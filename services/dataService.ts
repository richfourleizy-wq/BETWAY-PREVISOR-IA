
import { Match, HistoricalStat } from '../types';
import { INITIAL_MATCHES } from '../constants';

export class DataService {
  /**
   * Mock fetching matches from Betway API.
   * In a real app, this would use axios to call a proxy or Betway's public feed.
   */
  static async getLiveMatches(): Promise<Match[]> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...INITIAL_MATCHES];
  }

  static getTeamForm(teamName: string): HistoricalStat[] {
    // Generates realistic mock form data
    const results: ('W' | 'D' | 'L')[] = ['W', 'W', 'D', 'W', 'L'];
    return results.map((res, i) => ({
      date: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString().split('T')[0],
      score: res === 'W' ? '2-1' : (res === 'D' ? '1-1' : '0-2'),
      opponent: 'Random Rival ' + (i + 1),
      result: res
    }));
  }
}
