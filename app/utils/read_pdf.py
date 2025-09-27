import PyPDF2

def read_pdf(file_path: str) -> str:
    text = ""
    try:
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or "" 
        return text.strip()
    except Exception as e:
        print(f"Erro ao ler arquivo PDF: {e}")
        return ""
