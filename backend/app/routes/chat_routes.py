import uuid
import subprocess
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import requests, asyncio
from ..database.database import SessionLocal
from sqlalchemy.orm import Session
from ..database.schemas import ChatRequest
from datetime import datetime
from ..database.models import ChatSession, Message, User, Chatbots, UserChatbots, UnrelatedQueries
from ..services.embedding_service import compare_match_embedding, classify_query, generate_llm_response
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama



router = APIRouter()

# Depends(get_db) injects this session into each route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WHISPER_BINARY = os.path.join(BASE_DIR, "../../whisper.cpp/build/bin/whisper-cli")
WHISPER_MODEL = os.path.join(BASE_DIR, "../../whisper.cpp/models/ggml-base.en.bin")


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
        role = "User" if msg.is_user else "Bot"
        conversation_context += f"{role}: {msg.content}\n"
    
    conversation_context += f"User: {request.prompt}\n"
    
    # Generate a title
    title_response = request.prompt[:30] + "..."
    
    if not request.session_id:
        session.title = title_response
    
    # DistilBERT Academic Classifier
    predicted_class = classify_query(request.prompt)
    
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
            retrieved_knowledge = compare_match_embedding(request.prompt, chatbot_id=chatbot_id)
            full_prompt = (
                "You are AcadProBot, a helpful academic advisor chatbot.\n\n"
                "Recent conversation:\n"
                f"{conversation_context}\n"
                "Relevant academic knowledge:\n"
                f"{retrieved_knowledge}\n\n"
                "Now respond naturally and accurately to the user's latest message."
            )
            response_text = generate_llm_response(full_prompt)
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
    
@router.get("/sessions/{user_id}")
def get_user_chatsession(user_id: str, db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter_by(user_id = user_id).order_by(ChatSession.updated_at.desc()).all()
    return [
        {
        "session_id": session.id,
        "title": session.title,    
        "created_at": session.created_at   
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
