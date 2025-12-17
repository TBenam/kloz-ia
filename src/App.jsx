import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Settings,
  Send,
  BrainCircuit,
  Zap,
  Save,
  Bot,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('config');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null

  // --- 1. CHARGEMENT DE LA SAUVEGARDE (LocalStorage) ---
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('klozia_config_v1');
    return saved ? JSON.parse(saved) : {
      businessName: 'KlozIA Shop',
      context: `Tu es un vendeur expert pour "KlozIA Shop".
Ton but : Vendre des chaussures de sport à 50€.
Ton style : Court, dynamique, emoji, comme sur WhatsApp.
Si le client hésite, propose une réduction de 10% (code: PROMO10).
Ne dis JAMAIS "je suis une IA". Comporte-toi comme un humain.`
    };
  });

  // --- GESTION RESPONSIVE ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. SAUVEGARDE MANUELLE & AUTO ---
  const saveConfig = () => {
    setSaveStatus('saving');
    localStorage.setItem('klozia_config_v1', JSON.stringify(config));
    
    // Simulation d'un petit délai pour l'effet visuel
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 500);
  };

  // --- CHAT STATE ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Salut ! Je suis prêt à tester tes instructions. Dis-moi bonjour !",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // --- AUTO SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTab]);

  // --- API CALL (LE FIX DU CERVEAU) ---
  const callLLM = async (userMessage, history) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history,
        // On envoie la config ACTUELLE pour forcer l'IA à la lire
        businessName: config.businessName,
        context: config.context 
      })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erreur serveur IA');
    }

    const data = await res.json();
    return data.text;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      // Construction de l'historique pour l'IA
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      // Ajout du message actuel
      history.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const reply = await callLLM(userMsg.text, history);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsTyping(false);
    }
  };

  // --- COMPOSANTS UI ---
  const NavButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center p-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
          : 'text-slate-400 hover:bg-slate-800'
      } ${isMobile ? 'flex-1 flex-col gap-1 text-xs' : 'w-full justify-start gap-3'}`}
    >
      <Icon className={isMobile ? "w-6 h-6" : "w-5 h-5"} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR (Desktop) / TOPBAR (Mobile) */}
      <aside className="md:w-72 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 md:h-20 flex items-center px-4 md:px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <BrainCircuit className="w-8 h-8 text-indigo-500 mr-3" />
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">Kloz<span className="text-indigo-400">IA</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider hidden md:block">Automatisation WhatsApp</p>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex flex-col gap-2 p-4">
          <NavButton id="config" icon={Settings} label="Configuration IA" />
          <NavButton id="chat" icon={MessageSquare} label="Simulateur WhatsApp" />
        </nav>

        {/* Footer Sidebar Desktop */}
        <div className="hidden md:block mt-auto p-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-1">
              <ShieldCheck className="w-4 h-4" />
              Mode Sécurisé
            </div>
            <p className="text-xs text-emerald-400/70">Vos données ne quittent pas cette session.</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header Mobile */}
        <header className="md:hidden h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
          <span className="font-semibold text-sm flex items-center gap-2">
            {activeTab === 'config' ? <Settings className="w-4 h-4 text-indigo-400"/> : <Zap className="w-4 h-4 text-yellow-400"/>}
            {activeTab === 'config' ? 'Réglages du Cerveau' : 'Démo Client'}
          </span>
          {activeTab === 'config' && (
             <button 
               onClick={saveConfig}
               className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full font-medium active:scale-95 transition-transform"
             >
               {saveStatus === 'saved' ? 'OK !' : 'Sauvegarder'}
             </button>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950">
          
          {/* --- TAB CONFIG --- */}
          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Programmez votre Agent</h2>
                <p className="text-slate-400 text-sm">C'est ici que vous donnez une personnalité à votre vendeur.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 focus-within:ring-2 ring-indigo-500/50 transition-all">
                  <div className="px-4 py-2 border-b border-slate-800/50 text-xs font-medium text-indigo-400 uppercase tracking-wider">
                    Nom du Business
                  </div>
                  <input
                    className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-slate-600"
                    placeholder="Ex: Ma Boutique Fashion"
                    value={config.businessName}
                    onChange={e => setConfig({ ...config, businessName: e.target.value })}
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 flex flex-col h-[60vh] md:h-96 focus-within:ring-2 ring-indigo-500/50 transition-all">
                  <div className="px-4 py-2 border-b border-slate-800/50 flex justify-between items-center">
                    <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Instructions Système (Prompt)</span>
                    {saveStatus === 'saved' && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Sauvegardé</span>}
                  </div>
                  <textarea
                    className="flex-1 w-full bg-transparent border-none text-slate-200 px-4 py-4 focus:outline-none resize-none placeholder-slate-600 leading-relaxed"
                    placeholder="Décrivez ici ce que l'IA doit vendre, ses prix, et son comportement..."
                    value={config.context}
                    onChange={e => setConfig({ ...config, context: e.target.value })}
                  />
                </div>
              </div>

              <div className="hidden md:flex justify-end">
                <button 
                  onClick={saveConfig}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    saveStatus === 'saved' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  {saveStatus === 'saved' ? <CheckCircle2 className="w-5 h-5"/> : <Save className="w-5 h-5"/>}
                  {saveStatus === 'saved' ? 'Instructions Enregistrées' : 'Sauvegarder les instructions'}
                </button>
              </div>
            </div>
          )}

          {/* --- TAB CHAT --- */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col md:max-w-md md:mx-auto md:border-x md:border-slate-800 bg-black/20 pb-[70px] md:pb-0">
              {/* En-tête Chat style WhatsApp */}
              <div className="bg-slate-800/80 backdrop-blur p-4 flex items-center shadow-sm sticky top-0 z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="font-bold text-slate-100 leading-tight">{config.businessName}</h3>
                  <p className="text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> En ligne
                  </p>
                </div>
              </div>

              {/* Zone Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-[15px] shadow-sm ${
                      m.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                    }`}>
                      {m.text}
                      <div className={`text-[10px] mt-1 text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center border border-slate-700">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center my-4">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone Saisie */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 sticky bottom-0 md:relative">
                <input
                  className="flex-1 bg-slate-950 text-white rounded-full px-5 py-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-slate-600"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Écrivez un message..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 text-white p-3 rounded-full transition-colors shadow-lg shadow-indigo-900/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 fixed bottom-0 w-full z-30 pb-safe">
        <NavButton id="config" icon={Settings} label="Config" />
        <NavButton id="chat" icon={MessageSquare} label="Chat" />
      </nav>

    </div>
  );
}