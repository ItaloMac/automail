import spacy
import string

nlp = spacy.load("pt_core_news_sm")

def preprocess(text: str) -> str:
    doc = nlp(text.lower())

    tokens = []
    for token in doc:
        # Verifica se o token não é uma stopword
        if not token.is_stop:
            # Verifica se o token não é pontuação
            if token.text not in string.punctuation:
                # Usa a forma lematizada
                tokens.append(token.lemma_)
    
    return " ".join(tokens)
