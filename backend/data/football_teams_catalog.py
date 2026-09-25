"""
Catálogo enriquecido de clubes de fútbol, torneos, imágenes oficiales,
estado de clasificación a copas actuales (Champions, Libertadores, Liguilla Liga MX)
y jugadores clave para alimentar las ventanas emergentes del Agente de IA.
"""

from typing import Dict, Any, Optional

TEAMS_CATALOG: Dict[str, Dict[str, Any]] = {
    # ─── LIGA MX ──────────────────────────────────────────────────────────────
    "cruz azul": {
        "id": "cruz-azul",
        "name": "Cruz Azul",
        "short_name": "Cruz Azul",
        "country": "México 🇲🇽",
        "league": "Liga MX",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cruz_Azul_logo.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/218.png",
        "color": "#003399",
        "stadium": "Estadio Ciudad de los Deportes (CDMX)",
        "current_cup_status": "🏆 Concacaf Champions Cup & Liderato General Liga MX (Puesto #1 - 37 pts)",
        "is_cup_qualified": True,
        "cup_name": "Concacaf Champions Cup / Liguilla Directa",
        "league_position": "1º Lugar (Líder)",
        "points": 37,
        "form": ["V", "V", "V", "E", "V"],
        "key_players": [
            {
                "name": "Giorgos Giakoumakis",
                "position": "Delantero Centro",
                "number": 9,
                "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Goleador en racha"
            },
            {
                "name": "Carlos Rotondi",
                "position": "Extremo / Carrilero",
                "number": 29,
                "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Máximo asistidor"
            },
            {
                "name": "Gonzalo Piovi",
                "position": "Defensa Central",
                "number": 33,
                "photo": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80",
                "status": "Líder defensivo"
            }
        ],
        "injuries": [
            {"player": "Gabriel Fernández (Toro)", "reason": "Fase final de recuperación de ligamento cruzado", "status": "Duda médica"}
        ]
    },
    "monterrey": {
        "id": "monterrey",
        "name": "CF Monterrey (Rayados)",
        "short_name": "Rayados",
        "country": "México 🇲🇽",
        "league": "Liga MX",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/f/ff/CF_Monterrey_logo.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/225.png",
        "color": "#002B49",
        "stadium": "Estadio BBVA (Monterrey)",
        "current_cup_status": "🏆 Mundial de Clubes FIFA 2025 & Zona de Liguilla Liga MX (Puesto #3 - 31 pts)",
        "is_cup_qualified": True,
        "cup_name": "Mundial de Clubes FIFA 2025",
        "league_position": "3º Lugar",
        "points": 31,
        "form": ["V", "E", "V", "D", "V"],
        "key_players": [
            {
                "name": "Germán Berterame",
                "position": "Delantero Centro",
                "number": 9,
                "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Referente de área"
            },
            {
                "name": "Sergio Canales",
                "position": "Mediocampista Ofensivo",
                "number": 10,
                "photo": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80",
                "status": "Motor creativo del equipo"
            },
            {
                "name": "Lucas Ocampos",
                "position": "Extremo",
                "number": 29,
                "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80",
                "status": "Desequilibrio por banda"
            }
        ],
        "injuries": [
            {"player": "Jordi Cortizo", "reason": "Molestia muscular en gemelo", "status": "Duda para el partido"}
        ]
    },
    "club america": {
        "id": "america",
        "name": "Club América",
        "short_name": "América",
        "country": "México 🇲🇽",
        "league": "Liga MX",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/6/60/Club_Am%C3%A9rica_logo.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/227.png",
        "color": "#FFF000",
        "stadium": "Estadio Azteca / Ciudad de los Deportes",
        "current_cup_status": "🏆 Bicampeón Liga MX & Clasificado a Concacaf Champions Cup",
        "is_cup_qualified": True,
        "cup_name": "Concacaf Champions Cup",
        "league_position": "4º Lugar",
        "points": 28,
        "form": ["V", "V", "E", "V", "D"],
        "key_players": [
            {"name": "Henry Martín", "position": "Delantero", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "Capitán y goleador"},
            {"name": "Álvaro Fidalgo", "position": "Mediocentro", "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80", "status": "Distribuidor clave"}
        ],
        "injuries": [
            {"player": "Sebastián Cáceres", "reason": "Distensión muscular en muslo", "status": "Baja confirmada"}
        ]
    },
    "chivas": {
        "id": "chivas",
        "name": "CD Guadalajara (Chivas)",
        "short_name": "Chivas",
        "country": "México 🇲🇽",
        "league": "Liga MX",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Club_Deportivo_Guadalajara_logo.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/217.png",
        "color": "#CC0000",
        "stadium": "Estadio Akron (Guadalajara)",
        "current_cup_status": "🏆 Clasificado a Concacaf Champions Cup 2025 / Zona Play-In Liga MX",
        "is_cup_qualified": True,
        "cup_name": "Concacaf Champions Cup",
        "league_position": "7º Lugar",
        "points": 25,
        "form": ["V", "D", "V", "E", "D"],
        "key_players": [
            {"name": "Roberto Alvarado", "position": "Extremo", "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80", "status": "Referente de ataque"},
            {"name": "Javier 'Chicharito' Hernández", "position": "Delantero", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "En proceso de ritmo físico"}
        ],
        "injuries": [
            {"player": "Gilberto Sepúlveda", "reason": "Sobrecarga en tobillo", "status": "Duda médica"}
        ]
    },

    # ─── UEFA CHAMPIONS LEAGUE / EUROPA ───────────────────────────────────────
    "real madrid": {
        "id": "real-madrid",
        "name": "Real Madrid CF",
        "short_name": "Real Madrid",
        "country": "España 🇪🇸",
        "league": "La Liga / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/86.png",
        "color": "#FFFFFF",
        "stadium": "Estadio Santiago Bernabéu (Madrid)",
        "current_cup_status": "🏆 Vigente Campeón UEFA Champions League (15 Copas) & Fase de Liga Suiza (Puesto #2)",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "2º en La Liga (31 pts) / 2º en UCL",
        "points": 31,
        "form": ["V", "V", "V", "E", "V"],
        "key_players": [
            {
                "name": "Vinícius Júnior",
                "position": "Extremo Izquierdo",
                "number": 7,
                "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Balón de Oro Contender"
            },
            {
                "name": "Kylian Mbappé",
                "position": "Delantero",
                "number": 9,
                "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Máximo goleador del plantel"
            },
            {
                "name": "Jude Bellingham",
                "position": "Mediocampista",
                "number": 5,
                "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Organizador de juego"
            }
        ],
        "injuries": [
            {"player": "Dani Carvajal", "reason": "Rotura de ligamento cruzado anterior", "status": "Baja de larga duración"},
            {"player": "David Alaba", "reason": "Fase final de recuperación de rodilla", "status": "Baja confirmada"}
        ]
    },
    "bayern munich": {
        "id": "bayern-munich",
        "name": "FC Bayern Múnich",
        "short_name": "Bayern Múnich",
        "country": "Alemania 🇩🇪",
        "league": "Bundesliga / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/132.png",
        "color": "#DC052D",
        "stadium": "Allianz Arena (Múnich)",
        "current_cup_status": "🏆 Clasificado a UEFA Champions League (6 títulos) & Líder de Bundesliga",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "1º en Bundesliga (29 pts)",
        "points": 29,
        "form": ["V", "V", "E", "V", "V"],
        "key_players": [
            {
                "name": "Harry Kane",
                "position": "Delantero Centro",
                "number": 9,
                "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80",
                "status": "Bota de Oro • Promedio 1.2 goles/partido"
            },
            {
                "name": "Jamal Musiala",
                "position": "Mediapunta",
                "number": 42,
                "photo": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80",
                "status": "Titular • Desequilibrio absoluto"
            },
            {
                "name": "Michael Olise",
                "position": "Extremo Derecho",
                "number": 17,
                "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
                "status": "Gran momento ofensivo"
            }
        ],
        "injuries": [
            {"player": "Hiroki Ito", "reason": "Recuperación de fractura de metatarso", "status": "Baja confirmada"},
            {"player": "Josip Stanišić", "reason": "Ligamento colateral de rodilla", "status": "Baja confirmada"}
        ]
    },
    "barcelona": {
        "id": "barcelona",
        "name": "FC Barcelona",
        "short_name": "FC Barcelona",
        "country": "España 🇪🇸",
        "league": "La Liga / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/83.png",
        "color": "#004D98",
        "stadium": "Estadi Olímpic Lluís Companys (Montjuïc)",
        "current_cup_status": "🏆 Líder de La Liga & Clasificado a UEFA Champions League (Fase de Liga - Puesto #3)",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "1º en La Liga (34 pts)",
        "points": 34,
        "form": ["V", "V", "V", "V", "D"],
        "key_players": [
            {"name": "Lamine Yamal", "position": "Extremo Derecho", "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80", "status": "Estrella emergente mundial"},
            {"name": "Robert Lewandowski", "position": "Delantero", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "Pichichi de La Liga (14 goles)"},
            {"name": "Raphinha", "position": "Extremo / Capitán", "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80", "status": "Racha goleadora y asistencias"}
        ],
        "injuries": [
            {"player": "Marc-André ter Stegen", "reason": "Rotura de tendón rotuliano", "status": "Baja toda la temporada"},
            {"player": "Ronald Araújo", "reason": "Fase final de recuperación de isquiotibiales", "status": "Baja confirmada"}
        ]
    },
    "atletico madrid": {
        "id": "atletico-madrid",
        "name": "Atlético de Madrid",
        "short_name": "Atlético",
        "country": "España 🇪🇸",
        "league": "La Liga / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/1068.png",
        "color": "#CB3524",
        "stadium": "Riyadh Air Metropolitano (Madrid)",
        "current_cup_status": "🏆 Clasificado a UEFA Champions League & Mundial de Clubes FIFA 2025",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "3º en La Liga (26 pts)",
        "points": 26,
        "form": ["V", "V", "E", "D", "V"],
        "key_players": [
            {"name": "Antoine Griezmann", "position": "Mediapunta", "photo": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80", "status": "Líder indiscutible"},
            {"name": "Julián Álvarez", "position": "Delantero", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "Goleador clave"}
        ],
        "injuries": [
            {"player": "Robin Le Normand", "reason": "Traumatismo craneoencefálico en recuperación", "status": "Duda médica"}
        ]
    },
    "arsenal": {
        "id": "arsenal",
        "name": "Arsenal FC",
        "short_name": "Arsenal",
        "country": "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "league": "Premier League / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/359.png",
        "color": "#EF0107",
        "stadium": "Emirates Stadium (Londres)",
        "current_cup_status": "🏆 Clasificado a UEFA Champions League & Top 3 Premier League",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "3º en Premier League (22 pts)",
        "points": 22,
        "form": ["V", "E", "D", "V", "E"],
        "key_players": [
            {"name": "Bukayo Saka", "position": "Extremo Derecho", "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80", "status": "Desequilibrio y gol"},
            {"name": "Martin Ødegaard", "position": "Capitán / Volante", "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80", "status": "Retorno de lesión, alta médica"}
        ],
        "injuries": [
            {"player": "Riccardo Calafiori", "reason": "Lesión de rodilla", "status": "Baja médica"}
        ]
    },
    "manchester city": {
        "id": "manchester-city",
        "name": "Manchester City FC",
        "short_name": "Man City",
        "country": "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "league": "Premier League / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/382.png",
        "color": "#6CABDD",
        "stadium": "Etihad Stadium (Manchester)",
        "current_cup_status": "🏆 Campeón de Premier League & Clasificado a UEFA Champions League (Fase de Liga)",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "2º en Premier League (23 pts)",
        "points": 23,
        "form": ["D", "D", "V", "V", "E"],
        "key_players": [
            {"name": "Erling Haaland", "position": "Delantero", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "Máximo goleador Premier League"},
            {"name": "Phil Foden", "position": "Volante Ofensivo", "photo": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80", "status": "Titular"}
        ],
        "injuries": [
            {"player": "Rodri Hernández (Balón de Oro)", "reason": "Rotura de ligamento cruzado", "status": "Baja toda la temporada"},
            {"player": "Kevin De Bruyne", "reason": "En proceso de ritmo físico progresivo", "status": "Disponible"}
        ]
    },
    "juventus": {
        "id": "juventus",
        "name": "Juventus FC",
        "short_name": "Juventus",
        "country": "Italia 🇮🇹",
        "league": "Serie A / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/111.png",
        "color": "#000000",
        "stadium": "Allianz Stadium (Turín)",
        "current_cup_status": "🏆 Líder Jornada 1 UEFA SoccerStats (5-0 vs NEC) & Invicto Serie A",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Puesto #1 en Fase Liga)",
        "league_position": "4º en Serie A (Invicto)",
        "points": 24,
        "form": ["V", "E", "V", "E", "V"],
        "key_players": [
            {"name": "Dušan Vlahović", "position": "Delantero Centro", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "Goleador bianconero"},
            {"name": "Kenan Yıldız", "position": "Mediapunta", "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80", "status": "Joven promesa #10"}
        ],
        "injuries": [
            {"player": "Bremer", "reason": "Rotura de ligamento cruzado", "status": "Baja de larga duración"}
        ]
    },
    "ac milan": {
        "id": "ac-milan",
        "name": "AC Milan",
        "short_name": "Milan",
        "country": "Italia 🇮🇹",
        "league": "Serie A / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/103.png",
        "color": "#FB090B",
        "stadium": "San Siro / Giuseppe Meazza",
        "current_cup_status": "🏆 Clasificado a UEFA Champions League (7 Copas de Europa)",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "6º en Serie A",
        "points": 21,
        "form": ["D", "V", "D", "V", "E"],
        "key_players": [
            {"name": "Rafael Leão", "position": "Extremo Izquierdo", "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80", "status": "Titular de alto desequilibrio"},
            {"name": "Christian Pulisic", "position": "Extremo / Mediapunta", "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80", "status": "Goleador de la temporada (7 goles)"}
        ],
        "injuries": [
            {"player": "Ismaël Bennacer", "reason": "Lesión muscular en gemelo", "status": "Baja confirmada"}
        ]
    },
    "psg": {
        "id": "psg",
        "name": "Paris Saint-Germain",
        "short_name": "PSG",
        "country": "Francia 🇫🇷",
        "league": "Ligue 1 / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/160.png",
        "color": "#004170",
        "stadium": "Parc des Princes (París)",
        "current_cup_status": "🏆 Líder de Ligue 1 & Clasificado a UEFA Champions League",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga)",
        "league_position": "1º en Ligue 1 (29 pts)",
        "points": 29,
        "form": ["V", "V", "V", "E", "V"],
        "key_players": [
            {"name": "Bradley Barcola", "position": "Extremo", "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80", "status": "Máximo anotador de Ligue 1"},
            {"name": "Ousmane Dembélé", "position": "Extremo", "photo": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&auto=format&fit=crop&q=80", "status": "Titular"}
        ],
        "injuries": [
            {"player": "Gonçalo Ramos", "reason": "Lesión de tobillo", "status": "Baja confirmada"}
        ]
    },
    "liverpool": {
        "id": "liverpool",
        "name": "Liverpool FC",
        "short_name": "Liverpool",
        "country": "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "league": "Premier League / UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
        "fallback_logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/364.png",
        "color": "#C8102E",
        "stadium": "Anfield (Liverpool)",
        "current_cup_status": "🏆 Líder de Premier League & Invictos en UEFA Champions League",
        "is_cup_qualified": True,
        "cup_name": "UEFA Champions League (Fase de Liga - Puesto #1)",
        "league_position": "1º en Premier League (28 pts)",
        "points": 28,
        "form": ["V", "V", "V", "V", "E"],
        "key_players": [
            {"name": "Mohamed Salah", "position": "Extremo Derecho", "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80", "status": "Goleador y figura absoluta"},
            {"name": "Virgil van Dijk", "position": "Defensa Central", "photo": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80", "status": "Capitán y baluarte defensivo"}
        ],
        "injuries": [
            {"player": "Alisson Becker", "reason": "Lesión en isquiotibiales", "status": "Baja médica"}
        ]
    }
}

TOURNAMENTS_INFO = {
    "champions league": {
        "name": "UEFA Champions League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg",
        "badge_color": "blue",
        "category": "Continental Élite",
        "format": "Fase de Liga Suiza (36 Clubes)"
    },
    "uefa": {
        "name": "UEFA Champions League / Europa League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg",
        "badge_color": "blue",
        "category": "Continental Élite",
        "format": "Fase de Liga Suiza (36 Clubes)"
    },
    "liga mx": {
        "name": "Liga MX — Primera División",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/0/00/Liga_MX_logo.svg",
        "badge_color": "emerald",
        "category": "Nacional México",
        "format": "Torneo Regular + Liguilla Directa / Play-In"
    },
    "premier league": {
        "name": "Premier League",
        "logo": "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        "badge_color": "purple",
        "category": "Nacional Inglaterra",
        "format": "Liga Regular (38 Jornadas)"
    },
    "la liga": {
        "name": "La Liga EA Sports",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_EA_Sports_2023_Logo.svg",
        "badge_color": "rose",
        "category": "Nacional España",
        "format": "Liga Regular (38 Jornadas)"
    },
    "copa libertadores": {
        "name": "Copa CONMEBOL Libertadores",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/8/87/Copa_Libertadores_logo.svg",
        "badge_color": "amber",
        "category": "Continental Sudamérica",
        "format": "Fase de Grupos y Eliminación Directa"
    }
}

def find_team_info(team_name: str) -> Dict[str, Any]:
    """
    Busca inteligentemente un equipo en el catálogo con coincidencia difusa,
    o genera un perfil verosímil y estructurado si no está en el catálogo estático.
    """
    if not team_name:
        return _generate_generic_team("Equipo")

    clean_name = team_name.lower().strip()
    
    # Búsqueda exacta y por inclusión
    for key, data in TEAMS_CATALOG.items():
        if key in clean_name or clean_name in key or data["name"].lower() in clean_name or data["short_name"].lower() in clean_name:
            return data

    # Mapeos por alias populares
    aliases = {
        "madrid": "real madrid",
        "merengue": "real madrid",
        "bayern": "bayern munich",
        "bavaro": "bayern munich",
        "barca": "barcelona",
        "barça": "barcelona",
        "blaugrana": "barcelona",
        "atleti": "atletico madrid",
        "colchonero": "atletico madrid",
        "gunners": "arsenal",
        "city": "manchester city",
        "citizens": "manchester city",
        "juve": "juventus",
        "bianconero": "juventus",
        "rossoneri": "ac milan",
        "milan": "ac milan",
        "reds": "liverpool",
        "rayados": "monterrey",
        "la maquina": "cruz azul",
        "águilas": "club america",
        "aguilas": "club america",
        "rebaño": "chivas"
    }
    
    for alias, target_key in aliases.items():
        if alias in clean_name:
            if target_key in TEAMS_CATALOG:
                return TEAMS_CATALOG[target_key]

    # Generación dinámica inteligente para equipos no pre-cargados
    return _generate_generic_team(team_name)

def _generate_generic_team(name: str) -> Dict[str, Any]:
    """Genera perfil para un equipo dinámico no precargado."""
    initials = "".join([w[0].upper() for w in name.split()[:2]]) or "FC"
    return {
        "id": name.lower().replace(" ", "-"),
        "name": name,
        "short_name": name,
        "country": "Fútbol Internacional 🌐",
        "league": "Liga Profesional",
        "logo": f"https://ui-avatars.com/api/?name={initials}&background=0284c7&color=fff&size=128&bold=true",
        "fallback_logo": f"https://ui-avatars.com/api/?name={initials}&background=0284c7&color=fff&size=128&bold=true",
        "color": "#0284c7",
        "stadium": f"Estadio de {name}",
        "current_cup_status": "🏆 En competencia activa de liga y copas continentales",
        "is_cup_qualified": True,
        "cup_name": "Competición Oficial Activa",
        "league_position": "En tabla competitiva",
        "points": "Activo",
        "form": ["V", "E", "V", "E", "V"],
        "key_players": [
            {
                "name": f"Capitán de {name}",
                "position": "Volante / Delantero",
                "number": 10,
                "photo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80",
                "status": "Titular indiscutible"
            },
            {
                "name": f"Goleador de {name}",
                "position": "Delantero Centro",
                "number": 9,
                "photo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
                "status": "En racha ofensiva"
            }
        ],
        "injuries": [
            {"player": "Informe médico en evolución", "reason": "Monitoreo físico preventivo", "status": "En evaluación"}
        ]
    }

def find_tournament_info(league_name: Optional[str]) -> Dict[str, Any]:
    """Identifica el torneo y sus insignias oficiales."""
    if not league_name:
        return TOURNAMENTS_INFO["champions league"]

    l_clean = league_name.lower()
    for key, data in TOURNAMENTS_INFO.items():
        if key in l_clean or l_clean in key:
            return data

    return {
        "name": league_name,
        "logo": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg",
        "badge_color": "emerald",
        "category": "Fútbol Profesional",
        "format": "Torneo Oficial"
    }
