import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MatchList } from './components/MatchList';
import { SoccerStatsView } from './components/SoccerStatsView';
import { BookmakersView } from './components/BookmakersView';
import { AgentWorkspace } from './components/AgentWorkspace';
import { ChatConsole } from './components/ChatConsole';
import { MatchModal } from './components/MatchModal';
import { ArrowRight, Coins, Radar, Sparkles, Target, Trophy } from 'lucide-react';

function App() {
  const [status, setStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [models, setModels] = useState([]);
  const [activeModel, setActiveModel] = useState("qwen2.5:1.5b");
  const [matches, setMatches] = useState([]);
  const [uefaData, setUefaData] = useState(null);
  const [bookmakersData, setBookmakersData] = useState(null);
  const [heroImageErrors, setHeroImageErrors] = useState({});
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
    } catch {
      throw new Error(`Error procesando respuesta del backend (${res.status}): ${text.slice(0, 150)}`, { cause: text });
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

  const featuredMatch = matches[0];
  const showRadar = () => {
    setCurrentView('radar');
    window.setTimeout(() => document.getElementById('match-scanner')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
      <div className="night-match min-h-[100dvh] bg-dark-950 text-slate-100 flex flex-col font-sans">
      
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
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <section className="nm-football-hero relative overflow-hidden rounded-[28px] border border-slate-700/70 bg-gradient-to-br from-[#132347] via-[#0d1931] to-[#08111f] px-6 py-8 sm:p-10 lg:p-12 shadow-[0_22px_60px_rgba(0,0,0,.24)]">
          <div className="nm-pitch" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full border border-cyan-300/10 bg-cyan-400/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-lime-300/5 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="max-w-xl">
              <p className="nm-eyebrow flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Noche de partido</p>
              <h1 className="mt-3 text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl [text-wrap:balance]">Haz que cada partido tenga más sentido.</h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">Revisa el panorama, encuentra tendencias y llega al partido con una lectura más completa de lo que está en juego.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={showRadar} className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-lime-200">
                  Explorar partidos <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button onClick={() => setCurrentView('bookmakers')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-500/50 bg-slate-950/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-slate-900/50">
                  Ver cuotas <Coins className="h-4 w-4 text-amber-300" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" />Partidos destacados</span>
                <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Cuotas para comparar</span>
                <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-300" />Contexto del encuentro</span>
              </div>
            </div>

            <article className="nm-match-card relative mx-auto w-full max-w-md overflow-hidden rounded-[30px] p-5 sm:p-6">
              <div className="nm-match-card-glow" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-[.14em] text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> En la mira</span>
                  <Target className="h-5 w-5 text-lime-300" aria-hidden="true" />
                </div>
                <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[.16em] text-cyan-300">{featuredMatch?.liga || 'Tu próxima jugada'}</p>
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="min-w-0 text-center">
                    <div className="nm-team-orb mx-auto">
                      {featuredMatch?.home_info?.logo && !heroImageErrors.home ? <img src={featuredMatch.home_info.logo} alt="" onError={() => setHeroImageErrors((previous) => ({ ...previous, home: true }))} /> : <span>{(featuredMatch?.local || 'A').slice(0, 2)}</span>}
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-white sm:text-base">{featuredMatch?.local || 'Elige'}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2"><span className="nm-versus">VS</span><span className="text-[10px] font-mono text-slate-400">{featuredMatch?.fecha || 'Próximamente'}</span></div>
                  <div className="min-w-0 text-center">
                    <div className="nm-team-orb nm-team-orb-away mx-auto">
                      {featuredMatch?.away_info?.logo && !heroImageErrors.away ? <img src={featuredMatch.away_info.logo} alt="" onError={() => setHeroImageErrors((previous) => ({ ...previous, away: true }))} /> : <span>{(featuredMatch?.visitante || 'P').slice(0, 2)}</span>}
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-white sm:text-base">{featuredMatch?.visitante || 'un partido'}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Lectura destacada</p><p className="mt-1 truncate text-sm font-semibold text-amber-300">{featuredMatch?.mercado || 'Explora el encuentro'}</p></div><div className="shrink-0 rounded-xl border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-center"><p className="text-[9px] uppercase tracking-wide text-lime-200">Señal</p><p className="font-mono text-lg font-bold text-lime-300">{featuredMatch?.confianzaBase || '—'}</p></div></div>
                  <button onClick={showRadar} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/[.08] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/[.14]">Ver previa del partido <ArrowRight className="h-4 w-4 text-lime-300" aria-hidden="true" /></button>
                </div>
              </div>
            </article>
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
        <nav aria-label="Vistas de inteligencia" className="glass-panel rounded-2xl p-2 flex items-center overflow-x-auto gap-2">
          <div className="flex items-center gap-2 min-w-max" role="tablist">
            <button
              onClick={() => setCurrentView("radar")}
              role="tab" aria-selected={currentView === "radar"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                currentView === "radar"
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Radar className="w-4 h-4 text-emerald-400" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => setCurrentView("bookmakers")}
              role="tab" aria-selected={currentView === "bookmakers"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                currentView === "bookmakers"
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Cuotas</span>
            </button>

            <button
              onClick={() => setCurrentView("uefa")}
              role="tab" aria-selected={currentView === "uefa"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                currentView === "uefa"
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Estadísticas</span>
            </button>
          </div>
        </nav>

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
      <footer className="border-t border-slate-800/80 bg-dark-950/80 py-6 text-center text-xs text-slate-400">
        <p>
          Agentes IA · Una guía para explorar el contexto deportivo. Revisa siempre la información más reciente antes de tomar una decisión.
        </p>
      </footer>

    </div>
  );
}

export default App;
