# app/db/schemas.py
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
    class Config:
        orm_mode = True

# Validate the user’s credentials before issuing a token.
class UserLogin(BaseModel):
    email: EmailStr
    password: str
