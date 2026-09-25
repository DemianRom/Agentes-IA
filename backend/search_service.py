import logging
import warnings
import re
from typing import List, Dict, Any, Optional

warnings.filterwarnings("ignore")

logger = logging.getLogger("search_service")

class SearchService:
    """
    Servicio de Búsqueda Deportiva con DuckDuckGo (ddgs / goduck):
    Rastrea páginas oficiales (FlashScore, SoccerStats, ESPN, Marca, UEFA.com, Transfermarkt)
    para verificar en tiempo real:
    - Estado en vivo / marcador / fecha del partido
    - Clasificación a copas actuales (Champions League, Libertadores, Liguilla)
    - Noticias de jugadores, bajas médicas, sanciones y alineaciones
    - Cuotas de apuestas y valor de mercado
    """

    def __init__(self):
        self._ddgs_class = None
        self._init_client()

    def _init_client(self):
        try:
            from ddgs import DDGS
            self._ddgs_class = DDGS
        except ImportError:
            try:
                from duckduckgo_search import DDGS
                self._ddgs_class = DDGS
            except ImportError:
                self._ddgs_class = None
                logger.warning("No se pudo importar duckduckgo_search / ddgs.")

    def search_news(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Busca noticias de actualidad deportiva con DuckDuckGo News."""
        if not self._ddgs_class:
            return []

        results = []
        try:
            with self._ddgs_class() as ddgs:
                news_gen = ddgs.news(query, max_results=max_results)
                for item in (news_gen or []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("url") or item.get("href", ""),
                        "snippet": item.get("body", "") or item.get("snippet", ""),
                        "date": item.get("date", ""),
                        "source": item.get("source", "DuckDuckGo News")
                    })
        except Exception as e:
            logger.debug(f"Error en search_news ({query}): {e}")
            # Fallback a text search
            return self.search_text(f"{query} noticias", max_results=max_results)
        return results

    def search_text(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Busca páginas web deportivas usando DuckDuckGo Text Search."""
        if not self._ddgs_class:
            return []

        results = []
        try:
            with self._ddgs_class() as ddgs:
                text_gen = ddgs.text(query, max_results=max_results)
                for item in (text_gen or []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("href") or item.get("url", ""),
                        "snippet": item.get("body", "") or item.get("snippet", ""),
                        "date": item.get("date", ""),
                        "source": self._detect_domain_source(item.get("href") or item.get("url", ""))
                    })
        except Exception as e:
            logger.debug(f"Error en search_text ({query}): {e}")
        return results

    def search_live_sports(self, query: str = "partidos de futbol en vivo hoy", max_results: int = 8) -> List[Dict[str, Any]]:
        """
        Búsqueda especializada en tiempo real a través de los portales deportivos oficiales
        (FlashScore, SoccerStats, ESPN Deportes, Diario MARCA, UEFA.com, Transfermarkt, BeSoccer, SofaScore, etc.).
        """
        seen_urls = set()
        results = []

        queries = [
            f"{query} marcadores en vivo futbol flashscore espn",
            f"{query} futbol hoy marca as uefa soccerstats",
            f"{query} alineaciones bajas partidos transfermarkt"
        ]

        for q in queries:
            try:
                sub_results = self.search_text(q, max_results=4)
                for item in sub_results:
                    u = (item.get("url") or "").strip()
                    if u and u not in seen_urls:
                        seen_urls.add(u)
                        results.append(item)
                        if len(results) >= max_results:
                            break
            except Exception as e:
                logger.debug(f"Error en sub-búsqueda deportiva ({q}): {e}")
            if len(results) >= max_results:
                break

        if len(results) < 4:
            news_res = self.search_news(f"{query} futbol", max_results=4)
            for item in news_res:
                u = (item.get("url") or "").strip()
                if u and u not in seen_urls:
                    seen_urls.add(u)
                    results.append(item)
                    if len(results) >= max_results:
                        break

        return results

    def _detect_domain_source(self, url: str) -> str:
        """Extrae el nombre amigable de la fuente según el dominio de la URL."""
        u_lower = (url or "").lower()
        if "soccerstats.com" in u_lower:
            return "SoccerStats Oficial ⚽"
        elif "flashscore" in u_lower or "mis-marcadores" in u_lower:
            return "FlashScore En Vivo 🔴"
        elif "espn" in u_lower:
            return "ESPN Deportes 📺"
        elif "marca.com" in u_lower:
            return "Diario MARCA 🗞️"
        elif "as.com" in u_lower:
            return "Diario AS 🗞️"
        elif "uefa.com" in u_lower:
            return "UEFA Oficial 🏆"
        elif "transfermarkt" in u_lower:
            return "Transfermarkt 📊"
        elif "besoccer" in u_lower:
            return "BeSoccer 📱"
        elif "sofascore" in u_lower:
            return "SofaScore 📈"
        elif "caliente.mx" in u_lower:
            return "Caliente.mx 🇲🇽"
        elif "pinnacle.com" in u_lower:
            return "Pinnacle Sports ⚡"
        elif "bet365" in u_lower:
            return "Bet365 🌐"
        elif "foxsports" in u_lower:
            return "Fox Sports ⚽"
        elif "tudn" in u_lower:
            return "TUDN Deportes 🇲🇽"
        elif "tycsports" in u_lower:
            return "TyC Sports 🇦🇷"
        elif "goal.com" in u_lower:
            return "Goal.com ⚽"
        elif "yahoo" in u_lower:
            return "Yahoo Sports 📰"
        return "Página Deportiva Verificada"

    def search_match_context(
        self,
        home_team: str,
        away_team: str,
        league: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Consulta exhaustiva en DuckDuckGo cubriendo:
        1. Estado del partido (En vivo / Programado / Resultado reciente)
        2. Clasificación a copas actuales y posición en liga
        3. Noticias de jugadores, bajas médicas, alineaciones
        4. Cuotas y pronósticos en portales oficiales
        """
        league_str = f" {league}" if league else ""
        seen_urls = set()
        todas_las_fuentes = []
        is_live = False
        live_status_text = "Programado"
        live_minute = ""
        live_score = ""

        # 1. Búsqueda de noticias e información general del partido
        q_news = f"{home_team} {away_team}{league_str} futbol noticias"
        noticias = self.search_news(q_news, max_results=3)

        # 2. Búsqueda de lesiones, bajas médicas y alineaciones
        q_alineaciones = f"{home_team} {away_team} alineaciones confirmadas bajas lesionados"
        alineaciones = self.search_text(q_alineaciones, max_results=3)

        # 3. Búsqueda de estado en vivo / marcadores y programación
        q_live = f"{home_team} vs {away_team} en vivo directo marcador resultado"
        live_search = self.search_text(q_live, max_results=2)

        # 4. Búsqueda de copas y clasificación
        q_copas = f"{home_team} clasificado champions libertadores tabla posiciones {league or ''}"
        copas_search = self.search_text(q_copas, max_results=2)

        raw_pool = noticias + alineaciones + live_search + copas_search

        for item in raw_pool:
            u = (item.get("url") or "").strip()
            if u and u not in seen_urls:
                seen_urls.add(u)
                item["source"] = self._detect_domain_source(u)
                todas_las_fuentes.append(item)

                # Heurística para detectar si hay menciones de partido en vivo o minuto
                text_blob = f"{item.get('title', '')} {item.get('snippet', '')}".lower()
                if "en vivo" in text_blob or "en directo" in text_blob or "minuto" in text_blob or "jugándose" in text_blob:
                    # Detectar si hay marcador (ej. 2-1 o 1-0)
                    score_match = re.search(r"\b([0-9])\s*[-–:]\s*([0-9])\b", text_blob)
                    if score_match:
                        live_score = f"{score_match.group(1)} - {score_match.group(2)}"
                    minute_match = re.search(r"minuto\s*([0-9]{1,2})|([0-9]{1,2})['’]", text_blob)
                    if minute_match:
                        live_minute = f"{minute_match.group(1) or minute_match.group(2)}'"

        # Si aún hay pocas fuentes, buscar individualmente al equipo local
        if len(todas_las_fuentes) < 3 and home_team:
            extra = self.search_news(f"{home_team} futbol noticias bajas", max_results=2)
            for it in extra:
                u = it.get("url", "").strip()
                if u and u not in seen_urls:
                    seen_urls.add(u)
                    it["source"] = self._detect_domain_source(u)
                    todas_las_fuentes.append(it)

        # Determinar estado en vivo
        if live_score or live_minute:
            is_live = True
            live_status_text = f"🔴 En Juego ({live_minute or 'En Directo'}{' • Marcador: ' + live_score if live_score else ''})"
        else:
            live_status_text = "🟢 Programado / En Radar"

        return {
            "home_team": home_team,
            "away_team": away_team,
            "league": league,
            "is_live": is_live,
            "live_status_text": live_status_text,
            "live_minute": live_minute,
            "live_score": live_score,
            "noticias_recientes": noticias,
            "alineaciones_y_bajas": alineaciones,
            "fuentes_totales": todas_las_fuentes[:10]
        }

search_service = SearchService()
