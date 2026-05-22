import uuid
import os
from typing import List, Dict, Any
from flashrank import Ranker
from langchain_community.document_compressors import FlashrankRerank
from langchain_core.documents import Document 
from .embedder import EmbedderService
from .generator import GeneratorService
from .extractor import ExtractorService


extractorService = ExtractorService()
embedderService = EmbedderService()
generatorService = GeneratorService()

PROCESS_EXTRACT_MAIN_CONTENT = "Extracting Main Content"
PROCESS_EMBED_QUERY = "Embedding Query"
PROCESS_COMPARE_MATCH_EMBEDDING = "Comparing and Matching Embedding"
PROCESS_RERANK = "Reranking"
PROCESS_GENERATE_RESPONSE = "Generating response"

class RAGService:
    def __init__(self, supabase):
        self.supabase = supabase

    def add_process_log(self, process_logs, step, status="completed"):
        log = {
            "step": step,
            "status": status
        }

        if process_logs is None:
            return log

        process_logs.append(log)
        return log
    
    
    def rerank(
        self,
        chunks: List[str],
        query: str,
        top_k: int
    ) -> str:
        if not chunks:
            print("no chunks")
            return "no knowledge from db. Answer academic queries yourself."
        docs = [Document(page_content=chunk) for chunk in chunks]

        compressor = FlashrankRerank(model="ms-marco-MiniLM-L-12-v2")

        # Flashrank will reorder based on relevance
        reranked_docs = compressor.compress_documents(docs, query)

        # Extract the text content only 
        top_text = "\n\n".join([d.page_content for d in reranked_docs[:top_k]])
        # top_text = "\n\n".join([d.page_content for d in reranked_docs])
        print("\nReranking\n",top_text)
        return top_text
        # return [d.page_content for d in reranked_docs[:top_k]]
        
    
    def compare_match_embedding_v2(
        self, 
        query_embedding: List[float], 
        chatbot_id: uuid
    ) -> List[str]:
        print("RAG Start")

        response = self.supabase.rpc("match_embeddings", {
            "query_embedding": query_embedding,
            "match_count": 5,
            "chatbot_id": str(chatbot_id)
        }).execute()
        
        # print(type(query_embedding), len(query_embedding))
    
        if not response.data:
            print("no data from db: ", response)
            return [] 
        
        # filter match count with higher than similarity threshold
        SIMILARITY_THRESHOLD = 0.55
        
        top_result = response.data[0]
        similarity = top_result["similarity"]
        
        print("db similarity: ", similarity)
        
        match_chunks = []
        for top_result in response.data:
            if top_result["similarity"] < SIMILARITY_THRESHOLD:
                print("similarity low. skip")
                continue
                    
            # match_chunks.append(top_result["content"])
            
            # find neighbour chunk 
            source_doc = top_result["document_id"]
            source_web = top_result["website_id"]
            top_idx = top_result["chunk_index"]
            top_similarity = top_result["similarity"]
            
            if source_doc:
                source_type = "document"
                source_filter = ("document_id", source_doc)
            elif source_web:
                source_type = "website"
                source_filter = ("website_id", source_web)
            else:
                return "no source id found"

            print(f"Top source = {source_type}, starting at chunk {top_idx}, similarity = {top_similarity}")
            
            N = 5 
            
            start_index = max(top_idx - 1, 0)

            neighbors = self.supabase.table("embeddings") \
                .select("content, chunk_index") \
                .eq(source_filter[0], source_filter[1]) \
                .gte("chunk_index", start_index) \
                .lte("chunk_index", top_idx + N) \
                .order("chunk_index") \
                .execute()

            combined_text = ""
            for item in neighbors.data:
                if item["content"] not in match_chunks:
                    combined_text += (item["content"]) + "\n\n"
            
            match_chunks.append(combined_text)
                    
            
        print(match_chunks)
        print("Retrieved chunks:", len(match_chunks))
        return [item for item in match_chunks]
    
    
    def run_rag_pipeline(self, prompt, context, chatbot_id, process_logs=None):
        main_content = extractorService.extract_main_content(prompt)
        self.add_process_log(process_logs, PROCESS_EXTRACT_MAIN_CONTENT)

        embedded_query = embedderService.embed_query(main_content)
        self.add_process_log(process_logs, PROCESS_EMBED_QUERY)

        retrieved = self.compare_match_embedding_v2(
            embedded_query,
            chatbot_id=chatbot_id
        )
        self.add_process_log(process_logs, PROCESS_COMPARE_MATCH_EMBEDDING)

        reranked = self.rerank(retrieved, prompt, 3)
        self.add_process_log(process_logs, PROCESS_RERANK)

        response = generatorService.generate_llm_response(
            prompt,
            context,
            reranked
        )
        self.add_process_log(process_logs, PROCESS_GENERATE_RESPONSE)

        return response

    def run_rag_pipeline_stream(self, prompt, context, chatbot_id, process_logs=None):
        main_content = extractorService.extract_main_content(prompt)
        yield self.add_process_log(process_logs, PROCESS_EXTRACT_MAIN_CONTENT)

        embedded_query = embedderService.embed_query(main_content)
        yield self.add_process_log(process_logs, PROCESS_EMBED_QUERY)

        retrieved = self.compare_match_embedding_v2(
            embedded_query,
            chatbot_id=chatbot_id
        )
        yield self.add_process_log(process_logs, PROCESS_COMPARE_MATCH_EMBEDDING)

        reranked = self.rerank(retrieved, prompt, 3)
        yield self.add_process_log(process_logs, PROCESS_RERANK)

        response = generatorService.generate_llm_response(
            prompt,
            context,
            reranked
        )
        yield self.add_process_log(process_logs, PROCESS_GENERATE_RESPONSE)

        return response
