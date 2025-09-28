from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Email(Base):
    __tablename__ = "emails"
    id = Column(Integer, primary_key=True, index=True)
    original_text = Column(Text, nullable=False)
    preprocessed_text = Column(Text)
    category = Column(String(50), nullable=False)
    generated_response = Column(Text)
    ai_confidence = Column(Float)
    email_type = Column(String(20), default="text")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Email(id={self.id}, category='{self.category}', confidence={self.confidence})>"

    def to_dict(self):
        return {
            "id": self.id,
            "original_text": self.original_text[:100] + "..." if len(self.original_text) > 100 else self.original_text,
            "category": self.category,
            "ai_confidence": self.ai_confidence,
            "generated_response": self.generated_response,
            "email_type": self.email_type,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }