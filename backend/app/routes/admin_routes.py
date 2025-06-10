# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.database import SessionLocal
from ..services.users_services import get_users_of_admin
from ..core.hashing import verify_password
from ..core.security import create_access_token
from..dependencies.auth_dep import get_current_user
from datetime import timedelta
from ..database import models

router = APIRouter()

# Depends(get_db) injects this session into each route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
        
        
@router.get("/users")
def get_users_of_admin_route(current_admin: models.Admin = Depends(get_current_user), db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.admin_id == current_admin.id).all()
    print(users)
    if not users:
        print("no users")
    return users