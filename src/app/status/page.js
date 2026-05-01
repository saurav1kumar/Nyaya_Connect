'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StatusTracker() {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/consultations?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        if (data.length === 0) setError('No cases found for this phone number.');
      } else {
        setError('Failed to fetch status. Please try again.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      ASSIGNED: 'bg-blue-100 text-blue-700 border-blue-200',
      PAID: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 mb-12 hover:-translate-x-1 transition-all">

          ← Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[var(--text-primary)] mb-4">Track Your Case</h1>
          <p className="text-[var(--text-secondary)]">Enter the phone number you used to submit your request.</p>
        </div>

        <div className="glass-card p-8 mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input 
                required
                type="tel" 
                placeholder="Enter Phone (e.g. 9876543210)" 
                className="glass-input text-lg py-4"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="px-8 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Find My Case'}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-4 font-medium">⚠️ {error}</p>}
        </div>

        <div className="space-y-6">
          {results && results.map(c => (
            <div key={c.id} className="glass-card p-8 hover:shadow-xl transition-all border-l-4 border-l-indigo-600">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Case ID</span>
                  <div className="text-lg font-black text-[var(--text-primary)]">{c.id}</div>
                </div>
                {getStatusBadge(c.status)}
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">Category</div>
                  <div className="font-bold text-[var(--text-primary)]">{c.category}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">Assigned Advocate</div>
                  <div className="font-bold text-[var(--text-primary)]">{c.lawyerName || 'Pending Assignment...'}</div>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-[var(--text-secondary)] italic">
                  {c.status === 'PENDING' && "Our team is reviewing your request. Please wait for assignment."}
                  {c.status === 'ASSIGNED' && "Advocate assigned! Proceed to payment for online chat."}
                  {c.status === 'PAID' && "Payment received! Waiting for advocate to start chat."}
                  {c.status === 'ACTIVE' && "Chat session is now live!"}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {c.status === 'ASSIGNED' && (
                    <Link 
                      href={`/checkout/${c.id}`}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl text-center font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
                    >
                      Pay ₹{c.fee} & Start Chat
                    </Link>
                  )}
                  {(c.status === 'PAID' || c.status === 'ACTIVE') && (
                    <Link 
                      href={`/chat/${c.id}`}
                      className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl text-center font-black shadow-lg shadow-green-600/20 hover:scale-105 transition-all"
                    >
                      Enter Chat Room
                    </Link>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
