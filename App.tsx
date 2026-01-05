
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import PredictionView from './components/PredictionView';
import Login from './components/Login';
import { DataService } from './services/dataService';
import { GeminiService } from './services/geminiService';
import { Match, PredictionResult } from './types';

const ITEMS_PER_PAGE = 6;
const STORAGE_KEY = 'betway_ai_user_session';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'painel' | 'direto' | 'historico' | 'docs'>('painel');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const init = async () => {
      try {
        setLoadingMatches(true);
        const data = await DataService.getLiveMatches();
        setMatches(data);
      } catch (err) {
        setError('Falha ao carregar o feed em tempo real da Betway.');
      } finally {
        setLoadingMatches(false);
      }
    };
    init();
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, currentView, selectedLeague]);

  const leagues = useMemo(() => {
    const uniqueLeagues = Array.from(new Set(matches.map(m => m.league))).sort();
    return ['all', ...uniqueLeagues];
  }, [matches]);

  useEffect(() => {
    if (matches.length === 0 || !isAuthenticated) return;

    const interval = setInterval(() => {
      setMatches(prevMatches => 
        prevMatches.map(match => {
          if (Math.random() > 0.85) {
            return {
              ...match,
              previousOdds: { ...match.odds },
              odds: {
                home: Number((match.odds.home * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2)),
                draw: Number((match.odds.draw * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2)),
                away: Number((match.odds.away * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2)),
              }
            };
          }
          return match;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [matches.length, isAuthenticated]);

  const filteredMatches = useMemo(() => {
    let result = [...matches];

    if (currentView === 'direto') {
      result = result.filter(m => m.status === 'LIVE');
    }

    if (selectedLeague !== 'all') {
      result = result.filter(m => m.league === selectedLeague);
    }

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(match => 
        match.homeTeam.toLowerCase().includes(query) || 
        match.awayTeam.toLowerCase().includes(query) || 
        match.league.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [matches, searchQuery, currentView, selectedLeague]);

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / ITEMS_PER_PAGE));
  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMatches.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMatches, currentPage]);

  const handleLogin = (userData: { name: string; email: string }, remember: boolean) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedMatch(null);
    setPrediction(null);
  };

  const handleMatchSelect = async (match: Match) => {
    if (selectedMatch?.id === match.id) {
      setSelectedMatch(null);
      setPrediction(null);
      return;
    }
    
    setSelectedMatch(match);
    setPrediction(null);
    setLoadingPrediction(true);
    
    try {
      const result = await GeminiService.getPrediction(match);
      setPrediction(result);
    } catch (err) {
      setError('Erro no motor de previsão IA.');
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleNavigate = (view: 'painel' | 'direto' | 'historico' | 'docs') => {
    setCurrentView(view);
    setSearchQuery('');
    setSelectedLeague('all');
    if (view === 'painel') {
      setSelectedMatch(null);
      setPrediction(null);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Navbar onNavigate={handleNavigate} onLogout={handleLogout} user={user} currentView={currentView} />
      
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden">
        <aside className="w-full md:w-[380px] border-r border-slate-800 bg-slate-900/30 overflow-y-auto custom-scrollbar flex flex-col shadow-2xl z-20">
          <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-sm tracking-widest uppercase">
                {currentView === 'direto' ? 'Em Direto' : 'Todas as Ligas'}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 uppercase font-black">AI ACTIVE</span>
                <div className="w-8 h-4 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <i className="fas fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs transition-colors group-focus-within:text-green-500"></i>
                <select 
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all cursor-pointer text-slate-300"
                >
                  <option value="all">TODAS AS LIGAS DO MUNDO</option>
                  {leagues.filter(l => l !== 'all').map(league => (
                    <option key={league} value={league}>{league.toUpperCase()}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none"></i>
              </div>

              <div className="relative group">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm transition-colors group-focus-within:text-green-500"></i>
                <input 
                  type="text" 
                  placeholder="Pesquisar equipa ou jogo..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-slate-500 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            {loadingMatches ? (
              <div className="space-y-4">
                {[1,2,3,4,5,6].map(n => (
                  <div key={n} className="h-32 bg-slate-800/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {paginatedMatches.map(match => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      isSelected={selectedMatch?.id === match.id}
                      onSelect={handleMatchSelect}
                      prediction={selectedMatch?.id === match.id ? prediction : null}
                      loadingPrediction={selectedMatch?.id === match.id ? loadingPrediction : false}
                    />
                  ))}
                  
                  {!loadingMatches && filteredMatches.length === 0 && (
                    <div className="text-center py-20 flex flex-col items-center space-y-3 opacity-50">
                      <i className="fas fa-globe-africa text-3xl text-slate-600"></i>
                      <div className="text-sm text-slate-500">Sem jogos disponíveis de momento.</div>
                    </div>
                  )}
                </div>

                {filteredMatches.length > ITEMS_PER_PAGE && (
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="flex-1 mr-2 px-3 py-2 bg-slate-800 rounded-lg text-xs font-bold uppercase disabled:opacity-20 hover:bg-slate-700 transition-colors"
                    >
                      <i className="fas fa-chevron-left mr-2"></i> Anterior
                    </button>
                    <div className="text-[10px] font-mono text-slate-500 px-2">
                      {currentPage}/{totalPages}
                    </div>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="flex-1 ml-2 px-3 py-2 bg-slate-800 rounded-lg text-xs font-bold uppercase disabled:opacity-20 hover:bg-slate-700 transition-colors"
                    >
                      Próximo <i className="fas fa-chevron-right ml-2"></i>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 relative">
          {error && (
            <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center shadow-lg animate-bounce z-30">
              <i className="fas fa-exclamation-circle mr-3"></i>
              <span>{error}</span>
            </div>
          )}
          
          {selectedMatch ? (
            <PredictionView 
              match={selectedMatch} 
              prediction={prediction}
              loading={loadingPrediction}
            />
          ) : (
            <div className="p-10 space-y-12 animate-fadeIn max-w-5xl mx-auto">
              <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold tracking-widest uppercase mb-4">
                  Powered by Gemini 3 Pro
                </div>
                <h1 className="text-6xl font-black tracking-tighter leading-none uppercase">
                  A Tua Vantagem <span className="text-green-500 underline decoration-4 underline-offset-8">Inteligente</span>
                </h1>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Bem-vindo de volta, <span className="text-white font-bold">{user?.name}</span>. Analise os mercados globais com precisão matemática.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div onClick={() => handleNavigate('direto')} className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-green-500/50 cursor-pointer transition-all hover:bg-slate-900 group shadow-lg">
                  <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-bolt text-green-500 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold mb-3">Live Analysis</h3>
                  <p className="text-sm text-slate-400">Análise em milissegundos de jogos em curso para previsões de mercados "In-Play".</p>
                </div>
                <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:bg-slate-900 group shadow-lg">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-microchip text-blue-500 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold mb-3">Redes Neuronais</h3>
                  <p className="text-sm text-slate-400">Processamento de centenas de variáveis: clima, lesões e historial tático.</p>
                </div>
                <div onClick={() => handleNavigate('historico')} className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:bg-slate-900 group shadow-lg">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-chart-line text-purple-500 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold mb-3">Value Betting</h3>
                  <p className="text-sm text-slate-400">Encontre discrepâncias entre as odds da Betway e a probabilidade real calculada.</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
