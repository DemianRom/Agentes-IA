from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

# Carga las variables del archivo .env al entorno de Python
load_dotenv()

app = FastAPI()

# Permitir conexión desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash")

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