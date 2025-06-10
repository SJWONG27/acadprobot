from fastapi import APIRouter, Depends, HTTPException
import requests
from ..database.database import SessionLocal
from sqlalchemy.orm import Session
from ..database.schemas import ChatRequest
from datetime import datetime
from ..database.models import ChatSession, Message

router = APIRouter()

# Depends(get_db) injects this session into each route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 


# @router.post("/chat")
# def chat_with_ollama(request: ChatRequest, db: Session = Depends(get_db)):
#     if request.session_id:
#         session = db.query(ChatSession).filter_by(id=request.session_id, user_id=request.id).first() 
#         if not session:
#             raise HTTPException(status_code=404, detail="Chat session not found")
#         else: 
#             session = ChatSession(user_id=request.user_id, context={})
#             db.add(session)
#             db.commit()
#             db.refresh(session) 
    
#     user_msg = Message(session_id = session.id, content=request.prompt, is_user=True)
#     db.add(user_msg)
    
#     past_messages = db.query(Message).filter_by(session_id = session.id).order_by(Message.created_at).all()[-5:] 
    
#     # Format history into a context string
#     context_prompt = ""
#     for msg in past_messages:
#         role = "User" if msg.is_user else "Bot"
#         context_prompt += f"{role}: {msg.content}\n"
#     context_prompt += f"User: {request.prompt}\nBot:"

#     # 4. Call Ollama with context
#     try:
#         ollama_url = "http://localhost:11434/api/generate"
#         res = request.post(ollama_url, json={
#             "model": "llama3.2",
#             "prompt": context_prompt,
#             "stream": False
#         })
#         res.raise_for_status()
#         response_text = res.json().get("response")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")

#     # 5. Save bot response
#     bot_msg = Message(session_id=session.id, content=response_text, is_user=False)
#     db.add(bot_msg)

#     # 6. Update timestamp
#     session.updated_at = datetime.utcnow()
#     db.commit()

#     return {
#         "session_id": session.id,
#         "response": response_text
#     }
    
@router.post("/")
def chat_with_ollama(request: ChatRequest, db: Session = Depends(get_db)):
    # Case 1: If session_id is provided, try to retrieve it
    if request.session_id:
        session = db.query(ChatSession).filter_by(id=request.session_id, user_id=str(request.id)).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        # Case 2: If no session_id, create a new session
        session = ChatSession(user_id=str(request.id), context={})
        db.add(session)
        db.commit()
        db.refresh(session)

    # Now session is guaranteed to be defined here ↓↓↓
    user_msg = Message(session_id=session.id, content=request.prompt, is_user=True)
    db.add(user_msg)

    past_messages = (
        db.query(Message)
        .filter_by(session_id=session.id)
        .order_by(Message.created_at)
        .all()[-5:]
    )

    # Build context
    context_prompt = ""
    for msg in past_messages:
        role = "User" if msg.is_user else "Bot"
        context_prompt += f"{role}: {msg.content}\n"
    context_prompt += f"User: {request.prompt}\nBot:"

    try:
        ollama_url = "http://localhost:11434/api/generate"
        res = requests.post(ollama_url, json={
            "model": "llama3.2",
            "prompt": context_prompt,
            "stream": False
        })
        res.raise_for_status()
        response_text = res.json().get("response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")

    bot_msg = Message(session_id=session.id, content=response_text, is_user=False)
    db.add(bot_msg)

    session.updated_at = datetime.utcnow()
    db.commit()

    return {
        "session_id": session.id,
        "response": response_text
    }
