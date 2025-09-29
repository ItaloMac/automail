from typing import Dict, Any
import random
from app.services.email_classifier import EmailClassifier


class AIResponseGenerator:
     _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
       if hasattr(self, "email_classifier"):
            return  # evita recriação

        # Reutiliza classifier já otimizado
        from app.services.email_classifier import EmailClassifier
        self.email_classifier = EmailClassifier()

        
        # Templates de resposta por categoria e tipo
        self.response_templates = {
            "Produtivo": {
                "senha": [
                    "Recebemos sua solicitação sobre redefinição de senha. Nossa equipe de TI foi notificada e você receberá as instruções por email em até 2 horas úteis.",
                    "Sua solicitação de redefinição de senha foi encaminhada para o suporte técnico. Você receberá um email com as instruções em breve."
                ],
                "sistema": [
                    "Identificamos o problema relatado em nosso sistema. Nossa equipe técnica já foi notificada e está trabalhando na correção.",
                    "Recebemos seu relato sobre o erro no sistema. O caso foi encaminhado para nossa equipe de desenvolvimento."
                ],
                "suporte": [
                    "Sua solicitação foi registrada e encaminhada para nossa equipe de suporte. Um atendente entrará em contato em até 24 horas úteis.",
                    "Recebemos sua mensagem e ela foi direcionada para o setor responsável. Nossa equipe retornará com uma solução em breve."
                ],
                "financeiro": [
                    "Sua questão financeira foi encaminhada para nosso departamento financeiro. Você receberá um retorno dentro de 48 horas úteis.",
                    "Recebemos sua solicitação financeira. Nossa equipe do setor financeiro analisará seu caso e entrará em contato."
                ],
                "treinamento": [
                    "Sua solicitação de treinamento foi registrada. Nossa equipe de capacitação entrará em contato para agendar uma sessão.",
                    "Recebemos sua necessidade de treinamento adicional. Um especialista da nossa equipe agendará um horário para te auxiliar."
                ],
                "generico": [
                    "Sua mensagem foi recebida e direcionada para o setor apropriado. Retornaremos com uma resposta em até 24 horas úteis.",
                    "Recebemos sua solicitação. Nossa equipe analisará seu caso e fornecerá uma resposta adequada em breve."
                ]
            },
            "Improdutivo": {
                "felicitacoes": [
                    "Muito obrigado pelas felicitações! Desejamos o mesmo para você e sua família.",
                    "Agradecemos as felicitações! Que seja um período de muita alegria e prosperidade."
                ],
                "pessoal": [
                    "Obrigado pela mensagem! Desejo tudo de bom para você.",
                    "Agradeço pelo contato. Tenha um excelente dia!"
                ],
                "generico": [
                    "Obrigado pela mensagem!",
                    "Agradeço pelo contato."
                ]
            }
        }

    def generate_response(self, email_text: str) -> Dict[str, Any]:
        try:
            classification = self.email_classifier.classify(email_text)
            category = classification["category"]
            confidence = classification["confidence"]
            
            email_type = self._identify_email_type(email_text.lower(), category)
            
            selected_response = self._select_template(category, email_type)
            
            return {
                "suggested_response": selected_response,
                "category": category,
                "confidence": round(confidence, 3),
                "email_type": email_type,
                "status": "success"
            }
            
        except Exception as e:
            return {
                "suggested_response": self._get_fallback_response(),
                "category": "unknown",
                "confidence": 0.0,
                "email_type": "generico",
                "status": "error",
                "error": str(e)
            }

    def _identify_email_type(self, email_text: str, category: str) -> str:
        """Identifica tipo do email por palavras-chave"""
        if category == "Produtivo":
            keywords = {
                "senha": ["senha", "password", "login", "acesso", "entrar", "redefinir"],
                "sistema": ["erro", "bug", "sistema", "falha", "problema", "não funciona", "500", "404"],
                "suporte": ["suporte", "ajuda", "dúvida", "chat", "atendimento", "demora", "protocolo"],
                "financeiro": ["financeiro", "pagamento", "fatura", "cobrança", "valor", "preço", "boleto"],
                "treinamento": ["treinamento", "capacitação", "aprender", "tutorial", "ensinar", "adaptar", "funcionalidade"]
            }
            
            for email_type, words in keywords.items():
                if any(word in email_text for word in words):
                    return email_type
                    
        elif category == "Improdutivo":
            felicitacao_words = ["feliz", "natal", "ano novo", "parabéns", "aniversário", "prospero", "festas"]
            if any(word in email_text for word in felicitacao_words):
                return "felicitacoes"
            else:
                return "pessoal"
        
        return "generico"

    def _select_template(self, category: str, email_type: str) -> str:
        if category in self.response_templates:
            category_templates = self.response_templates[category]
            
            if email_type in category_templates:
                return random.choice(category_templates[email_type])
            elif "generico" in category_templates:
                return random.choice(category_templates["generico"])
        
        return self._get_fallback_response(category)

    def _get_fallback_response(self, category: str = None) -> str:
        if category == "Produtivo":
            return "Obrigado pelo seu email. Analisaremos sua solicitação e retornaremos em breve."
        elif category == "Improdutivo":
            return "Obrigado pela mensagem! Desejo tudo de bom."
        else:
            return "Obrigado pelo contato."


# Exemplo de uso
if __name__ == "__main__":
    from email_classifier import EmailClassifier
    
    # Teste direto do gerador (sem usar o engine)
    classifier = EmailClassifier()
    generator = AIResponseGenerator()
    
    exemplos_teste = [
        "Preciso de ajuda para acessar minha conta",
        "Ano novo prospero para todos da equipe, estaremos juntos no proximo ano",
        "Preciso de uma resposta rapida para o meu problema, meu numero de protocolo é 12345",
        "Não estou conseguindo redefinir a minha senha no portal",
        "Preciso de um treinamento para usar a nova funcionalidade",
        "Meu financeiro no sistema esta errado, nao consigo gerar pagamento."
    ]
    
    for texto in exemplos_teste:
        resultado = generator.generate_response(texto)
        print(f"\nTexto: {texto}")
        print(f"Categoria: {resultado['category']} (confiança: {resultado['confidence']:.3f})")
        print(f"Tipo: {resultado['email_type']}")
        print(f"Resposta: {resultado['suggested_response']}")
        print("-" * 80)
