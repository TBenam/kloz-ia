import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Settings, Send, BrainCircuit, Zap, Save, Bot, AlertCircle, ShieldCheck, CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('config');
  const [isMobile, setIsMobile] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- SAFE LOAD (Anti-Crash) ---
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('klozia_config_v1');
      return saved ? JSON.parse(saved) : defaultData();
    } catch (e) {
      return defaultData(); // Si localStorage est bloqué, on charge par défaut sans planter
    }
  });

  function defaultData() {
    return {
      businessName: 'KlozIA Shop',
      context: `Tu es un vendeur expert pour "KlozIA Shop".\nTon but : Vendre des chaussures à 50€.\nStyle : Court, dynamique, emoji.\nNe dis jamais que tu es une IA.`
    };
  }

  // --- DETECTION MOBILE ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Vérif immédiate
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- SAFE SAVE (Anti-Crash) ---
  const saveConfig = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('klozia_config_v1', JSON.stringify(config));
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      }, 500);
    } catch (e) {
      alert("Impossible de sauvegarder (Mode Privé activé ?)");
      setSaveStatus(null);
    }
  };

  // --- CHAT LOGIC ---
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "👋 Prêt à vendre ! Dis-moi bonjour.", time: 'Now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    const userText = inputText.trim();
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, time: 'Now' }]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      // Construction historique léger
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: history,
          context: config.context // ENVOI DU CONTEXTE
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur IA");

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.text, time: 'Now' }]);
    } catch (e) {
      console.error(e);
      setError("L'IA ne répond pas. Vérifie ta clé API dans Vercel.");
    } finally {
      setIsTyping(false);
    }
  };

  // --- COMPOSANTS UI ---
  const NavButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center p-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-indigo-600 text-white' : 'text-slate-400'
      } ${isMobile ? 'flex-1 flex-col gap-1 text-xs' : 'w-full justify-start gap-3'}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* SIDEBAR / HEADER */}
      <aside className="md:w-72 bg-slate-900 border-b md:border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-4 bg-slate-900/50 backdrop-blur">
          <BrainCircuit className="w-8 h-8 text-indigo-500 mr-3" />
          <h1 className="text-xl font-bold">Kloz<span className="text-indigo-400">IA</span></h1>
        </div>
        <nav className="hidden md:flex flex-col gap-2 p-4">
          <NavButton id="config" icon={Settings} label="Configuration" />
          <NavButton id="chat" icon={MessageSquare} label="Simulateur" />
        </nav>
      </aside>

      {/* MOBILE HEADER */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-0">
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="text-xs text-indigo-400 mb-1">NOM DU BUSINESS</div>
              <input 
                className="w-full bg-transparent outline-none" 
                value={config.businessName} 
                onChange={e => setConfig({...config, businessName: e.target.value})} 
              />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 h-80 flex flex-col">
              <div className="text-xs text-purple-400 mb-2 flex justify-between">
                <span>INSTRUCTIONS IA</span>
                {saveStatus === 'saved' && <span className="text-emerald-400 flex gap-1"><CheckCircle2 className="w-3 h-3"/> Sauvegardé</span>}
              </div>
              <textarea 
                className="flex-1 w-full bg-transparent outline-none resize-none"
                value={config.context} 
                onChange={e => setConfig({...config, context: e.target.value})} 
              />
            </div>
            <div className="hidden md:block text-right">
              <button onClick={saveConfig} className="bg-indigo-600 px-6 py-2 rounded-xl text-white font-bold">Sauvegarder</button>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col md:max-w-md md:mx-auto bg-black/20">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-slate-500 text-xs px-4">Écrit...</div>}
              {error && <div className="text-red-400 text-xs px-4 bg-red-500/10 p-2 rounded">{error}</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input 
                className="flex-1 bg-slate-950 rounded-full px-4 border border-slate-800"
                value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message..."
              />
              <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-2 rounded-full">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE NAV */}
      <nav className="md:hidden h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 fixed bottom-0 w-full z-40">
        <NavButton id="config" icon={Settings} label="Config" />
        <NavButton id="chat" icon={MessageSquare} label="Chat" />
      </nav>
    </div>
  );
}