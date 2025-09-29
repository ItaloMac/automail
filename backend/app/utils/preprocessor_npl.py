import spacy
import string

# Carrega spaCy uma vez, desativa componentes que não usa para acelerar
nlp = spacy.load("pt_core_news_sm", disable=["ner", "parser"])

def preprocess(text: str) -> str:
    doc = nlp(text.lower())
    return " ".join(
        token.lemma_ for token in doc
        if not token.is_stop and not token.is_punct
    )
