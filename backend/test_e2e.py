import asyncio
import sys
from search_service import search_service
from agents import agente_recopilador, agente_decisor
from ollama_service import ollama_service

async def test_full_pipeline():
    print("--- 1. Probando Ollama Service ---")
    health = await ollama_service.check_health()
    print(f"Ollama Online: {health.get('online')}, Modelo: {health.get('current_model')}")

    print("\n--- 2. Probando DuckDuckGo Search (Prioridad 3) ---")
    search_res = search_service.search_match_context("Cruz Azul", "CF Monterrey", "Liga MX")
    fuentes = search_res.get('fuentes_totales', [])
    print(f"Fuentes encontradas: {len(fuentes)}")
    for f in fuentes[:2]:
        print(f" - [{f.get('title')}] -> {f.get('url')}")

    print("\n--- 3. Probando Agente Recopilador (Prioridad 4) ---")
    recop_result = await agente_recopilador.recopilar(
        partido_o_consulta="Cruz Azul vs Monterrey",
        equipo_local="Cruz Azul",
        equipo_visitante="CF Monterrey",
        liga="Liga MX"
    )
    print(f"Agente: {recop_result['agente']}")
    print(f"Fuentes citadas: {recop_result['total_fuentes']}")

    print("\n--- 4. Probando Agente Decisor (Prioridad 5) ---")
    decis_result = await agente_decisor.decidir(
        informe_recopilador=recop_result,
        cuota_sugerida="+115 (2.15)"
    )
    print(f"Prediccion: {decis_result.get('prediccion')}")
    print(f"Confianza: {decis_result.get('confianza_pct')}% ({decis_result.get('nivel_confianza')})")
    print(f"Razones: {decis_result.get('razones')}")
    print(f"Riesgos: {decis_result.get('riesgos')}")
    print(f"Gestion Riesgo: {decis_result.get('gestion_riesgo')}")

    print("\n[OK] PRUEBAS COMPLETADAS CON EXITO")

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
