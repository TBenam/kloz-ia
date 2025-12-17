import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Settings, Send, BrainCircuit, Zap, Save, Bot, AlertCircle, ShieldCheck, CheckCircle2
} from 'lucide-react';

// --- COMPOSANT NAV (Sorti pour éviter le crash mobile) ---
const NavButton = ({ id, activeTab, icon: Icon, label, onClick, isMobile }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center justify-center p-3 rounded-xl transition-all ${
      activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
    } ${isMobile ? 'flex-1 flex-col gap-1 text-xs' : 'w-full justify-start gap-3'}`}
  >
    <Icon className={isMobile ? "w-6 h-6" : "w-5 h-5"} />
    <span>{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('config');
  const [isMobile, setIsMobile] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- CHARGEMENT ROBUSTE ---
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('klozia_config_v2');
      return saved ? JSON.parse(saved) : defaultData();
    } catch (e) { return defaultData(); }
  });

  function defaultData() {
    return {
      businessName: 'KlozIA Démo',
      context: `Tu es un vendeur cool pour une boutique de Sneakers.\nTon but est de vendre des Jordan à 150€.\nSois bref et utilise des emojis.\nNe dis jamais que tu es une IA.`
    };
  }

  // --- DETECTION MOBILE ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- SAUVEGARDE ---
  const saveConfig = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('klozia_config_v2', JSON.stringify(config));
      setTimeout(() => { setSaveStatus('saved'); setTimeout(() => setSaveStatus(null), 2000); }, 500);
    } catch (e) { alert("Erreur sauvegarde (Stockage bloqué ?)"); }
  };

  // --- CHAT ---
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "👋 Salut ! Je suis prêt. Dis-moi 'Bonjour' !", time: 'Now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    const userText = inputText.trim();
    
    // 1. Affiche le message de l'utilisateur tout de suite
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, time: 'Now' }]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      // 2. PRÉPARATION DE L'HISTORIQUE (C'est ici que ça plantait !)
      // On enlève le tout premier message (le "Bienvenue" du robot)
      // pour que Google ne voie que la conversation réelle commençant par TOI.
      const cleanHistory = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // 3. Appel API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: cleanHistory, // On envoie l'historique nettoyé
          context: config.context
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue du serveur");
      }

      // 4. Réponse IA
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.text, time: 'Now' }]);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-72 bg-slate-900 border-r border-slate-800 flex-col z-20">
        <div className="h-20 flex items-center px-6 bg-slate-900/50">
          <BrainCircuit className="w-8 h-8 text-indigo-500 mr-3" />
          <h1 className="text-xl font-bold">Kloz<span className="text-indigo-400">IA</span></h1>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <NavButton id="config" activeTab={activeTab} icon={Settings} label="Configuration" onClick={setActiveTab} />
          <NavButton id="chat" activeTab={activeTab} icon={MessageSquare} label="Simulateur" onClick={setActiveTab} />
        </nav>
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
        <span className="font-semibold text-sm flex items-center gap-2">
          {activeTab === 'config' ? <Settings className="w-4 h-4 text-indigo-400"/> : <Zap className="w-4 h-4 text-yellow-400"/>}
          {activeTab === 'config' ? 'Cerveau' : 'Démo'}
        </span>
        {activeTab === 'config' && (
          <button onClick={saveConfig} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full">
            {saveStatus === 'saved' ? 'OK' : 'Sauver'}
          </button>
        )}
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-0 relative">
        
        {/* ONGLET CONFIG */}
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="text-xs text-indigo-400 mb-1 font-bold">NOM DU BUSINESS</div>
              <input 
                className="w-full bg-transparent outline-none text-white" 
                value={config.businessName} 
                onChange={e => setConfig({...config, businessName: e.target.value})} 
              />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 h-80 flex flex-col">
              <div className="text-xs text-purple-400 mb-2 font-bold flex justify-between">
                <span>INSTRUCTIONS (PROMPT)</span>
                {saveStatus === 'saved' && <span className="text-emerald-400 flex gap-1"><CheckCircle2 className="w-3 h-3"/> Sauvegardé</span>}
              </div>
              <textarea 
                className="flex-1 w-full bg-transparent outline-none resize-none text-slate-300 leading-relaxed"
                value={config.context} 
                onChange={e => setConfig({...config, context: e.target.value})} 
                placeholder="Décrivez comment l'IA doit se comporter..."
              />
            </div>
            <div className="hidden md:block text-right">
              <button onClick={saveConfig} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-white font-bold transition-colors">
                Sauvegarder les instructions
              </button>
            </div>
          </div>
        )}

        {/* ONGLET CHAT */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col md:max-w-md md:mx-auto bg-black/20 md:border-x md:border-slate-800">
            {/* Header Chat */}
            <div className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center sticky top-0 z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <div className="font-bold text-sm">{config.businessName}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> En ligne
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-slate-800 rounded-2xl px-4 py-2 text-xs text-slate-500">KlozIA écrit...</div>
                </div>
              )}
              
              {/* AFFICHAGE DE L'ERREUR EN ROUGE */}
              {error && (
                <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-500 font-bold text-xs uppercase mb-1">Erreur Système</h4>
                    <p className="text-red-400 text-xs font-mono">{error}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Zone */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input 
                className="flex-1 bg-slate-950 text-white rounded-full px-5 py-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-slate-600 transition-all"
                value={inputText} 
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Écrivez un message..."
              />
              <button 
                onClick={handleSendMessage} 
                disabled={!inputText.trim() || isTyping}
                className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white p-3 rounded-full transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* NAVIGATION MOBILE (Fixée en bas) */}
      <nav className="md:hidden h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 fixed bottom-0 w-full z-40 pb-safe">
        <NavButton id="config" activeTab={activeTab} icon={Settings} label="Config" onClick={setActiveTab} isMobile={true} />
        <NavButton id="chat" activeTab={activeTab} icon={MessageSquare} label="Chat" onClick={setActiveTab} isMobile={true} />
      </nav>
    </div>
  );
}