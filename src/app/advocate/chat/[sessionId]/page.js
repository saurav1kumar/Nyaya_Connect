'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdvocateChatRoom() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [advocate, setAdvocate] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const session = localStorage.getItem('advocateSession');
    if (!session) {
      router.push('/advocate/login');
      return;
    }
    setAdvocate(JSON.parse(session));

    const fetchData = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          fetch(`/api/consultations?id=${sessionId}`),
          fetch(`/api/messages?sessionId=${sessionId}`)
        ]);
        const cData = await cRes.json();
        const mData = await mRes.json();
        setConsultation(cData);
        setMessages(mData);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [sessionId, router]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sender: 'advocate',
          senderName: advocate?.name,
          text
        })
      });
      setMessages(prev => [...prev, {
        id: 'temp-' + Date.now(),
        sessionId,
        sender: 'advocate',
        senderName: advocate?.name,
        text,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  const endSession = async () => {
    if (!confirm('Are you sure you want to end this consultation?')) return;
    try {
      await fetch('/api/consultations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, action: 'COMPLETE' })
      });
      router.push('/advocate/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Left Column - Client Info */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col p-8 overflow-y-auto">
        <Link href="/advocate/dashboard" className="text-sm font-black text-indigo-600 mb-10 flex items-center gap-2">← BACK TO LIST</Link>
        
        <div className="mb-10 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-sm">👤</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">{consultation?.clientName}</h2>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{consultation?.clientPhone}</div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Case Category</div>
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-black inline-block">{consultation?.category} Law</div>
          </div>

          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Legal Concern</div>
            <div className="p-5 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed italic border border-slate-100">
              "{consultation?.issue}"
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <button 
              onClick={endSession}
              className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              End Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-black text-slate-800">Secure Live Chat</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-slate-400">Session ID: {sessionId}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Client is Active</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'advocate' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] group`}>
                <div className={`px-5 py-4 rounded-3xl shadow-sm relative ${
                  m.sender === 'advocate' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {m.sender !== 'advocate' && (
                    <div className="text-[10px] font-black uppercase text-indigo-500 mb-1">CLIENT</div>
                  )}
                  <p className="text-sm leading-relaxed font-medium">{m.text}</p>
                </div>
                <div className={`text-[10px] mt-2 font-bold text-slate-400 px-2 ${m.sender === 'advocate' ? 'text-right' : 'text-left'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* Input */}
        <div className="p-8 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="flex gap-4 max-w-5xl mx-auto">
            <input 
              type="text" 
              placeholder="Type your legal advice or message..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-sm font-medium outline-none"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />
            <button className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
