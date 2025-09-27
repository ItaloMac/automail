def read_txt(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        return content.strip()
    except Exception as e:
        print(f"Erro ao ler arquivo TXT: {e}")
        return ""
