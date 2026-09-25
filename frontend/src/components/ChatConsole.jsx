import React, { useState, useRef, useEffect } from 'react';
import { Bot, Brain, RefreshCw, Send, Sparkles, Trash2, User, Zap } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function ChatConsole({ activeModel, onSendMessage, onClearHistory, mensajes, cargando }) {
  const [inputMessage, setInputMessage] = useState("");
  const [modo, setModo] = useState("chat"); // "chat" (Rápido + DuckDuckGo) | "pipeline" | "recopilador"
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "🏥 Bajas Cruz Azul vs Monterrey", query: "Bajas, lesiones y posibles alineaciones para Cruz Azul vs Monterrey" },
    { label: "🏆 Real Madrid vs Bayern", query: "Real Madrid vs Bayern Múnich análisis de partido y pronóstico" },
    { label: "⚡ Arsenal vs Man City", query: "Arsenal vs Manchester City alineaciones y pronóstico de goles" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, cargando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || cargando) return;
    onSendMessage(inputMessage.trim(), modo);
    setInputMessage("");
  };

  const handleQuickPrompt = (query) => {
    onSendMessage(query, modo);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[650px] shadow-xl overflow-hidden">
      
      {/* Cabecera del Chat */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-white">
              Consola de Consulta Deportiva
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Modelo: <strong className="text-emerald-400">{activeModel || 'Ollama'}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
          title="Limpiar historial de chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Selector de Modo del Agente */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 text-xs">
        <span className="text-slate-400 text-[11px] font-mono">Modo:</span>
        <button
          onClick={() => setModo("pipeline")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            modo === "pipeline"
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2 Agentes (Completo)
        </button>
        <button
          onClick={() => setModo("recopilador")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            modo === "recopilador"
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          DuckDuckGo + Citas
        </button>
        <button
          onClick={() => setModo("chat")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            modo === "chat"
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Chat Libre Ollama
        </button>
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {mensajes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">
                Sesión de Consulta Independiente
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Pregunta sobre cualquier jugador, lesión, alineación o partido.
              </p>
            </div>

            {/* Chips Rápidos */}
            <div className="space-y-1.5 w-full max-w-xs">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(qp.query)}
                  className="w-full text-left p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 transition-all truncate"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          mensajes.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.rol !== 'usuario' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  msg.rol === 'usuario'
                    ? 'bg-emerald-600 text-white shadow-md rounded-br-none'
                    : 'bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-[10px] uppercase font-mono tracking-wider opacity-80">
                    {msg.rol === 'usuario' ? 'Tú' : (msg.agente || 'IA Analista')}
                  </span>
                  {msg.modo && (
                    <span className="text-[9px] font-mono text-cyan-400 bg-slate-950/60 px-1.5 py-0.2 rounded border border-slate-800">
                      {msg.modo}
                    </span>
                  )}
                </div>

                <MarkdownRenderer content={msg.texto} />
              </div>

              {msg.rol === 'usuario' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {cargando && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl rounded-bl-none text-xs text-slate-400 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Procesando consulta deportiva con {activeModel || 'Ollama'}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensajes */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900/80 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu consulta deportiva..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || cargando}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-emerald"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
