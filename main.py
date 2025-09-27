from app.database import create_tables, get_db
from fastapi import FastAPI, Depends

create_tables()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Tabelas PostgreSQL criadas com sucesso!"}

@app.get("/test-db")
async def test_db(db = Depends(get_db)):
    result = db.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = [row[0] for row in result.fetchall()]
    return {"tables": tables}