
import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (view: 'painel' | 'direto' | 'historico' | 'docs') => void;
  onLogout: () => void;
  currentView: string;
  user: { name: string; email: string } | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLogout, currentView, user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    liveAlerts: true,
    highConfidence: true,
    darkMode: true,
    language: 'pt',
    leagues: ['Liga Portugal', 'Premier League']
  });

  const linkClass = (view: string) => 
    `transition-colors cursor-pointer pb-1 border-b-2 ${
      currentView === view 
        ? 'text-white border-green-500' 
        : 'text-slate-400 border-transparent hover:text-white hover:border-slate-600'
    }`;

  const toggleLeague = (league: string) => {
    setSettings(prev => ({
      ...prev,
      leagues: prev.leagues.includes(league) 
        ? prev.leagues.filter(l => l !== league) 
        : [...prev.leagues, league]
    }));
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('painel')}>
          <div className="bg-green-500 p-2 rounded-lg shadow-lg shadow-green-500/20">
            <i className="fas fa-robot text-black text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            BETWAY <span className="text-green-500 underline decoration-2 underline-offset-4">PREVISOR IA</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button onClick={() => onNavigate('painel')} className={linkClass('painel')}>Painel</button>
          <button onClick={() => onNavigate('direto')} className={linkClass('direto')}>Jogos em Direto</button>
          <button onClick={() => onNavigate('historico')} className={linkClass('historico')}>Histórico</button>
          <button onClick={() => onNavigate('docs')} className={linkClass('docs')}>Documentação</button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Estado da IA</span>
            <span className="text-xs font-bold text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              ACTIVO
            </span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2.5 rounded-full transition-all active:scale-95 relative ${isSettingsOpen ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <i className="fas fa-cog"></i>
            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </button>
          <div 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold cursor-pointer hover:border-green-500 transition-all overflow-hidden"
          >
            {user?.name.charAt(0) || 'U'}
          </div>
        </div>
      </nav>

      {/* Painel Lateral de Configurações & Conta */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-slate-900 shadow-2xl border-l border-slate-800 flex flex-col animate-slideInRight"
            onClick={e => e.stopPropagation()}
          >
            {/* Header do Painel */}
            <div className="p-6 border-b border-slate-800 bg-slate-800/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black uppercase tracking-tighter">Centro de Controlo</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black text-xl font-black shadow-lg">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white">{user?.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[9px] font-bold">PLANO PRO</span>
                </div>
              </div>
            </div>

            {/* Opções do Painel */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {/* Secção de Alertas */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                  <i className="fas fa-bell mr-2"></i> Notificações & Alertas
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Alertas em Tempo Real</span>
                    <input 
                      type="checkbox" 
                      className="w-10 h-5 bg-slate-800 rounded-full appearance-none checked:bg-green-500 transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform checked:after:translate-x-5" 
                      checked={settings.liveAlerts}
                      onChange={() => setSettings(s => ({ ...s, liveAlerts: !s.liveAlerts }))}
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Odds de Alto Valor (IA)</span>
                    <input 
                      type="checkbox" 
                      className="w-10 h-5 bg-slate-800 rounded-full appearance-none checked:bg-green-500 transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform checked:after:translate-x-5" 
                      checked={settings.highConfidence}
                      onChange={() => setSettings(s => ({ ...s, highConfidence: !s.highConfidence }))}
                    />
                  </label>
                </div>
              </div>

              {/* Secção de Interface */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                  <i className="fas fa-layer-group mr-2"></i> Interface & Região
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-3 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-bold text-slate-400 hover:border-green-500 transition-all">
                    <i className="fas fa-globe"></i>
                    <span>PORTUGUÊS</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-bold text-slate-400 hover:border-green-500 transition-all">
                    <i className="fas fa-moon"></i>
                    <span>TEMA ESCURO</span>
                  </button>
                </div>
              </div>

              {/* Ligas de Interesse */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Favoritos</h4>
                <div className="flex flex-wrap gap-2">
                  {['Liga Portugal', 'Premier League', 'Moçambola', 'La Liga'].map(league => (
                    <button
                      key={league}
                      onClick={() => toggleLeague(league)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                        settings.leagues.includes(league)
                          ? 'bg-green-500/10 border-green-500 text-green-500'
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {league}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer do Painel - Botão de Logout */}
            <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-800/10">
              <button 
                onClick={() => {
                  setIsSettingsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center space-x-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98]"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Terminar Sessão</span>
              </button>
              <p className="text-[9px] text-slate-600 text-center font-bold tracking-widest uppercase">
                Versão 2.5.1 AI Core Pro
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
