import React, { useState } from 'react';

function App() {
  const [chatQuery, setChatQuery] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const mockTopJugadas = [
    { id: 1, partido: "Sparta Praga vs RB Salzburg", liga: "Champions League", cuota: "+110", confianza: "85%", prediccion: "Local / Over 2.5" }
  ];

  const enviarMensaje = async () => {
    if (!chatQuery.trim()) return;
    
    const historialNuevo = [...mensajes, { rol: 'usuario', texto: chatQuery }];
    setMensajes(historialNuevo);
    setChatQuery("");
    setCargando(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: chatQuery })
      });
      
      const data = await response.json();
      console.log("Respuesta en crudo:", data.respuesta);

      let textoLimpio = "";
      
      try {
        // Convertimos la estructura de bloques a un objeto de JavaScript
        const bloques = typeof data.respuesta === 'string' ? JSON.parse(data.respuesta) : data.respuesta;
        
        // Si es un arreglo y tiene la propiedad "text", extraemos solo el texto
        if (Array.isArray(bloques) && bloques[0].text) {
          textoLimpio = bloques[0].text;
        } else {
          textoLimpio = data.respuesta; // Por si acaso manda texto normal
        }
      } catch (e) {
        // Si no era un JSON, asumimos que ya era texto limpio
        textoLimpio = data.respuesta;
      }

      setMensajes([...historialNuevo, { rol: 'ia', texto: textoLimpio }]);
    } catch (error) {
      console.error("Error:", error);
      setMensajes([...historialNuevo, { rol: 'ia', texto: "Error de conexión con el servidor." }]);
    }
    
    setCargando(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Panel Central */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Control: Top Jugadas</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-gray-600">Partido</th>
                <th className="pb-3 text-gray-600">Liga</th>
                <th className="pb-3 text-gray-600">Predicción</th>
                <th className="pb-3 text-gray-600">Cuota</th>
                <th className="pb-3 text-gray-600">Confianza IA</th>
              </tr>
            </thead>
            <tbody>
              {mockTopJugadas.map((jugada) => (
                <tr key={jugada.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">{jugada.partido}</td>
                  <td className="py-4">{jugada.liga}</td>
                  <td className="py-4 text-blue-600 font-semibold">{jugada.prediccion}</td>
                  <td className="py-4">{jugada.cuota}</td>
                  <td className="py-4 text-green-600 font-bold">{jugada.confianza}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel Lateral - Chat */}
      <div className="w-1/3 bg-white border-l p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Consulta de Agente</h2>
        <div className="flex-1 bg-gray-50 rounded p-4 mb-4 overflow-y-auto border space-y-3">
          <p className="text-sm text-gray-500 italic text-center mb-4">Sesión independiente iniciada.</p>
          
          {mensajes.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg text-sm w-4/5 ${msg.rol === 'usuario' ? 'bg-blue-100 ml-auto' : 'bg-white border mr-auto'}`}>
              <span className="font-bold block mb-1">{msg.rol === 'usuario' ? 'Tú' : 'IA Analista'}</span>
              {msg.texto}
            </div>
          ))}
          
          {cargando && (
            <div className="text-sm text-gray-500 italic bg-white border p-3 rounded-lg w-4/5 mr-auto">
              Analizando...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ej. Alineaciones de Cruz Azul..." 
            className="flex-1 border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
          />
          <button 
            onClick={enviarMensaje}
            disabled={cargando}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;