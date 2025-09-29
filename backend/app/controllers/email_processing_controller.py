from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import Dict, Any, Optional
import tempfile
import os
from app.services.email_processing_engine import EmailProcessingEngine
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

# Criar engine única na inicialização do módulo
# Evita criar um novo EmailProcessingEngine para cada requisição
global_engine: Optional[EmailProcessingEngine] = None

def get_engine(db: Session) -> EmailProcessingEngine:
    global global_engine
    if global_engine is None:
        global_engine = EmailProcessingEngine(db)
    return global_engine


@router.post("/process-text")
async def process_text_email(
    email_text: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        engine = get_engine(db)
        result = engine.process_email(email_text, "text")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-pdf")
async def process_pdf_email(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Só aceita PDF")
    
    try:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        content = await file.read()
        temp_file.write(content)
        temp_file.close()
        
        engine = get_engine(db)
        result = engine.process_email(temp_file.name, "pdf")
        
        os.unlink(temp_file.name)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-txt")
async def process_txt_email(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Só aceita TXT")
    
    try:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt', mode='w+', encoding='utf-8')
        content = await file.read()
        temp_file.write(content.decode('utf-8'))
        temp_file.close()
        
        engine = get_engine(db)
        result = engine.process_email(temp_file.name, "txt")
        
        os.unlink(temp_file.name)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
