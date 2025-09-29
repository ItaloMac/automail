WORKDIR /app

# Copia apenas o requirements.txt primeiro
COPY requirements.txt .

# Instala dependências
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Instala torch CPU-only (menor)
RUN pip install --no-cache-dir torch==2.1.0+cpu torchvision==0.16.0+cpu torchaudio==2.1.0+cpu --index-url https://download.pytorch.org/whl/cpu

# Instala spaCy manualmente
RUN pip install https://github.com/explosion/spacy-models/releases/download/pt_core_news_sm-3.7.0/pt_core_news_sm-3.7.0-py3-none-any.whl

# Copia o restante da aplicação
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
