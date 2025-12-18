import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Settings, Send, BrainCircuit, Zap, Save, Bot, AlertCircle, 
  CheckCircle2, ArrowRight, Instagram, Facebook, Globe, Sparkles, X, Menu,
  Smartphone, BarChart3, Clock, Link, Calendar, Check, Star, User, Loader2, Lock, Eye, LogOut, KeyRound
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';

// --- CONFIGURATION FIREBASE PROD ---
const firebaseConfig = {
  apiKey: "AIzaSyCuhnxGQRqgYjMCnY6iRlI8_XytrgazzE0",
  authDomain: "klozia.firebaseapp.com",
  projectId: "klozia",
  storageBucket: "klozia.firebasestorage.app",
  messagingSenderId: "38073872196",
  appId: "1:38073872196:web:82d416b35a6fbc3e28b111",
  measurementId: "G-SLJC591TQL"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// On utilise l'ID du projet comme namespace pour les collections
const appId = 'klozia'; 

// --- AUTHENTIFICATION AUTO ---
const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);
  return user;
};

// --- COMPOSANTS UI PARTAGÉS ---

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all hover:bg-slate-900 group">
    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

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

// --- COMPOSANT WHATSAPP MOCKUP ---
const WhatsAppProof = () => (
  <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto border-4 border-slate-800 relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
    <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
        <User className="w-6 h-6 text-slate-500" />
      </div>
      <div>
        <div className="font-bold text-sm">Marc (Client E-com)</div>
        <div className="text-[10px] opacity-80">En ligne</div>
      </div>
    </div>
    
    <div className="bg-[#E5DDD5] p-4 h-64 flex flex-col gap-3 text-sm font-sans relative">
      <div className="opacity-10 absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
      
      <div className="self-end bg-[#DCF8C6] p-2 px-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] z-10 animate-fade-in-up delay-100">
        <p>Mec, je viens de checker les stats de KlozIA sur les 30 derniers jours... 😳</p>
        <span className="text-[10px] text-slate-500 block text-right mt-1">10:42 <span className="text-blue-500">✓✓</span></span>
      </div>

      <div className="self-start bg-white p-2 px-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] z-10 animate-fade-in-up delay-300">
        <p>Ah oui ? Ça donne quoi ? Dis-moi tout !</p>
        <span className="text-[10px] text-slate-500 block text-right mt-1">10:43</span>
      </div>

      <div className="self-end bg-[#DCF8C6] p-2 px-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] z-10 animate-fade-in-up delay-700">
        <p className="font-bold">C'est juste dingue.</p>
        <p>J'ai littéralement <span className="font-bold bg-yellow-200 px-1">triplé mes ventes</span>. L'IA a closé 45 leads pendant que je dormais cette nuit. 🚀</p>
        <span className="text-[10px] text-slate-500 block text-right mt-1">10:45 <span className="text-blue-500">✓✓</span></span>
      </div>
    </div>
  </div>
);

