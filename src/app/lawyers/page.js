'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { State, City } from 'country-state-city';


export default function LawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    state: '',
    stateCode: '',
    city: '',
    experience: '',
    consultationFee: 499,
    password: 'advocate123',
  });



  const [submitting, setSubmitting] = useState(false);

  const fetchLawyers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lawyers');
      const data = await res.json();
      setLawyers(data);
    } catch (err) {
      console.error('Failed to fetch lawyers', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const handleAddLawyer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/lawyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newLawyer = await res.json();
        setLawyers((prev) => [...prev, newLawyer]);
        setModalOpen(false);
        setFormData({ name: '', specialization: '', state: '', stateCode: '', city: '', experience: '', consultationFee: 499, password: 'advocate123' });


      }
    } catch (err) {
      console.error('Failed to add lawyer', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-[260px] transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Advocates Management</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Add and manage your panel of legal experts</p>
            </div>
            <button 
              onClick={() => setModalOpen(true)}
              className="btn-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Advocate
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Specialization</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>City</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Fee (₹)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Experience</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Actions</th>

                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 w-12 bg-[var(--input-bg)] rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--input-bg)] rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--input-bg)] rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-[var(--input-bg)] rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 bg-[var(--input-bg)] rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-8 bg-[var(--input-bg)] rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 bg-[var(--input-bg)] rounded"></div></td>
                      </tr>
                    ))
                  ) : lawyers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                        No advocates found. Start by adding one.
                      </td>
                    </tr>
                  ) : (
                    lawyers.map((lawyer) => (
                      <tr key={lawyer.id} className="hover:bg-[var(--input-bg)] transition-colors">
                        <td className="px-6 py-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{lawyer.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xs font-bold">
                              {lawyer.name.charAt(5)}
                            </div>
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{lawyer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            {lawyer.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{lawyer.city}</td>
                        <td className="px-6 py-4 text-sm font-black text-indigo-600">₹{lawyer.consultationFee}</td>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lawyer.experience}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${lawyer.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{lawyer.isOnline ? 'Online' : 'Offline'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="btn-ghost text-xs py-1 px-2">Edit</button>
                        </td>
                      </tr>

                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="glass-card w-full max-w-lg p-6 md:p-8 relative z-10" style={{ animation: 'scaleIn 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Add New Advocate</h3>
              <button 
                onClick={() => setModalOpen(false)} 
                className="p-2 rounded-xl hover:bg-[var(--input-bg)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleAddLawyer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Adv. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Specialization *</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="glass-select w-full"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Property Law">Property Law</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Labour Law">Labour Law</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>State *</label>
                  <select 
                    required
                    className="glass-select w-full"
                    value={formData.stateCode}
                    onChange={(e) => {
                      const state = State.getStateByCodeAndCountry(e.target.value, 'IN');
                      setFormData({ ...formData, stateCode: e.target.value, state: state.name, city: '' });
                    }}
                  >
                    <option value="">Select State</option>
                    {State.getStatesOfCountry('IN').map(s => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>City *</label>
                  <select 
                    required
                    className="glass-select w-full"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!formData.stateCode}
                  >
                    <option value="">Select City</option>
                    {formData.stateCode && City.getCitiesOfState('IN', formData.stateCode).map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Experience *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    placeholder="499"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) })}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Portal Password *</label>
                <input
                  type="text"
                  placeholder="advocate123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass-input"
                  required
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">Used by the advocate to log into their portal.</p>
              </div>


              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-ghost flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  {submitting ? 'Adding...' : 'Add Advocate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
