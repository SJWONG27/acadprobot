# from typing import Union
# from app.routes import chat
# from fastapi import FastAPI


# app = FastAPI()



# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

# app.include_router(chat.router)

# app/main.py
from fastapi import FastAPI
from .routes import auth_routes, admin_routes, chat_routes
from .database.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(admin_routes.router, prefix="/admin", tags=["Authentication"])
app.include_router(chat_routes.router, prefix="/chat", tags=["Authentication"])