// --- MODAL CODE PIN ADMIN (NOUVEAU) ---
const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === '77324389') {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs p-6 relative z-10 shadow-2xl animate-scale-in text-center">
        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Accès Admin</h3>
        <p className="text-slate-500 text-xs mb-6">Zone réservée à la direction</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            autoFocus
            className={`w-full bg-slate-950 border ${error ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-lg p-3 text-center text-white focus:border-indigo-500 outline-none tracking-[0.5em] font-mono text-lg mb-4`}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="••••••••"
            maxLength={8}
          />
          {error && <p className="text-red-500 text-xs mb-2">Code incorrect</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors text-sm">
            Déverrouiller
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MODAL DE CAPTURE DE LEAD ---
const LeadModal = ({ isOpen, onClose, title }) => {
  const [formData, setFormData] = useState({ name: '', business: '', phone: '', slot: '' });
  const [status, setStatus] = useState('idle');
  const user = useAuth(); // Hook auth
  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Sécurité

    setStatus('submitting');
    try {
      // Envoi vers Firestore dans la collection publique 'leads'
      // Utilisation du bon chemin avec l'appId 'klozia'
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        ...formData,
        createdAt: serverTimestamp(),
        type: title,
        userId: user.uid 
      });
      
      setStatus('success');
    } catch (error) {
      console.error("Erreur lead:", error);
      alert("Une erreur est survenue. Vérifiez votre connexion.");
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-scale-in">
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Reçu 5/5 !</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Merci <strong>{formData.name}</strong>. Votre demande pour <em>{formData.business}</em> est bien enregistrée.<br/>
              Notre équipe technique vous contactera sur WhatsApp très rapidement.
            </p>
            <button onClick={onClose} className="bg-white hover:bg-slate-200 text-slate-900 px-8 py-3 rounded-full text-base font-bold transition-colors w-full">
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500 fill-current" /> {title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Remplissez ce formulaire pour démarrer.</p>
              </div>
              <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Votre Prénom</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Thomas" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Nom du Business</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" 
                  value={formData.business} onChange={e => setFormData({...formData, business: e.target.value})} placeholder="Ex: Ma Marque de Vêtements" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Numéro WhatsApp</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600"/>
                  <input required type="tel" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pl-12 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-mono" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+237 6..." />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Meilleur moment pour l'appel</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600"/>
                  <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pl-12 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})}>
                    <option value="">Choisir un créneau...</option>
                    <option value="Matin (9h-12h)">Matin (9h-12h)</option>
                    <option value="Après-midi (14h-17h)">Après-midi (14h-17h)</option>
                    <option value="Soirée (18h-20h)">Soirée (18h-20h)</option>
                  </select>
                </div>
              </div>
              
              <button disabled={status === 'submitting'} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 transform hover:-translate-y-1">
                {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin"/> : "Valider ma demande 🚀"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ onBack }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();

  useEffect(() => {
    // Écoute en temps réel les nouveaux leads
    if (!user) return;

    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), orderBy('createdAt', 'desc'));
    
    // onSnapshot permet la mise à jour en temps réel (sans recharger)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Erreur lecture leads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
              <Lock className="w-8 h-8 text-white"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold">KlozIA Admin</h1>
              <p className="text-slate-400 text-sm">Gestion des prospects en temps réel</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all text-sm font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Retour au Site
          </button>
        </div>

        {/* Stats Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="text-slate-500 text-sm font-bold uppercase mb-2">Total Prospects</div>
            <div className="text-4xl font-bold text-white">{leads.length}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="text-slate-500 text-sm font-bold uppercase mb-2">Dernier Ajout</div>
            <div className="text-xl font-bold text-indigo-400">
              {leads.length > 0 && leads[0].createdAt 
                ? new Date(leads[0].createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                : '-'}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="text-slate-500 text-sm font-bold uppercase mb-2">Status</div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Sync Active
            </div>
          </div>
        </div>

        {/* Tableaux des Leads */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="font-bold text-lg flex items-center gap-2"><User className="w-5 h-5 text-indigo-500"/> Liste des demandes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-slate-200 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-5 border-b border-slate-800">Date & Heure</th>
                  <th className="p-5 border-b border-slate-800">Nom du Client</th>
                  <th className="p-5 border-b border-slate-800">Business</th>
                  <th className="p-5 border-b border-slate-800">Contact WhatsApp</th>
                  <th className="p-5 border-b border-slate-800">Créneau</th>
                  <th className="p-5 border-b border-slate-800">Type de demande</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan="6" className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500"/></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan="6" className="p-12 text-center text-slate-500 italic">Aucun prospect enregistré pour le moment.</td></tr>
                ) : (
                  leads.map((lead, index) => (
                    <tr key={lead.id} className={`hover:bg-slate-800/50 transition-colors ${index === 0 ? 'bg-indigo-500/5' : ''}`}>
                      <td className="p-5 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {lead.createdAt 
                          ? new Date(lead.createdAt.seconds * 1000).toLocaleString('fr-FR', {
                              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            }) 
                          : 'En cours...'}
                      </td>
                      <td className="p-5 font-bold text-white text-base">{lead.name}</td>
                      <td className="p-5 text-indigo-300 font-medium">{lead.business}</td>
                      <td className="p-5">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-2 w-fit">
                          <Smartphone className="w-3 h-3"/> {lead.phone}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="flex items-center gap-2 text-slate-300">
                           {lead.slot}
                        </span>
                      </td>
                      <td className="p-5 text-xs">
                        <span className={`px-2 py-1 rounded border ${
                          lead.type && lead.type.includes('WhatsApp') 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }`}>
                          {lead.type || 'Général'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE (V3 - Storytelling & Closing) ---

const LandingPage = ({ onStartDemo, onOpenAdmin }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false); // État pour la modal Auth Admin
  const [modalTitle, setModalTitle] = useState('');

  const openLeadForm = (title) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} />
      <AdminLoginModal isOpen={adminAuthOpen} onClose={() => setAdminAuthOpen(false)} onSuccess={onOpenAdmin} />
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">Kloz<span className="text-indigo-400">IA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#story" className="hover:text-white transition-colors">L'Histoire</a>
            <a href="#features" className="hover:text-white transition-colors">Solutions</a>
            <a href="#proof" className="hover:text-white transition-colors">Résultats</a>
          </div>
          <button 
            onClick={onStartDemo}
            className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg shadow-white/10 transform hover:scale-105"
          >
            Démo Live <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 cursor-pointer hover:bg-emerald-500/20 transition-colors"
               onClick={() => openLeadForm("Connexion WhatsApp Express")}>
            <Link className="w-3 h-3" />
            <span>Connecter WhatsApp en 1 clic</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Automatisez les réponses. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              Multipliez la croissance.
            </span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-12 space-y-4">
            <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
              Des agents IA qui rassurent, font des ventes, et sont <span className="text-white border-b-2 border-indigo-500/50">dévoués corps et âme</span> à votre business 24/7.
            </p>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Intégrez KlozIA directement à <span className="text-white font-semibold">WhatsApp, Messenger et Instagram</span>. Automatisez vos conversations, prises de rendez-vous et la qualification de vos leads sans lever le petit doigt.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStartDemo}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 fill-current" />
              Voir la Démo Live
            </button>
            <button 
              onClick={() => openLeadForm("Intégration WhatsApp")}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-slate-300 border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Connecter WhatsApp
            </button>
          </div>

          {/* Social Proof Logos */}
          <div className="mt-20 pt-10 border-t border-slate-800/50">
            <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-widest">S'intègre parfaitement avec</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center gap-2 font-bold text-2xl text-slate-300 hover:text-[#25D366] transition-colors cursor-default"><span className="p-2 bg-[#25D366]/20 rounded-full text-[#25D366] mr-2"><Smartphone className="w-6 h-6"/></span> WhatsApp</div>
              <div className="flex items-center gap-2 font-bold text-2xl text-slate-300 hover:text-[#0084FF] transition-colors cursor-default"><span className="p-2 bg-[#0084FF]/20 rounded-full text-[#0084FF] mr-2"><Facebook className="w-6 h-6"/></span> Messenger</div>
              <div className="flex items-center gap-2 font-bold text-2xl text-slate-300 hover:text-[#E1306C] transition-colors cursor-default"><span className="p-2 bg-[#E1306C]/20 rounded-full text-[#E1306C] mr-2"><Instagram className="w-6 h-6"/></span> Instagram</div>
            </div>
          </div>
        </div>
      </section>

      {/* STORYTELLING SECTION (NOUVEAU) */}
      <section id="story" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full w-fit mb-6">L'HISTOIRE DU FONDATEUR</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight">
            "J'ai failli tout perdre... <br/><span className="text-indigo-500">Merci KlozIA.</span>"
          </h2>
          
          <div className="space-y-8 text-lg text-slate-300 leading-relaxed font-light">
            <p>
              En 2021, j'ai fait ce que nous rêvons tous de faire. J'ai plaqué la sécurité de mon job de développeur, le salaire fixe, le confort, pour me jeter dans l'arène du e-commerce.
            </p>
            <p>
              Au début ? C'était l'euphorie. Les premières ventes, la courbe qui monte. Je me sentais invincible.
              <br/><span className="text-white font-medium">Mais très vite, le rêve s'est transformé en une prison dorée.</span>
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-3">
              <AlertCircle className="text-red-500"/> L'Enfer du "Ping" à 3h du matin
            </h3>
            <p>
              On ne vous parle jamais de l'autre côté de la croissance. On ne vous dit pas que plus vous vendez, plus vous devenez esclave.
              Mon téléphone est devenu mon bourreau.
            </p>
            <ul className="space-y-4 border-l-2 border-slate-700 pl-6 my-6 italic text-slate-400">
              <li>⏰ <strong className="text-white">2h du matin :</strong> Un client demande si sa commande est partie.</li>
              <li>⏰ <strong className="text-white">4h du matin :</strong> Un autre insulte ma marque parce qu'il n'a pas eu de réponse dans la minute.</li>
              <li>⏰ <strong className="text-white">Toute la journée :</strong> "C'est combien ?" "Livraison quand ?"</li>
            </ul>
            <p>
              Je voyais mon énergie s'évaporer. Je ne pilotais plus mon business, je subissais mon business. J'avais atteint ce plafond de verre terrifiant où chaque nouvelle vente ne m'apportait pas plus d'argent, mais plus de stress. Je stagnais. Je saturais. <span className="bg-red-500/20 text-red-200 px-1">J'étais devenu le goulot d'étranglement de ma propre réussite.</span>
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-4">L'échec de la délégation humaine</h3>
            <p>
              J'ai fait ce que tous les gurus disent de faire : "Délègue". J'ai embauché. J'ai mis des humains derrière les claviers.
              <br/>Le résultat ? <strong className="text-white">Un désastre.</strong>
            </p>
            <p>
              Personne – je dis bien PERSONNE – n'aimera votre business autant que vous.
              Mes commerciaux fatiguaient. Ils avaient des humeurs. Ils rataient des ventes faciles. Ils n'avaient pas la "faim". Et surtout, ils coûtaient une fortune pour un résultat médiocre.
            </p>
            <p>
              J'étais coincé. Soit je restais petit, soit j'explosais en vol.
            </p>

            <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-2xl mt-12 relative overflow-hidden group hover:border-indigo-500 transition-colors">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit className="w-32 h-32"/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">La Révélation : KlozIA</h3>
              <p className="mb-4">
                C'est là que mon passé de développeur et ma réalité d'entrepreneur se sont percutés.
                Je ne voulais pas d'un "chatbot" stupide. Je voulais un clone.
                Je voulais une version de moi-même, mais une version qui ne dort jamais, ne se plaint jamais, et ne rate jamais une vente.
              </p>
              <p className="font-bold text-white text-xl">
                J'ai créé KlozIA.
              </p>
            </div>

            <p>
              KlozIA n'est pas un outil de support. C'est votre meilleure commerciale, sous stéroïdes.
              Elle a une mission unique : Prendre votre prospect par la main et l'amener au closing avec une précision chirurgicale.
            </p>
            <p>
              Elle répond à 3h du matin avec la même fraîcheur et la même empathie qu'à 10h du matin.
              Elle connaît la psychologie de vente sur le bout des doigts.
              Elle transforme la frustration client en "Capital Amour" pour votre marque.
            </p>
            
            <h3 className="text-2xl font-bold text-white mt-12 mb-4">Le Résultat ?</h3>
            <p>
              Ce n'est pas juste du temps gagné. C'est de la croissance débloquée.
              Nous aidons les entreprises à passer de 0 à 1 million, et de 10 à 100 millions, simplement en supprimant la friction humaine là où elle fait mal.
            </p>
          </div>
        </div>
      </section>

      {/* CASE STUDY SECTION */}
      <section id="proof" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold mb-6">
                ÉTUDE DE CAS
              </div>
              <h2 className="text-4xl font-bold mb-6">
                "J'ai triplé mes ventes en 30 jours"
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Ne nous croyez pas sur parole. Regardez ce que nos clients disent quand ils voient leur tableau de bord le matin.
                L'impact est immédiat : plus de réactivité = plus de confiance = plus de ventes.
              </p>
              <div className="flex gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-3xl font-bold text-white mb-1">x3</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Ventes</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-3xl font-bold text-white mb-1">-90%</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Temps SAV</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
              <WhatsAppProof />
            </div>
          </div>
        </div>
      </section>

      {/* Features Recap */}
      <section id="features" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Clock}
              title="Dévouement 24/7"
              desc="Ne ratez plus aucune opportunité. Votre agent répond instantanément, de jour comme de nuit, pour rassurer et convertir."
            />
            <FeatureCard 
              icon={BrainCircuit}
              title="Qualification Automatique"
              desc="L'IA filtre les curieux et qualifie les vrais prospects avant même que vous n'ouvriez votre téléphone."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Ventes & Rendez-vous"
              desc="Transformez des discussions banales en chiffre d'affaires. L'IA guide le client jusqu'au paiement ou à la réservation."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Arrêtez de subir, recommencez à grandir.</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Ne laissez pas votre croissance être limitée par votre fatigue ou celle de vos équipes.
            Vous avez déjà le produit. Vous avez le marché. <br/>Il vous manque juste la machine à closer.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => openLeadForm("Réservation Appel Stratégique")}
              className="w-full md:w-auto bg-white text-slate-900 px-8 py-5 rounded-full font-bold text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <Calendar className="w-5 h-5" />
              Réserver un appel stratégique
            </button>
            
            <button 
              onClick={onStartDemo}
              className="w-full md:w-auto bg-indigo-600 text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/30 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 fill-current" />
              Tester le simulateur
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">Sans engagement • Installation rapide • Compatible mobile</p>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-10 border-t border-slate-900 text-center text-slate-600 text-sm bg-slate-950">
        <p className="mb-4">&copy; 2024 KlozIA Solutions. Propulsé par Gemini 2.5 Flash.</p>
        <button onClick={() => setAdminAuthOpen(true)} className="text-xs text-slate-800 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors">
          <Lock className="w-3 h-3"/> Admin Access
        </button>
      </footer>
    </div>
  );
};

