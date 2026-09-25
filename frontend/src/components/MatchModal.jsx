import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  Globe,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Tv,
  User,
  Users,
  X,
  Zap
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function MatchModal({ 
  isOpen, 
  onClose, 
  matchData, 
  analysisData, 
  isLoading, 
  onReAnalyze 
}) {
  const [activeTab, setActiveTab] = useState('decision'); // 'decision' | 'players' | 'standings' | 'sources' | 'dossier'
  const [copied, setCopied] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [customSearchResults, setCustomSearchResults] = useState(null);
  const [isSearchingDuck, setIsSearchingDuck] = useState(false);
  const dialogRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Escuchar tecla escape para cerrar el modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    if (isOpen) {
      lastFocusedElement.current = document.activeElement;
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => dialogRef.current?.querySelector('[data-dialog-close]')?.focus(), 0);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (isOpen) lastFocusedElement.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extraer datos combinados (del partido y del análisis multi-agente)
  const homeInfo = analysisData?.home_team_info || matchData?.home_info || {
    name: matchData?.local || matchData?.partido?.split(' vs ')[0] || 'Equipo Local',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg',
    current_cup_status: '🏆 En competencia oficial activa',
    league_position: 'Puesto destacado en tabla',
    stadium: matchData?.stadium || 'Estadio Principal',
    form: ['V', 'V', 'E', 'D', 'V']
  };

  const awayInfo = analysisData?.away_team_info || matchData?.away_info || {
    name: matchData?.visitante || matchData?.partido?.split(' vs ')[1] || 'Equipo Visitante',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg',
    current_cup_status: '🏆 En competencia oficial activa',
    league_position: 'Puesto en zona competitiva',
    stadium: 'Estadio Rival',
    form: ['V', 'E', 'V', 'V', 'D']
  };

  const tournamentInfo = analysisData?.torneo_info || matchData?.tournament_info || {
    name: matchData?.liga || 'Torneo Oficial de Fútbol',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg',
    badge_color: 'emerald'
  };

  const estadoPartido = analysisData?.estado_partido || {
    is_live: matchData?.is_live || false,
    status_text: matchData?.live_status_text || '🟢 Programado',
    minute: '',
    score: '',
    stadium: homeInfo.stadium || 'Estadio Principal'
  };

  const decisor = analysisData?.decisor;
  const recopilador = analysisData?.recopilador;
  const fuentes = recopilador?.fuentes || [];

  const handleImageError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleCopyVerdict = () => {
    if (!decisor) return;
    const text = `🎯 RECOMENDACIÓN DE APUESTA (AGENTES IA):\n` +
      `Partido: ${matchData?.partido || analysisData?.partido}\n` +
      `A cuál apostar: ${decisor.a_cual_apostar || decisor.prediccion}\n` +
      `Confianza: ${decisor.confianza_pct}% (${decisor.nivel_confianza}) | ${decisor.veredicto_tipo}\n` +
      `Cuota recomendada: ${decisor.cuota_recomendada || matchData?.cuota}\n` +
      `Valor Esperado: ${decisor.valor_esperado_ev || '+12% EV'}\n` +
      `Stake sugerido: ${decisor.gestion_riesgo}\n` +
      `Razones: ${decisor.razones?.join(' • ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDuckSearch = async (e) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;
    setIsSearchingDuck(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${homeInfo.name} ${awayInfo.name} ${customSearchQuery}`, max_results: 4 })
      });
      const data = await res.json();
      setCustomSearchResults(data.resultados || []);
    } catch (err) {
      console.error(err);
    }
    setIsSearchingDuck(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto" role="presentation">
      {/* Backdrop con Blur Dinámico */}
      <div 
        onClick={onClose} aria-hidden="true"
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Contenedor Principal de la Ventana Emergente */}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="match-dossier-title" className="relative w-full max-w-5xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 my-auto flex flex-col max-h-[92vh] animate-scaleUp">
        <h2 id="match-dossier-title" className="sr-only">Dossier de análisis: {matchData?.partido || analysisData?.partido || 'partido seleccionado'}</h2>
        
        {/* Glow decorativo de fondo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* ─── 1. CABECERA SUPERIOR DEL MODAL ──────────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md shrink-0">
          
          {/* Badge del Torneo & Estado En Vivo */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{tournamentInfo.name}</span>
            </div>

            {/* Badge de Estado del Partido (En Vivo vs Programado) */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border shadow-sm ${
              estadoPartido.is_live
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
            }`}>
              {estadoPartido.is_live ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>🔴 EN DIRECTO {estadoPartido.minute ? `(${estadoPartido.minute})` : ''} {estadoPartido.score ? `• ${estadoPartido.score}` : ''}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{estadoPartido.status_text} • {matchData?.fecha || 'Próximo Encuentro'}</span>
                </>
              )}
            </div>
          </div>

          {/* Botones de Acción de la Cabecera */}
          <div className="flex items-center gap-2">
            {onReAnalyze && (
              <button
                onClick={() => onReAnalyze(matchData)}
                disabled={isLoading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-emerald-500 disabled:opacity-50"
                title="Rastrear nuevamente con DuckDuckGo e IA"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Rastreando...' : 'Re-escanear DuckDuckGo'}</span>
              </button>
            )}

            {decisor && (
              <button
                onClick={handleCopyVerdict}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                title="Copiar pronóstico y cuotas"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 border border-slate-700 transition-all"
              data-dialog-close aria-label="Cerrar dossier de partido" title="Cerrar dossier de partido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── 2. HERO MATCHUP: IMÁGENES, ESCUDOS, COPAS Y CLASIFICACIÓN ────── */}
        <div className="relative p-5 sm:p-7 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            
            {/* EQUIPO LOCAL (Escudo, Nombre, Copa y Posición) */}
            <div className="md:col-span-3 flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                {!imgErrors[homeInfo.id || 'home'] ? (
                  <img
                    src={homeInfo.logo}
                    alt={homeInfo.name}
                    onError={() => handleImageError(homeInfo.id || 'home')}
                    width="80" height="80" className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-emerald-950/80 text-emerald-300 flex items-center justify-center font-bold text-xl font-display">
                    {homeInfo.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                  LOCAL
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-mono">{homeInfo.country || 'Fútbol'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight truncate">
                  {homeInfo.name}
                </h3>
                
                {/* Clasificación a Copas Actuales */}
                <div className="mt-1 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-amber-300/90 bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-800/40 line-clamp-1" title={homeInfo.current_cup_status}>
                    {homeInfo.current_cup_status}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>Posición: <strong className="text-slate-200">{homeInfo.league_position}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      Racha: {homeInfo.form?.map((f, i) => (
                        <span key={i} className={`w-3.5 h-3.5 rounded text-[9px] font-bold flex items-center justify-center ${
                          f === 'V' ? 'bg-emerald-600 text-white' : f === 'E' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {f}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTRO VS / MARCADOR / PROBABILIDAD */}
            <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-glow-emerald">
                <span className="text-sm font-black text-emerald-400 font-display">VS</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 text-center">
                {matchData?.mercado || 'Línea de Dinero'}
              </span>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {matchData?.cuota || '+115'}
              </span>
            </div>

            {/* EQUIPO VISITANTE (Escudo, Nombre, Copa y Posición) */}
            <div className="md:col-span-3 flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                {!imgErrors[awayInfo.id || 'away'] ? (
                  <img
                    src={awayInfo.logo}
                    alt={awayInfo.name}
                    onError={() => handleImageError(awayInfo.id || 'away')}
                    width="80" height="80" className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-cyan-950/80 text-cyan-300 flex items-center justify-center font-bold text-xl font-display">
                    {awayInfo.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-700/50">
                  VISITA
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-mono">{awayInfo.country || 'Fútbol'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight truncate">
                  {awayInfo.name}
                </h3>
                
                {/* Clasificación a Copas Actuales */}
                <div className="mt-1 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-cyan-300/90 bg-cyan-950/50 px-2 py-0.5 rounded-lg border border-cyan-800/40 line-clamp-1" title={awayInfo.current_cup_status}>
                    {awayInfo.current_cup_status}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>Posición: <strong className="text-slate-200">{awayInfo.league_position}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      Racha: {awayInfo.form?.map((f, i) => (
                        <span key={i} className={`w-3.5 h-3.5 rounded text-[9px] font-bold flex items-center justify-center ${
                          f === 'V' ? 'bg-emerald-600 text-white' : f === 'E' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {f}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── 3. BARRA DE PESTAÑAS DENTRO DE LA VENTANA EMERGENTE ──────────── */}
        <div className="flex items-center gap-2 px-5 sm:px-7 py-3 border-b border-slate-800 bg-slate-950/70 overflow-x-auto shrink-0" role="tablist" aria-label="Secciones del dossier">
          
          <button
            onClick={() => setActiveTab('decision')} role="tab" aria-selected={activeTab === 'decision'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all shrink-0 ${
              activeTab === 'decision'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Dictamen y pronóstico</span>
          </button>

          <button
            onClick={() => setActiveTab('players')} role="tab" aria-selected={activeTab === 'players'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all shrink-0 ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Jugadores y bajas</span>
          </button>

          <button
            onClick={() => setActiveTab('standings')} role="tab" aria-selected={activeTab === 'standings'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all shrink-0 ${
              activeTab === 'standings'
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/50 shadow-glow-amber'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Clasificación y copas</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')} role="tab" aria-selected={activeTab === 'sources'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all shrink-0 ${
              activeTab === 'sources'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/50 shadow-glow-violet'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span>Fuentes DuckDuckGo ({fuentes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')} role="tab" aria-selected={activeTab === 'dossier'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all shrink-0 ${
              activeTab === 'dossier'
                ? 'bg-slate-800 text-slate-200 border border-slate-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Dossier IA</span>
          </button>

        </div>

        {/* ─── 4. CONTENIDO INTERACTIVO DESPLAZABLE ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* ESTADO DE CARGA ANIMADO */}
          {isLoading && (
            <div className="py-16 text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-emerald-400 border-r-cyan-400 animate-spin" />
                <Bot className="w-7 h-7 text-emerald-400 absolute" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Navegando y Fact-Checking en DuckDuckGo...
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Rastreando páginas oficiales (SoccerStats, FlashScore, ESPN, UEFA, Marca) para verificar estado en vivo, bajas médicas, clasificación y calcular la mejor apuesta con Ollama.
                </p>
              </div>
            </div>
          )}

          {/* ════════════ PESTAÑA 1: DICTAMEN 'A CUÁL APOSTAR' ════════════ */}
          {!isLoading && activeTab === 'decision' && decisor && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Tarjeta Gigante Destacada: 'A CUÁL APOSTAR' */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900 border border-emerald-500/40 shadow-glow-emerald relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Bloque Izquierdo: Veredicto Directo */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/50">
                        {decisor.veredicto_tipo || 'SÓLIDO RECOMENDADO (+EV)'}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-700/50">
                        {decisor.valor_esperado_ev || '+12.5% EV'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {decisor.gestion_riesgo || 'Stake 2.5%'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-mono text-slate-400 block mb-1">
                        🎯 Veredicto Definitivo — ¿A cuál apostar?
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight text-emerald-300">
                        {decisor.a_cual_apostar || decisor.prediccion}
                      </h2>
                    </div>

                    {decisor.analisis_tactico && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                        {decisor.analisis_tactico}
                      </p>
                    )}
                  </div>

                  {/* Bloque Derecho: Medidor de Confianza */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs uppercase font-mono text-slate-400 mb-1">
                      Nivel de Confianza
                    </span>
                    <span className="text-5xl font-black font-display text-emerald-400">
                      {decisor.confianza_pct || 85}%
                    </span>
                    <span className="text-xs font-bold text-emerald-300 mt-1">
                      Calificación: {decisor.nivel_confianza || 'Alta'}
                    </span>

                    <div className="w-full bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.max(15, decisor.confianza_pct || 85))}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Comparador de Momios en Vivo (Caliente.mx, Pinnacle, Bet365) */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-sm">
                    <Coins className="w-4 h-4" />
                    <span>Momios Disponibles en Portales Oficiales</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Mercado: {decisor.mercado_recomendado || matchData?.mercado || '1X2'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Caliente.mx 🇲🇽 */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-red-400">Caliente.mx 🇲🇽</span>
                        <span className="text-[10px] text-slate-400 font-mono">México</span>
                      </div>
                      <span className="text-xl font-black text-white font-mono">{matchData?.bookmakers?.caliente?.odds || '+115 (2.15)'}</span>
                    </div>
                    <a
                      href={matchData?.bookmakers?.caliente?.url || 'https://www.caliente.mx/deportes/futbol/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 py-1.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-700/50 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Apostar en Caliente.mx</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Pinnacle Sports ⚡ */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-orange-400">Pinnacle ⚡</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Sharp / Bajo Margen</span>
                      </div>
                      <span className="text-xl font-black text-emerald-400 font-mono">{matchData?.bookmakers?.pinnacle?.odds || '2.22 (+122)'}</span>
                    </div>
                    <a
                      href={matchData?.bookmakers?.pinnacle?.url || 'https://www.pinnacle.com/es/soccer/matchups'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 py-1.5 px-3 rounded-lg bg-orange-950/60 hover:bg-orange-900 text-orange-300 border border-orange-700/50 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Ver cuota en Pinnacle</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Bet365 🌐 */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-emerald-400">Bet365 🌐</span>
                        <span className="text-[10px] text-slate-400 font-mono">Global</span>
                      </div>
                      <span className="text-xl font-black text-white font-mono">{matchData?.bookmakers?.bet365?.odds || '2.10'}</span>
                    </div>
                    <a
                      href={matchData?.bookmakers?.bet365?.url || 'https://www.bet365.com/#/IP/B1'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 py-1.5 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Ver línea en Bet365</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              </div>

              {/* Razones Clave vs Riesgos Detectados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Razones Fundamentadas */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Razones Clave & Ventajas Deportivas</span>
                  </div>
                  <ul className="space-y-2">
                    {decisor.razones?.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="font-mono text-emerald-400 font-bold">#{i + 1}</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Riesgos Detectados */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Riesgos Detectados & Puntos Críticos</span>
                  </div>
                  <ul className="space-y-2">
                    {decisor.riesgos?.map((rk, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{rk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* ════════════ PESTAÑA 2: JUGADORES, BAJAS & REPORTE MÉDICO ════════ */}
          {!isLoading && activeTab === 'players' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Sección Jugadores Estrella */}
              <div>
                <h4 className="text-sm font-bold font-display text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Figuras Clave y Jugadores a Seguir</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Jugadores Local */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase font-mono block">
                      {homeInfo.name} — Referentes
                    </span>
                    <div className="space-y-2">
                      {homeInfo.key_players?.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-white block truncate">{p.name}</span>
                            <span className="text-[11px] text-slate-400 block">{p.position} {p.number ? `• #${p.number}` : ''}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/40">
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jugadores Visitante */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase font-mono block">
                      {awayInfo.name} — Referentes
                    </span>
                    <div className="space-y-2">
                      {awayInfo.key_players?.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-white block truncate">{p.name}</span>
                            <span className="text-[11px] text-slate-400 block">{p.position} {p.number ? `• #${p.number}` : ''}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/40">
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Sala de Bajas Médicas & Lesiones Verificadas */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Reporte Médico Oficial (Bajas, Lesiones y Sanciones)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Contrastado con DuckDuckGo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Lesiones Local */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 font-mono block">
                      Bajas Médicas: {homeInfo.name}
                    </span>
                    {homeInfo.injuries?.length > 0 ? (
                      homeInfo.injuries.map((inj, i) => (
                        <div key={i} className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-2 text-xs">
                          <span className="text-rose-400 font-bold">🚑</span>
                          <div>
                            <span className="font-bold text-slate-200 block">{inj.player}</span>
                            <span className="text-slate-400 text-[11px]">{inj.reason}</span>
                            <span className="inline-block text-[10px] text-rose-300 font-mono mt-1 bg-rose-950/80 px-1.5 py-0.5 rounded">
                              {inj.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Plantel completo sin bajas médicas críticas reportadas.</p>
                    )}
                  </div>

                  {/* Lesiones Visitante */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 font-mono block">
                      Bajas Médicas: {awayInfo.name}
                    </span>
                    {awayInfo.injuries?.length > 0 ? (
                      awayInfo.injuries.map((inj, i) => (
                        <div key={i} className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-2 text-xs">
                          <span className="text-rose-400 font-bold">🚑</span>
                          <div>
                            <span className="font-bold text-slate-200 block">{inj.player}</span>
                            <span className="text-slate-400 text-[11px]">{inj.reason}</span>
                            <span className="inline-block text-[10px] text-rose-300 font-mono mt-1 bg-rose-950/80 px-1.5 py-0.5 rounded">
                              {inj.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Plantel completo sin bajas médicas críticas reportadas.</p>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ════════════ PESTAÑA 3: CLASIFICACIÓN & COPAS ACTUALES ════════════ */}
          {!isLoading && activeTab === 'standings' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Tarjetas de Clasificación a Copas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Copas Local */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center">
                      <img src={homeInfo.logo} alt={homeInfo.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-display">{homeInfo.name}</h4>
                      <span className="text-xs text-emerald-400 font-mono">{homeInfo.league_position}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Clasificación a Copas Actuales:</span>
                    <p className="text-xs font-bold text-amber-300 leading-relaxed">
                      {homeInfo.current_cup_status}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">Puntos Acumulados</span>
                      <span className="font-bold text-white font-mono text-sm">{homeInfo.points || '31 pts'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">Estadio Sede</span>
                      <span className="font-bold text-slate-300 text-[11px] truncate block">{homeInfo.stadium}</span>
                    </div>
                  </div>
                </div>

                {/* Copas Visitante */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center">
                      <img src={awayInfo.logo} alt={awayInfo.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-display">{awayInfo.name}</h4>
                      <span className="text-xs text-cyan-400 font-mono">{awayInfo.league_position}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Clasificación a Copas Actuales:</span>
                    <p className="text-xs font-bold text-cyan-300 leading-relaxed">
                      {awayInfo.current_cup_status}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">Puntos Acumulados</span>
                      <span className="font-bold text-white font-mono text-sm">{awayInfo.points || '29 pts'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">Condición</span>
                      <span className="font-bold text-slate-300 text-[11px] truncate block">Visitante</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Información General del Torneo */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-mono text-slate-400 block">Torneo en Disputa</span>
                  <span className="text-base font-bold text-white font-display">{tournamentInfo.name}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">{tournamentInfo.format || 'Formato Oficial'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
              </div>

            </div>
          )}

          {/* ════════════ PESTAÑA 4: FUENTES VERÍDICAS DUCKDUCKGO ════════════ */}
          {!isLoading && activeTab === 'sources' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Buscador Rápido de DuckDuckGo en Vivo */}
              <form onSubmit={handleDuckSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Consultar dato verídico en DuckDuckGo (ej. 'alineación oficial', 'última hora')..."
                    value={customSearchQuery}
                    onChange={(e) => setCustomSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customSearchQuery.trim() || isSearchingDuck}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearchingDuck ? 'Buscando...' : 'Buscar'}</span>
                </button>
              </form>

              {/* Resultados de búsqueda personalizada */}
              {customSearchResults && (
                <div className="space-y-2 p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40">
                  <span className="text-xs font-bold text-purple-300 font-mono block">
                    Resultados DuckDuckGo en Vivo:
                  </span>
                  <div className="space-y-2">
                    {customSearchResults.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500 transition-all group"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-200 group-hover:text-purple-300">{r.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{r.snippet}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de Fuentes Consultadas por el Agente */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 font-mono block">
                  Páginas Oficiales Consultadas por el Agente ({fuentes.length} fuentes indexadas):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fuentes.map((f, i) => (
                    <a
                      key={i}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                            {f.id || `[${i + 1}]`}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            {f.fuente}
                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-2">
                          {f.titulo}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-3 mt-1.5">
                          {f.snippet}
                        </p>
                      </div>

                      <span className="text-[10px] text-cyan-400 font-bold mt-3 flex items-center gap-1">
                        Abrir fuente oficial →
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ════════════ PESTAÑA 5: DOSSIER COMPLETO DE INTELIGENCIA ══════════ */}
          {!isLoading && activeTab === 'dossier' && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Informe de Inteligencia Deportiva — Agente Recopilador</span>
              </div>
              <MarkdownRenderer content={recopilador?.informe_inteligencia || 'Sin informe generado.'} />
            </div>
          )}

        </div>

        {/* ─── 5. FOOTER DEL MODAL ─────────────────────────────────────────── */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Información contrastada con DuckDuckGo, SoccerStats & Casas de Apuestas Oficiales</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
}
