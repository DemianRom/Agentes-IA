# Agentes-IA

## 🚀 Resumen del Progreso del día 23 de septiembre 2026
El día de hoy se estableció con éxito la arquitectura base del proyecto y se logró la primera prueba de vida (End-to-End) del sistema. Ya contamos con un entorno de desarrollo funcional que conecta una interfaz de usuario moderna con el modelo avanzado de Google Gemini, sentando las bases para la integración del pipeline de agentes.

##  Hitos Alcanzados Hoy

### 1. Definición de Arquitectura y Entorno
*   **Estructura Modular:** Separación estricta del proyecto en dos capas: `frontend` (React/Vite) y `backend` (FastAPI/Python).
*   **Entorno Seguro:** Configuración de entorno virtual (`venv`) para aislar dependencias de Python y uso de `.env` para la protección de la API Key.

### 2. Desarrollo del Backend (API)
*   **Implementación de FastAPI:** Creación de un servidor asíncrono con configuración CORS habilitada para permitir peticiones locales.
*   **Integración de IA (LangChain):** Conexión exitosa con la API de Google Gemini.
*   **Actualización de Modelo:** Se diagnosticaron los permisos de la API Key y se migró el motor principal a `gemini-3.6-flash`, cumpliendo con los estándares y requerimientos más recientes de Google para cuentas nuevas.

### 3. Desarrollo del Frontend (Dashboard)
*   **Maquetado Inicial:** Creación del panel de control usando React y Tailwind CSS.
*   **Panel de Jugadas (Mock):** Renderizado de una tabla base para visualizar el Top de recomendaciones (partido, cuota, nivel de confianza).
*   **Módulo de Consultas Aisladas:** Implementación de un chat lateral diseñado para cumplir el requerimiento de consultas dinámicas e independientes por usuario.

### 4. Conexión End-to-End
*   El frontend se comunica exitosamente con el backend mediante peticiones POST.
*   Se implementó un analizador (parser) en React para extraer el texto limpio de la estructura de bloques complejos que devuelve la versión 3.6 de Gemini, evitando crasheos en la interfaz.

---

## 💻 Instrucciones para levantar el entorno local

Para ejecutar el proyecto, se requieren dos terminales:

**Terminal 1 (Backend):**
\`\`\`bash
cd backend
source venv/Scripts/activate   # (O venv/bin/activate en Mac/Linux)
uvicorn main:app --reload
\`\`\`
*(El servidor correrá en http://localhost:8000)*

**Terminal 2 (Frontend):**
\`\`\`bash
cd frontend
npm run dev
\`\`\`
*(La interfaz correrá en http://localhost:5173)*

---

## Próximos Pasos (Backlog)
1. **Formato de Chat:** Integrar renderizado de Markdown (`react-markdown`) en el frontend para mostrar texto enriquecido (negritas, listas).
2. **Base de Datos:** Levantar instancia local de MongoDB y definir los esquemas de las colecciones (`matches`, `odds_tracking`, `teams_stats`).
3. **Pipeline de Agentes:** Estructurar LangGraph en el backend para crear los dos agentes acordados (Recopilador y Decisor) y dotarlos de herramientas de búsqueda (DuckDuckGo).