// --- APPLICATION PRINCIPALE (SIMULATEUR V1) ---

const AppInterface = ({ onBackHome }) => {
  const [activeTab, setActiveTab] = useState('config');
  const [isMobile, setIsMobile] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const saveConfig = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('klozia_config_v2', JSON.stringify(config));
      setTimeout(() => { setSaveStatus('saved'); setTimeout(() => setSaveStatus(null), 2000); }, 500);
    } catch (e) { alert("Erreur sauvegarde"); }
  };

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "👋 Mode Démo activé. Je suis votre IA configurée. Testez-moi !", time: 'Now' }
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
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, time: 'Now' }]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      const cleanHistory = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: cleanHistory,
          context: config.context
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.text, time: 'Now' }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden animate-fade-in">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-72 bg-slate-900 border-r border-slate-800 flex-col z-20">
        <div className="h-20 flex items-center px-6 bg-slate-900/50 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={onBackHome}>
          <BrainCircuit className="w-8 h-8 text-indigo-500 mr-3" />
          <h1 className="text-xl font-bold">Kloz<span className="text-indigo-400">IA</span></h1>
        </div>
        <div className="px-6 py-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Simulateur</div>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <NavButton id="config" activeTab={activeTab} icon={Settings} label="Configuration IA" onClick={setActiveTab} />
          <NavButton id="chat" activeTab={activeTab} icon={MessageSquare} label="Tester le Chat" onClick={setActiveTab} />
        </nav>
        <div className="mt-auto p-4">
          <button onClick={onBackHome} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Retour accueil
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-2" onClick={onBackHome}>
          <BrainCircuit className="w-6 h-6 text-indigo-500" />
          <span className="font-bold">KlozIA <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-normal">APP</span></span>
        </div>
        {activeTab === 'config' && (
          <button onClick={saveConfig} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full">
            {saveStatus === 'saved' ? 'OK' : 'Sauver'}
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-0 relative">
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto p-4 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2 mt-4">
              <h2 className="text-2xl font-bold">Configuration de l'Agent</h2>
              <div className="text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">
                Mode Démo
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-indigo-400 mb-2 font-bold uppercase">Identité du Business</div>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                value={config.businessName} 
                onChange={e => setConfig({...config, businessName: e.target.value})} 
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-96">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs text-purple-400 font-bold uppercase">Instructions Système (Prompt)</div>
                {saveStatus === 'saved' && <span className="text-emerald-400 flex gap-1 text-xs items-center"><CheckCircle2 className="w-3 h-3"/> Sauvegardé</span>}
              </div>
              <textarea 
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 leading-relaxed outline-none resize-none focus:border-indigo-500 transition-colors font-mono text-sm"
                value={config.context} 
                onChange={e => setConfig({...config, context: e.target.value})} 
                placeholder="Décrivez comment l'IA doit se comporter..."
              />
              <div className="mt-3 text-xs text-slate-500">
                💡 Astuce : Soyez précis sur le ton et l'objectif de vente.
              </div>
            </div>
            
            <div className="hidden md:flex justify-end">
              <button onClick={saveConfig} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-white font-bold transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Sauvegarder les réglages
              </button>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col md:max-w-xl md:mx-auto bg-black/20 md:border-x md:border-slate-800">
            <div className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center sticky top-0 z-10 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">{config.businessName}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    En ligne
                  </div>
                </div>
              </div>
              <button onClick={() => setMessages([])} className="text-xs text-slate-500 hover:text-white transition-colors">
                Effacer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-md ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2 text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"/>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-75"/>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-150"/>
                  </div>
                </div>
              )}
              {error && (
                <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-500 font-bold text-xs uppercase mb-1">Erreur IA</h4>
                    <p className="text-red-400 text-xs font-mono">{error}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

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
                className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white p-3 rounded-full transition-all shadow-lg shadow-indigo-500/20 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className="md:hidden h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 fixed bottom-0 w-full z-40 pb-safe">
        <NavButton id="config" activeTab={activeTab} icon={Settings} label="Config" onClick={setActiveTab} isMobile={true} />
        <NavButton id="chat" activeTab={activeTab} icon={MessageSquare} label="Chat" onClick={setActiveTab} isMobile={true} />
      </nav>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <>
      {currentView === 'home' && (
        <LandingPage 
          onStartDemo={() => setCurrentView('app')} 
          onOpenAdmin={() => setCurrentView('admin')}
        />
      )}
      {currentView === 'app' && (
        <AppInterface onBackHome={() => setCurrentView('home')} />
      )}
      {currentView === 'admin' && (
        <AdminDashboard onBack={() => setCurrentView('home')} />
      )}
    </>
  );
}import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Settings, Send, BrainCircuit, Zap, Save, Bot, AlertCircle, 
  CheckCircle2, ArrowRight, Instagram, Facebook, Globe, Sparkles, X, Menu,
  Smartphone, BarChart3, Clock, Link, Calendar, Check, Star, User, Loader2, Lock, Eye, LogOut, KeyRound
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';

