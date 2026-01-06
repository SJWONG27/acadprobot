from ..database.models import ChatSession, Message
from fastapi import HTTPException
from .classifier import ClassifierService
from .rag import RAGService
from datetime import datetime
import os
from dotenv import load_dotenv
from supabase import create_client, Client


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
academic_classifier_model_path = os.path.join(BASE_DIR, "../../academic_classifier_bert")
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SECRET_KEY)

classifierService = ClassifierService(academic_classifier_model_path)
ragService = RAGService(supabase)


class ChatService:
    def __init__(self):
        pass
    
    def get_or_create_session(self, db, request):
        chatbot_id = request.chatbot_id

        # Case 1: If session_id is provided, try to retrieve it
        if request.session_id:
            session = (
                db.query(ChatSession)
                .filter_by(
                    id=request.session_id,
                    chatbot_id=chatbot_id,
                    user_id=str(request.id)
                )
                .first()
            )
            if not session:
                raise HTTPException(status_code=404, detail="Chat session not found")
        else:
            # Case 2: If no session_id, create a new session
            session = ChatSession(
                user_id=str(request.id),
                chatbot_id=chatbot_id,
                context={}
            )
            db.add(session)
            db.commit()
            db.refresh(session)

        return session
    
    
    def create_message(self, db, session_id, content, is_user):
        msg = Message(
            session_id=session_id,
            content=content,
            is_user=is_user
        )
        db.add(msg)
        
        return msg


    def get_past_messages(self,  db, session_id: str):
        past_messages = db.query(Message).filter_by(session_id=session_id).order_by(Message.created_at).all()[-3:]
        
        return past_messages


    def handle_chat(self, db, request):
        session = self.get_or_create_session(db, request)

        self.create_message(db, session.id, request.prompt, is_user=True)

        past_messages = self.get_past_messages(db, session.id)
        
        # Build context
        conversation_context = ""
        for msg in past_messages:
            # role = "User" if msg.is_user else "Bot"
            if msg.is_user:
                conversation_context += f"User: {msg.content}\n"

        if not request.session_id:
            session.title = request.prompt[:30] + "..."

        predicted_class = classifierService.classify_query(request.prompt)

        if predicted_class == 0:
            response_text = classifierService.handle_non_academic_query(db, request)
        else:
            try:
                response_text = ragService.run_rag_pipeline(
                    request.prompt,
                    conversation_context,
                    request.chatbot_id
                )
            except Exception as e:
                print(f"RAG error: {repr(e)}")
                response_text = (
                    "Sorry, I encountered an issue retrieving information. "
                    "Please try again later."
                )

        self.create_message(db, session.id, response_text, is_user=False)
        session.updated_at = datetime.utcnow()
        db.commit()

        return {
            "session_id": session.id,
            "response": response_text
        }
