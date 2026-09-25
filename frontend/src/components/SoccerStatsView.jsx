import React, { useState } from 'react';
import { 
  Activity, 
  ArrowUpRight, 
  BarChart3, 
  Bot, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Table, 
  TrendingUp, 
  Trophy 
} from 'lucide-react';

export function SoccerStatsView({ data, onAnalyzeMatch, analyzingMatchId }) {
  const [activeSubTab, setActiveSubTab] = useState('upcoming'); // 'upcoming' | 'standings' | 'results'
  const [standingsFilter, setStandingsFilter] = useState('all'); // 'all' | 'direct' | 'playoff' | 'eliminated'

  if (!data) return null;

  const standings = data.standings || [];
  const averages = data.averages || {};
  const upcoming = data.upcoming_fixtures || [];
  const results = data.matchday_1_results || [];

  const filteredStandings = standings.filter(team => {
    if (standingsFilter === 'direct') return team.pos <= 8;
    if (standingsFilter === 'playoff') return team.pos >= 9 && team.pos <= 24;
    if (standingsFilter === 'eliminated') return team.pos >= 25;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner de Sincronización con SoccerStats */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden shadow-glow-cyan">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-700/40">
                Panorama de la competición
              </span>
              <a 
                href="https://www.soccerstats.com/leagueview.asp?league=uefa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>soccerstats.com/uefa</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Champions League
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Consulta partidos, posiciones y tendencias para llegar al encuentro con mejor contexto.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-300 font-medium">Todos los equipos</span>
          </div>
        </div>

        {/* Tarjetas de Métricas Globales SoccerStats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Ambos Anotan (BTS)</span>
            <span className="text-xl font-black text-cyan-400 font-display">
              {averages.both_teams_scored_pct}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Frecuencia muy alta</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Over 2.5 Goles</span>
            <span className="text-xl font-black text-emerald-400 font-display">
              {averages.over_25_pct}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Media de 3.1 goles/pj</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Minutos Más Goleadores</span>
            <span className="text-base font-bold text-amber-400 font-display truncate block">
              16 - 30 min
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">27.7% de goles totales</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Distribución 1T / 2T</span>
            <span className="text-base font-bold text-purple-400 font-display truncate block">
              55.3% / 44.7%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Más goles en primer tiempo</span>
          </div>
        </div>

      </div>

      {/* Selector de Sub-pestañas */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('upcoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeSubTab === 'upcoming'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Próximos Partidos (Jornada 2)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('standings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeSubTab === 'standings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span>Tabla de Posiciones (36 Clubes)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('results')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeSubTab === 'results'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-violet'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Resultados Jornada 1 (18 Partidos)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PRÓXIMOS PARTIDOS JORNADA 2 */}
      {activeSubTab === 'upcoming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map((match) => {
            const isAnalyzing = analyzingMatchId === match.id;

            return (
              <div
                key={match.id}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {match.fecha}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-700/40">
                      {match.estado}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mb-1">
                    {match.partido}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-slate-400">Mercado sugerido:</span>
                    <span className="text-xs font-semibold text-cyan-300">{match.mercado}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Cuota SoccerStats</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">{match.cuota}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Confianza Algorítmica</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">{match.confianzaBase}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAnalyzeMatch(match)}
                  disabled={isAnalyzing}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isAnalyzing
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-emerald'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analizando con Agentes...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Analizar con Recopilador & Decisor</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: TABLA DE POSICIONES (36 EQUIPOS) */}
      {activeSubTab === 'standings' && (
        <div className="space-y-4">
          
          {/* Filtros de la Tabla */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStandingsFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                standingsFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos (36)
            </button>
            <button
              onClick={() => setStandingsFilter('direct')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                standingsFilter === 'direct' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Top 1-8 (Octavos Directos)
            </button>
            <button
              onClick={() => setStandingsFilter('playoff')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                standingsFilter === 'playoff' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Puestos 9-24 (Playoffs)
            </button>
            <button
              onClick={() => setStandingsFilter('eliminated')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                standingsFilter === 'eliminated' ? 'bg-rose-950/80 text-rose-300 border border-rose-700/50' : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              Puestos 25-36 (Eliminados)
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-4">Club</th>
                    <th className="py-3 px-3">PJ</th>
                    <th className="py-3 px-3">G</th>
                    <th className="py-3 px-3">E</th>
                    <th className="py-3 px-3">P</th>
                    <th className="py-3 px-3">GF</th>
                    <th className="py-3 px-3">GC</th>
                    <th className="py-3 px-3">DG</th>
                    <th className="py-3 px-3 font-bold text-white">PTS</th>
                    <th className="py-3 px-3">PPG</th>
                    <th className="py-3 px-3">Clean Sheet</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredStandings.map((team) => {
                    let statusColor = "bg-slate-800 text-slate-300";
                    if (team.pos <= 8) statusColor = "bg-emerald-950/80 text-emerald-400 border border-emerald-700/40";
                    else if (team.pos <= 24) statusColor = "bg-cyan-950/80 text-cyan-400 border border-cyan-700/40";
                    else statusColor = "bg-rose-950/80 text-rose-400 border border-rose-700/40";

                    return (
                      <tr key={team.pos} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{team.pos}</td>
                        <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                          <span>{team.flag}</span>
                          <span>{team.team}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{team.pj}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{team.g}</td>
                        <td className="py-2.5 px-3 text-slate-400">{team.e}</td>
                        <td className="py-2.5 px-3 text-rose-400">{team.p}</td>
                        <td className="py-2.5 px-3 text-slate-300">{team.gf}</td>
                        <td className="py-2.5 px-3 text-slate-400">{team.gc}</td>
                        <td className={`py-2.5 px-3 font-mono ${team.dg > 0 ? 'text-emerald-400' : team.dg < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {team.dg > 0 ? `+${team.dg}` : team.dg}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white font-mono text-sm">{team.pts}</td>
                        <td className="py-2.5 px-3 text-slate-300 font-mono">{team.ppg}</td>
                        <td className="py-2.5 px-3 text-cyan-300 font-mono">{team.cs}</td>
                        <td className="py-2.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                            {team.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RESULTADOS JORNADA 1 (18 PARTIDOS) */}
      {activeSubTab === 'results' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((res) => (
            <div key={res.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{res.fecha}</span>
                <span className="text-amber-400 font-bold">{res.cuota}</span>
              </div>
              
              <div className="flex items-center justify-between font-bold text-sm text-white">
                <span className="truncate pr-2">{res.local}</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded text-cyan-400 font-mono font-black shrink-0">
                  {res.resultado}
                </span>
                <span className="truncate pl-2 text-right">{res.visitante}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {res.over25 && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/40">
                    Over 2.5 ✅
                  </span>
                )}
                {res.bts && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-700/40">
                    Ambos Anotan ✅
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
