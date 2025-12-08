from typing import List, Dict, Any
import os
from langchain_ollama import OllamaEmbeddings



class EmbedderService:
    def __init__(self):        
        ollama_base_url = os.getenv("OLLAMA_BASE_URL")
        default_url = ollama_base_url != ""
        
        self.model = OllamaEmbeddings(
            model="nomic-embed-text",
            base_url = ollama_base_url if default_url else None
        )
    
    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        return self.model.embed_documents(texts)

    def embed_query(self, query: List[str]) -> List[float]:
        return self.model.embed_query(query)
    