'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../components/ThemeProvider';


export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: 'platform', label: 'Platform', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> },
    { id: 'security', label: 'Security', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-[260px] transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your profile and platform preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:w-64 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeTab === tab.id ? 'glass-card bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-[var(--input-bg)]'
                  }`}
                  style={{ color: activeTab === tab.id ? 'white' : 'var(--text-secondary)' }}
                >
                  <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-60'}>{tab.icon}</span>
                  <span className="text-sm font-bold">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 glass-card p-6 md:p-8">
              {activeTab === 'profile' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Edit Profile</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                      A
                    </div>
                    <div>
                      <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Super Admin</h4>
                      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Super Admin Role • Active since Mar 2026</p>
                      <button className="btn-ghost text-xs py-1.5 px-3">Change Avatar</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
                      <input type="text" defaultValue="Super Admin" className="glass-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                      <input type="email" defaultValue="admin@nyaygrid.com" className="glass-input" />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button className="btn-primary">Save Profile Changes</button>
                  </div>
                </div>
              )}

              {activeTab === 'platform' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Platform Settings</h3>
                  
                  {/* Theme Settings */}
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)]" style={{ background: 'var(--input-bg)' }}>
                      <div>
                        <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>App Theme</h4>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Currently using {theme} mode</p>
                      </div>
                      <button onClick={toggleTheme} className="btn-ghost text-xs">
                        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                      </button>
                    </div>
                  </div>

                  {/* Consultation Settings */}
                  <h3 className="text-lg font-bold mb-6 pt-6 border-t border-[var(--border-color)]" style={{ color: 'var(--text-primary)' }}>Consultation Fees</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Default Consultation Fee (₹)</label>
                      <input 
                        type="number" 
                        defaultValue={499} 
                        className="glass-input" 
                        onChange={(e) => fetch('/api/settings', { method: 'PATCH', body: JSON.stringify({ defaultConsultationFee: parseInt(e.target.value) }) })}
                      />
                      <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">Applied to all new consultation requests by default.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Platform Commission (%)</label>
                      <input 
                        type="number" 
                        defaultValue={20} 
                        className="glass-input"
                        onChange={(e) => fetch('/api/settings', { method: 'PATCH', body: JSON.stringify({ platformCommission: parseInt(e.target.value) }) })}
                      />
                      <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">Commission charged by NyayConnect on every paid session.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-indigo-600/20 bg-indigo-600/5">
                    <div>
                      <h4 className="text-sm font-bold text-indigo-600">Auto-Assign Advocates</h4>
                      <p className="text-xs text-indigo-600/70">Coming Soon: Use AI to match clients with advocates automatically.</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-slate-300">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                    </div>
                  </div>
                </div>
              )}


              {activeTab === 'security' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Security & Privacy</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
                      <input type="password" placeholder="••••••••" className="glass-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>New Password</label>
                      <input type="password" placeholder="••••••••" className="glass-input" />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button className="btn-primary">Update Password</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
