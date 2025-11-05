from sqlalchemy import *
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid 
from datetime import datetime
from pgvector.sqlalchemy import Vector
from enum import Enum

Base = declarative_base()

class Role(Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid = True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, nullable=False, unique=True)
    password = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(Text, nullable=False, default=Role.USER)
    

class Chatbots(Base):
    __tablename__ = "chatbots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False, default="")
    refercode = Column(Text, nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    
class UserChatbots(Base):
    __tablename__ = "user_chatbots"
    __table_args__ = (PrimaryKeyConstraint('user_id', 'chatbot_id'),)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    chatbot_id = Column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String)
    context = Column(JSON)     
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), server_onupdate=func.now())
    chatbot_id = Column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey('chat_sessions.id'))
    content = Column(Text)
    is_user = Column(Boolean) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    
class Embedding(Base):
    __tablename__ = "embeddings"
    
    id = Column(UUID(as_uuid = True), primary_key=True, default=uuid.uuid4)
    embedding = Column(Vector(768))
    content = Column(Text)
    chunk_index = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    chatbot_id = Column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    website_id = Column(UUID(as_uuid=True), ForeignKey("website_documents.id"))
    

class EmbeddingStatus(Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, nullable=False)
    status = Column(SQLEnum(EmbeddingStatus), default=EmbeddingStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    chatbot_id = Column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)
    
class WebsiteDocument(Base):
    __tablename__ = "website_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String, nullable=False)
    status = Column(SQLEnum(EmbeddingStatus), default=EmbeddingStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    chatbot_id = Column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)


class UnrelatedQueries(Base):
    __tablename__ = "unrelated_queries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    chatbot_id = Column(UUID(as_uuid=True), nullable=False)
    query_text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    