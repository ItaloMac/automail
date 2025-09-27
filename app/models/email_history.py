from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from app.database import Base

class EmailHistory(Base):
    __tablename__ = "email_history"

    id = Column(Integer, primary_key=True, index=True)
    text_preview = Column(String(200))          
    category = Column(String(50), nullable=False)  
    ai_confidence = Column(Float)                  
    response_preview = Column(String(200))      
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())
    email_type = Column(String(20), default="text") 

    def __repr__(self):
        return f"<EmailHistory(id={self.id}, category='{self.category}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "text_preview": self.text_preview,
            "category": self.category,
            "ai_confidence": round(self.ai_confidence, 3) if self.ai_confidence else None,
            "response_preview": self.response_preview,
            "analyzed_at": self.analyzed_at.isoformat() if self.analyzed_at else None,
            "email_type": self.email_type
        }
