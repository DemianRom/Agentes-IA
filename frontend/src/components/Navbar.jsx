import { RefreshCw, Zap } from 'lucide-react';

export function Navbar({ onRefreshStatus, checkingStatus }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/75 backdrop-blur-xl">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-lg bg-white px-3 py-2 text-slate-950">Ir al contenido</a>
      <div className="max-w-7xl mx-auto h-[64px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
            <Zap className="h-[18px] w-[18px] text-cyan-300" aria-hidden="true" />
          </div>
          <p className="font-display text-[15px] font-bold tracking-[.11em] text-white">AGENTES<span className="text-cyan-300">·IA</span></p>
          <span className="hidden sm:inline-flex rounded-full border border-slate-700/70 bg-white/[.03] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">Fútbol</span>
        </div>
        <button onClick={onRefreshStatus} disabled={checkingStatus} aria-label="Actualizar datos" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/55 text-slate-300 transition hover:border-cyan-400/55 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
          <RefreshCw className={`h-[18px] w-[18px] ${checkingStatus ? 'animate-spin text-cyan-300' : ''}`} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
