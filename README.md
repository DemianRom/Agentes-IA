# 🏆 Agentes-IA — Terminal de Inteligencia Deportiva & Pronósticos Cuantitativos

Sistema multi-agente autónomo impulsado por **Ollama (IA local)** y **DuckDuckGo Live Search** para análisis deportivo verídico en tiempo real, detección de apuestas con valor (+EV), verificación de copas actuales (Champions League, Libertadores, Liguilla Liga MX), estado en vivo de partidos, noticias de jugadores, bajas médicas y ventanas emergentes interactivas con imágenes oficiales.

---

## 🚀 Capacidades y Novedades Implementadas

### 1. 🔍 Navegación Verídica con DuckDuckGo (Portales Oficiales & Fact-Checking)
* Conexión en vivo a portales deportivos de referencia: **SoccerStats**, **FlashScore**, **ESPN Deportes**, **Diario MARCA**, **UEFA.com**, **Transfermarkt**, **Diario AS**, **Yahoo Sports** y **BeSoccer**.
* Extracción y cotejo de:
  - **Estado en Vivo / Programación**: Detecta si el partido se encuentra en juego actualmente (minuto y marcador en tiempo real) o fecha/hora/estadio programado.
  - **Clasificación a Copas Actuales**: Si el club participa y está clasificado en la **UEFA Champions League** (Fase de Liga Suiza), **Copa Libertadores**, **Concachampions** o **Liguilla Directa de Liga MX**, junto a su posición en tabla y puntos acumulados.
  - **Noticias & Reporte Médico de Jugadores**: Bajas confirmadas, roturas musculares, dudas médicas y sanciones disciplinarias.
  - **Citas Indexadas Estrictas**: Referencias `[1]`, `[2]`, `[3]` con enlaces directos para auditoría sin alucinaciones.

### 2. 🪟 Ventana Emergente Interactiva con Imágenes Oficiales (`MatchModal.jsx`)
Al hacer clic en cualquier partido o escanear un cruce personalizado, se despliega una **Ventana Emergente (Modal)** con diseño Glassmorphism de alta gama que incluye:
* **Escudos & Logos Oficiales**: Insignias vectoriales y de alta resolución de ambos clubes y del torneo en disputa.
* **Badge de Estado en Vivo**: Indicador pulsante `🔴 EN DIRECTO (Minuto X' • Marcador)` o `🟢 PROGRAMADO (Estadio & Fecha)`.
* **Dictamen Directo "¿A Cuál Apostar?"**:
  - Veredicto claro y justificado del Agente Decisor.
  - Medidor de confianza porcentual (%) y calificación de riesgo.
  - Cálculo de Valor Esperado (+EV) y gestión de banca Kelly (Stake sugerido).
  - Momios en tiempo real para **Caliente.mx 🇲🇽**, **Pinnacle Sports ⚡** y **Bet365 🌐** con botones de acceso directo.
* **Pestaña de Jugadores & Bajas Médicas**: Tarjetas con fotos de jugadores clave, rol y sala médica detallada (🚑 lesión, ⚠️ duda, 🟨 sanción).
* **Pestaña de Clasificación & Copas Actuales**: Estado en competiciones continentales, tabla de posiciones y racha en los últimos 5 partidos.
* **Pestaña de Fuentes Verídicas**: Enlaces y fragmentos extraídos de DuckDuckGo con buscador integrado para consultas adicionales.
* **Pestaña de Dossier IA**: Informe completo generado por el Agente Recopilador.

### 3. 🤖 Pipeline Multi-Agente Local (Ollama)
* **Agente Recopilador (`recopilador.py`)**: Rastreador, fact-checker y estructurador de inteligencia deportiva.
* **Agente Decisor (`decisor.py`)**: Estratega cuantitativo que define la cuota justa, probabilidad real y recomendación definitiva.

---

## 💻 Instrucciones para Iniciar el Sistema

### Requisito: Ollama
Asegúrate de tener Ollama activo:
```bash
ollama serve
```

### 1. Iniciar Backend (FastAPI en Puerto 8000)
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
*API activa en:* `http://localhost:8000` | *Documentación:* `http://localhost:8000/docs`

### 2. Iniciar Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
*Interfaz de usuario activa en:* `http://localhost:5173`

---

## 🧪 Pruebas Automatizadas
Para validar todo el pipeline (DuckDuckGo Search + Ollama + Copas + Dictamen de Apuesta):
```bash
cd backend
python test_e2e.py
```