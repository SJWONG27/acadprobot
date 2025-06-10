# app/core/security.py
from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv


# load variables from env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

