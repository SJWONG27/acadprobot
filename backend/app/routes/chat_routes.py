import uuid
import subprocess
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from ..database.database import SessionLocal
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from ..database.schemas import ChatRequest
from ..database.models import ChatSession, Message
from ..services.chat import ChatService

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
load_dotenv()

chatService = ChatService()


@router.post("/")
def chat_with_ollama(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    return chatService.handle_chat(db, request)


@router.post("/stream")
def chat_with_process_stream(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    return StreamingResponse(
        chatService.handle_chat_stream(db, request),
        media_type="application/x-ndjson"
    )


        
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
