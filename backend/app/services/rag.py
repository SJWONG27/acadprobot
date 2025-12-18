import uuid
from typing import List, Dict, Any
from flashrank import Ranker
from langchain_community.document_compressors import FlashrankRerank
from langchain_core.documents import Document 


class RAGService:
    def __init__(self, supabase):
        self.supabase = supabase
    
    
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

        compressor = FlashrankRerank()

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