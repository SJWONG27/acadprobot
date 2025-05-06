# app/core/security.py
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# load variables from env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
