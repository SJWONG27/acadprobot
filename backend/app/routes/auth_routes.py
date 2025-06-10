# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.database import SessionLocal
from ..services import users_services
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
        
# response model - response body (wat api returns)
# user:... - request body (wat client sent)
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if users_services.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    admin = db.query(models.Admin).filter_by(refercode=user.refercode).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Invalid refercode")

    return users_services.create_user(db, user, admin_id=admin.id)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = users_services.get_user_by_email(db, user.email)
    if db_user and verify_password(user.password, db_user.password):
        token = create_access_token(
            data={"sub": str(db_user.id), "role": "user"},
            expires_delta=timedelta(minutes=30)
        )
        return {"access_token": token, 
                "token_type": "bearer", 
                "role": "user"}
    
    db_admin = users_services.get_admin_by_email(db, user.email)
    if  db_admin and verify_password(user.password, db_admin.password):    
        token = create_access_token(
            data={"sub": str(db_admin.id), "role": "admin"},
            expires_delta=timedelta(minutes=30)
        )
        return {"access_token": token, 
                "token_type": "bearer", 
                "role": "admin"}
    
    raise HTTPException(status_code=400, detail="Invalid credentials")


@router.get("/me") 
def read_current_user(user= Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "refercode": user.refercode}
