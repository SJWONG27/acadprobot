from fastapi import APIRouter, Depends, HTTPException
import requests, asyncio
from ..database.database import SessionLocal
from sqlalchemy.orm import Session
from ..database.schemas import ChatRequest
from datetime import datetime
from ..database.models import ChatSession, Message, User
from ..services.embedding_service import compare_match_embedding, classify_query
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


@router.post("/")
async def chat_with_ollama(request: ChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=request.id).first()
    if not user or not user.admin_id:
        raise HTTPException(status_code=404, detail="User or admin_id not found")
    
    admin_id = user.admin_id
    
    # Case 1: If session_id is provided, try to retrieve it
    if request.session_id:
        session = db.query(ChatSession).filter_by(id=request.session_id, admin_id=admin_id, user_id=str(request.id)).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        # Case 2: If no session_id, create a new session
        session = ChatSession(user_id=str(request.id), admin_id=admin_id, context={})
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
    context_prompt = ""
    for msg in past_messages:
        # role = "User" if msg.is_user else "Bot"
        # context_prompt += f"{role}: {msg.content}\n"
        if msg.is_user:
            context_prompt += f"User: {msg.content}\n"
    
    context_prompt += f"User: {request.prompt}\n"
    
    # 1st async task: Generate title for a chat session
    async def generate_chat_title_task():
        # Call the chain with your user input
        # try:
        #     # prompt_template = ChatPromptTemplate([
        #     #     ("system", "Generate one short title directly for an academic chat query"),
        #     #     ("human", request.prompt),
        #     # ])
        #     prompt_template = ChatPromptTemplate([
        #         ("system", """You are a title generator for an academic chatbot.
        #     Generate ONLY a short 3–5 word title summarizing the user's question.
        #     Do NOT include any explanation, punctuation, or quotation marks.
        #     Examples:
        #     User: How do I apply for UM?
        #     Title: UM Application Process

        #     User: What are the requirements for Computer Science?
        #     Title: Computer Science Requirements
        #     """),
        #         ("human", f"User: {request.prompt}\nTitle:"),
        #     ])


        #     # Instantiate Ollama Model
        #     model = OllamaLLM(model="llama3.2:1b-instruct-q2_K")
        #     # Chain Prompt and Model together
        #     chain = prompt_template | model
        #     title_response = chain.invoke({"user_prompt": request.prompt})
        #     session.title = title_response
        #     return title_response
        try:
            return request.prompt[:30] + "..."
        except Exception as e:
            print(f"LangChain Error: {repr(e)}")
            session.title = request.prompt[:30] + "..."
            
    # 2nd async task: RAG Process
    async def rag_task():
        print("RAG DONE")
        return compare_match_embedding(context_prompt, admin_id=admin_id)   
    
    # RAG Process
    # response_text = compare_match_embedding(context_prompt, admin_id=admin_id)    
    # print("RAG done")
    
    # Run both concurrently
    title_response, response_text = await asyncio.gather(
        generate_chat_title_task(),
        rag_task()
    )
    
    if not request.session_id:
        session.title = title_response
    # db.add(session)

    # Now session is guaranteed to be defined here
    # user_msg = Message(session_id=session.id, content=request.prompt, is_user=True)
    # db.add(user_msg)
    
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