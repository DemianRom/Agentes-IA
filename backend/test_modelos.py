"""Comprueba que Ollama está disponible y que el modelo local requerido existe."""

import requests


MODEL_NAME = "qwen2.5:1.5b"
OLLAMA_TAGS_URL = "http://127.0.0.1:11434/api/tags"


def main():
    try:
        response = requests.get(OLLAMA_TAGS_URL, timeout=10)
        response.raise_for_status()
        models = {model["name"] for model in response.json().get("models", [])}

        if MODEL_NAME in models:
            print(f"OK: Ollama está disponible y {MODEL_NAME} está descargado.")
            return

        print(f"ERROR: No se encontró {MODEL_NAME}. Ejecuta: ollama pull {MODEL_NAME}")
    except requests.RequestException as error:
        print(f"ERROR: No se pudo conectar con Ollama: {error}")


if __name__ == "__main__":
    main()
