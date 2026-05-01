'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdvocateLogin() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/lawyers')
      .then(res => res.json())
      .then(data => setLawyers(data));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/advocate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedName, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('advocateSession', JSON.stringify(data.advocate));
        router.push('/advocate/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-600/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6l9-4 9 4" /><path d="M3 6v8l9 4 9-4V6" /></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Advocate Portal</h1>
          <p className="text-slate-500 font-medium">Log in to manage your legal consultations.</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Select Your Name</label>
              <select 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none"
                value={selectedName}
                onChange={e => setSelectedName(e.target.value)}
              >
                <option value="">Choose advocate</option>
                {lawyers.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Secret Password</label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm font-bold text-center">⚠️ {error}</p>}

            <button 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Secure Access • NyayConnect Advocate Network
        </p>
      </div>
    </div>
  );
}
