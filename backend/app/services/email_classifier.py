from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from app.utils.training_data import EXAMPLES
from app.utils.preprocessor_npl import preprocess


class EmailClassifier:
    def __init__(self):
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

        texts, labels = zip(*EXAMPLES)
        embeddings = self.embedding_model.encode(texts)

        # treino/teste
        X_train, X_test, y_train, y_test = train_test_split(
            embeddings, labels, test_size=0.2, random_state=42
        )

        # 4. Treinar classificador
        self.clf = LogisticRegression()
        self.clf.fit(X_train, y_train)

    def classify(self, text):
        processed_text = preprocess(text)
        
        emb = self.embedding_model.encode([processed_text])

        pred = self.clf.predict(emb)[0]
        proba = self.clf.predict_proba(emb)[0]
        confidence = max(proba)

        if pred == 1:
            category = "Improdutivo"
        else:
            category = "Produtivo"
        
        return {
            "category": category,
            "confidence": float(confidence)  # Converter para float Python
        }


if __name__ == "__main__":
    classifier = EmailClassifier()

    exemplos_teste = [
        "Não estou conseguindo redefinir a minha senha no portal",
        "Feliz natal a toda a equipe",
        "O suporte esta demorando muito para responder no chat do sistema!",
        "Bom ano novo para todos da equipe, quero estar com voces no proximo ano",
        "Não estou conseguindo me adptar ao sistema, gostaria de um novo treinamento"
    ]

    for texto in exemplos_teste:
        resultado = classifier.classify(texto)
        print(f"Texto: {texto}")
        print(f"→ Categoria: {resultado['category']} (confiança: {resultado['confidence']:.2f}) \n")