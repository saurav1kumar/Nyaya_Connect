'use client';

import { useState } from 'react';

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i}>
          <div className="skeleton h-4 rounded" style={{ width: i === 0 ? '70px' : i === 7 ? '90px' : '80px' }}></div>
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ status }) {
  const cls = {
    NEW: 'badge-new',
    ASSIGNED: 'badge-assigned',
    CONTACTED: 'badge-contacted',
  };
  const dot = {
    NEW: '#eab308',
    ASSIGNED: '#22c55e',
    CONTACTED: '#3b82f6',
  };
  return (
    <span className={`badge ${cls[status] || 'badge-new'}`}>
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: dot[status] }}
      ></span>
      {status}
    </span>
  );
}

export default function LeadsTable({ leads, loading, onAssign }) {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(leads.length / perPage);
  const paginated = leads.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // If page exceeds available after filtering, reset
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div className="glass-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out' }}>
      {/* Table Header Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            All Leads
          </h2>
          <span
            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
            style={{
              background: 'var(--accent-glow)',
              color: 'var(--accent)',
            }}
          >
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-xs py-2 px-3 hidden sm:flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Category</th>
              <th>City</th>
              <th>Status</th>
              <th>Assigned Lawyer</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex flex-col items-center justify-center py-16">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: 'var(--input-bg)' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      No leads found
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((lead, index) => (
                <tr
                  key={lead.id}
                  style={{ animation: `slideUp ${0.1 + index * 0.03}s ease-out` }}
                >
                  <td>
                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {lead.id}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${
                            ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]
                          }22, ${
                            ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]
                          }44)`,
                          color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5],
                        }}
                      >
                        {lead.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {lead.phone}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-category">{lead.category}</span>
                  </td>
                  <td>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {lead.city}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td>
                    {lead.assignedLawyer ? (
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {lead.assignedLawyer}
                      </span>
                    ) : (
                      <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(lead.createdAt)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => onAssign(lead)}
                      className="btn-assign"
                      id={`assign-btn-${lead.id}`}
                    >
                      {lead.status === 'ASSIGNED' ? 'Reassign' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border-color)]">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, leads.length)} of {leads.length} leads
          </p>
          <div className="flex items-center gap-1.5">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              id="pagination-prev"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                id={`pagination-page-${page}`}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              id="pagination-next"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
