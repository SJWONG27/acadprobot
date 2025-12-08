import uuid
from typing import List, Dict, Any



class RAGService:
    def __init__(self, supabase):
        self.supabase = supabase
    
    def compare_match_embedding(
        self, 
        query_embedding: List[float], 
        chatbot_id: uuid
    ) -> str:
        print("RAG Start")

        response = self.supabase.rpc("match_embeddings", {
            "query_embedding": query_embedding,
            "match_count": 5,
            "chatbot_id": str(chatbot_id)
        }).execute()
        
        # print(type(query_embedding), len(query_embedding))
    
        if not response.data:
            print("no data from db: ", response)
            return "no knowledge from db. Answer academic queries yourself."    
        
        # filter match count with higher than similarity threshold
        SIMILARITY_THRESHOLD = 0.5
        
        top_result = response.data[0]
        similarity = top_result["similarity"]
        
        print("db similarity: ", similarity)
        
        if similarity < SIMILARITY_THRESHOLD:
            print("similarity low")
            return "no knowledge from db. Answer academic queries yourself."
        
        
        match_chunks = []
        for item in response.data:
            if item["similarity"] > SIMILARITY_THRESHOLD:
                match_chunks.append(item["content"])
        
        
        # find neighbour chunk 
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

        neighbors = self.supabase.table("embeddings") \
            .select("content, chunk_index") \
            .eq(source_filter[0], source_filter[1]) \
            .gte("chunk_index", top_idx) \
            .lte("chunk_index", top_idx + N) \
            .order("chunk_index") \
            .execute()
        
        # combine all
        top_content = top_result["content"]
        continuous_chunks = [item["content"] for item in neighbors.data]    
        
        all_chunks = []
        all_chunks.append(top_content)
        for item in continuous_chunks:
            if item not in all_chunks:
                all_chunks.append(item)
                
        for item in match_chunks:
            if item not in all_chunks:
                all_chunks.append(item)

        context = "\n\n".join(all_chunks)
            
        print(context)
            
        return context