import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  Bot, 
  Brain, 
  CheckCircle2, 
  ChevronRight, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Layers, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  X 
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function AgentWorkspace({ data, isLoading, onClose }) {
  const [activeTab, setActiveTab] = useState('decisor');
  const [copied, setCopied] = useState(false);

  if (!data && !isLoading) return null;

  const recopilador = data?.recopilador;
  const decisor = data?.decisor;
  const fuentes = recopilador?.fuentes || [];

  const handleCopyPrediction = () => {
    if (!decisor) return;
    const text = `🎯 PREDICCIÓN AGENTES IA: ${data.partido}\n` +
      `Pronóstico: ${decisor.prediccion}\n` +
      `Confianza: ${decisor.confianza_pct}% (${decisor.nivel_confianza})\n` +
      `Veredicto: ${decisor.veredicto_tipo}\n` +
      `Stake sugerido: ${decisor.gestion_riesgo}\n` +
      `Razones: ${decisor.razones?.join(' | ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden my-6">
      {/* Glow de fondo decorativo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera del Workspace */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/40">
              Pipeline Multi-Agente
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {data?.liga || 'Análisis Predictivo'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
            {data?.partido || 'Analizando encuentro...'}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {decisor && (
            <button
              onClick={handleCopyPrediction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="Copiar resumen del pronóstico"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Estado de Carga con Animación */}
      {isLoading && (
        <div className="py-16 text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-emerald-400 border-r-cyan-400 animate-spin" />
            <Bot className="w-7 h-7 text-emerald-400 absolute" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Coordinando Agentes Autónomos...
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              <strong>Agente Recopilador</strong> rastreando noticias y alineaciones en DuckDuckGo → 
              <strong> Agente Decisor</strong> computando probabilidades y confianza con Ollama.
            </p>
          </div>
        </div>
      )}

      {/* Contenido cuando el análisis está listo */}
      {!isLoading && data && (
        <div className="mt-5 space-y-6">

          {/* Pestañas de Navegación de Agentes */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('decisor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-display ${
                activeTab === 'decisor'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>🎯 Dictamen Agente Decisor</span>
            </button>

            <button
              onClick={() => setActiveTab('recopilador')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-display ${
                activeTab === 'recopilador'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>🔍 Inteligencia Agente Recopilador ({fuentes.length} Citas)</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-display ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/40 shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>⚡ Auditoría Multi-Agente</span>
            </button>
          </div>

          {/* TAB 1: AGENTE DECISOR (PREDICCIÓN, CONFIANZA, RAZONES Y RIESGOS) */}
          {activeTab === 'decisor' && decisor && (
            <div className="space-y-6">
              
              {/* Bloque Principal del Pronóstico */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-emerald-950/20 border border-slate-800 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  
                  {/* Predicción Central */}
                  <div className="lg:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                        {decisor.veredicto_tipo || 'PRONÓSTICO MODELO SÓLIDO'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Gestión: {decisor.gestion_riesgo}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                      {decisor.prediccion}
                    </h3>

                    {decisor.analisis_tactico && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                        {decisor.analisis_tactico}
                      </p>
                    )}
                  </div>

                  {/* Medidor de Confianza */}
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs uppercase font-mono text-slate-400 mb-1">
                      Nivel de Confianza
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black font-display text-emerald-400">
                        {decisor.confianza_pct || 80}%
                      </span>
                    </div>
                    
                    {/* Barra de Progreso */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.max(10, decisor.confianza_pct || 80))}%` }}
                      />
                    </div>

                    <span className="text-[11px] font-semibold text-slate-300 mt-2">
                      Calificación: <strong className="text-emerald-400">{decisor.nivel_confianza}</strong>
                    </span>
                  </div>

                </div>
              </div>

              {/* Razones Clave vs Riesgos Detectados (Prioridad 5) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Columna: Razones Fundamentadas */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Razones Clave & Fundamentos</span>
                  </div>

                  <ul className="space-y-2">
                    {decisor.razones && decisor.razones.length > 0 ? (
                      decisor.razones.map((razon, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <span className="font-mono text-emerald-400 font-bold mt-0.5">#{idx + 1}</span>
                          <span className="leading-relaxed">{razon}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 italic">No se listaron razones específicas.</li>
                    )}
                  </ul>
                </div>

                {/* Columna: Riesgos Detectados */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Riesgos Detectados & Puntos Críticos</span>
                  </div>

                  <ul className="space-y-2">
                    {decisor.riesgos && decisor.riesgos.length > 0 ? (
                      decisor.riesgos.map((riesgo, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{riesgo}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 italic">No se detectaron riesgos elevados.</li>
                    )}
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AGENTE RECOPILADOR (NOTICIAS, LESIONES, ALINEACIONES Y CITAS DUCKDUCKGO) */}
          {activeTab === 'recopilador' && recopilador && (
            <div className="space-y-6">
              
              {/* Barra de Fuentes DuckDuckGo Citadas */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-xs">
                    <Search className="w-4 h-4" />
                    <span>Fuentes Web Consultadas y Citadas (DuckDuckGo Live Index)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {fuentes.length} fuentes verificadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {fuentes.map((f, i) => (
                    <a
                      key={i}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          {f.id}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-2 mt-1 group-hover:text-cyan-300">
                        {f.titulo}
                      </p>
                      <span className="text-[10px] text-slate-400 truncate mt-1">
                        {f.fuente || 'Sitio Web'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Informe Completo del Recopilador */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Dossier de Inteligencia Deportiva Estructurado</span>
                </div>

                <MarkdownRenderer content={recopilador.informe_inteligencia} />
              </div>

            </div>
          )}

          {/* TAB 3: AUDITORÍA DEL PIPELINE MULTI-AGENTE */}
          {activeTab === 'timeline' && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold font-display text-white">
                Traza de Ejecución y Cooperación de Agentes
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                
                {/* Paso 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 text-xs font-bold shadow-glow-emerald">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 font-mono">
                      FASE 1: RASTREO DUCKDUCKGO (Prioridad 3)
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Consultas ejecutadas para noticias recientes, bajas médicas, suspensiones y alineaciones de ambos planteles.
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      Resultado: {fuentes.length} fuentes indexadas y contrastadas sin alucinación.
                    </span>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 text-xs font-bold shadow-glow-cyan">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-400 font-mono">
                      FASE 2: AGENTE RECOPILADOR (Prioridad 4)
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Estructuración de la información en 4 ejes: Noticias, Lesiones/Bajas, Alineaciones y Racha reciente con citación estricta [1], [2].
                    </p>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-slate-950 text-xs font-bold shadow-glow-violet">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 font-mono">
                      FASE 3: AGENTE DECISOR & OLLAMA (Prioridades 1 y 5)
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Inferencia en modelo local Ollama para emitir el veredicto probabilístico, confianza cuantitativa, fundamentos y gestión de riesgo.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
