'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import LeadsTable from '../components/LeadsTable';
import AssignModal from '../components/AssignModal';
import AssignConsultationModal from '../components/AssignConsultationModal';


export default function Home() {
  const [leads, setLeads] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leads');
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  const [consModalOpen, setConsModalOpen] = useState(false);
  const [selectedCons, setSelectedCons] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, lawyersRes, consRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/lawyers'),
        fetch('/api/consultations')
      ]);
      setLeads(await leadsRes.json());
      setLawyers(await lawyersRes.json());
      setConsultations(await consRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({ category: '', city: '', status: '', dateFrom: '', dateTo: '' });
  }, []);

  const handleAssignLead = useCallback(async (leadId, lawyer) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, lawyerName: lawyer.name, status: 'ASSIGNED' }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedLawyer: lawyer.name, status: 'ASSIGNED' } : l));
        setLeadModalOpen(false);
      }
    } catch (err) { console.error(err); }
  }, []);

  const handleAssignCons = useCallback(async (id, lawyer) => {
    try {
      const res = await fetch('/api/consultations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'ASSIGN', lawyerId: lawyer.id }),
      });
      if (res.ok) {
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, lawyerId: lawyer.id, lawyerName: lawyer.name, status: 'ASSIGNED' } : c));
        setConsModalOpen(false);
      }
    } catch (err) { console.error(err); }
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-[260px] transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-8 pb-24 lg:pb-8">
          <header className="mb-12">
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">NyayGrid Control Center</h1>
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">Manage legal leads and online consultations</p>
          </header>

          {/* Tab Switcher */}
          <div className="flex gap-6 mb-10 bg-[var(--input-bg)] p-1.5 rounded-2xl border border-[var(--glass-border)] w-fit">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'leads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Leads Management
            </button>
            <button 
              onClick={() => setActiveTab('consultations')}
              className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'consultations' ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Online Consultations
            </button>
          </div>

          <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleFilterReset} />

          {activeTab === 'leads' ? (
            <LeadsTable 
              leads={leads.filter(l => (!filters.category || l.category === filters.category) && (!filters.city || l.city === filters.city))} 
              loading={loading} 
              onAssign={(l) => { setSelectedLead(l); setLeadModalOpen(true); }} 
            />
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Advocate</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="text-center py-10">Loading consultations...</td></tr>
                    ) : consultations.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-10 text-[var(--text-muted)]">No consultations found.</td></tr>
                    ) : consultations.map(c => (
                      <tr key={c.id}>
                        <td className="font-mono font-bold text-xs">{c.id}</td>
                        <td>
                          <div className="font-bold">{c.clientName}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{c.clientPhone}</div>
                        </td>
                        <td><span className="badge badge-category">{c.category}</span></td>
                        <td>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                            c.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            c.status === 'ASSIGNED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            c.status === 'PAID' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                            c.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="font-bold">{c.lawyerName || '—'}</td>
                        <td>
                          {c.status === 'PENDING' && (
                            <button 
                              onClick={() => { setSelectedCons(c); setConsModalOpen(true); }}
                              className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-lg shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
                            >
                              Assign
                            </button>
                          )}
                          {(c.status === 'ACTIVE' || c.status === 'PAID') && (
                            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                              Live Room
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <AssignModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        lead={selectedLead}
        onAssign={handleAssignLead}
        lawyers={lawyers}
      />

      <AssignConsultationModal
        isOpen={consModalOpen}
        onClose={() => setConsModalOpen(false)}
        consultation={selectedCons}
        onAssign={handleAssignCons}
        lawyers={lawyers}
      />
    </div>
  );
}
