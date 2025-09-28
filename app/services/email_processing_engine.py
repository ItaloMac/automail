from typing import Dict, Any, Optional
import os
from app.services.ai_response_generator import AIResponseGenerator
from app.services.email_history_service import EmailHistoryService
from app.utils.read_pdf import read_pdf
from app.utils.read_txt import read_txt
from app.utils.preprocessor_npl import preprocess
from sqlalchemy.orm import Session


class EmailProcessingEngine:
    def __init__(self, db: Optional[Session] = None):
        self.response_generator = AIResponseGenerator()
        self.db = db
        
    def process_email(self, input_data: str, input_type: str = "text") -> Dict[str, Any]:
        try:
            # 1. Ler o arquivo
            content = self._read_content(input_data, input_type)
            
            # 2. Processar texto
            processed = preprocess(content)
            
            # 3. Gerar resposta
            response = self.response_generator.generate_response(processed)
            
            # 4. Montar resultado
            result = {
                "status": "success",
                "raw_content": content,
                "processed_content": processed,
                "category": response["category"],
                "confidence": float(response["confidence"]),  # Converter para float Python
                "email_type": response["email_type"],
                "suggested_response": response["suggested_response"],
                "input_type": input_type
            }
            
            if self.db:
                history_service = EmailHistoryService(self.db)
                saved = history_service.save_email(result)
                result["saved_id"] = saved.id
            
            return result
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "suggested_response": "Obrigado pelo contato."
            }
    
    def _read_content(self, input_data: str, input_type: str) -> str:
        if input_type == "text":
            return input_data
        elif input_type == "pdf":
            return read_pdf(input_data)
        elif input_type == "txt":
            return read_txt(input_data)
        else:
            raise ValueError(f"Tipo inválido: {input_type}")
