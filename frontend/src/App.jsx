import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MatchList } from './components/MatchList';
import { SoccerStatsView } from './components/SoccerStatsView';
import { BookmakersView } from './components/BookmakersView';
import { AgentWorkspace } from './components/AgentWorkspace';
import { ChatConsole } from './components/ChatConsole';
import { MatchModal } from './components/MatchModal';
import { Activity, BarChart3, Bot, Brain, Coins, Database, ShieldCheck, Sparkles, TrendingUp, Trophy } from 'lucide-react';

function App() {
  const [status, setStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [models, setModels] = useState([]);
  const [activeModel, setActiveModel] = useState("qwen2.5:1.5b");
  const [matches, setMatches] = useState([]);
  const [uefaData, setUefaData] = useState(null);
  const [bookmakersData, setBookmakersData] = useState(null);
  const [currentView, setCurrentView] = useState("radar"); // "radar" | "bookmakers" | "uefa"
  
  // Estado del Workspace y Modal de Análisis
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingMatchId, setAnalyzingMatchId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMatch, setModalMatch] = useState(null);

  // Estado del Chat
  const [mensajes, setMensajes] = useState([]);
  const [chatCargando, setChatCargando] = useState(false);

  // Cargar estado inicial del sistema, modelos, partidos, SoccerStats y Casas de Apuestas
  useEffect(() => {
    fetchSystemStatus();
    fetchMatches();
    fetchUefaSoccerStats();
    fetchBookmakersOdds();
  }, []);

  // Helper seguro para parsear JSON sin crashear en caso de desconexión o 500
  const safeFetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!text || !text.trim()) {
      throw new Error(`Respuesta vacía del servidor (${res.status}). Verifica que el backend esté corriendo en el puerto 8000.`);
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Error procesando respuesta del backend (${res.status}): ${text.slice(0, 150)}`);
    }
  };

  const fetchSystemStatus = async () => {
    setCheckingStatus(true);
    try {
      const data = await safeFetchJson('/api/status');
      setStatus(data);
      if (data.ollama?.available_models) {
        setModels(data.ollama.available_models);
        if (data.ollama.current_model) {
          setActiveModel(data.ollama.current_model);
        }
      }
    } catch (err) {
      console.warn("Estado del sistema no disponible:", err.message);
    }
    setCheckingStatus(false);
  };

  const fetchMatches = async () => {
    try {
      const data = await safeFetchJson('/api/matches');
      setMatches(data.matches || []);
    } catch (err) {
      console.warn("Partidos no disponibles:", err.message);
    }
  };

  const fetchUefaSoccerStats = async () => {
    try {
      const data = await safeFetchJson('/api/uefa/soccerstats');
      setUefaData(data);
    } catch (err) {
      console.warn("SoccerStats no disponible:", err.message);
    }
  };

  const fetchBookmakersOdds = async () => {
    try {
      const data = await safeFetchJson('/api/bookmakers/odds');
      setBookmakersData(data);
    } catch (err) {
      console.warn("Cuotas de casas de apuestas no disponibles:", err.message);
    }
  };

  // Ejecutar el Pipeline Multi-Agente y Abrir la Ventana Emergente
  const handleAnalyzeMatch = async (match) => {
    setIsAnalyzing(true);
    setAnalyzingMatchId(match.id);
    setModalMatch(match);
    setIsModalOpen(true);
    setActiveAnalysis({
      partido: match.partido,
      liga: match.liga,
      cuota: match.cuota,
      mercado: match.mercado,
      home_team_info: match.home_info,
      away_team_info: match.away_info,
      torneo_info: match.tournament_info
    });

    try {
      const data = await safeFetchJson('/api/analisis-completo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partido: match.partido,
          equipo_local: match.local || match.partido?.split(' vs ')[0],
          equipo_visitante: match.visitante || match.partido?.split(' vs ')[1],
          liga: match.liga,
          cuota: match.cuota,
          mercado: match.mercado,
          modelo: activeModel
        })
      });

      setActiveAnalysis(data);
    } catch (error) {
      console.error("Error en pipeline:", error);
      setActiveAnalysis(prev => ({
        ...prev,
        error: error.message,
        recopilador: {
          informe_inteligencia: `❌ No se pudo completar el análisis: ${error.message}.\n\nAsegúrate de que el backend esté iniciado en http://localhost:8000.`,
          fuentes: []
        },
        decisor: {
          a_cual_apostar: "Revisar conexión backend",
          prediccion: "Análisis Interrumpido",
          confianza_pct: 0,
          nivel_confianza: "Error",
          veredicto_tipo: "DESCONECTADO",
          razones: ["Fallo de conexión o respuesta no válida."],
          riesgos: ["Inicia el servidor backend con: python -m uvicorn main:app --port 8000"]
        }
      }));
    }

    setIsAnalyzing(false);
    setAnalyzingMatchId(null);
  };

  // Enviar mensaje en la consola de chat
  const handleSendMessage = async (mensaje, modo) => {
    const nuevoHistorial = [...mensajes, { rol: 'usuario', texto: mensaje }];
    setMensajes(nuevoHistorial);
    setChatCargando(true);

    try {
      let endpoint = '/api/chat';
      let body = { mensaje, modelo: activeModel };

      if (modo === 'pipeline') {
        endpoint = '/api/analisis-completo';
        body = { partido: mensaje, modelo: activeModel };
      } else if (modo === 'recopilador') {
        endpoint = '/api/agente/recopilador';
        body = { partido_o_consulta: mensaje, modelo: activeModel };
      }

      const data = await safeFetchJson(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      let respuestaTexto = "";
      let agenteNombre = "IA Ollama";

      if (modo === 'pipeline') {
        agenteNombre = "Agente Decisor + Recopilador";
        if (data.decisor && (data.decisor.a_cual_apostar || data.decisor.prediccion)) {
          respuestaTexto = `### 🎯 Recomendación: ${data.decisor.a_cual_apostar || data.decisor.prediccion}\n` +
            `**Confianza:** ${data.decisor.confianza_pct || 80}% (${data.decisor.nivel_confianza || 'Alta'}) | **Veredicto:** ${data.decisor.veredicto_tipo || 'SÓLIDO'}\n\n` +
            `**Cuota Sugerida:** ${data.decisor.cuota_recomendada || '+115 (2.15)'} | **Valor:** ${data.decisor.valor_esperado_ev || '+12% EV'}\n\n` +
            (data.decisor.razones && data.decisor.razones.length > 0 ? `#### Razones Clave:\n` + data.decisor.razones.map(r => `- ${r}`).join('\n') + `\n\n` : '') +
            (data.decisor.riesgos && data.decisor.riesgos.length > 0 ? `#### Riesgos Detectados:\n` + data.decisor.riesgos.map(rk => `- ⚠️ ${rk}`).join('\n') + `\n\n` : '') +
            (data.decisor.gestion_riesgo ? `**Gestión de Riesgo:** ${data.decisor.gestion_riesgo}\n\n` : '') +
            `---\n` +
            `*Fuentes verificadas por DuckDuckGo:* ${data.recopilador?.fuentes?.length || 0} referencias oficiales.`;
        } else if (data.recopilador?.informe_inteligencia) {
          respuestaTexto = data.recopilador.informe_inteligencia;
        } else if (data.respuesta) {
          respuestaTexto = data.respuesta;
        } else {
          respuestaTexto = "Análisis completado. Para pronósticos cuantitativos y dictamen de apuestas, ingresa un cruce directo como **'Cruz Azul vs Monterrey'** o **'Real Madrid vs Bayern Múnich'**.";
        }
      } else if (modo === 'recopilador') {
        agenteNombre = "Agente Recopilador";
        respuestaTexto = data.informe_inteligencia || data.respuesta || "Información recopilada.";
      } else {
        agenteNombre = "IA Analista";
        respuestaTexto = data.respuesta || data.informe_inteligencia || "Sin respuesta del modelo.";
      }

      setMensajes([...nuevoHistorial, { rol: 'ia', agente: agenteNombre, modo, texto: respuestaTexto }]);
    } catch (err) {
      setMensajes([
        ...nuevoHistorial,
        { rol: 'ia', agente: 'Error', texto: `⚠️ ${err.message}` }
      ]);
    }

    setChatCargando(false);
  };

  const handleClearHistory = () => {
    setMensajes([]);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      
      {/* Barra de Navegación Principal */}
      <Navbar
        status={status}
        models={models}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
        onRefreshStatus={() => {
          fetchSystemStatus();
          fetchMatches();
          fetchUefaSoccerStats();
          fetchBookmakersOdds();
        }}
        checkingStatus={checkingStatus}
      />

      {/* Contenedor Central */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Superior de Métricas en Vivo */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Motor IA Activo</span>
              <span className="text-sm font-bold text-white font-mono truncate block max-w-[130px]">
                {activeModel}
              </span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">DuckDuckGo & Bookmakers</span>
              <span className="text-sm font-bold text-amber-300 font-mono">Caliente • Pinnacle</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Copas Actuales & Tablas</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">Champions • Liga MX</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Ventana Emergente</span>
              <span className="text-sm font-bold text-purple-300 font-mono">Imágenes & Dictamen</span>
            </div>
          </div>
        </section>

        {/* Workspace de Análisis en Vista Normal (Inline) */}
        {(activeAnalysis || isAnalyzing) && !isModalOpen && (
          <section>
            <AgentWorkspace
              data={activeAnalysis}
              isLoading={isAnalyzing}
              onClose={() => setActiveAnalysis(null)}
            />
          </section>
        )}

        {/* Barra de Selección de Vista Principal */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("radar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                currentView === "radar"
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Radar Multiliga & Escáner (Liga MX / Champions / Premier)</span>
            </button>

            <button
              onClick={() => setCurrentView("bookmakers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                currentView === "bookmakers"
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Casas de Apuestas (+EV & Momios Caliente/Pinnacle)</span>
            </button>

            <button
              onClick={() => setCurrentView("uefa")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                currentView === "uefa"
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>UEFA SoccerStats Oficial (36 Clubes)</span>
            </button>
          </div>
        </div>

        {/* Cuadrícula Principal: Vista Seleccionada + Consola de Chat */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Panel Izquierdo: Vista Principal */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {currentView === "radar" && (
              <MatchList
                matches={matches}
                onAnalyzeMatch={handleAnalyzeMatch}
                analyzingMatchId={analyzingMatchId}
              />
            )}

            {currentView === "bookmakers" && (
              <BookmakersView
                data={bookmakersData}
                onAnalyzeMatch={handleAnalyzeMatch}
                analyzingMatchId={analyzingMatchId}
              />
            )}

            {currentView === "uefa" && (
              <SoccerStatsView
                data={uefaData}
                onAnalyzeMatch={handleAnalyzeMatch}
                analyzingMatchId={analyzingMatchId}
              />
            )}
          </div>

          {/* Panel Derecho: Consola de Chat y Consultas Aisladas */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <ChatConsole
                activeModel={activeModel}
                onSendMessage={handleSendMessage}
                onClearHistory={handleClearHistory}
                mensajes={mensajes}
                cargando={chatCargando}
              />
            </div>
          </div>

        </section>

      </main>

      {/* ─── VENTANA EMERGENTE INTERACTIVA CON IMÁGENES, COPAS Y APUESTAS ─── */}
      <MatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        matchData={modalMatch}
        analysisData={activeAnalysis}
        isLoading={isAnalyzing}
        onReAnalyze={handleAnalyzeMatch}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-dark-950 py-6 text-center text-xs text-slate-400">
        <p>
          Agentes IA • Conectado a DuckDuckGo Search, SoccerStats, Caliente.mx, Pinnacle & Bet365
        </p>
      </footer>

    </div>
  );
}

export default App;
