// ================================
// App.jsx — VERSION CORRIGÉE SENIOR
// Appel Gemini sécurisé via API Vercel (/api/chat)
// ================================

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Settings,
  Send,
  BrainCircuit,
  Zap,
  User,
  Bot,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('config');

  // --- CONFIG BUSINESS ---
  const [config, setConfig] = useState({
    businessName: 'Gym Alpha',
    context: `Je vends un coaching privé "Transformation 90 jours" à 1500€.
C'est cher mais je garantis les résultats.
Si le client trouve ça trop cher, insiste sur le coût de la mauvaise santé.
Mes dispos : Lundi au Samedi, 7h–20h.
L'objectif est de réserver un appel de découverte.
Sois persuasif, pro, mais cool (style WhatsApp).`
  });

  // --- CHAT STATE ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Bonjour ! Je suis l'assistant IA. Posez-moi une question.",
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
  }, [messages, isTyping]);

  // --- API CALL (SECURISÉ) ---
  const callLLM = async (userMessage, history) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history,
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

  // --- SEND MESSAGE ---
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
      const history = [...messages, userMsg].map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

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

  // --- UI ---
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
            <BrainCircuit className="w-6 h-6 text-white md:mr-3" />
            <span className="hidden md:block text-xl font-bold">Kloz<span className="text-indigo-400">IA</span></span>
          </div>

          <nav className="mt-8 flex flex-col gap-2 px-2">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center p-3 rounded-lg ${activeTab === 'config' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Settings className="w-6 h-6 md:mr-3" />
              <span className="hidden md:block">Config</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center p-3 rounded-lg ${activeTab === 'chat' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <MessageSquare className="w-6 h-6 md:mr-3" />
              <span className="hidden md:block">Démo</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:block p-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400 flex gap-2">
            <ShieldCheck className="w-4 h-4" />
            Backend sécurisé via Vercel API
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-6">
          <h2 className="flex items-center gap-2 font-semibold">
            {activeTab === 'config' ? <Settings className="w-5 h-5 text-indigo-400" /> : <Zap className="w-5 h-5 text-yellow-400" />}
            {activeTab === 'config' ? 'Cerveau' : 'Live Chat'}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'config' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> Identité
                </h3>
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3"
                  value={config.businessName}
                  onChange={e => setConfig({ ...config, businessName: e.target.value })}
                />
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> Mémoire
                </h3>
                <textarea
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 resize-none"
                  value={config.context}
                  onChange={e => setConfig({ ...config, context: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full max-w-md mx-auto flex flex-col">
              <div className="bg-slate-800 rounded-t-3xl p-4 flex items-center border-b border-slate-700">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-sm">{config.businessName}</h3>
                  <p className="text-emerald-400 text-xs">En ligne</p>
                </div>
              </div>

              <div className="flex-1 bg-black/40 overflow-y-auto p-4 space-y-4 border-x border-slate-800">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 rounded-bl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}

                {isTyping && <div className="text-slate-500 text-xs animate-pulse">Écrit…</div>}

                {error && (
                  <div className="flex justify-center">
                    <div className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded border border-red-500/20 flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> {error}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="bg-slate-800 p-3 rounded-b-3xl border-t border-slate-700 flex items-center gap-2">
                <input
                  className="flex-1 bg-slate-900 rounded-full px-4 py-2.5 border border-slate-700"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message…"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-indigo-600 text-white p-2.5 rounded-full disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
