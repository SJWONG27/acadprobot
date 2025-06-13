from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from ..services.users_services import get_user_by_id, get_admin_by_id
from sqlalchemy.orm import Session
from ..database.database import SessionLocal
from app.database.models import User
from dotenv import load_dotenv
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
        
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Payload: {payload}")  
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None:
            print("no user id in token")
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        print(f"JWTError: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")

    if role == "admin":
        user = get_admin_by_id(db, user_id)
    else:
        user = get_user_by_id(db, user_id)
    if user is None:
        print("User not found in DB!")
        raise HTTPException(status_code=404, detail="User not found")
    print("Successfully fetched user")
    return user