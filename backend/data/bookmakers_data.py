"""
Módulo de Integración y Comparación de Casas de Apuestas:
- Pinnacle Sports (Benchmark Sharp / Margen 2-3%)
- Caliente.mx (Líder en México / Liga MX)
- Bet365 (Líder Global)
- Betfair Exchange (Consenso de Dinero Profesional)
"""

BOOKMAKERS_DATA = {
    "bookmakers_info": [
        {
            "id": "pinnacle",
            "name": "Pinnacle Sports",
            "country": "Internacional",
            "margin_avg": "2.4%",
            "profile": "Casa Sharp (Sin limitación a ganadores, máxima liquidez)",
            "url": "https://www.pinnacle.com/es/soccer/matchups",
            "badge_color": "orange"
        },
        {
            "id": "caliente",
            "name": "Caliente.mx",
            "country": "México 🇲🇽",
            "margin_avg": "6.1%",
            "profile": "Casa Recreativa #1 de México (Momios Liga MX y promociones)",
            "url": "https://www.caliente.mx/deportes/futbol/",
            "badge_color": "red"
        },
        {
            "id": "bet365",
            "name": "Bet365",
            "country": "Global 🌐",
            "margin_avg": "5.2%",
            "profile": "Mayor variedad de mercados y líneas de gol en vivo",
            "url": "https://www.bet365.com/#/IP/B1",
            "badge_color": "emerald"
        },
        {
            "id": "betfair",
            "name": "Betfair Exchange",
            "country": "Reino Unido 🇬🇧",
            "margin_avg": "2.0% (Comisión)",
            "profile": "Bolsa de apuestas: refleja el volumen y dinero real de los apostadores",
            "url": "https://www.betfair.com/exchange/plus/football",
            "badge_color": "amber"
        }
    ],
    "odds_comparison": [
        {
            "id": "match-cruz-azul-mty",
            "partido": "Cruz Azul vs Monterrey",
            "liga": "Liga MX — Apertura",
            "mercado": "Victoria Local (Cruz Azul)",
            "cuota_justa_modelo": 1.92,
            "caliente": {
                "odds_decimal": 2.15,
                "odds_american": "+115",
                "margin": "6.2%",
                "url": "https://www.caliente.mx/deportes/futbol/mexico/liga-mx/"
            },
            "pinnacle": {
                "odds_decimal": 2.22,
                "odds_american": "+122",
                "margin": "2.3%",
                "url": "https://www.pinnacle.com/es/soccer/matchups"
            },
            "bet365": {
                "odds_decimal": 2.10,
                "odds_american": "+110",
                "margin": "5.5%",
                "url": "https://www.bet365.com/#/AC/B1/C1/D1002/E91823793/G40/"
            },
            "best_bookmaker": "Pinnacle (+122 / 2.22)",
            "ev_percent": "+15.6%",
            "line_movement": {
                "opening": 2.45,
                "current": 2.15,
                "trend": "down",
                "direction": "📉 Caída de cuota (-0.30) por fuerte volumen a Cruz Azul"
            },
            "stake_kelly": "3.5% del Bankroll ($350 MXN)"
        },
        {
            "id": "match-real-madrid-bayern",
            "partido": "Real Madrid vs Bayern Múnich",
            "liga": "UEFA Champions League",
            "mercado": "Ambos Anotan & Over 2.5",
            "cuota_justa_modelo": 1.74,
            "caliente": {
                "odds_decimal": 1.91,
                "odds_american": "-110",
                "margin": "6.0%",
                "url": "https://www.caliente.mx/deportes/futbol/champions-league/"
            },
            "pinnacle": {
                "odds_decimal": 1.98,
                "odds_american": "-102",
                "margin": "2.2%",
                "url": "https://www.pinnacle.com/es/soccer/champions-league/matchups"
            },
            "bet365": {
                "odds_decimal": 1.95,
                "odds_american": "-105",
                "margin": "4.8%",
                "url": "https://www.bet365.com/#/AC/B1/C1/D1002/E91823793/G40/"
            },
            "best_bookmaker": "Pinnacle (-102 / 1.98)",
            "ev_percent": "+13.7%",
            "line_movement": {
                "opening": 2.10,
                "current": 1.91,
                "trend": "down",
                "direction": "📉 Línea ajustada a la baja por respaldo masivo de goles"
            },
            "stake_kelly": "4.0% del Bankroll ($400 MXN)"
        },
        {
            "id": "match-salzburgo-milan",
            "partido": "Salzburgo vs AC Milan",
            "liga": "UEFA Champions League (J2)",
            "mercado": "Ambos Equipos Anotan (BTS)",
            "cuota_justa_modelo": 1.55,
            "caliente": {
                "odds_decimal": 1.70,
                "odds_american": "-143",
                "margin": "6.4%",
                "url": "https://www.caliente.mx/deportes/futbol/champions-league/"
            },
            "pinnacle": {
                "odds_decimal": 1.78,
                "odds_american": "-128",
                "margin": "2.5%",
                "url": "https://www.pinnacle.com/es/soccer/champions-league/matchups"
            },
            "bet365": {
                "odds_decimal": 1.72,
                "odds_american": "-139",
                "margin": "5.1%",
                "url": "https://www.bet365.com/#/IP/B1"
            },
            "best_bookmaker": "Pinnacle (-128 / 1.78)",
            "ev_percent": "+14.8%",
            "line_movement": {
                "opening": 1.85,
                "current": 1.70,
                "trend": "down",
                "direction": "📉 Dinero profesional entrando al BTS tras la derrota del Milan en J1"
            },
            "stake_kelly": "4.5% del Bankroll ($450 MXN)"
        },
        {
            "id": "match-benfica-celtic",
            "partido": "Benfica vs Celtic",
            "liga": "UEFA Champions League (J2)",
            "mercado": "Victoria Benfica ML",
            "cuota_justa_modelo": 1.45,
            "caliente": {
                "odds_decimal": 1.57,
                "odds_american": "-175",
                "margin": "5.9%",
                "url": "https://www.caliente.mx/deportes/futbol/champions-league/"
            },
            "pinnacle": {
                "odds_decimal": 1.63,
                "odds_american": "-159",
                "margin": "2.1%",
                "url": "https://www.pinnacle.com/es/soccer/champions-league/matchups"
            },
            "bet365": {
                "odds_decimal": 1.60,
                "odds_american": "-167",
                "margin": "4.9%",
                "url": "https://www.bet365.com/#/IP/B1"
            },
            "best_bookmaker": "Pinnacle (-159 / 1.63)",
            "ev_percent": "+12.4%",
            "line_movement": {
                "opening": 1.70,
                "current": 1.57,
                "trend": "down",
                "direction": "📉 Benfica respaldado por su victoria 2-0 ante el Milan en San Siro"
            },
            "stake_kelly": "5.0% del Bankroll ($500 MXN)"
        },
        {
            "id": "match-arsenal-city",
            "partido": "Arsenal vs Manchester City",
            "liga": "Premier League",
            "mercado": "Menos de 2.5 Goles",
            "cuota_justa_modelo": 1.88,
            "caliente": {
                "odds_decimal": 2.05,
                "odds_american": "+105",
                "margin": "6.3%",
                "url": "https://www.caliente.mx/deportes/futbol/inglaterra/premier-league/"
            },
            "pinnacle": {
                "odds_decimal": 2.14,
                "odds_american": "+114",
                "margin": "2.4%",
                "url": "https://www.pinnacle.com/es/soccer/matchups"
            },
            "bet365": {
                "odds_decimal": 2.08,
                "odds_american": "+108",
                "margin": "5.0%",
                "url": "https://www.bet365.com/#/AC/B1/C1/D1002/E91823793/G40/"
            },
            "best_bookmaker": "Pinnacle (+114 / 2.14)",
            "ev_percent": "+13.8%",
            "line_movement": {
                "opening": 2.25,
                "current": 2.05,
                "trend": "down",
                "direction": "📉 Cierre defensivo anticipado de Arteta y Guardiola"
            },
            "stake_kelly": "3.0% del Bankroll ($300 MXN)"
        }
    ]
}
