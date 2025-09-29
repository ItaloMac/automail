FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install base dependencies
RUN pip install --no-cache-dir --upgrade pip

# Install torch CPU-only version (muito menor)
RUN pip install --no-cache-dir torch==2.1.0+cpu torchvision==0.16.0+cpu torchaudio==2.1.0+cpu --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies from PyPI
RUN pip install --no-cache-dir -r requirements.txt

# Install spaCy Portuguese model
RUN pip install https://github.com/explosion/spacy-models/releases/download/pt_core_news_sm-3.7.0/pt_core_news_sm-3.7.0-py3-none-any.whl

# Copy application
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]