from fastapi import FastAPI
from .routes import admin_routes, chat_routes
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

app.include_router(admin_routes.router, prefix="/admin", tags=["Authentication"])
app.include_router(chat_routes.router, prefix="/chat", tags=["Authentication"])
