'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AnalyticsPage() {
  const [leads, setLeads] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, lawyersRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/lawyers'),
      ]);
      const leadsData = await leadsRes.json();
      const lawyersData = await lawyersRes.json();
      setLeads(leadsData);
      setLawyers(lawyersData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculations
  const totalLeads = leads.length;
  const assignedLeads = leads.filter(l => l.status === 'ASSIGNED').length;
  const newLeads = leads.filter(l => l.status === 'NEW').length;
  const contactedLeads = leads.filter(l => l.status === 'CONTACTED').length;
  
  const categoryCounts = leads.reduce((acc, lead) => {
    acc[lead.category] = (acc[lead.category] || 0) + 1;
    return acc;
  }, {});

  const cityCounts = leads.reduce((acc, lead) => {
    acc[lead.city] = (acc[lead.city] || 0) + 1;
    return acc;
  }, {});

  const maxCategory = Math.max(...Object.values(categoryCounts), 1);
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const stats = [
    { label: 'Conversion Rate', value: totalLeads ? `${((assignedLeads / totalLeads) * 100).toFixed(1)}%` : '0%', icon: '🚀', color: '#10b981' },
    { label: 'Avg. Response Time', value: '2.4 hrs', icon: '⚡', color: '#6366f1' },
    { label: 'Lawyer Efficiency', value: '94%', icon: '📈', color: '#f59e0b' },
    { label: 'Customer Rating', value: '4.8/5', icon: '⭐', color: '#ec4899' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-[260px] transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Performance Analytics</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Visual insights into leads and assignments</p>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center transition-transform hover:-translate-y-1">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Leads by Category</h3>
              <div className="space-y-5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="h-4 w-20 bg-[var(--input-bg)] rounded"></div>
                      <div className="flex-1 h-2 bg-[var(--input-bg)] rounded-full"></div>
                      <div className="h-4 w-8 bg-[var(--input-bg)] rounded"></div>
                    </div>
                  ))
                ) : (
                  sortedCategories.map(([cat, count]) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-xs font-bold mb-2 uppercase tracking-tight" style={{ color: 'var(--text-secondary)' }}>
                        <span>{cat}</span>
                        <span style={{ color: 'var(--accent)' }}>{count} leads</span>
                      </div>
                      <div className="h-3 w-full bg-[var(--input-bg)] rounded-full overflow-hidden shadow-inner border border-[var(--border-color)]">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${(count / maxCategory) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Status Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'New', count: newLeads, color: '#eab308' },
                  { label: 'Assigned', count: assignedLeads, color: '#22c55e' },
                  { label: 'Contacted', count: contactedLeads, color: '#3b82f6' },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl border border-[var(--glass-border)] text-center shadow-sm" style={{ background: 'var(--input-bg)' }}>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{loading ? '...' : s.count}</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-2xl border border-[var(--glass-border)] shadow-inset" style={{ background: 'var(--input-bg)' }}>
                <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Lawyer Availability</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <span>Currently Active Architects</span>
                      <span className="font-bold">{lawyers.filter(l => l.activeCases > 0).length} / {lawyers.length}</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border-color)]">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${lawyers.length ? (lawyers.filter(l => l.activeCases > 0).length / lawyers.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
