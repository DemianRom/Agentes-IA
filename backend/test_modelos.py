import google.generativeai as genai
import os
from dotenv import load_dotenv

# Cargar la llave
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ No se encontró la GOOGLE_API_KEY en el archivo .env")
else:
    print("✅ Llave cargada. Consultando a Google los modelos disponibles...\n")
    genai.configure(api_key=api_key)
    
    # Listar los modelos que soportan generación de texto (chat)
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"👉 {m.name}")