# app/crud/users.py
from sqlalchemy.orm import Session
from ..database import models, schemas
from ..utils.hashing import hash_password
from sqlalchemy.dialects.postgresql import UUID

def create_user(db: Session, user: schemas.UserCreate, admin_id: UUID):
    hashed_pwd = hash_password(user.password)
    db_user = models.User(
        email=user.email,
        password=hashed_pwd,
        admin_id=admin_id,
        refercode=user.refercode,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()
