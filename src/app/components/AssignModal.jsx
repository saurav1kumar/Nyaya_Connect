'use client';

import { useState, useEffect, useRef } from 'react';
import { lawyers } from '../data/mockData';

export default function AssignModal({ isOpen, onClose, lead, onAssign }) {
  const [selectedLawyer, setSelectedLawyer] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLawyer('');
      setIsAssigning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !lead) return null;

  const selected = lawyers.find((l) => l.id === selectedLawyer);

  const handleAssign = async () => {
    if (!selectedLawyer) return;
    setIsAssigning(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    onAssign(lead.id, selected);
    setIsAssigning(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        ref={modalRef}
        className="glass-card w-full max-w-lg p-0 overflow-hidden"
        style={{ animation: 'scaleIn 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Assign Lawyer
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              to lead <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>{lead.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--input-bg)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
            id="close-modal-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Lead Info */}
        <div className="px-5 pt-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Name</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
              </div>
              <div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Category</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lead.category}</p>
              </div>
              <div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>City</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lead.city}</p>
              </div>
              <div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Phone</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lead.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lawyer Selection */}
        <div className="p-5">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Select Lawyer
          </label>
          <select
            value={selectedLawyer}
            onChange={(e) => setSelectedLawyer(e.target.value)}
            className="glass-select w-full mb-4"
            id="lawyer-select"
          >
            <option value="">Choose a lawyer...</option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — {l.specialization} ({l.city})
              </option>
            ))}
          </select>

          {/* Selected Lawyer Details */}
          {selected && (
            <div
              className="p-4 rounded-xl border"
              style={{
                background: 'var(--input-bg)',
                borderColor: 'var(--accent-glow)',
                animation: 'slideUp 0.2s ease-out',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {selected.name.split(' ').pop()[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selected.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selected.specialization}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selected.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selected.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selected.activeCases} active cases</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--border-color)]">
          <button onClick={onClose} className="btn-ghost" id="cancel-assign-btn">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedLawyer || isAssigning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            id="confirm-assign-btn"
          >
            {isAssigning ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Assigning...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Confirm Assignment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
