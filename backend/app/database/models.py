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

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(UUID(as_uuid = True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, nullable=False, unique=True)
    password = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    refercode = Column(Text, nullable=False, unique=True)
    
    users = relationship("User", back_populates="admin", foreign_keys="User.admin_id")


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid = True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, nullable=False, unique=True)
    password = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    refercode = Column(Text, ForeignKey("admins.refercode"), nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)
    
    admin = relationship("Admin", back_populates="users", foreign_keys=[admin_id])
    

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String)
    context = Column(JSON)     # For storing chat context
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey('chat_sessions.id'))
    content = Column(Text)
    is_user = Column(Boolean)  # True for user, False for bot
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Embedding(Base):
    __tablename__ = "test_embeddings"
    
    id = Column(UUID(as_uuid = True), primary_key=True, default=uuid.uuid4)
    embedding = Column(Vector(768))
    content = Column(Text)
    chunk_index = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)
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
    created_at = Column(DateTime, default=datetime.utcnow)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)
    
class WebsiteDocument(Base):
    __tablename__ = "website_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String, nullable=False)
    status = Column(SQLEnum(EmbeddingStatus), default=EmbeddingStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)

    