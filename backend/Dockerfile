FROM python:3.11-slim

WORKDIR /app

# Evitar downloads automáticos de transformers e datasets
ENV TRANSFORMERS_OFFLINE=1
ENV HF_DATASETS_OFFLINE=1

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

# Pré-baixa modelos necessários
RUN python -m spacy download pt_core_news_sm
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')"

# Copia o restante da aplicação
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
