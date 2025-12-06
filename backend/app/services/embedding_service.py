from docx import Document as DocxDocument
from fastapi import HTTPException
import fitz 
import textwrap
import requests
from supabase import create_client, Client
import os
import torch
from dotenv import load_dotenv
from ..database.models import Embedding, EmbeddingStatus, Document, WebsiteDocument
import re
from bs4 import BeautifulSoup
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import OllamaEmbeddings
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from playwright.async_api import async_playwright
import asyncio
import numpy as np
import spacy
from sqlalchemy import create_engine
import pathlib


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SECRET_KEY)

# comment base_url out when doing dev
embedding_model = OllamaEmbeddings(
    model="nomic-embed-text",
    base_url="http://ollama:11434"
)

llm_model = OllamaLLM(
    model="llama3.2",
    base_url="http://ollama:11434"
)

nlp = spacy.load("en_core_web_md")


class RemoveColonParser(StrOutputParser):
    def parse(self, text: str) -> str:
        cleaned_text = re.sub(r"(\d+\.\s[^\n:]+):", r"\1", text)  # numbered list
        cleaned_text = re.sub(r"(\*\*[^\n:]+\*\*):", r"\1", cleaned_text)  # **bolded headers**:
        return cleaned_text

def get_embeddings(chunks):
    return embedding_model.embed_documents(chunks)

def get_query_embeddings(query):
    return embedding_model.embed_query(query)

def split_into_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if len(s.strip()) > 0]

def merge_semantic_chunks(sentences, embeddings, threshold, max_chars):
    merged_chunks = []
    current_chunk = sentences[0]

    for i in range(1, len(sentences)):
        sim = np.dot(embeddings[i], embeddings[i - 1]) / (
            np.linalg.norm(embeddings[i]) * np.linalg.norm(embeddings[i - 1])
        )

        if sim > threshold and len(current_chunk) + len(sentences[i]) < max_chars:
            current_chunk += " " + sentences[i]
        else:
            merged_chunks.append(current_chunk)
            current_chunk = sentences[i]

    merged_chunks.append(current_chunk)
    return merged_chunks

def semantic_chunking_v2(text, threshold=0.8, max_chars=1000, min_words=5):
    sentences = split_into_sentences(text)
    embeddings = get_embeddings(sentences)
    merged_chunks = merge_semantic_chunks(sentences, embeddings, threshold, max_chars)
    filtered_chunks = [
        chunk for chunk in merged_chunks
        if(len(chunk.split())) >= min_words
    ]
    return filtered_chunks


# website
async def extract_text_from_website(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="networkidle")
            html = await page.content()
            await browser.close()
    except Exception as e:
        return [f"Playwright error: {e}"]

    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav", "form", "iframe"]):
        tag.decompose()
    content = soup.get_text(separator="\n", strip=True)
    
    if not content or len(content.strip()) == 0:
        return ["cannot find"]
    
    result_chunks = semantic_chunking_v2(content)
    
    return result_chunks if result_chunks else ["cannot find"]


# documents
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

def get_embedding_docs(fileUploaded, chatbot_id, document_id, db):
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
            
        # chunks = textwrap.wrap(extracted_text, width=2000)
        chunks = semantic_chunking_v2(extracted_text)
        chunk_embeddings = get_embeddings(chunks)

        for i, emb in enumerate(chunk_embeddings):
            record = Embedding(
                content=chunks[i],
                embedding=emb,
                chunk_index=i,
                chatbot_id=chatbot_id, 
                document_id=document_id
            )
            db.add(record)
            
            doc.status = EmbeddingStatus.completed
            db.commit()
        
    except Exception as e:
        doc.status = EmbeddingStatus.failed
        db.commit()
        raise e 
    
