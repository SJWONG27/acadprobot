import uuid
import subprocess
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from supabase import create_client, Client
from ..database.database import SessionLocal
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from ..database.schemas import ChatRequest
from datetime import datetime
from ..database.models import ChatSession, Message, UnrelatedQueries
from ..services.classifier import ClassifierService
from ..services.embedder import EmbedderService
from ..services.rag import RAGService
from ..services.extractor import ExtractorService
from ..services.generator import GeneratorService

router = APIRouter()

# Depends(get_db) injects this session into each route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
academic_classifier_model_path = os.path.join(BASE_DIR, "../../academic_classifier_bert")
WHISPER_BINARY = os.path.join(BASE_DIR, "../../whisper.cpp/build/bin/whisper-cli")
WHISPER_MODEL = os.path.join(BASE_DIR, "../../whisper.cpp/models/ggml-base.en.bin")
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SECRET_KEY)

classifierService = ClassifierService(academic_classifier_model_path)
embedderService = EmbedderService()
extractorService = ExtractorService()
ragService = RAGService(supabase)
generatorService = GeneratorService()

@router.post("/")
def chat_with_ollama(request: ChatRequest, db: Session = Depends(get_db)):

    chatbot_id = request.chatbot_id
        
    # Case 1: If session_id is provided, try to retrieve it
    if request.session_id:
        session = db.query(ChatSession).filter_by(id=request.session_id, chatbot_id=chatbot_id, user_id=str(request.id)).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        # Case 2: If no session_id, create a new session
        session = ChatSession(user_id=str(request.id), chatbot_id=chatbot_id, context={})
        db.add(session)
        db.commit()
        db.refresh(session)
        
    user_msg = Message(session_id=session.id, content=request.prompt, is_user=True)
    db.add(user_msg)

    past_messages = (
        db.query(Message)
        .filter_by(session_id=session.id)
        .order_by(Message.created_at)
        .all()[-3:]
    )

    # Build context
    conversation_context = ""
    for msg in past_messages:
        # role = "User" if msg.is_user else "Bot"
        if msg.is_user:
            conversation_context += f"User: {msg.content}\n"
        
    # Generate a title
    title_response = request.prompt[:30] + "..."
    
    if not request.session_id:
        session.title = title_response
    
    # DistilBERT Academic Classifier
    predicted_class = classifierService.classify_query(request.prompt)
    
    
    if predicted_class == 0:
        response_text = (
            "I'm sorry, but that question seems unrelated to academic programs. "
            "Could you please rephrase it or ask something about your studies?"
        )
        
        # Collect rejected queries for further training
        unrelated = UnrelatedQueries(
            user_id=request.id,
            chatbot_id=chatbot_id,
            query_text = request.prompt
        )
        db.add(unrelated)
        db.commit()
    else:
        # RAG Process
        try:
            main_content = extractorService.extract_main_content(request.prompt)
            print(main_content)
            embedded_query = embedderService.embed_query(main_content)
            retrieved_knowledge = ragService.compare_match_embedding_v2(embedded_query, chatbot_id=chatbot_id)
            rerank_knowledge = ragService.rerank(retrieved_knowledge, request.prompt, 3)
            response_text = generatorService.generate_llm_response(request.prompt, conversation_context, rerank_knowledge)
        except Exception as e:
            print(f"RAG error: {repr(e)}")
            response_text = "Sorry, I encountered an issue retrieving information. Please try again later."
    
    bot_msg = Message(session_id=session.id, content=response_text, is_user=False)
    db.add(bot_msg)
    session.updated_at = datetime.utcnow()
    db.commit()

    return {
        "session_id": session.id,
        "response": response_text,
    }
    
@router.get("/sessions/{session_id}/messages")
def get_messages(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(Message).join(ChatSession).filter(ChatSession.id == session_id).order_by(Message.created_at).all()
    return [
        {
            "role": "user" if msg.is_user else "assistant",
            "content": msg.content
        } for msg in messages
    ]
    
@router.get("/sessions/{user_id}/{chatbot_id}")
def get_user_chatsession(user_id: str, chatbot_id: str, db: Session = Depends(get_db)):
    sessions = (db.query(ChatSession)
                .filter_by(
                    user_id = user_id,
                    chatbot_id = chatbot_id
                )
                .order_by(ChatSession.updated_at.desc())
                .all()
                )
    return [
        {
        "session_id": session.id,
        "title": session.title,    
        "updated_at": session.updated_at   
        } for session in sessions
    ]
    
    
@router.delete("/sessions/{session_id}")
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter_by(id = session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Cant delete")
    
    db.query(Message).filter_by(session_id = session_id).delete()
    
    db.delete(session)
    db.commit()
    
    return {"message": f"Session {session_id} and its messages deleted successfully."}


@router.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    raw_path = f"/tmp/{file_id}.webm"
    wav_path = f"/tmp/{file_id}.wav"
    output_txt = f"/tmp/{file_id}.wav.txt"

    # Save original webm audio
    with open(raw_path, "wb") as f:
        f.write(await audio.read())

    # Convert to wav
    subprocess.run(["ffmpeg", "-i", raw_path, wav_path], check=True)

    # Whisper command
    cmd = [WHISPER_BINARY, "-m", WHISPER_MODEL, "-f", wav_path, "-otxt"]
    subprocess.run(cmd, check=True)

    if not os.path.exists(output_txt):
        return {"text": ""}

    with open(output_txt, "r") as f:
        text = f.read()

    # Cleanup
    os.remove(raw_path)
    os.remove(wav_path)
    os.remove(output_txt)

    return {"text": text}
