from sqlalchemy.orm import Session
from app.models.email_history import EmailHistory
from datetime import datetime

class EmailHistoryService:
    def __init__(self, db: Session):
        self.db = db
    
    def save_email(self, email_data):
        text_preview = email_data["raw_content"][:200] if email_data.get("raw_content") else ""
        response_preview = email_data["suggested_response"][:200] if email_data.get("suggested_response") else ""
        
        new_email = EmailHistory(
            text_preview=text_preview,
            category=email_data.get("category", "unknown"),
            ai_confidence=email_data.get("confidence", 0.0),
            response_preview=response_preview,
            email_type=email_data.get("input_type", "text"),
            analyzed_at=datetime.now()
        )
        
        self.db.add(new_email)
        self.db.commit()
        self.db.refresh(new_email)
        
        return new_email
    
    def get_all_emails(self):
        return self.db.query(EmailHistory).order_by(EmailHistory.analyzed_at.desc()).all()
    
    def get_emails_by_category(self, category):
        return self.db.query(EmailHistory).filter(EmailHistory.category == category).all()
    
    def count_emails(self):
        total = self.db.query(EmailHistory).count()
        produtivos = self.db.query(EmailHistory).filter(EmailHistory.category == "Produtivo").count()
        improdutivos = self.db.query(EmailHistory).filter(EmailHistory.category == "Improdutivo").count()
        
        return {
            "total": total,
            "produtivos": produtivos,
            "improdutivos": improdutivos
        }
