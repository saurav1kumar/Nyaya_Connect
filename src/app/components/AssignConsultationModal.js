'use client';

import { useState } from 'react';

export default function AssignConsultationModal({ isOpen, onClose, consultation, onAssign, lawyers }) {
  const [selectedLawyerId, setSelectedLawyerId] = useState('');

  if (!isOpen || !consultation) return null;

  const handleAssign = () => {
    const lawyer = lawyers.find(l => l.id === selectedLawyerId);
    if (lawyer) {
      onAssign(consultation.id, lawyer);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-900">Assign Advocate</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Consultation ID: {consultation.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl">×</button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Client Details</div>
            <div className="font-black text-slate-800">{consultation.clientName}</div>
            <div className="text-sm text-indigo-600 font-bold mt-1">{consultation.category} • {consultation.city}</div>
            <p className="text-xs text-slate-500 mt-3 italic line-clamp-2">"{consultation.issue}"</p>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Select Advocate to Assign</label>
            <select 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
              value={selectedLawyerId}
              onChange={e => setSelectedLawyerId(e.target.value)}
            >
              <option value="">Choose an advocate...</option>
              {lawyers
                .filter(l => l.specialization.includes(consultation.category))
                .map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.experience} exp) - Fee: ₹{l.consultationFee}
                  </option>
                ))}
            </select>
          </div>

          <button 
            disabled={!selectedLawyerId}
            onClick={handleAssign}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
          >
            Assign Advocate & Set Fee
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
