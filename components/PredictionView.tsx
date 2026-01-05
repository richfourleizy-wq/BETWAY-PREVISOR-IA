
import React from 'react';
import { Match, PredictionResult } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { DataService } from '../services/dataService';

interface PredictionViewProps {
  match: Match;
  prediction: PredictionResult | null;
  loading: boolean;
}

const PredictionView: React.FC<PredictionViewProps> = ({ match, prediction, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-800 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <i className="fas fa-brain text-green-500 animate-pulse"></i>
          </div>
        </div>
        <h3 className="text-xl font-bold">IA a Analisar Dinâmicas do Jogo...</h3>
        <p className="text-slate-400 text-center max-w-sm">
          A gerar previsões usando Gemini 3 Flash. Calculando distribuição de Poisson e vetores de forma.
        </p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-slate-500 opacity-50">
        <i className="fas fa-arrow-left text-4xl mb-4"></i>
        <h3 className="text-xl font-bold">Selecione um jogo para ver a previsão da IA</h3>
      </div>
    );
  }

  const chartData = [
    { name: 'Casa', val: prediction.probability.homeWin },
    { name: 'Empate', val: prediction.probability.draw },
    { name: 'Fora', val: prediction.probability.awayWin },
  ];

  const homeForm = DataService.getTeamForm(match.homeTeam);
  const awayForm = DataService.getTeamForm(match.awayTeam);

  const translateRisk = (risk: string) => {
    switch(risk) {
      case 'LOW': return 'RISCO BAIXO';
      case 'MEDIUM': return 'RISCO MÉDIO';
      case 'HIGH': return 'RISCO ALTO';
      default: return risk;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-sm mr-2">RECOMENDAÇÃO IA</span>
            {prediction.recommendedBet}
          </h2>
          <div className="flex items-center space-x-4 mt-2">
             <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
               prediction.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-400' : 
               prediction.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 
               'bg-red-500/20 text-red-400'
             }`}>
               {translateRisk(prediction.riskLevel)}
             </span>
             <span className="text-sm text-slate-400">
               Placar Previsto: <span className="text-white font-mono font-bold">{prediction.predictedScore}</span>
             </span>
          </div>
        </div>
        <div className="text-center p-3 bg-slate-800 rounded-xl border border-slate-700 min-w-[120px]">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Confiança</div>
          <div className="text-3xl font-black text-green-500">{prediction.confidenceScore}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 flex items-center">
            <i className="fas fa-chart-pie mr-2"></i> Distribuição de Probabilidades
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="val" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#f8fafc', formatter: (val: number) => `${val}%` }}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#64748b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center">
            <i className="fas fa-brain mr-2 text-green-500"></i> Raciocínio Inteligente Gemini
          </h3>
          <div className="prose prose-invert text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-56 custom-scrollbar pr-2">
             <p>{prediction.aiAnalysis}</p>
          </div>
          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
             <div className="flex items-center text-xs text-green-400 font-bold mb-2 uppercase tracking-wide">
               <i className="fas fa-lightbulb mr-2"></i> Dica para Utilizadores Betway
             </div>
             <p className="text-xs text-slate-400">
               As odds atuais refletem uma probabilidade implícita de {((1 / match.odds.home) * 100).toFixed(1)}%. A IA vê {prediction.probability.homeWin}%, indicando uma 
               <span className="text-green-400 font-bold ml-1">
                 {prediction.probability.homeWin > ((1 / match.odds.home) * 100) ? 'Oportunidade de Valor' : 'Sem Valor de Aposta'}
               </span>.
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-500 flex justify-between">
            <span>Forma: {match.homeTeam}</span>
            <span className="text-green-500">Tendência: Estável</span>
          </h4>
          <div className="space-y-2">
            {homeForm.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">{f.date}</span>
                <span className="text-xs font-semibold">vs {f.opponent}</span>
                <div className="flex items-center space-x-2">
                   <span className="text-xs font-mono">{f.score}</span>
                   <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                     f.result === 'W' ? 'bg-green-500 text-black' : f.result === 'D' ? 'bg-slate-600' : 'bg-red-500'
                   }`}>{f.result === 'W' ? 'V' : f.result === 'D' ? 'E' : 'D'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-500 flex justify-between">
            <span>Forma: {match.awayTeam}</span>
            <span className="text-red-500">Tendência: Crítica</span>
          </h4>
          <div className="space-y-2">
            {awayForm.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">{f.date}</span>
                <span className="text-xs font-semibold">vs {f.opponent}</span>
                <div className="flex items-center space-x-2">
                   <span className="text-xs font-mono">{f.score}</span>
                   <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                     f.result === 'W' ? 'bg-green-500 text-black' : f.result === 'D' ? 'bg-slate-600' : 'bg-red-500'
                   }`}>{f.result === 'W' ? 'V' : f.result === 'D' ? 'E' : 'D'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionView;
