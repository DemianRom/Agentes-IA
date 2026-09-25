import React from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BadgePercent, 
  Bot, 
  Calculator, 
  Coins, 
  ExternalLink, 
  Flame, 
  Scale, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Zap 
} from 'lucide-react';

export function BookmakersView({ data, onAnalyzeMatch, analyzingMatchId }) {
  if (!data) return null;

  const bookmakers = data.bookmakers_info || [];
  const comparisons = data.odds_comparison || [];

  return (
    <div className="space-y-6">
      
      {/* Banner de Conexión con Casas de Apuestas */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 relative overflow-hidden shadow-glow-amber">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/40">
                Comparador Multi-Bookmaker & +EV
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Pinnacle • Caliente.mx • Bet365 • Betfair
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Monitor de Cuotas en Vivo & Detección de Valor (+EV)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Compara en tiempo real los momios de las principales casas de apuestas contra la cuota justa del Modelo SÓLIDO. Detecta caídas de línea provocadas por dinero profesional y accede directamente a cada casa con un clic.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-300 font-medium">4 Casas Conectadas</span>
          </div>
        </div>

        {/* Tarjetas de Casas de Apuestas Conectadas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          {bookmakers.map((bk) => (
            <a
              key={bk.id}
              href={bk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                    {bk.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {bk.country} • Margen: <strong className="text-slate-200">{bk.margin_avg}</strong>
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {bk.profile}
                </p>
              </div>

              <span className="text-[10px] font-bold text-amber-400 mt-2 flex items-center gap-1">
                Abrir portal oficial →
              </span>
            </a>
          ))}
        </div>

      </div>

      {/* Matriz de Comparación de Cuotas y Líneas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Oportunidades de Inversión con Valor Matemático (+EV)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {comparisons.length} partidos auditados
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {comparisons.map((item) => {
            const isAnalyzing = analyzingMatchId === item.id;

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-amber-500/40 transition-all space-y-4"
              >
                {/* Cabecera del Partido */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {item.liga}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="text-[10px] text-slate-400">
                        Mercado: <strong className="text-cyan-300">{item.mercado}</strong>
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-white font-display">
                      {item.partido}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/50 shadow-glow-emerald">
                      {item.ev_percent} EV
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-700/50">
                      {item.best_bookmaker}
                    </span>
                  </div>
                </div>

                {/* Comparación directa de Momios por Casa de Apuestas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Caliente.mx */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-red-400">Caliente.mx 🇲🇽</span>
                        <span className="text-[10px] font-mono text-slate-400">Margen {item.caliente.margin}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white font-mono">{item.caliente.odds_american}</span>
                        <span className="text-xs text-slate-400 font-mono">({item.caliente.odds_decimal})</span>
                      </div>
                    </div>

                    <a
                      href={item.caliente.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 py-1.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Apostar en Caliente</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Pinnacle Sports */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-orange-400">Pinnacle (Sharp) ⚡</span>
                        <span className="text-[10px] font-mono text-slate-400">Margen {item.pinnacle.margin}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-emerald-400 font-mono">{item.pinnacle.odds_decimal}</span>
                        <span className="text-xs text-slate-400 font-mono">({item.pinnacle.odds_american})</span>
                      </div>
                    </div>

                    <a
                      href={item.pinnacle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 py-1.5 px-3 rounded-lg bg-orange-950/40 hover:bg-orange-900/60 text-orange-300 border border-orange-800/40 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Ver cuota en Pinnacle</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Bet365 */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-emerald-400">Bet365 (Global) 🌐</span>
                        <span className="text-[10px] font-mono text-slate-400">Margen {item.bet365.margin}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white font-mono">{item.bet365.odds_decimal}</span>
                        <span className="text-xs text-slate-400 font-mono">({item.bet365.odds_american})</span>
                      </div>
                    </div>

                    <a
                      href={item.bet365.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 py-1.5 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Ver línea en Bet365</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>

                {/* Movimiento de Líneas y Gestión de Capital Kelly */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs">
                    <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium">
                      {item.line_movement.direction}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Stake Kelly Recomendado:</span>
                    </div>
                    <span className="font-bold font-mono text-emerald-400">
                      {item.stake_kelly}
                    </span>
                  </div>
                </div>

                {/* Botón Analizar con Agentes */}
                <button
                  onClick={() => onAnalyzeMatch({
                    id: item.id,
                    partido: item.partido,
                    liga: item.liga,
                    cuota: item.caliente.odds_american + ' (' + item.caliente.odds_decimal + ')',
                    mercado: item.mercado
                  })}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-700/80 transition-all shadow-sm disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analizando partido y cuotas con Agentes...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-emerald-400" />
                      <span>Analizar Valor de Cuota con Recopilador & Decisor</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
