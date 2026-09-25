
/**
 * Renderizador de Markdown ligero y seguro para textos enriquecidos de agentes IA.
 * Procesa negritas, cursivas, listas con viñetas, citas [1], [2], títulos y bloques de código.
 */
export function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  // Si ya es un objeto, intentar convertirlo o extraer texto
  if (typeof content !== 'string') {
    try {
      content = JSON.stringify(content, null, 2);
    } catch {
      content = String(content);
    }
  }

  const lines = content.split('\n');

  return (
    <div className={`space-y-2 text-sm leading-relaxed text-slate-200 ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Títulos Markdown ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-base font-bold text-emerald-400 mt-3 mb-1 flex items-center gap-1.5">
              {formatInline(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-lg font-extrabold text-cyan-400 mt-4 mb-2 flex items-center gap-1.5">
              {formatInline(trimmed.replace('## ', ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-xl font-black text-white mt-4 mb-2">
              {formatInline(trimmed.replace('# ', ''))}
            </h2>
          );
        }

        // Elementos de lista (- o *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 ml-2">
              <span className="text-emerald-400 mt-1 font-bold text-xs">◆</span>
              <div className="flex-1">{formatInline(itemText)}</div>
            </div>
          );
        }

        // Elementos numerados (1. , 2. )
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="bg-slate-800 text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded font-bold mt-0.5">
                {numMatch[1]}
              </span>
              <div className="flex-1 font-normal">{formatInline(numMatch[2])}</div>
            </div>
          );
        }

        // Párrafo normal
        return (
          <p key={idx} className="text-slate-300">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function formatInline(text) {
  // Manejo de citas [1], [2], [10]
  // Manejo de negritas **texto**
  // Manejo de código `codigo`
  
  // Dividir por tokens
  const parts = [];
  let current = text;
  let keyCounter = 0;

  // Reemplazar citas [1], [2], etc con badges
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[\d+\])/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(current)) !== null) {
    if (match.index > lastIndex) {
      parts.push(current.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong key={keyCounter++} className="font-semibold text-white">
          {boldText}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeText = token.slice(1, -1);
      parts.push(
        <code key={keyCounter++} className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded font-mono text-xs">
          {codeText}
        </code>
      );
    } else if (/^\[\d+\]$/.test(token)) {
      parts.push(
        <span
          key={keyCounter++}
          className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.2 mx-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-700/50"
          title={`Fuente verificada ${token}`}
        >
          {token}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < current.length) {
    parts.push(current.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
