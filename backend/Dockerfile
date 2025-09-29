# Base: python slim
FROM python:3.11-slim

# Dependências do sistema
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Instala pip atualizado
RUN pip install --no-cache-dir --upgrade pip

# Instala Torch CPU-only primeiro
RUN pip install --no-cache-dir torch==2.1.0+cpu torchvision==0.16.0+cpu torchaudio==2.1.0+cpu --index-url https://download.pytorch.org/whl/cpu

# Depois instala o restante do requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Instala o modelo de spaCy manualmente (apenas pt_core_news_sm)
RUN pip install https://github.com/explosion/spacy-models/releases/download/pt_core_news_sm-3.7.0/pt_core_news_sm-3.7.0-py3-none-any.whl
