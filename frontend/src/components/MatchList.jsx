import { useState } from 'react';
import { Bot, ChevronRight, Clock, Search, Sparkles } from 'lucide-react';

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
      <section id="match-scanner" className="glass-panel p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-emerald-500/30 shadow-glow-emerald" aria-labelledby="scanner-title">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 id="scanner-title" className="text-base font-bold text-white font-display">
              Encuentra tu partido
            </h2>
          </div>
        </div>
        
        <p className="text-xs text-slate-300 mb-4">
          Escribe el cruce que quieres revisar y descubre lo más relevante: forma, contexto, posibles bajas y señales del encuentro.
        </p>

        <form onSubmit={handleCustomAnalyze} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <label htmlFor="custom-match" className="sr-only">Partido a analizar</label><input
              id="custom-match"
              type="text"
              placeholder="Ej. Cruz Azul vs Monterrey, Real Madrid vs Bayern, Barcelona vs PSG, Arsenal vs City..."
              value={customMatch}
              onChange={(e) => setCustomMatch(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

            <label htmlFor="custom-league" className="sr-only">Competencia</label><select
              id="custom-league"
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
            disabled={!customMatch.trim() || String(analyzingMatchId || '').startsWith('custom-')}
            className="px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center justify-center gap-2 shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Bot className="w-4 h-4" />
            {String(analyzingMatchId || '').startsWith('custom-') ? 'Analizando...' : 'Escanear partido'}
          </button>
        </form>
      </section>

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
          <label htmlFor="match-filter" className="sr-only">Filtrar partidos</label><input
            id="match-filter"
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
              className="nm-fixture-card rounded-[24px] p-5 border border-slate-800/80 relative group flex flex-col justify-between"
            >
              <div>
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">
                      {match.liga}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {match.fecha}
                    </span>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/40">
                    {match.estado}
                  </span>
                </div>

                {/* Matchup con Escudos Oficiales */}
                <div className="mb-4">
                  <div className="nm-fixture-duel flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    
                    {/* Local */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                        {homeInfo?.logo && !imgErrors[`${match.id}-home`] ? (
                          <img
                            src={homeInfo.logo}
                            alt={match.local}
                            onError={() => handleImageError(`${match.id}-home`)}
                            width="32" height="32" loading="lazy" className="max-w-full max-h-full object-contain"
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

                    <span className="nm-fixture-vs text-[11px] font-mono font-bold text-slate-500">VS</span>

                    {/* Visitante */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end text-right">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {match.visitante}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                        {awayInfo?.logo && !imgErrors[`${match.id}-away`] ? (
                          <img
                            src={awayInfo.logo}
                            alt={match.visitante}
                            onError={() => handleImageError(`${match.id}-away`)}
                            width="32" height="32" loading="lazy" className="max-w-full max-h-full object-contain"
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
                    <div className="mt-3 text-[10px] text-amber-300/90 font-mono bg-amber-950/30 px-2.5 py-1.5 rounded-lg border border-amber-800/30 truncate">
                      {homeInfo.current_cup_status.replace(/^🏆\s*/, '')}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Lectura sugerida</span>
                    <span className="text-xs font-semibold text-cyan-300">{match.mercado}</span>
                  </div>
                </div>

                {/* Métricas clave: Cuota y Confianza */}
                <div className="nm-fixture-metrics grid grid-cols-2 gap-2 mb-5 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Cuota Promedio</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{match.cuota}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Confianza</span>
                    <div className="flex items-center gap-2"><span className="text-sm font-bold text-emerald-400 font-mono">{match.confianzaBase}</span><span className="h-1.5 flex-1 max-w-12 rounded-full bg-slate-700 overflow-hidden"><span className="block h-full rounded-full bg-lime-300" style={{ width: match.confianzaBase }} /></span></div>
                  </div>
                </div>
              </div>

              {/* Botón de Acción Abrir Ventana Emergente con Agentes */}
              <button
                onClick={() => onAnalyzeMatch(match)}
                disabled={isAnalyzing}
                className={`nm-dossier-button w-full sm:w-auto sm:min-w-[310px] px-4 rounded-2xl text-xs font-display font-bold flex items-center text-left transition-all ${
                  isAnalyzing
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'text-white'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Consultando fuentes e IA...</span>
                  </>
                ) : (
                  <>
                    <span className="nm-dossier-icon"><Bot className="w-4 h-4 text-cyan-200" /></span>
                    <span className="ml-3 flex flex-col gap-0.5"><span className="tracking-wide text-white">Abrir previa del partido</span><span className="text-[10px] font-normal tracking-normal text-slate-300">Forma, bajas y señales del encuentro</span></span>
                    <span className="nm-dossier-arrow ml-auto"><ChevronRight className="w-4 h-4" /></span>
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
