# app/db/schemas.py
from typing import Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID

# register - Input data for creating a user 
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    # admin_id: UUID
    refercode: str

#  Return user data (without password) to the frontend.
class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    refercode: str 
    admin_id: UUID
    class Config:
        # orm_mode = True
        sslmode='require'

# Validate the user’s credentials before issuing a token.
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChatRequest(BaseModel):
    id: UUID
    chatbot_id: UUID
    session_id: Optional[int] = None
    prompt: str
    
    
class ChatbotRequest(BaseModel):
    chatbot_id : UUID 
    
