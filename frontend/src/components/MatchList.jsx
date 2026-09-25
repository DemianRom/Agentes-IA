import React, { useState } from 'react';
import { Bot, ChevronRight, Clock, Flame, Play, Search, Sparkles, Target, Trophy, ShieldAlert, Zap } from 'lucide-react';

export function MatchList({ matches, onAnalyzeMatch, analyzingMatchId }) {
  const [selectedLeague, setSelectedLeague] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [customMatch, setCustomMatch] = useState("");
  const [customLeague, setCustomLeague] = useState("Champions League");
  const [imgErrors, setImgErrors] = useState({});

  const leagues = ["Todas", "Champions League", "Liga MX", "Premier League", "La Liga"];

  const filteredMatches = matches.filter(m => {
    const matchesLeague = selectedLeague === "Todas" || m.liga.toLowerCase().includes(selectedLeague.toLowerCase());
    const matchesSearch = m.partido.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.liga.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLeague && matchesSearch;
  });

  const handleImageError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleCustomAnalyze = (e) => {
    e.preventDefault();
    if (!customMatch.trim()) return;

    onAnalyzeMatch({
      id: `custom-${Date.now()}`,
      partido: customMatch.trim(),
      liga: customLeague,
      cuota: "Cuota de Mercado (+EV)",
      mercado: "Línea de Dinero / Total Goles",
      isCustom: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Análisis Personalizado Rápido */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border border-emerald-500/30 shadow-glow-emerald">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-display">
              Escáner Dinámico Multi-Agente (DuckDuckGo + Copas)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
            DuckDuckGo Live + Ollama
          </span>
        </div>
        
        <p className="text-xs text-slate-300 mb-4">
          Ingresa cualquier cruce futbolístico del mundo. El <strong>Agente Recopilador</strong> buscará noticias, bajas médicas y estado de copas en tiempo real vía DuckDuckGo, y el <strong>Agente Decisor</strong> abrirá una <strong>Ventana Emergente Interactiva</strong> con imágenes y dictamen de apuestas.
        </p>

        <form onSubmit={handleCustomAnalyze} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Ej. Cruz Azul vs Monterrey, Real Madrid vs Bayern, Barcelona vs PSG, Arsenal vs City..."
              value={customMatch}
              onChange={(e) => setCustomMatch(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={customLeague}
            onChange={(e) => setCustomLeague(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="Liga MX">Liga MX</option>
            <option value="Champions League">Champions League</option>
            <option value="Premier League">Premier League</option>
            <option value="La Liga">La Liga</option>
            <option value="Internacional">Otro Torneo</option>
          </select>

          <button
            type="submit"
            disabled={!customMatch.trim() || analyzingMatchId === 'custom'}
            className="px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2 shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Bot className="w-4 h-4" />
            {analyzingMatchId === 'custom' ? 'Analizando...' : 'Escanear Partido'}
          </button>
        </form>
      </div>

      {/* Controles de Filtro y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Pestañas de Liga */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLeague === league
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {league}
            </button>
          ))}
        </div>

        {/* Buscador de la lista */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar partidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
      </div>

      {/* Lista de Partidos Curados con Escudos, Copas y Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((match) => {
          const isAnalyzing = analyzingMatchId === match.id;
          const homeInfo = match.home_info;
          const awayInfo = match.away_info;

          return (
            <div
              key={match.id}
              className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg relative group flex flex-col justify-between"
            >
              <div>
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">
                      {match.liga}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {match.fecha}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/40">
                    {match.estado}
                  </span>
                </div>

                {/* Matchup con Escudos Oficiales */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    
                    {/* Local */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                        {homeInfo?.logo && !imgErrors[`${match.id}-home`] ? (
                          <img
                            src={homeInfo.logo}
                            alt={match.local}
                            onError={() => handleImageError(`${match.id}-home`)}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400">
                            {match.local?.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {match.local}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-500">VS</span>

                    {/* Visitante */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end text-right">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {match.visitante}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                        {awayInfo?.logo && !imgErrors[`${match.id}-away`] ? (
                          <img
                            src={awayInfo.logo}
                            alt={match.visitante}
                            onError={() => handleImageError(`${match.id}-away`)}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-cyan-400">
                            {match.visitante?.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Estado de Copas / Posición */}
                  {homeInfo?.current_cup_status && (
                    <div className="mt-2 text-[10px] text-amber-300/90 font-mono bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-800/30 truncate">
                      {homeInfo.current_cup_status}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400">Mercado sugerido:</span>
                    <span className="text-xs font-semibold text-cyan-300">{match.mercado}</span>
                  </div>
                </div>

                {/* Métricas clave: Cuota y Confianza */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Cuota Promedio</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{match.cuota}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Confianza Base</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{match.confianzaBase}</span>
                  </div>
                </div>
              </div>

              {/* Botón de Acción Abrir Ventana Emergente con Agentes */}
              <button
                onClick={() => onAnalyzeMatch(match)}
                disabled={isAnalyzing}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isAnalyzing
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-emerald-600/90 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-glow-emerald'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Navegando DuckDuckGo e IA...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-white" />
                    <span>Analizar & Abrir Ventana Emergente</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/80" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
