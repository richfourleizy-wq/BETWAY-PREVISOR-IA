
import { Match } from './types';

export const INITIAL_MATCHES: Match[] = [
  // Ligas Europeias
  { id: 'm1', homeTeam: 'Benfica', awayTeam: 'Sporting CP', league: 'Liga Portugal', startTime: new Date(Date.now() + 3600000).toISOString(), status: 'SCHEDULED', odds: { home: 2.10, draw: 3.40, away: 3.20 } },
  { 
    id: 'm2', 
    homeTeam: 'Real Madrid', 
    awayTeam: 'Barcelona', 
    league: 'La Liga', 
    startTime: new Date().toISOString(), 
    status: 'LIVE', 
    score: { home: 1, away: 0 }, 
    odds: { home: 1.65, draw: 4.00, away: 5.50 },
    stats: {
      possession: [55, 45],
      shotsOnTarget: [4, 2],
      corners: [5, 3],
      dangerousAttacks: [42, 38]
    }
  },
  { id: 'm3', homeTeam: 'Man City', awayTeam: 'Liverpool', league: 'Premier League', startTime: new Date(Date.now() + 7200000).toISOString(), status: 'SCHEDULED', odds: { home: 1.85, draw: 3.80, away: 4.20 } },
  { id: 'm4', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', startTime: new Date(Date.now() + 14400000).toISOString(), status: 'SCHEDULED', odds: { home: 1.50, draw: 4.50, away: 6.00 } },
  { id: 'm5', homeTeam: 'Juventus', awayTeam: 'Inter Milan', league: 'Serie A', startTime: new Date(Date.now() + 18000000).toISOString(), status: 'SCHEDULED', odds: { home: 2.40, draw: 3.20, away: 2.90 } },
  { id: 'm6', homeTeam: 'PSG', awayTeam: 'Marseille', league: 'Ligue 1', startTime: new Date(Date.now() + 21600000).toISOString(), status: 'SCHEDULED', odds: { home: 1.40, draw: 5.00, away: 7.50 } },
  
  // Ligas Africanas
  { 
    id: 'm7', 
    homeTeam: 'Black Bulls', 
    awayTeam: 'Fer. Maputo', 
    league: 'Moçambola', 
    startTime: new Date().toISOString(), 
    status: 'LIVE', 
    score: { home: 2, away: 2 }, 
    odds: { home: 2.10, draw: 2.80, away: 3.50 },
    stats: {
      possession: [50, 50],
      shotsOnTarget: [6, 7],
      corners: [4, 5],
      dangerousAttacks: [55, 61]
    }
  },
  { id: 'm8', homeTeam: 'Costa do Sol', awayTeam: 'UD Songo', league: 'Moçambola', startTime: new Date(Date.now() + 5000000).toISOString(), status: 'SCHEDULED', odds: { home: 2.20, draw: 3.00, away: 3.20 } },
  { id: 'm9', homeTeam: 'Al Ahly', awayTeam: 'Zamalek', league: 'Egipto Premier', startTime: new Date(Date.now() + 9000000).toISOString(), status: 'SCHEDULED', odds: { home: 1.90, draw: 3.30, away: 4.10 } },
  { id: 'm10', homeTeam: 'Mamelodi Sundowns', awayTeam: 'Orlando Pirates', league: 'PSL África do Sul', startTime: new Date(Date.now() + 3000000).toISOString(), status: 'SCHEDULED', odds: { home: 1.75, draw: 3.40, away: 5.00 } },
  
  // Américas
  { id: 'm11', homeTeam: 'Flamengo', awayTeam: 'Palmeiras', league: 'Brasileirão', startTime: new Date(Date.now() + 12000000).toISOString(), status: 'SCHEDULED', odds: { home: 2.05, draw: 3.25, away: 3.60 } },
  { id: 'm12', homeTeam: 'River Plate', awayTeam: 'Boca Juniors', league: 'Argentina Superliga', startTime: new Date(Date.now() + 15000000).toISOString(), status: 'SCHEDULED', odds: { home: 2.15, draw: 3.10, away: 3.40 } },
  { id: 'm13', homeTeam: 'Inter Miami', awayTeam: 'LA Galaxy', league: 'MLS', startTime: new Date(Date.now() + 25000000).toISOString(), status: 'SCHEDULED', odds: { home: 1.80, draw: 3.90, away: 4.00 } },
  
  // Ásia e Outros
  { 
    id: 'm14', 
    homeTeam: 'Al-Hilal', 
    awayTeam: 'Al-Nassr', 
    league: 'Saudi Pro League', 
    startTime: new Date().toISOString(), 
    status: 'LIVE', 
    score: { home: 0, away: 1 }, 
    odds: { home: 2.50, draw: 3.50, away: 2.60 },
    stats: {
      possession: [48, 52],
      shotsOnTarget: [2, 5],
      corners: [3, 2],
      dangerousAttacks: [31, 45]
    }
  },
  { id: 'm15', homeTeam: 'Vissel Kobe', awayTeam: 'Yokohama F.', league: 'J-League', startTime: new Date(Date.now() + 43200000).toISOString(), status: 'SCHEDULED', odds: { home: 2.30, draw: 3.20, away: 3.10 } },
  { id: 'm16', homeTeam: 'Sydney FC', awayTeam: 'Melbourne Victory', league: 'A-League', startTime: new Date(Date.now() + 36000000).toISOString(), status: 'SCHEDULED', odds: { home: 2.25, draw: 3.40, away: 3.00 } },
  { id: 'm17', homeTeam: 'Celtic', awayTeam: 'Rangers', league: 'Scottish Premiership', startTime: new Date(Date.now() + 10800000).toISOString(), status: 'SCHEDULED', odds: { home: 2.00, draw: 3.50, away: 3.60 } },
  { id: 'm18', homeTeam: 'Ajax', awayTeam: 'PSV', league: 'Eredivisie', startTime: new Date(Date.now() + 14400000).toISOString(), status: 'SCHEDULED', odds: { home: 2.45, draw: 3.60, away: 2.70 } },
  { id: 'm19', homeTeam: 'Porto', awayTeam: 'Braga', league: 'Liga Portugal', startTime: new Date(Date.now() + 18000000).toISOString(), status: 'SCHEDULED', odds: { home: 1.60, draw: 3.90, away: 5.25 } },
  { id: 'm20', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahce', league: 'Super Lig Turquia', startTime: new Date(Date.now() + 7200000).toISOString(), status: 'SCHEDULED', odds: { home: 2.10, draw: 3.30, away: 3.40 } }
];

export const APP_THEME = {
  primary: '#00cc66', 
  secondary: '#1e293b',
  accent: '#3b82f6',
  danger: '#ef4444',
  warning: '#f59e0b'
};
