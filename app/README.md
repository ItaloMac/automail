# AutoMail - Backend

Sistema de análise automática de emails que classifica mensagens como **Produtivas** ou **Improdutivas** e gera respostas inteligentes usando IA.

## Tecnologias e Modelos

- **Framework**: FastAPI
- **Banco**: PostgreSQL
- **NLP**: spaCy (pré-processamento)
- **Classificação**: BERT Portuguese (neuralmind)
- **Geração de Respostas**: GPT-2 Portuguese (pierreguillou)

## Funcionalidades Principais

### Análise de Emails
- Classificação automática (Produtivo/Improdutivo)
- Geração de respostas contextualizadas
- Suporte a texto puro e PDF

### Histórico e Gestão
- Armazenamento em PostgreSQL
- Consulta de análises anteriores

### Fine-tuning Demonstrativo
- Simulação de treinamento com dados fictícios

## Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/analyze/text` | Analisar texto de email e gerar resposta |
| `POST` | `/api/analyze/pdf` | Analisar PDF com email e gerar resposta |
| `GET` | `/api/history` | Consultar histórico |
| `POST` | `/api/training/fine-tune` | Demo de fine-tuning |

## ⚡ Instalação e Execução
