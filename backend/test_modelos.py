import requests

MODEL_NAME = "qwen2.5:1.5b"

try:
    response = requests.get("http://127.0.0.1:11434/api/tags", timeout=10)
    response.raise_for_status()
    models = {model["name"] for model in response.json().get("models", [])}

    if MODEL_NAME in models:
        print(f"OK: Ollama esta disponible y {MODEL_NAME} esta descargado.")
    else:
        print(f"ERROR: No se encontró {MODEL_NAME}. Ejecuta: ollama pull {MODEL_NAME}")
except requests.RequestException as error:
    print(f"ERROR: No se pudo conectar con Ollama: {error}")
