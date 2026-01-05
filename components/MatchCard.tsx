
import React from 'react';
import { Match, PredictionResult } from '../types';

interface MatchCardProps {
  match: Match;
  isSelected: boolean;
  onSelect: (match: Match) => void;
  prediction?: PredictionResult | null;
  loadingPrediction?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  isSelected, 
  onSelect, 
  prediction, 
  loadingPrediction 
}) => {
  const isLive = match.status === 'LIVE';

  const handleOddClick = (e: React.MouseEvent, label: string, value: number) => {
    e.stopPropagation();
    alert(`Aposta seleccionada: ${match.homeTeam} vs ${match.awayTeam} - Mercado: ${label} (Odd: ${value.toFixed(2)})`);
  };

  const renderOdd = (type: 'home' | 'draw' | 'away', label: string) => {
    const current = match.odds[type];
    const previous = match.previousOdds ? match.previousOdds[type] : current;
    const diff = ((current - previous) / previous) * 100;
    
    let colorClass = "text-green-400";
    let icon = null;

    if (Math.abs(diff) >= 1) {
      if (diff > 0) {
        colorClass = "text-green-400 font-bold bg-green-500/10";
        icon = <i className="fas fa-caret-up ml-1 text-[8px]"></i>;
      } else {
        colorClass = "text-red-400 font-bold bg-red-500/10";
        icon = <i className="fas fa-caret-down ml-1 text-[8px]"></i>;
      }
    }

    return (
      <button 
        onClick={(e) => handleOddClick(e, label, current)}
        className={`flex-1 bg-slate-900 rounded py-1.5 border border-slate-800 transition-all hover:border-slate-600 active:scale-95 flex flex-col items-center justify-center ${colorClass}`}
      >
        <span className="block text-slate-500 text-[8px] mb-0.5 uppercase font-bold">{label}</span>
        <span className="text-[11px] flex items-center">
          {current.toFixed(2)}
          {icon}
        </span>
      </button>
    );
  };

  const StatBar = ({ label, values }: { label: string, values: [number, number] }) => {
    const total = values[0] + values[1] || 1;
    const percent1 = (values[0] / total) * 100;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500">
          <span>{values[0]}</span>
          <span>{label}</span>
          <span>{values[1]}</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full flex overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${percent1}%` }}></div>
          <div className="bg-blue-500 h-full flex-1"></div>
        </div>
      </div>
    );
  };

  return (
    <div 
      onClick={() => onSelect(match)}
      className={`rounded-xl cursor-pointer transition-all border overflow-hidden group ${
        isSelected 
        ? 'bg-green-500/10 border-green-500 ring-1 ring-green-500 shadow-lg shadow-green-500/5' 
        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      {/* Header & Match Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{match.league}</span>
          {isLive && (
            <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span>
              AO VIVO
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 text-center">
            <div className="w-10 h-10 bg-slate-700 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold border border-slate-600 group-hover:border-slate-400 transition-colors">
              {match.homeTeam.charAt(0)}
            </div>
            <span className="text-xs font-semibold block truncate px-1">{match.homeTeam}</span>
          </div>
          
          <div className="px-3 text-center min-w-[60px]">
            {isLive ? (
              <div className="text-xl font-bold font-mono tracking-tighter text-white">
                {match.score?.home} : {match.score?.away}
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <div className="text-[9px] text-slate-500 mt-1 font-medium">VS</div>
          </div>

          <div className="flex-1 text-center">
            <div className="w-10 h-10 bg-slate-700 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold border border-slate-600 group-hover:border-slate-400 transition-colors">
              {match.awayTeam.charAt(0)}
            </div>
            <span className="text-xs font-semibold block truncate px-1">{match.awayTeam}</span>
          </div>
        </div>

        <div className="flex gap-1.5 text-center">
          {renderOdd('home', '1')}
          {renderOdd('draw', 'X')}
          {renderOdd('away', '2')}
        </div>
      </div>

      {/* Expanded Section */}
      <div className={`transition-all duration-300 ease-in-out border-t border-slate-800/50 bg-slate-900/40 ${
        isSelected ? 'max-h-[500px] opacity-100 p-4' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="space-y-4">
          {/* Real-time Stats */}
          {isLive && match.stats && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-600 tracking-tighter border-b border-slate-800 pb-1">Estatísticas em Tempo Real</h4>
              <StatBar label="Posse %" values={match.stats.possession} />
              <StatBar label="Remates à Baliza" values={match.stats.shotsOnTarget} />
              <StatBar label="Cantos" values={match.stats.corners} />
            </div>
          )}

          {/* AI Insights Summary */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-600 tracking-tighter border-b border-slate-800 pb-1">Análise Gemini AI</h4>
            {loadingPrediction ? (
              <div className="flex items-center space-x-2 py-2">
                <div className="w-3 h-3 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                <span className="text-[10px] text-slate-500 animate-pulse font-bold uppercase">A calcular probabilidades...</span>
              </div>
            ) : prediction ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center p-2 bg-green-500/5 rounded border border-green-500/20">
                  <span className="text-[10px] font-bold text-slate-400">DICA:</span>
                  <span className="text-[10px] font-black text-green-500 uppercase">{prediction.recommendedBet}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Confiança:</span>
                  <span className="text-white font-black">{prediction.confidenceScore}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Placar Previsto:</span>
                  <span className="text-white font-black font-mono">{prediction.predictedScore}</span>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-slate-600 italic">Previsão não disponível.</div>
            )}
          </div>
          
          <div className="flex justify-center pt-2">
            <button className="text-[9px] font-black text-green-500 uppercase tracking-widest hover:text-white transition-colors">
              Ver Análise Completa <i className="fas fa-external-link-alt ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
