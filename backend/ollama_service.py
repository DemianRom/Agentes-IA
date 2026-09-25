import os
import httpx
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv

load_dotenv()

DEFAULT_OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")

class OllamaService:
    def __init__(self, base_url: str = DEFAULT_OLLAMA_URL, default_model: str = DEFAULT_MODEL):
        self.base_url = base_url.rstrip("/")
        self.default_model = default_model

    async def get_models(self) -> List[str]:
        """Obtiene la lista de modelos instalados en Ollama."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    return [m.get("name") for m in data.get("models", [])]
        except Exception as e:
            print(f"[OllamaService] Error obteniendo modelos: {e}")
        return []

    async def check_health(self) -> Dict[str, Any]:
        """Comprueba el estado del servidor Ollama."""
        try:
            models = await self.get_models()
            is_online = len(models) >= 0  # if we got a response
            # Check if default model or any model is present
            active_model = self.default_model
            if models and active_model not in models:
                # Find best fallback
                for preferred in ["qwen2.5:1.5b", "llama3.2:3b", "llama3.2:latest", "llama2:7b"]:
                    if preferred in models:
                        active_model = preferred
                        break
                else:
                    active_model = models[0]

            return {
                "online": True,
                "base_url": self.base_url,
                "current_model": active_model,
                "available_models": models,
                "count": len(models)
            }
        except Exception as e:
            return {
                "online": False,
                "base_url": self.base_url,
                "current_model": self.default_model,
                "available_models": [],
                "error": str(e)
            }

    async def generate_chat(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.3
    ) -> str:
        """Envía una solicitud de chat a Ollama y retorna la respuesta generada."""
        selected_model = model or self.default_model

        # Verificar si el modelo existe o usar fallback
        models = await self.get_models()
        if models and selected_model not in models:
            # Buscar coincidencia parcial (ej. 'qwen' o 'llama' o '2.4'/'2.5')
            matched = False
            for m in models:
                if selected_model.lower() in m.lower():
                    selected_model = m
                    matched = True
                    break
            if not matched:
                # Fallbacks comunes
                for preferred in ["qwen2.5:1.5b", "llama3.2:3b", "llama3.2:latest"]:
                    if preferred in models:
                        selected_model = preferred
                        break
                else:
                    selected_model = models[0]

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": selected_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }

        try:
            async with httpx.AsyncClient(timeout=90.0) as client:
                res = await client.post(f"{self.base_url}/api/chat", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    message = data.get("message", {})
                    return message.get("content", "").strip()
                else:
                    return f"Error en Ollama ({res.status_code}): {res.text}"
        except httpx.ConnectError:
            return (
                "⚠️ Error de conexión: No se pudo conectar a Ollama en "
                f"{self.base_url}. Asegúrate de que el servicio esté ejecutándose ('ollama serve')."
            )
        except httpx.TimeoutException:
            return "⏳ Tiempo de espera agotado: Ollama tardó demasiado en responder."
        except Exception as e:
            return f"❌ Error inesperado con Ollama: {str(e)}"

# Instancia singleton para reusar
ollama_service = OllamaService()
