import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sqlalchemy.orm import Session
from ..database.models import UnrelatedQueries

class ClassifierService:
    def __init__(self, model_path: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.academic_classifier_model = AutoModelForSequenceClassification.from_pretrained(model_path)
        
    def classify_query(self, query: str) -> int:
        inputs = self.tokenizer(query, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.academic_classifier_model(**inputs)
            logits = outputs.logits
            predicted_class = torch.argmax(logits, dim=1).item()
            confidence = torch.softmax(logits, dim=1)[0][predicted_class].item()
            
        print(f"Query: {query}")
        print(f"Predicted class: {predicted_class}, confidence: {confidence:.2f}")
        
        return predicted_class
    
    
    def store_irrelevant_query(self, user_id: str, chatbot_id: str, query_text: str, db: Session):
        unrelated = UnrelatedQueries(
                user_id=user_id,
                chatbot_id=chatbot_id,
                query_text=query_text
            )
        db.add(unrelated)
        db.commit()
        db.refresh(unrelated)
        return unrelated
    

    def handle_non_academic_query(
        self,
        db,
        request
    ):
        self.store_irrelevant_query(
            db=db,
            user_id=request.id,
            chatbot_id=request.chatbot_id,
            query_text=request.prompt
        )

        return (
            "I'm sorry, but that question seems unrelated to academic programs. "
            "Could you please rephrase it or ask something about your studies?"
        )