// --- CONFIGURATION FIREBASE PROD ---
const firebaseConfig = {
  apiKey: "AIzaSyCuhnxGQRqgYjMCnY6iRlI8_XytrgazzE0",
  authDomain: "klozia.firebaseapp.com",
  projectId: "klozia",
  storageBucket: "klozia.firebasestorage.app",
  messagingSenderId: "38073872196",
  appId: "1:38073872196:web:82d416b35a6fbc3e28b111",
  measurementId: "G-SLJC591TQL"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// On utilise l'ID du projet comme namespace pour les collections
const appId = 'klozia'; 

// --- AUTHENTIFICATION AUTO ---
const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);
  return user;
};

// --- COMPOSANTS UI PARTAGÉS ---

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all hover:bg-slate-900 group">
    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

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

// --- COMPOSANT WHATSAPP MOCKUP ---
const WhatsAppProof = () => (
  <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto border-4 border-slate-800 relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
    <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
        <User className="w-6 h-6 text-slate-500" />
      </div>
      <div>
        <div className="font-bold text-sm">Marc (Client E-com)</div>
        <div className="text-[10px] opacity-80">En ligne</div>
      </div>
    </div>
    
    <div className="bg-[#E5DDD5] p-4 h-64 flex flex-col gap-3 text-sm font-sans relative">
      <div className="opacity-10 absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
      
      <div className="self-end bg-[#DCF8C6] p-2 px-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] z-10 animate-fade-in-up delay-100">
        <p>Mec, je viens de checker les stats de KlozIA sur les 30 derniers jours... 😳</p>
        <span className="text-[10px] text-slate-500 block text-right mt-1">10:42 <span className="text-blue-500">✓✓</span></span>
      </div>

      <div className="self-start bg-white p-2 px-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] z-10 animate-fade-in-up delay-300">
        <p>Ah oui ? Ça donne quoi ? Dis-moi tout !</p>
        <span className="text-[10px] text-slate-500 block text-right mt-1">10:43</span>
      </div>

      <div className="self-end bg-[#DCF8C6] p-2 px-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] z-10 animate-fade-in-up delay-700">
        <p className="font-bold">C'est juste dingue.</p>
        <p>J'ai littéralement <span className="font-bold bg-yellow-200 px-1">triplé mes ventes</span>. L'IA a closé 45 leads pendant que je dormais cette nuit. 🚀</p>
        <span className="text-[10px] text-slate-500 block text-right mt-1">10:45 <span className="text-blue-500">✓✓</span></span>
      </div>
    </div>
  </div>
);

