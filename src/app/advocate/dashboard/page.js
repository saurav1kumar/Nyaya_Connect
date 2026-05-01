'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdvocateDashboard() {
  const router = useRouter();
  const [advocate, setAdvocate] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const session = localStorage.getItem('advocateSession');
    if (!session) {
      router.push('/advocate/login');
      return;
    }
    const adv = JSON.parse(session);
    setAdvocate(adv);

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/consultations?lawyerId=${adv.id}`);
        const data = await res.json();
        setConsultations(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleStatusUpdate = async (id, action) => {
    try {
      const res = await fetch('/api/consultations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        // Refresh local data
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: action === 'ACCEPT' ? 'ACTIVE' : 'COMPLETED' } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleOnline = async () => {
    const newStatus = !advocate.isOnline;
    try {
      await fetch('/api/lawyers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: advocate.id, isOnline: newStatus })
      });
      const updated = { ...advocate, isOnline: newStatus };
      setAdvocate(updated);
      localStorage.setItem('advocateSession', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  if (!advocate || loading) return <div className="min-h-screen flex items-center justify-center">Loading portal...</div>;

  const pending = consultations.filter(c => c.status === 'PAID');
  const active = consultations.filter(c => c.status === 'ACTIVE');
  const completed = consultations.filter(c => c.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 6l9-4 9 4" /><path d="M3 6v8l9 4 9-4V6" /></svg>
          </div>
          <span className="text-xl font-black tracking-tighter">AdvocatePortal</span>
        </div>

        <nav className="flex-1 space-y-2">
          {['Dashboard', 'My Schedule', 'Reviews', 'Account'].map(item => (
            <button key={item} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all ${item === 'Dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {item}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
            <button 
              onClick={toggleOnline}
              className={`w-12 h-6 rounded-full transition-all relative ${advocate.isOnline ? 'bg-green-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${advocate.isOnline ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('advocateSession'); router.push('/advocate/login'); }}
            className="w-full py-3 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 rounded-xl font-bold text-sm transition-all"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Welcome, {advocate.name}</h1>
            <p className="text-slate-500 font-medium">{advocate.specialization} • {advocate.city}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Consultation Fee</div>
              <div className="text-lg font-black text-indigo-600">₹{advocate.consultationFee}</div>
            </div>
            <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl shadow-sm">🔔</div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 mb-10 border-b border-slate-200">
          {[
            { id: 'pending', label: 'Paid Requests', count: pending.length },
            { id: 'active', label: 'Active Chats', count: active.length },
            { id: 'completed', label: 'History', count: completed.length }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-black transition-all relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{tab.count}</span>}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-6">
          {activeTab === 'pending' && pending.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex gap-8 items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">New Request • {c.id}</div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{c.clientName}</h4>
                  <p className="text-sm text-slate-500 font-medium line-clamp-1">{c.issue}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-8">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment</div>
                  <div className="text-sm font-black text-green-600 font-mono">₹{c.fee} RECEIVED</div>
                </div>
                <button 
                  onClick={() => handleStatusUpdate(c.id, 'ACCEPT')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
                >
                  Accept & Start Chat
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'active' && active.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between border-l-4 border-l-green-500">
              <div className="flex gap-8 items-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-2xl">💬</div>
                <div>
                  <div className="text-xs font-black text-green-500 uppercase tracking-widest mb-1">Live Consultation • {c.id}</div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{c.clientName}</h4>
                  <p className="text-sm text-slate-500 font-medium">Session in progress...</p>
                </div>
              </div>
              <Link 
                href={`/advocate/chat/${c.id}`}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-black shadow-lg shadow-green-600/20 hover:scale-105 transition-all"
              >
                Open Chat Room
              </Link>
            </div>
          ))}

          {activeTab === 'completed' && completed.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 opacity-70 flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900">{c.clientName}</h4>
                <div className="text-xs text-slate-400 font-bold">{c.category} • {new Date(c.endedAt).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400 uppercase">Status</div>
                <div className="text-sm font-black text-slate-600 uppercase">Completed</div>
              </div>
            </div>
          ))}

          {consultations.filter(c => 
            activeTab === 'pending' ? c.status === 'PAID' : 
            activeTab === 'active' ? c.status === 'ACTIVE' : 
            c.status === 'COMPLETED'
          ).length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-6 opacity-30">📂</div>
              <h4 className="text-xl font-black text-slate-400">No {activeTab} consultations.</h4>
              <p className="text-slate-400 font-medium">Any new {activeTab === 'pending' ? 'paid requests' : 'consultations'} will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
