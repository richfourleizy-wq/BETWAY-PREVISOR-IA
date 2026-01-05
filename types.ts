
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  odds: MatchOdds;
  previousOdds?: MatchOdds;
  score?: {
    home: number;
    away: number;
  };
  stats?: {
    possession: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    dangerousAttacks: [number, number];
  };
}

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

export interface PredictionResult {
  matchId: string;
  probability: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  recommendedBet: string;
  confidenceScore: number;
  aiAnalysis: string;
  predictedScore: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface HistoricalStat {
  date: string;
  score: string;
  opponent: string;
  result: 'W' | 'D' | 'L';
}
