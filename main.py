from app.database import create_tables, get_db
from fastapi import FastAPI, Depends
from app.controllers.email_processing_controller import router as email_router
from app.controllers.history_controller import router as history_router

create_tables()

app = FastAPI(
    title="AutoMail API",
    description="""
    ## Sistema de Processamento Automático de Emails
    
    Esta API permite processar emails automaticamente, classificando-os como **Produtivos** ou **Improdutivos** 
    e gerando respostas automáticas apropriadas com IA.
    
    ### Funcionalidades:
    
    * **Processar Texto**: Analisa texto de email diretamente
    * **Processar PDF**: Extrai e analisa texto de arquivos PDF
    * **Processar TXT**: Analisa arquivos de texto
    * **Histórico**: Consulta emails processados anteriormente
    * **Estatísticas**: Visualiza métricas do sistema
    
    ### Categorias de Email:
    
    * **Produtivo**: Emails relacionados ao trabalho (problemas, suporte, etc.)
    * **Improdutivo**: Emails pessoais, felicitações, etc.
    
    """,
    version="1.0.0"
)

app.include_router(email_router, prefix="/api/email", tags=["Email Processing"])
app.include_router(history_router, prefix="/api/history", tags=["Histórico"])