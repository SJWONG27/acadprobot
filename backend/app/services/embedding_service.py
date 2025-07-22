from docx import Document as DocxDocument
from fastapi import HTTPException
import fitz 
import textwrap
import requests
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from ..database.models import Embedding, EmbeddingStatus, Document, WebsiteDocument
import re
from bs4 import BeautifulSoup
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SECRET_KEY)

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

class RemoveColonParser(StrOutputParser):
    def parse(self, text: str) -> str:
        cleaned_text = re.sub(r"(\d+\.\s[^\n:]+):", r"\1", text)  # numbered list
        cleaned_text = re.sub(r"(\*\*[^\n:]+\*\*):", r"\1", cleaned_text)  # **bolded headers**:
        return cleaned_text

def extract_text_from_docx(file_obj):
    document = DocxDocument(file_obj)  
    return "\n".join([para.text for para in document.paragraphs])

def extract_text_from_pdf(file_obj):
    doc = fitz.open(stream=file_obj.read(), filetype="pdf")  # Read from stream
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

def extract_text_from_umexpert(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        return [f"Request failed: {e}"]

    soup = BeautifulSoup(response.text, "html.parser")
    project_div = soup.find('div', id='project-container')

    if not project_div:
        return ["cannot find"]

    # Get all text and split by "View CV"
    all_text = project_div.get_text(separator="\n", strip=True)
    blocks = all_text.split("View CV")

    target_phrase = "faculty of Computer Science and Information Technology"
    result_chunks = []

    for block in blocks:
        if target_phrase.lower() not in block.lower():
            continue

        lines = [line.strip() for line in block.strip().split("\n") if line.strip()]
        
        # Extract useful info heuristically
        name = next((l for l in lines if "Dr." in l or "Prof." in l), "Name not found")
        email = next((l for l in lines if "@" in l), "Email not found")
        dept = next((l for l in lines if "faculty" in l.lower()), "Faculty of Computer Science and Information Technology")
        phone = next((l for l in lines if l.replace("-", "").replace("+", "").isdigit() and len(l) >= 8), None)
        
        # Collect lines after "Area(s) of Expertise"
        expertise_lines = []
        collect = False
        for line in lines:
            if "Area(s) of Expertise" in line:
                collect = True
                continue
            if collect:
                expertise_lines.append(line)
        
        expertise = ", ".join(expertise_lines) if expertise_lines else "not specified"

        # Construct readable sentence
        paragraph = f"{name} is affiliated with the {dept}. "
        if phone:
            paragraph += f"Contact: {email}, Phone: {phone}. "
        else:
            paragraph += f"Contact: {email}. "
        paragraph += f"Their areas of expertise include: {expertise}."

        result_chunks.append(paragraph.strip())

    return result_chunks if result_chunks else ["no matching faculty found"]

def get_embeddings(chunks):
    return embedding_model.embed_documents(chunks)

def get_query_embeddings(query):
    return embedding_model.embed_query(query)

def extract_first_float(text):
    match = re.search(r"\b[0-1](?:\.\d+)?\b", text)  # matches 0, 0.1, ..., 1
    if match:
        return float(match.group(0))
    else:
        return 0.1  # fallback if no number found


def get_embedding_docs(fileUploaded, admin_id, document_id, db):
    doc = db.query(Document).filter_by(id=document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Update status to processing
    doc.status = EmbeddingStatus.processing
    db.commit()
    
    try: 
        if(fileUploaded.filename.endswith(".docx")):
            extracted_text = extract_text_from_docx(fileUploaded.file)
        else:
            extracted_text = extract_text_from_pdf(fileUploaded.file)
            
        chunks = textwrap.wrap(extracted_text, width=2000)
        chunk_embeddings = get_embeddings(chunks)

        for i, emb in enumerate(chunk_embeddings):
            record = Embedding(
                content=chunks[i],
                embedding=emb,
                chunk_index=i,
                admin_id=admin_id, 
                document_id=document_id
            )
            db.add(record)
            
            doc.status = EmbeddingStatus.completed
            db.commit()
        
    except Exception as e:
        doc.status = EmbeddingStatus.failed
        db.commit()
        raise e 
    
def get_website_embedding_docs(url, admin_id, website_id, db):
    doc = db.query(WebsiteDocument).filter_by(id=website_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Website Document not found")

    # Update status to processing
    doc.status = EmbeddingStatus.processing
    db.commit()
    
    try: 
        chunks = extract_text_from_umexpert(url)
        chunk_embeddings = get_embeddings(chunks)

        for i, emb in enumerate(chunk_embeddings):
            record = Embedding(
                content=chunks[i],
                embedding=emb,
                chunk_index=i,
                admin_id=admin_id,
                website_id=website_id
            )
            db.add(record)
            
            doc.status = EmbeddingStatus.completed
            db.commit()
        
    except Exception as e:
        doc.status = EmbeddingStatus.failed
        db.commit()
        raise e

def compare_match_embedding(user_query, admin_id):
    print("RAG Start")
    query_embedding = get_query_embeddings(user_query)

    response = supabase.rpc("match_test_embeddings", {
        "query_embedding": query_embedding,
        "match_count": 5,
        "admin_id": str(admin_id)
    }).execute()
    
    if not response.data:
        return "Sorry, I couldn't find any relevant information based on your query. Please contact your program's admin."
    
    top_chunks = [item["content"] for item in response.data]
    context = "\n\n".join(top_chunks)
    
    prompt = "Use the following context to answer the question only. Format the answer using Markdown-style"
    
    prompt_template = ChatPromptTemplate([
        ("system", "{context}"),
        ("system", "{prompt}"),
        ("human", "{user_query}")
    ])
    
    model = OllamaLLM(model="llama3.2")
    parser = RemoveColonParser()
    chain = prompt_template | model | parser
    
    result = chain.invoke({
        "context": context,
        "prompt": prompt,
        "user_query": user_query,
    })
    
    print(top_chunks)
    
    return result

    



    
    