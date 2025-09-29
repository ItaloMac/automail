# AutoMail - Sistema de Processamento Automático de Emails

O **AutoMail** é um sistema completo para análise automática de emails, que classifica mensagens como **Produtivas** ou **Improdutivas** e gera respostas inteligentes utilizando IA. Ele suporta múltiplos formatos de entrada, como texto, PDF e arquivos TXT, e armazena o histórico de análises em um banco de dados PostgreSQL.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Framework**: FastAPI
- **Banco de Dados**: PostgreSQL
- **NLP**: spaCy (pré-processamento)
- **Embeddings**: SentenceTransformers (paraphrase-multilingual-MiniLM-L12-v2)
- **Classificação**: Logistic Regression com embeddings multilíngues
- **Geração de Respostas**: Templates baseados em regras e classificação

### Frontend
- **Framework**: React
- **Biblioteca de Componentes**: Material-UI (MUI)
- **Gerenciamento de Estado**: React Hooks
- **HTTP Client**: Axios
- **Estilização**: Emotion e CSS
- **Ferramenta de Build**: Vite

---

## 🌟 Funcionalidades Principais

### Análise de Emails
- **Classificação Automática**: Identifica se o email é **Produtivo** ou **Improdutivo**.
- **Geração de Respostas**: Cria respostas automáticas baseadas no conteúdo do email.
- **Suporte a Múltiplos Formatos**: Texto, PDF e arquivos TXT.
- **Confiança da Classificação**: Exibe o nível de confiança do modelo.

### Histórico e Estatísticas
- **Histórico Completo**: Armazena e exibe análises anteriores.
- **Filtro por Categoria**: Filtra emails por **Produtivo** ou **Improdutivo**.
- **Estatísticas**: Mostra métricas do sistema, como total de emails processados.

---

## 📂 Estrutura do Projeto

```
automail/
├── backend/                # Código do backend (FastAPI)
│   ├── app/                # Aplicação principal
│   ├── Dockerfile          # Dockerfile do backend
│   └── requirements.txt    # Dependências do backend
├── frontend/               # Código do frontend (React)
│   ├── src/                # Código-fonte do frontend
│   ├── Dockerfile          # Dockerfile do frontend
│   └── package.json        # Dependências do frontend
├── docker-compose.yml      # Configuração do Docker Compose
└── README.md               # Documentação do projeto
```
---

## ⚡ Instalação e Execução

### Pré-requisitos
- **Docker** e **Docker Compose** instalados na máquina.

### Passos para Instalação e Execução
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/ItaloMac/automail.git
   cd automail
   ```

2. **Inicie os serviços com Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Acesse a aplicação**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend (API)**: [http://localhost:8000/docs](http://localhost:8000/docs)

4. **Parar os serviços**:
   Para parar os serviços, use:
   ```bash
   docker-compose down
   ```

---

## 🛠️ Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/email/process-text` | Analisar texto de email e gerar resposta |
| `POST` | `/api/email/process-pdf` | Analisar PDF com email e gerar resposta |
| `POST` | `/api/email/process-txt` | Analisar arquivo TXT e gerar resposta |
| `GET`  | `/api/history/` | Consultar histórico completo |
| `GET`  | `/api/history/category/{category}` | Consultar por categoria |
| `GET`  | `/api/history/stats` | Estatísticas do sistema |

---

## 🖥️ Interface do Usuário

### Tela Inicial
- Escolha o tipo de email para análise (Texto, PDF ou TXT).
- Botão para acessar o histórico de emails processados.

### Tela de Processamento
- Exibe uma barra de progresso durante o processamento.
- Mostra o resultado da análise com:
  - Categoria do email.
  - Nível de confiança.
  - Resposta sugerida.

### Histórico de Emails
- Lista de emails processados com paginação.
- Filtro por categoria (Produtivo/Improdutivo).
- Detalhes de cada email, incluindo o corpo do email (texto), categoria, confiança e resposta sugerida.

---

## 🧪 Testes

### Testar o Backend
1. Acesse a documentação interativa da API:
   [http://localhost:8000/docs](http://localhost:8000/docs)
2. Teste os endpoints diretamente na interface Swagger.

### Testar o Frontend
1. Acesse o frontend em [http://localhost:5173](http://localhost:5173).
2. Realize o upload de emails em diferentes formatos e verifique os resultados.


