from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from app.utils.training_data import EXAMPLES
from app.utils.preprocessor_npl import preprocess

class EmailClassifier:
    # INSTÂNCIA ÚNICA para toda aplicação
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if hasattr(self, "clf"):
            return 

        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

        texts, labels = zip(*EXAMPLES)
        processed_texts = [preprocess(t) for t in texts]
        embeddings = self.embedding_model.encode(processed_texts)

        # 3. Treino/teste
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

        category = "Improdutivo" if pred == 1 else "Produtivo"

        return {
            "category": category,
            "confidence": float(confidence)
        }
