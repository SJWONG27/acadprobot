from sqlalchemy import *
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid 
from datetime import datetime

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
    context = Column(JSON)     # For storing chat context
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, index=True)
    content = Column(Text)
    is_user = Column(Boolean)  # True for user, False for bot
    created_at = Column(DateTime, default=datetime.utcnow)