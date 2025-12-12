import re
import os
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


class RemoveColonParser(StrOutputParser):
    def parse(self, text: str) -> str:
        cleaned_text = re.sub(r"(\d+\.\s[^\n:]+):", r"\1", text) 
        cleaned_text = re.sub(r"(\*\*[^\n:]+\*\*):", r"\1", cleaned_text)
        return cleaned_text
    
class GeneratorService:
    def __init__(self):      
        ollama_base_url = os.getenv("OLLAMA_BASE_URL")
        default_url = ollama_base_url != ""
        
        self.model = OllamaLLM(
            model="llama3.2",
            temperature=0.3,
            base_url = ollama_base_url if default_url else None
        )
    
    def generate_llm_response(
        self, 
        current_query: str,
        conversation_context: str,
        retrieved_knowledge: str
    ) -> str:    
        
        full_prompt = (
                "You are AcadProBot, a helpful academic advisor chatbot in Universiti Malaya.\n\n"
                "Recent conversation:\n"
                f"{conversation_context}\n"
                "Relevant academic knowledge:\n"
                f"{retrieved_knowledge}\n\n"
                "Now respond naturally and accurately to the current_query using retrieved chunk in descending order similarity."
                "Format the answer using Markdown-style, with proper line spacing across different ideas."
            )
                
        prompt_template = ChatPromptTemplate([
            ("system", "{full_prompt}"),
            ("human", "{current_query}")
        ])
        
        parser = RemoveColonParser()
        chain = prompt_template | self.model | parser
        
        result = chain.invoke({
            "full_prompt": full_prompt,
            "current_query": current_query,
        })
        
        return result