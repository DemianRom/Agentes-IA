from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import ChatOllama

app = FastAPI()

# Permitir conexión desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOllama(
    model="qwen2.5:1.5b",
    base_url="http://127.0.0.1:11434",
    temperature=0.2,
)

class ChatRequest(BaseModel):
    mensaje: str

@app.post("/api/chat")
async def chat_independiente(request: ChatRequest):
    prompt = f"Eres un asistente experto en fútbol y análisis deportivo. Responde a esta consulta de manera concisa: {request.mensaje}"
    try:
        respuesta = llm.invoke(prompt)
        return {"respuesta": respuesta.content}
    except Exception as e:
        return {"respuesta": f"Error en la IA: {str(e)}"}