// --- MODAL CODE PIN ADMIN (NOUVEAU) ---
const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === '77324389') {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs p-6 relative z-10 shadow-2xl animate-scale-in text-center">
        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Accès Admin</h3>
        <p className="text-slate-500 text-xs mb-6">Zone réservée à la direction</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            autoFocus
            className={`w-full bg-slate-950 border ${error ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-lg p-3 text-center text-white focus:border-indigo-500 outline-none tracking-[0.5em] font-mono text-lg mb-4`}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="••••••••"
            maxLength={8}
          />
          {error && <p className="text-red-500 text-xs mb-2">Code incorrect</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors text-sm">
            Déverrouiller
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MODAL DE CAPTURE DE LEAD ---
const LeadModal = ({ isOpen, onClose, title }) => {
  const [formData, setFormData] = useState({ name: '', business: '', phone: '', slot: '' });
  const [status, setStatus] = useState('idle');
  const user = useAuth(); // Hook auth
  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Sécurité

    setStatus('submitting');
    try {
      // Envoi vers Firestore dans la collection publique 'leads'
      // Utilisation du bon chemin avec l'appId 'klozia'
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        ...formData,
        createdAt: serverTimestamp(),
        type: title,
        userId: user.uid 
      });
      
      setStatus('success');
    } catch (error) {
      console.error("Erreur lead:", error);
      alert("Une erreur est survenue. Vérifiez votre connexion.");
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-scale-in">
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Reçu 5/5 !</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Merci <strong>{formData.name}</strong>. Votre demande pour <em>{formData.business}</em> est bien enregistrée.<br/>
              Notre équipe technique vous contactera sur WhatsApp très rapidement.
            </p>
            <button onClick={onClose} className="bg-white hover:bg-slate-200 text-slate-900 px-8 py-3 rounded-full text-base font-bold transition-colors w-full">
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500 fill-current" /> {title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Remplissez ce formulaire pour démarrer.</p>
              </div>
              <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Votre Prénom</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Thomas" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Nom du Business</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" 
                  value={formData.business} onChange={e => setFormData({...formData, business: e.target.value})} placeholder="Ex: Ma Marque de Vêtements" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Numéro WhatsApp</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600"/>
                  <input required type="tel" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pl-12 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-mono" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+237 6..." />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Meilleur moment pour l'appel</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600"/>
                  <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pl-12 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})}>
                    <option value="">Choisir un créneau...</option>
                    <option value="Matin (9h-12h)">Matin (9h-12h)</option>
                    <option value="Après-midi (14h-17h)">Après-midi (14h-17h)</option>
                    <option value="Soirée (18h-20h)">Soirée (18h-20h)</option>
                  </select>
                </div>
              </div>
              
              <button disabled={status === 'submitting'} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 transform hover:-translate-y-1">
                {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin"/> : "Valider ma demande 🚀"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ onBack }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();

  useEffect(() => {
    // Écoute en temps réel les nouveaux leads
    if (!user) return;

    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), orderBy('createdAt', 'desc'));
    
    // onSnapshot permet la mise à jour en temps réel (sans recharger)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Erreur lecture leads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
              <Lock className="w-8 h-8 text-white"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold">KlozIA Admin</h1>
              <p className="text-slate-400 text-sm">Gestion des prospects en temps réel</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all text-sm font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Retour au Site
          </button>
        </div>

        {/* Stats Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="text-slate-500 text-sm font-bold uppercase mb-2">Total Prospects</div>
            <div className="text-4xl font-bold text-white">{leads.length}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="text-slate-500 text-sm font-bold uppercase mb-2">Dernier Ajout</div>
            <div className="text-xl font-bold text-indigo-400">
              {leads.length > 0 && leads[0].createdAt 
                ? new Date(leads[0].createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                : '-'}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="text-slate-500 text-sm font-bold uppercase mb-2">Status</div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Sync Active
            </div>
          </div>
        </div>

        {/* Tableaux des Leads */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="font-bold text-lg flex items-center gap-2"><User className="w-5 h-5 text-indigo-500"/> Liste des demandes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-slate-200 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-5 border-b border-slate-800">Date & Heure</th>
                  <th className="p-5 border-b border-slate-800">Nom du Client</th>
                  <th className="p-5 border-b border-slate-800">Business</th>
                  <th className="p-5 border-b border-slate-800">Contact WhatsApp</th>
                  <th className="p-5 border-b border-slate-800">Créneau</th>
                  <th className="p-5 border-b border-slate-800">Type de demande</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan="6" className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500"/></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan="6" className="p-12 text-center text-slate-500 italic">Aucun prospect enregistré pour le moment.</td></tr>
                ) : (
                  leads.map((lead, index) => (
                    <tr key={lead.id} className={`hover:bg-slate-800/50 transition-colors ${index === 0 ? 'bg-indigo-500/5' : ''}`}>
                      <td className="p-5 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {lead.createdAt 
                          ? new Date(lead.createdAt.seconds * 1000).toLocaleString('fr-FR', {
                              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            }) 
                          : 'En cours...'}
                      </td>
                      <td className="p-5 font-bold text-white text-base">{lead.name}</td>
                      <td className="p-5 text-indigo-300 font-medium">{lead.business}</td>
                      <td className="p-5">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-2 w-fit">
                          <Smartphone className="w-3 h-3"/> {lead.phone}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="flex items-center gap-2 text-slate-300">
                           {lead.slot}
                        </span>
                      </td>
                      <td className="p-5 text-xs">
                        <span className={`px-2 py-1 rounded border ${
                          lead.type && lead.type.includes('WhatsApp') 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }`}>
                          {lead.type || 'Général'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE (V3 - Storytelling & Closing) ---

const LandingPage = ({ onStartDemo, onOpenAdmin }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false); // État pour la modal Auth Admin
  const [modalTitle, setModalTitle] = useState('');

  const openLeadForm = (title) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} />
      <AdminLoginModal isOpen={adminAuthOpen} onClose={() => setAdminAuthOpen(false)} onSuccess={onOpenAdmin} />
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">Kloz<span className="text-indigo-400">IA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#story" className="hover:text-white transition-colors">L'Histoire</a>
            <a href="#features" className="hover:text-white transition-colors">Solutions</a>
            <a href="#proof" className="hover:text-white transition-colors">Résultats</a>
          </div>
          <button 
            onClick={onStartDemo}
            className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg shadow-white/10 transform hover:scale-105"
          >
            Démo Live <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 cursor-pointer hover:bg-emerald-500/20 transition-colors"
               onClick={() => openLeadForm("Connexion WhatsApp Express")}>
            <Link className="w-3 h-3" />
            <span>Connecter WhatsApp en 1 clic</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Automatisez les réponses. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              Multipliez la croissance.
            </span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-12 space-y-4">
            <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
              Des agents IA qui rassurent, font des ventes, et sont <span className="text-white border-b-2 border-indigo-500/50">dévoués corps et âme</span> à votre business 24/7.
            </p>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Intégrez KlozIA directement à <span className="text-white font-semibold">WhatsApp, Messenger et Instagram</span>. Automatisez vos conversations, prises de rendez-vous et la qualification de vos leads sans lever le petit doigt.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStartDemo}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 fill-current" />
              Voir la Démo Live
            </button>
            <button 
              onClick={() => openLeadForm("Intégration WhatsApp")}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-slate-300 border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Connecter WhatsApp
            </button>
          </div>

          {/* Social Proof Logos */}
          <div className="mt-20 pt-10 border-t border-slate-800/50">
            <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-widest">S'intègre parfaitement avec</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center gap-2 font-bold text-2xl text-slate-300 hover:text-[#25D366] transition-colors cursor-default"><span className="p-2 bg-[#25D366]/20 rounded-full text-[#25D366] mr-2"><Smartphone className="w-6 h-6"/></span> WhatsApp</div>
              <div className="flex items-center gap-2 font-bold text-2xl text-slate-300 hover:text-[#0084FF] transition-colors cursor-default"><span className="p-2 bg-[#0084FF]/20 rounded-full text-[#0084FF] mr-2"><Facebook className="w-6 h-6"/></span> Messenger</div>
              <div className="flex items-center gap-2 font-bold text-2xl text-slate-300 hover:text-[#E1306C] transition-colors cursor-default"><span className="p-2 bg-[#E1306C]/20 rounded-full text-[#E1306C] mr-2"><Instagram className="w-6 h-6"/></span> Instagram</div>
            </div>
          </div>
        </div>
      </section>

      {/* STORYTELLING SECTION (NOUVEAU) */}
      <section id="story" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full w-fit mb-6">L'HISTOIRE DU FONDATEUR</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight">
            "J'ai failli tout perdre... <br/><span className="text-indigo-500">Merci KlozIA.</span>"
          </h2>
          
          <div className="space-y-8 text-lg text-slate-300 leading-relaxed font-light">
            <p>
              En 2021, j'ai fait ce que nous rêvons tous de faire. J'ai plaqué la sécurité de mon job de développeur, le salaire fixe, le confort, pour me jeter dans l'arène du e-commerce.
            </p>
            <p>
              Au début ? C'était l'euphorie. Les premières ventes, la courbe qui monte. Je me sentais invincible.
              <br/><span className="text-white font-medium">Mais très vite, le rêve s'est transformé en une prison dorée.</span>
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-4 flex items-center gap-3">
              <AlertCircle className="text-red-500"/> L'Enfer du "Ping" à 3h du matin
            </h3>
            <p>
              On ne vous parle jamais de l'autre côté de la croissance. On ne vous dit pas que plus vous vendez, plus vous devenez esclave.
              Mon téléphone est devenu mon bourreau.
            </p>
            <ul className="space-y-4 border-l-2 border-slate-700 pl-6 my-6 italic text-slate-400">
              <li>⏰ <strong className="text-white">2h du matin :</strong> Un client demande si sa commande est partie.</li>
              <li>⏰ <strong className="text-white">4h du matin :</strong> Un autre insulte ma marque parce qu'il n'a pas eu de réponse dans la minute.</li>
              <li>⏰ <strong className="text-white">Toute la journée :</strong> "C'est combien ?" "Livraison quand ?"</li>
            </ul>
            <p>
              Je voyais mon énergie s'évaporer. Je ne pilotais plus mon business, je subissais mon business. J'avais atteint ce plafond de verre terrifiant où chaque nouvelle vente ne m'apportait pas plus d'argent, mais plus de stress. Je stagnais. Je saturais. <span className="bg-red-500/20 text-red-200 px-1">J'étais devenu le goulot d'étranglement de ma propre réussite.</span>
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-4">L'échec de la délégation humaine</h3>
            <p>
              J'ai fait ce que tous les gurus disent de faire : "Délègue". J'ai embauché. J'ai mis des humains derrière les claviers.
              <br/>Le résultat ? <strong className="text-white">Un désastre.</strong>
            </p>
            <p>
              Personne – je dis bien PERSONNE – n'aimera votre business autant que vous.
              Mes commerciaux fatiguaient. Ils avaient des humeurs. Ils rataient des ventes faciles. Ils n'avaient pas la "faim". Et surtout, ils coûtaient une fortune pour un résultat médiocre.
            </p>
            <p>
              J'étais coincé. Soit je restais petit, soit j'explosais en vol.
            </p>

            <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-2xl mt-12 relative overflow-hidden group hover:border-indigo-500 transition-colors">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit className="w-32 h-32"/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">La Révélation : KlozIA</h3>
              <p className="mb-4">
                C'est là que mon passé de développeur et ma réalité d'entrepreneur se sont percutés.
                Je ne voulais pas d'un "chatbot" stupide. Je voulais un clone.
                Je voulais une version de moi-même, mais une version qui ne dort jamais, ne se plaint jamais, et ne rate jamais une vente.
              </p>
              <p className="font-bold text-white text-xl">
                J'ai créé KlozIA.
              </p>
            </div>

            <p>
              KlozIA n'est pas un outil de support. C'est votre meilleure commerciale, sous stéroïdes.
              Elle a une mission unique : Prendre votre prospect par la main et l'amener au closing avec une précision chirurgicale.
            </p>
            <p>
              Elle répond à 3h du matin avec la même fraîcheur et la même empathie qu'à 10h du matin.
              Elle connaît la psychologie de vente sur le bout des doigts.
              Elle transforme la frustration client en "Capital Amour" pour votre marque.
            </p>
            
            <h3 className="text-2xl font-bold text-white mt-12 mb-4">Le Résultat ?</h3>
            <p>
              Ce n'est pas juste du temps gagné. C'est de la croissance débloquée.
              Nous aidons les entreprises à passer de 0 à 1 million, et de 10 à 100 millions, simplement en supprimant la friction humaine là où elle fait mal.
            </p>
          </div>
        </div>
      </section>

      {/* CASE STUDY SECTION */}
      <section id="proof" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold mb-6">
                ÉTUDE DE CAS
              </div>
              <h2 className="text-4xl font-bold mb-6">
                "J'ai triplé mes ventes en 30 jours"
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Ne nous croyez pas sur parole. Regardez ce que nos clients disent quand ils voient leur tableau de bord le matin.
                L'impact est immédiat : plus de réactivité = plus de confiance = plus de ventes.
              </p>
              <div className="flex gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-3xl font-bold text-white mb-1">x3</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Ventes</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-3xl font-bold text-white mb-1">-90%</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Temps SAV</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
              <WhatsAppProof />
            </div>
          </div>
        </div>
      </section>

      {/* Features Recap */}
      <section id="features" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Clock}
              title="Dévouement 24/7"
              desc="Ne ratez plus aucune opportunité. Votre agent répond instantanément, de jour comme de nuit, pour rassurer et convertir."
            />
            <FeatureCard 
              icon={BrainCircuit}
              title="Qualification Automatique"
              desc="L'IA filtre les curieux et qualifie les vrais prospects avant même que vous n'ouvriez votre téléphone."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Ventes & Rendez-vous"
              desc="Transformez des discussions banales en chiffre d'affaires. L'IA guide le client jusqu'au paiement ou à la réservation."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Arrêtez de subir, recommencez à grandir.</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Ne laissez pas votre croissance être limitée par votre fatigue ou celle de vos équipes.
            Vous avez déjà le produit. Vous avez le marché. <br/>Il vous manque juste la machine à closer.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => openLeadForm("Réservation Appel Stratégique")}
              className="w-full md:w-auto bg-white text-slate-900 px-8 py-5 rounded-full font-bold text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <Calendar className="w-5 h-5" />
              Réserver un appel stratégique
            </button>
            
            <button 
              onClick={onStartDemo}
              className="w-full md:w-auto bg-indigo-600 text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/30 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 fill-current" />
              Tester le simulateur
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">Sans engagement • Installation rapide • Compatible mobile</p>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-10 border-t border-slate-900 text-center text-slate-600 text-sm bg-slate-950">
        <p className="mb-4">&copy; 2024 KlozIA Solutions. Propulsé par Gemini 2.5 Flash.</p>
        <button onClick={() => setAdminAuthOpen(true)} className="text-xs text-slate-800 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors">
          <Lock className="w-3 h-3"/> Admin Access
        </button>
      </footer>
    </div>
  );
};

