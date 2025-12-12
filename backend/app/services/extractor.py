from typing import List, Dict, Any
import tempfile
import re
from bs4 import BeautifulSoup
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import UnstructuredWordDocumentLoader
from langchain_community.document_loaders import UnstructuredPDFLoader
from playwright.async_api import async_playwright
import numpy as np
import spacy
import unicodedata
from spacy.lang.en.stop_words import STOP_WORDS
from .embedder import EmbedderService

embedderService = EmbedderService()
nlp = spacy.load("en_core_web_md")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=0)
PHRASES_TO_REMOVE = ["universiti malaya", "university of malaya"]

class ExtractorService:
    def __init__(self):
        pass
        
    def clean_text(self, text: str) -> str:
        if not text:
            return ""

        text = unicodedata.normalize("NFKC", text)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"[\t\r\f\v]+", " ", text)
        text = re.sub(r"\n+", "\n", text)
        # bullet point
        text = re.sub(r"^\s*[\-\•\▪\●\*]\s+", "", text, flags=re.MULTILINE)
        text = re.sub(r"^\s*\d+[\.\)]\s+", "", text, flags=re.MULTILINE)

        # Remove duplicate punctuation
        text = re.sub(r"([.!?])\1+", r"\1", text)

        # spaces
        text = re.sub(r" +", " ", text)
        text = re.sub(r"\s+([.,!?;:])", r"\1", text)

        return text.strip()
    

    def split_into_sentences(self, text) -> List[str]:
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if len(s.strip()) > 0]


    def merge_semantic_chunks(
        self, 
        sentences: List[str], 
        embeddings: List[List[float]], 
        threshold: float, 
        max_chars: int
    ) -> List[str]:
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


    def semantic_chunking(
        self, 
        text: str, 
        threshold: float = 0.75, 
        max_chars: int = 800, 
        min_words: int = 5
    ) -> List[str]:
        cleaned_text = self.clean_text(text)
        sentences = self.split_into_sentences(cleaned_text)
        embeddings = embedderService.embed_texts(sentences)
        merged_chunks = self.merge_semantic_chunks(sentences, embeddings, threshold, max_chars)
        filtered_chunks = [
            chunk for chunk in merged_chunks
            if(len(chunk.split())) >= min_words
        ]
        return filtered_chunks


    async def extract_text_from_website(
        self,
        url: str
    ) -> List[str]:
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
        
        result_chunks = self.semantic_chunking(content)
        
        return result_chunks if result_chunks else ["cannot find"]


    def extract_text_from_pdf(self, file_obj) -> str:
        with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as tmp_file:
            tmp_file.write(file_obj.read())
            tmp_path = tmp_file.name
        loader = UnstructuredPDFLoader(tmp_path, mode="elements")
        docs = loader.load()

        text = "\n".join(doc.page_content for doc in docs)
        return text


    def extract_text_from_docx(self, file_obj) -> str:
        with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as tmp_file:
            tmp_file.write(file_obj.read())
            tmp_path = tmp_file.name
        loader = UnstructuredWordDocumentLoader(tmp_path, mode="elements")
        docs = loader.load()

        text = "\n".join(doc.page_content for doc in docs)
        return text


    def extract_main_content(self, text:str) -> str:
        lowered = text.lower()
        for phrase in PHRASES_TO_REMOVE:
            lowered = lowered.replace(phrase, "")
            
        doc = nlp(lowered)
        main_content = [
            token.text for token in doc
            if token.is_alpha and token.text.lower() not in STOP_WORDS
        ]
        return " ".join(main_content)
    
    
    def chunk_document(self, text:str) -> str:
        return text_splitter.split_text(text)
   