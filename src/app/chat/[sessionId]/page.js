'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientChatRoom() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Poll for consultation status and messages
  useEffect(() => {
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
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [sessionId]);

  // Scroll to bottom on new messages
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
          sender: 'client',
          senderName: consultation?.clientName || 'Client',
          text
        })
      });
      // Immediate optimistic update
      setMessages(prev => [...prev, {
        id: 'temp-' + Date.now(),
        sessionId,
        sender: 'client',
        senderName: consultation?.clientName,
        text,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Connecting to secure chat...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 shadow-lg flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/status" className="p-2 hover:bg-white/10 rounded-full transition-all">←</Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
              {consultation?.lawyerName?.charAt(5)}
            </div>
            <div>
              <div className="font-bold flex items-center gap-2">
                {consultation?.lawyerName}
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <div className="text-xs text-white/70 uppercase tracking-widest">{consultation?.category} Advocate</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div className="text-xs text-white/60">Session ID</div>
            <div className="text-sm font-mono font-bold">{sessionId}</div>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold border border-white/20 transition-all">Report</button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* System Message */}
        <div className="flex justify-center my-8">
          <div className="bg-white/50 backdrop-blur rounded-full px-6 py-2 text-xs font-bold text-gray-500 border border-white">
            SESSION STARTED • {new Date(consultation?.createdAt).toLocaleDateString()}
          </div>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative ${
              m.sender === 'client' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {m.sender !== 'client' && (
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">{m.senderName}</div>
              )}
              <p className="text-sm leading-relaxed">{m.text}</p>
              <div className={`text-[9px] mt-1 text-right opacity-60 ${m.sender === 'client' ? 'text-indigo-100' : 'text-gray-400'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {consultation?.status === 'PAID' && (
          <div className="flex justify-center my-8">
            <div className="bg-amber-50 text-amber-600 border border-amber-100 rounded-xl px-6 py-4 text-center max-w-sm">
              <div className="text-sm font-bold mb-1 italic">Waiting for Advocate...</div>
              <p className="text-xs opacity-80">The advocate has been notified and will join the chat room shortly. Please stay on this page.</p>
            </div>
          </div>
        )}

        {consultation?.status === 'COMPLETED' && (
          <div className="flex justify-center my-8">
            <div className="bg-gray-200 text-gray-600 rounded-xl px-6 py-4 text-center">
              <div className="text-sm font-bold">This session has been completed.</div>
              <p className="text-xs">You can no longer send messages in this chat.</p>
            </div>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4 shadow-2xl">
        {consultation?.status === 'ACTIVE' ? (
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
            <input 
              type="text" 
              placeholder="Type your message here..." 
              className="flex-1 bg-gray-100 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-600/20 transition-all text-sm"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />
            <button className="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm italic">
            Input is disabled for this session.
          </div>
        )}
      </div>
    </div>
  );
}