// --- APPLICATION PRINCIPALE (SIMULATEUR V1) ---

const AppInterface = ({ onBackHome }) => {
  const [activeTab, setActiveTab] = useState('config');
  const [isMobile, setIsMobile] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const saveConfig = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('klozia_config_v2', JSON.stringify(config));
      setTimeout(() => { setSaveStatus('saved'); setTimeout(() => setSaveStatus(null), 2000); }, 500);
    } catch (e) { alert("Erreur sauvegarde"); }
  };

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "👋 Mode Démo activé. Je suis votre IA configurée. Testez-moi !", time: 'Now' }
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
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, time: 'Now' }]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      const cleanHistory = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: cleanHistory,
          context: config.context
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.text, time: 'Now' }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden animate-fade-in">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-72 bg-slate-900 border-r border-slate-800 flex-col z-20">
        <div className="h-20 flex items-center px-6 bg-slate-900/50 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={onBackHome}>
          <BrainCircuit className="w-8 h-8 text-indigo-500 mr-3" />
          <h1 className="text-xl font-bold">Kloz<span className="text-indigo-400">IA</span></h1>
        </div>
        <div className="px-6 py-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Simulateur</div>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <NavButton id="config" activeTab={activeTab} icon={Settings} label="Configuration IA" onClick={setActiveTab} />
          <NavButton id="chat" activeTab={activeTab} icon={MessageSquare} label="Tester le Chat" onClick={setActiveTab} />
        </nav>
        <div className="mt-auto p-4">
          <button onClick={onBackHome} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Retour accueil
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-2" onClick={onBackHome}>
          <BrainCircuit className="w-6 h-6 text-indigo-500" />
          <span className="font-bold">KlozIA <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-normal">APP</span></span>
        </div>
        {activeTab === 'config' && (
          <button onClick={saveConfig} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full">
            {saveStatus === 'saved' ? 'OK' : 'Sauver'}
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-0 relative">
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto p-4 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2 mt-4">
              <h2 className="text-2xl font-bold">Configuration de l'Agent</h2>
              <div className="text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">
                Mode Démo
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-indigo-400 mb-2 font-bold uppercase">Identité du Business</div>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                value={config.businessName} 
                onChange={e => setConfig({...config, businessName: e.target.value})} 
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-96">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs text-purple-400 font-bold uppercase">Instructions Système (Prompt)</div>
                {saveStatus === 'saved' && <span className="text-emerald-400 flex gap-1 text-xs items-center"><CheckCircle2 className="w-3 h-3"/> Sauvegardé</span>}
              </div>
              <textarea 
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 leading-relaxed outline-none resize-none focus:border-indigo-500 transition-colors font-mono text-sm"
                value={config.context} 
                onChange={e => setConfig({...config, context: e.target.value})} 
                placeholder="Décrivez comment l'IA doit se comporter..."
              />
              <div className="mt-3 text-xs text-slate-500">
                💡 Astuce : Soyez précis sur le ton et l'objectif de vente.
              </div>
            </div>
            
            <div className="hidden md:flex justify-end">
              <button onClick={saveConfig} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-white font-bold transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Sauvegarder les réglages
              </button>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col md:max-w-xl md:mx-auto bg-black/20 md:border-x md:border-slate-800">
            <div className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center sticky top-0 z-10 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">{config.businessName}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    En ligne
                  </div>
                </div>
              </div>
              <button onClick={() => setMessages([])} className="text-xs text-slate-500 hover:text-white transition-colors">
                Effacer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-md ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2 text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"/>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-75"/>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-150"/>
                  </div>
                </div>
              )}
              {error && (
                <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-500 font-bold text-xs uppercase mb-1">Erreur IA</h4>
                    <p className="text-red-400 text-xs font-mono">{error}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

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
                className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white p-3 rounded-full transition-all shadow-lg shadow-indigo-500/20 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className="md:hidden h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 fixed bottom-0 w-full z-40 pb-safe">
        <NavButton id="config" activeTab={activeTab} icon={Settings} label="Config" onClick={setActiveTab} isMobile={true} />
        <NavButton id="chat" activeTab={activeTab} icon={MessageSquare} label="Chat" onClick={setActiveTab} isMobile={true} />
      </nav>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <>
      {currentView === 'home' && (
        <LandingPage 
          onStartDemo={() => setCurrentView('app')} 
          onOpenAdmin={() => setCurrentView('admin')}
        />
      )}
      {currentView === 'app' && (
        <AppInterface onBackHome={() => setCurrentView('home')} />
      )}
      {currentView === 'admin' && (
        <AdminDashboard onBack={() => setCurrentView('home')} />
      )}
    </>
  );
}