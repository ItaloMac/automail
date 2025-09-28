from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.email_history_service import EmailHistoryService
from app.models.email_history import EmailHistory

router = APIRouter(tags=["Histórico"])


@router.get("/")
async def get_all_emails(db: Session = Depends(get_db)):
    try:
        service = EmailHistoryService(db)
        emails = service.get_all_emails()
        
        result = []
        for email in emails:
            result.append(email.to_dict())
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/category/{category}")
async def get_emails_by_category(category: str, db: Session = Depends(get_db)):
    if category not in ["Produtivo", "Improdutivo"]:
        raise HTTPException(status_code=400, detail="Categoria inválida")
    
    try:
        service = EmailHistoryService(db)
        emails = service.get_emails_by_category(category)
        
        result = []
        for email in emails:
            result.append(email.to_dict())
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Pega estatísticas simples"""
    try:
        service = EmailHistoryService(db)
        stats = service.count_emails()
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
