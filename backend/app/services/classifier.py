import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

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


