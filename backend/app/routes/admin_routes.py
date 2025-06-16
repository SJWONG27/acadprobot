# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.database import SessionLocal
from..dependencies.auth_dep import get_current_user
from ..database.models import User, Admin, Embedding, EmbeddingStatus, Document, WebsiteDocument
from ..services.embedding_service import get_embedding_docs, get_website_embedding_docs


router = APIRouter()

# Depends(get_db) injects this session into each route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
        
        
@router.get("/users")
def get_users_of_admin_route(
    current_admin: Admin = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.admin_id == current_admin.id).all()
    print(users)
    if not users:
        print("no users")
    return users


@router.post("/upload")
def upload_doc(
    file: UploadFile = File(...), 
    current_admin: Admin = Depends(get_current_user), 
    db:Session=Depends(get_db)
):
    if not file.filename.endswith((".docx", ".pdf")):
        raise HTTPException(status_code=400, detail="Only DOCX and PDF files are supported.")
    
    
    document = Document(
        filename=file.filename,
        status=EmbeddingStatus.pending,
        admin_id=current_admin.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)  
    
    get_embedding_docs(file, admin_id=current_admin.id, document_id=document.id, db=db)
    return {"message": "File processed and stored", "document_id": str(document.id)}


@router.get("/documents")
def get_doc(
    current_admin: Admin = Depends(get_current_user), 
    db:Session=Depends(get_db)
    ):
    docs = db.query(Document).filter_by(admin_id= current_admin.id).order_by(Document.created_at.desc()).all()
    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "status": doc.status.value,
            "created_at": doc.created_at.isoformat()
        }
        for doc in docs
    ]

@router.post("/uploadwebsite")
def upload_websitedoc(
    payload: dict = Body(...),
    current_admin: Admin = Depends(get_current_user), 
    db:Session=Depends(get_db)
):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="Website URL is required.")
    
    
    document = WebsiteDocument(
        url=url,
        status=EmbeddingStatus.pending,
        admin_id=current_admin.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)  
    
    get_website_embedding_docs(url, admin_id=current_admin.id, website_id=document.id, db=db)
    return {"message": "URL processed and stored", "website_id": str(document.id)}
    
@router.get("/websitedocuments")
def get_websitedoc(
    current_admin: Admin = Depends(get_current_user), 
    db:Session=Depends(get_db)
    ):
    docs = db.query(WebsiteDocument).filter_by(admin_id= current_admin.id).order_by(WebsiteDocument.created_at.desc()).all()
    return [
        {
            "id": str(doc.id),
            "url": doc.url,
            "status": doc.status.value,
            "created_at": doc.created_at.isoformat()
        }
        for doc in docs
    ]
    
@router.delete("/deletedoc/{document_id}")
def delete_doc(
    document_id: str, 
    db:Session=Depends(get_db)
):
    embeddings = db.query(Embedding).filter_by(document_id=document_id).delete()
    if embeddings == 0:
        raise HTTPException(status_code=404, detail="document not found. Cant delete")
    
    # for embeddding in embeddings:
    #     db.delete(embeddding)
        
    db.query(Document).filter_by(id = document_id).delete() 
    db.commit() 
    
    return {f"Document {document_id} deleted successfully"}

@router.delete("/deletewebsitedoc/{website_id}")
def delete_website_doc(
    website_id: str, 
    db:Session=Depends(get_db)
):
    embeddings = db.query(Embedding).filter_by(website_id=website_id).delete()
    if embeddings == 0:
        raise HTTPException(status_code=404, detail="document not found. Cant delete")
    
    # for embeddding in embeddings:
    #     db.delete(embeddding)
        
    db.query(WebsiteDocument).filter_by(id = website_id).delete() 
    db.commit() 
    
    return {f"Website Document {website_id} deleted successfully"}