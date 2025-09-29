FROM python:3.11-slim

WORKDIR /app

# Evitar downloads automáticos durante runtime, exceto quando necessário
ENV TRANSFORMERS_OFFLINE=0
ENV HF_DATASETS_OFFLINE=0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia apenas requirements primeiro
COPY requirements.txt .

# Atualiza pip
RUN pip install --no-cache-dir --upgrade pip

# Instala Torch CPU-only (menor)
RUN pip install --no-cache-dir \
    torch==2.1.0+cpu \
    torchvision==0.16.0+cpu \
    torchaudio==2.1.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Instala restante das dependências
RUN pip install --no-cache-dir -r requirements.txt

# Instala spaCy PT
RUN pip install https://github.com/explosion/spacy-models/releases/download/pt_core_news_sm-3.7.0/pt_core_news_sm-3.7.0-py3-none-any.whl

# Copia o restante da aplicação
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