def get_website_embedding_docs(url, chatbot_id, website_id, db):
    doc = db.query(WebsiteDocument).filter_by(id=website_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Website Document not found")

    # Update status to processing
    doc.status = EmbeddingStatus.processing
    db.commit()
    
    try: 
        chunks = asyncio.run(extract_text_from_website(url))
        
        if not chunks or (len(chunks) == 1 and chunks[0].strip().lower() == "cannot find"):
            doc.status = EmbeddingStatus.failed
            db.commit()
            raise ValueError("Failed to extract valid website content")
        
        chunk_embeddings = get_embeddings(chunks)

        for i, emb in enumerate(chunk_embeddings):
            record = Embedding(
                content=chunks[i],
                embedding=emb,
                chunk_index=i,
                chatbot_id=chatbot_id,
                website_id=website_id
            )
            db.add(record)
            
            doc.status = EmbeddingStatus.completed
            db.commit()
        
    except Exception as e:
        doc.status = EmbeddingStatus.failed
        db.commit()
        raise e
    

def generate_llm_response(user_query):    
    prompt = "Answer the following academic query. Format the answer using Markdown-style, with proper line spacing across different ideas."
    
    prompt_template = ChatPromptTemplate([
        ("system", "{prompt}"),
        ("human", "{user_query}")
    ])
    
    parser = RemoveColonParser()
    chain = prompt_template | llm_model | parser
    
    result = chain.invoke({
        "prompt": prompt,
        "user_query": user_query,
    })
    
    return result

def extract_main_content(text):
    doc = nlp(str(text))
    nouns = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]
    return " ".join(nouns)

def compare_match_embedding(user_query, chatbot_id):
    print("RAG Start")
    user_query = extract_main_content(user_query)
    print(user_query)
    query_embedding = get_query_embeddings(user_query)

    response = supabase.rpc("match_embeddings", {
        "query_embedding": query_embedding,
        "match_count": 5,
        "chatbot_id": str(chatbot_id)
    }).execute()
    
    print(type(query_embedding), len(query_embedding))
 
    if not response.data or len(response.data) == 0:
        print("no data from db: ", response)
        return "no knowledge from db"    
    
    top_result = response.data[0]
    similarity = top_result["similarity"]
    
    print("db similarity: ", similarity)
    
    if (similarity < 0.4) or (not response.data):
        print("similarity low")
        return "no knowledge from db"
    
    source_doc = top_result["document_id"]
    source_web = top_result["website_id"]
    top_idx = top_result["chunk_index"]
    
    if source_doc:
        source_type = "document"
        source_filter = ("document_id", source_doc)
    elif source_web:
        source_type = "website"
        source_filter = ("website_id", source_web)
    else:
        return "no source id found"

    print(f"Top source = {source_type}, starting at chunk {top_idx}")
    
    N = 5 

    neighbors = supabase.table("embeddings") \
        .select("content, chunk_index") \
        .eq(source_filter[0], source_filter[1]) \
        .gte("chunk_index", top_idx) \
        .lte("chunk_index", top_idx + N) \
        .order("chunk_index") \
        .execute()
    
    continuous_chunks = [item["content"] for item in neighbors.data]    
    match_chunks = [item["content"] for item in response.data]
    
    all_chunks = []
    seen = set()
    for item in match_chunks + continuous_chunks:
        if item not in seen:
            all_chunks.append(item)
            seen.add(item)

    context = "\n\n".join(all_chunks)
        
    print(context)
        
    return context


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
academic_classifier_model_path = os.path.join(BASE_DIR, "../../academic_classifier_bert")
tokenizer = AutoTokenizer.from_pretrained(academic_classifier_model_path)
academic_classifier_model = AutoModelForSequenceClassification.from_pretrained(academic_classifier_model_path)


def classify_query(query: str) -> int:
    inputs = tokenizer(query, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = academic_classifier_model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
        confidence = torch.softmax(logits, dim=1)[0][predicted_class].item()
    print(f"Query: {query}")
    print(f"Predicted class: {predicted_class}, confidence: {confidence:.2f}")
    return predicted_class



    
    