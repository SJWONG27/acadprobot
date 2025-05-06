# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.database import SessionLocal
from ..crud import users
from ..utils.hashing import verify_password
from ..core.security import create_access_token
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
        
# response model - response body (wat api returns)
# user:... - request body (wat client sent)
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if users.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    admin = db.query(models.Admin).filter_by(refercode=user.refercode).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Invalid refercode")

    return users.create_user(db, user, admin_id=admin.id)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = users.get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": token, "token_type": "bearer"}
