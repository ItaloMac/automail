from typing import Dict, Any
import os
from app.services.ai_response_generator import AIResponseGenerator
from app.utils.read_pdf import read_pdf
from app.utils.read_txt import read_txt
from app.utils.preprocessor_npl import preprocess

class EmailProcessingEngine:
    def __init__(self):
        self.response_generator = AIResponseGenerator()
        
    def process_email(self, input_data: str, input_type: str = "text") -> Dict[str, Any]:
        try:
            # Ler conteúdo
            raw_content = self._read_content(input_data, input_type)
            
            # Pré-processar texto
            processed_text = preprocess(raw_content)
            
            # Gerar resposta (inclui classificação)
            response_result = self.response_generator.generate_response(raw_content)
            
            return {
                "status": "success",
                "raw_content": raw_content,
                "processed_content": processed_text,
                "category": response_result["category"],
                "confidence": response_result["confidence"],
                "email_type": response_result["email_type"],
                "suggested_response": response_result["suggested_response"]
            }
            
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
