
import React, { useState, useEffect, useRef } from 'react';

interface LoginProps {
  onLogin: (user: { name: string; email: string }, remember: boolean) => void;
}

type AuthView = 'login' | 'register';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleStatus, setGoogleStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [googleInitialized, setGoogleInitialized] = useState(false);
  
  const rememberMeRef = useRef(rememberMe);
  useEffect(() => {
    rememberMeRef.current = rememberMe;
  }, [rememberMe]);

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Parsing Error:", e);
      return null;
    }
  };

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; 
    
    const checkGoogleInterval = setInterval(() => {
      attempts++;
      if ((window as any).google?.accounts?.id) {
        setGoogleStatus('ready');
        clearInterval(checkGoogleInterval);
      } else if (attempts >= maxAttempts) {
        setGoogleStatus('error');
        clearInterval(checkGoogleInterval);
      }
    }, 500);

    return () => clearInterval(checkGoogleInterval);
  }, []);

  useEffect(() => {
    if (googleStatus === 'ready' && !googleInitialized && view === 'login') {
      const google = (window as any).google;
      
      try {
        google.accounts.id.initialize({
          client_id: '407408718192-80l69e20v22e6k26p4f5v90s21095p2s.apps.googleusercontent.com', 
          callback: (response: any) => {
            if (response.error) {
              setError(`Erro na Autenticação Google: ${response.error}`);
              return;
            }

            setIsLoading(true);
            const userObject = parseJwt(response.credential);
            
            if (userObject && userObject.email) {
              setTimeout(() => {
                onLogin({
                  name: userObject.name || 'Usuário Google',
                  email: userObject.email,
                }, rememberMeRef.current);
                setIsLoading(false);
              }, 800);
            } else {
              setIsLoading(false);
              setError("Perfil Google incompleto.");
            }
          },
          auto_select: false,
          itp_support: true
        });

        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          google.accounts.id.renderButton(
            buttonContainer,
            { 
              theme: 'filled_black', 
              size: 'large', 
              width: buttonContainer.offsetWidth || 350,
              text: 'signin_with',
              shape: 'pill',
              logo_alignment: 'left'
            }
          );
          setGoogleInitialized(true);
        }
      } catch (err) {
        setGoogleStatus('error');
      }
    }
  }, [googleStatus, googleInitialized, onLogin, view]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Se estiver na vista de registo, faz a validação básica
    if (view === 'register') {
      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem.');
        setIsLoading(false);
        return;
      }
      setTimeout(() => {
        onLogin({ name: name || 'Novo Utilizador', email: email || 'user@betway.co.mz' }, rememberMe);
        setIsLoading(false);
      }, 1500);
      return;
    }

    // Acesso de Administrador Simplificado: Sem verificação de senha
    // Apenas clica e entra como admin
    setTimeout(() => {
      onLogin({ 
        name: 'Administrador Betway', 
        email: email || 'admin@betway.com' 
      }, rememberMe);
      setIsLoading(false);
    }, 800);
  };

  const handleSocialLogin = (provider: 'Facebook' | 'GoogleDemo') => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      onLogin({
        name: `Usuário ${provider}`,
        email: `${provider.toLowerCase()}@betway.co.mz`,
      }, rememberMe);
      setIsLoading(false);
    }, 1200);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-green-500/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-xl shadow-green-500/20 mb-6 transform hover:rotate-3 transition-transform duration-500">
            <i className="fas fa-robot text-black text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase mb-2">
            Betway <span className="text-green-500">Predictor</span>
          </h1>
          <p className="text-slate-400 text-sm font-light tracking-wide">
            {view === 'login' ? 'Clique em entrar para aceder ao painel' : 'Crie a sua conta gratuita hoje'}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-white/5 p-6 sm:p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl ring-1 ring-white/10 transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold p-4 rounded-2xl flex items-start animate-shake">
                <i className="fas fa-exclamation-circle mt-0.5 mr-3"></i>
                <div className="flex-1 leading-relaxed">{error}</div>
                <button type="button" onClick={() => setError(null)} className="ml-2 hover:text-white transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            {view === 'register' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative group">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors"></i>
                  <input
                    type="text"
                    placeholder="O seu nome"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-600 text-white"
                    value={name}
                    onChange={(e) => handleInputChange(setName, e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Endereço de E-mail</label>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors"></i>
                <input
                  type="email"
                  placeholder="exemplo@betway.co.mz"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-600 text-white"
                  value={email}
                  onChange={(e) => handleInputChange(setEmail, e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Palavra-passe</label>
                {view === 'login' && (
                  <button type="button" className="text-[10px] text-green-500 hover:text-green-400 font-black uppercase tracking-tighter transition-colors">Esqueceu-se?</button>
                )}
              </div>
              <div className="relative group">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors"></i>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-600 text-white"
                  value={password}
                  onChange={(e) => handleInputChange(setPassword, e.target.value)}
                />
              </div>
            </div>

            {view === 'register' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar Palavra-passe</label>
                <div className="relative group">
                  <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors"></i>
                  <input
                    type="password"
                    placeholder="Repita a palavra-passe"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-600 text-white"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(setConfirmPassword, e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className={`block w-10 h-5 rounded-full transition-colors duration-300 ${rememberMe ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${rememberMe ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Aceito os Termos</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-widest text-xs"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch animate-spin text-lg"></i>
              ) : (
                <>
                  {view === 'login' ? 'Entrar no Sistema' : 'Finalizar Registo'} 
                  <i className="fas fa-chevron-right ml-2 text-[10px]"></i>
                </>
              )}
            </button>
          </form>

          {view === 'login' && (
            <>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-slate-800"></div>
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] whitespace-nowrap">Conectividade Social</span>
                <div className="flex-1 h-[1px] bg-slate-800"></div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="relative w-full min-h-[44px] flex flex-col items-center">
                  {googleStatus === 'loading' && (
                    <div className="w-full bg-slate-800/50 animate-pulse rounded-full py-3 flex items-center justify-center border border-slate-700/50">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                        <i className="fas fa-circle-notch animate-spin mr-2"></i>
                        A contactar Google...
                      </span>
                    </div>
                  )}
                  
                  {googleStatus === 'error' && (
                    <button 
                      onClick={() => handleSocialLogin('GoogleDemo')}
                      className="w-full flex items-center justify-center gap-3 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 py-3.5 rounded-full text-xs font-bold text-slate-300 transition-all hover:border-green-500/30"
                    >
                      <i className="fab fa-google text-red-500"></i>
                      <span className="uppercase tracking-widest text-[10px]">Google ID (Modo de Segurança)</span>
                    </button>
                  )}
                  
                  <div 
                    id="google-signin-button" 
                    className={`w-full overflow-hidden rounded-full transition-all duration-500 ${googleInitialized ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0'}`}
                  ></div>
                </div>
                
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="w-full flex items-center justify-center gap-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 py-3.5 rounded-full text-[10px] font-black text-[#1877F2] transition-all active:scale-[0.98] group uppercase tracking-widest"
                >
                  <i className="fab fa-facebook-f text-lg group-hover:scale-110 transition-transform"></i> 
                  <span>Aceder com Facebook</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-10 space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            {view === 'login' ? (
              <>Ainda não tem conta? <button onClick={() => setView('register')} className="text-green-500 font-black hover:text-green-400 transition-colors uppercase tracking-tight ml-1">Registe-se Gratuitamente</button></>
            ) : (
              <>Já faz parte da elite? <button onClick={() => setView('login')} className="text-green-500 font-black hover:text-green-400 transition-colors uppercase tracking-tight ml-1">Voltar ao Login</button></>
            )}
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <i className="fab fa-cc-visa text-slate-700 text-xl hover:text-slate-500 transition-colors cursor-help"></i>
            <i className="fab fa-cc-mastercard text-slate-700 text-xl hover:text-slate-500 transition-colors cursor-help"></i>
            <i className="fab fa-apple-pay text-slate-700 text-xl hover:text-slate-500 transition-colors cursor-help"></i>
            <i className="fab fa-google-pay text-slate-700 text-xl hover:text-slate-500 transition-colors cursor-help"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
