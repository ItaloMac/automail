# AutoMail - Backend

Sistema de análise automática de emails que classifica mensagens como **Produtivas** ou **Improdutivas** e gera respostas inteligentes usando IA.

## Tecnologias e Modelos

- **Framework**: FastAPI
- **Banco**: PostgreSQL
- **NLP**: spaCy (pré-processamento)
- **Embeddings**: SentenceTransformers (paraphrase-multilingual-MiniLM-L12-v2)
- **Classificação**: Logistic Regression com embeddings multilíngues
- **Geração de Respostas**: Templates baseados em regras e classificação

## Funcionalidades Principais

### Análise de Emails
- Classificação automática (Produtivo/Improdutivo)
- Geração de respostas contextualizadas por templates
- Suporte a texto puro, PDF e TXT
- Confiança da classificação

### Histórico e Gestão
- Armazenamento em PostgreSQL
- Consulta de análises anteriores por categoria

### Treinamento
- Modelo treinado com dados de exemplo português
- Classificação baseada em embeddings semânticos

## Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/email/process-text` | Analisar texto de email e gerar resposta |
| `POST` | `/api/email/process-pdf` | Analisar PDF com email e gerar resposta |
| `POST` | `/api/email/process-txt` | Analisar arquivo TXT e gerar resposta |
| `GET` | `/api/history/` | Consultar histórico completo |
| `GET` | `/api/history/category/{category}` | Consultar por categoria |
| `GET` | `/api/history/stats` | Estatísticas do sistema |

## ⚡ Instalação e Execução
