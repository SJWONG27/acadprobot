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

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SECRET_KEY)

def extract_text_from_docx(file_obj):
    document = DocxDocument(file_obj)  # Accept file-like object directly
    return "\n".join([para.text for para in document.paragraphs])

def extract_text_from_pdf(file_obj):
    doc = fitz.open(stream=file_obj.read(), filetype="pdf")  # Read from stream
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

# def extract_text_from_umexpert(url):
#     response = requests.get(url)
#     soup = BeautifulSoup(response.text, "html.parser")
#     project_div = soup.find('div', id='project-container')

#     if project_div:
#         texts = project_div.get_text(separator="\n", strip=True).splitlines()
#     else:
#         texts = ["cannot find"]
    
#     target_phrase = "faculty of Computer Science and Information Technology"
#     indices_to_keep = set()

#     for i, line in enumerate(texts):
#         if target_phrase.lower() in line.lower():
#             start = max(i - 2, 0)
#             end = min(i + 15 + 1, len(texts))
#             indices_to_keep.update(range(start, end))

#     cleaned_lines = [texts[i] for i in sorted(indices_to_keep)]
#     joined_text = "\n".join(cleaned_lines)
#     chunks = [chunk.strip() + "\nView CV" for chunk in joined_text.split("View CV") if chunk.strip()]

#     return chunks

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

    # Normalize target phrase
    target_phrase = "faculty of Computer Science and Information Technology"

    # Filter blocks: only those containing the phrase
    result_chunks = []
    for block in blocks:
        if target_phrase.lower() in block.lower():
            cleaned = block.strip() + "\nView CV"
            result_chunks.append(cleaned)

    return result_chunks if result_chunks else ["no matching faculty found"]

def get_ollama_embeddings(chunks):
    chunk_embeddings = []
    for chunk in chunks:
        res = requests.post("http://localhost:11434/api/embeddings", json={
            "model": "nomic-embed-text",
            "prompt": chunk
        })
        res.raise_for_status()
        embedding = res.json()["embedding"]
        chunk_embeddings.append(embedding)
    return chunk_embeddings


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
        chunk_embeddings = get_ollama_embeddings(chunks)

        for i, emb in enumerate(chunk_embeddings):
            record = Embedding(
                content=chunks[i],
                embedding=emb,
                chunk_index=i,
                admin_id=admin_id,  # You must pass this value in
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
            
        # chunks = textwrap.wrap(extracted_text, width=2000)
        chunk_embeddings = get_ollama_embeddings(chunks)

        for i, emb in enumerate(chunk_embeddings):
            record = Embedding(
                content=chunks[i],
                embedding=emb,
                chunk_index=i,
                admin_id=admin_id,  # You must pass this value in
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
    query_embedding = requests.post("http://localhost:11434/api/embeddings", json={
        "model": "nomic-embed-text",
        "prompt": user_query
    }).json()["embedding"]

    response = supabase.rpc("match_test_embeddings", {
        "query_embedding": query_embedding,
        "match_count": 5,
        "admin_id": str(admin_id)
    }).execute()
    
    if not response.data:
        return "Sorry, I couldn't find any relevant information based on your query. Please contact your program's admin."
    
    top_chunks = [item["content"] for item in response.data]
    context = "\n\n".join(top_chunks)
    
    prompt = f"""You are a helpful assistant, named AcadProBot founded by student Wong Soon Jit in Universiti Malaya (UM). 
        If not sure or ambiguous with the queries, voice it out.
        For those queries irrelevant with academic matters, generate default response.
        Generate response in English only.
    Use the following context to answer the question only:

    Context:
    {context}

    Question:
    {user_query}

    Answer:"""
    
    ollama_res = requests.post("http://localhost:11434/api/generate", json={
        "model": "llama3.2",
        "prompt": prompt,
        "stream": False
    })
    ollama_res.raise_for_status()
    response_text = ollama_res.json().get("response")
    print(f"RAG done {context}")
    return response_text
    
def get_confidence_score(answer: str, question: str) -> float:
    confidence_prompt = f"""
    Given the following question and answer, estimate your confidence to answer the query as a number between 0 (no confidence) and 1 (very confident):

    Question: {question}
    Answer: {answer}

    Confidence (0 to 1) (Dont give any explanation, just number) :
    """
    print(confidence_prompt)
    try:
        res = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3.2",
            "prompt": confidence_prompt,
            "stream": False
        })
        raw = res.json().get("response", "0.0").strip()
        print(raw)
        return extract_first_float(raw)
    except Exception as e:
        print("Exception occurred:", e)
        return 0.1


    
    