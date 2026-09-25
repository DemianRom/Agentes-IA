import React from 'react';
import { Activity, Bot, Brain, Database, RefreshCw, Search, ShieldCheck, Zap } from 'lucide-react';

export function Navbar({ status, models, activeModel, onSelectModel, onRefreshStatus, checkingStatus }) {
  const isOnline = status?.ollama?.online;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo y Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-600/20 border border-emerald-500/40 shadow-glow-emerald">
            <Zap className="w-5 h-5 text-emerald-400" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-white">
                AGENTES·IA
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                v2.4 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Inteligencia Deportiva Cuantitativa & Apuestas de Valor (+EV)
            </p>
          </div>
        </div>

        {/* Indicadores de Sistema en Vivo */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Motor Ollama Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
            <span className="font-medium text-slate-400 hidden md:inline">Ollama:</span>
            
            {models && models.length > 0 ? (
              <select
                value={activeModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="bg-transparent text-emerald-300 font-mono text-xs font-semibold focus:outline-none cursor-pointer"
                title="Selecciona el modelo Ollama para inferencia"
              >
                {models.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-mono text-xs text-emerald-300 font-semibold">
                {activeModel || (isOnline ? 'Conectado' : 'Desconectado')}
              </span>
            )}
          </div>

          {/* DuckDuckGo Live Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">DuckDuckGo:</span>
            <span className="text-cyan-400 font-semibold font-mono">En vivo</span>
          </div>

          {/* Agentes Activos Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-700/30 text-xs text-emerald-300">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">2 Agentes:</span>
            <span className="font-bold text-white font-mono">Recopilador + Decisor</span>
          </div>

          {/* Botón Refrescar Estado */}
          <button
            onClick={onRefreshStatus}
            disabled={checkingStatus}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refrescar estado de conexión con Ollama"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

        </div>
      </div>
    </header>
  );
}
