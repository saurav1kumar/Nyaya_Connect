'use client';

import { categories, cities, statuses } from '../data/mockData';

export default function Filters({ filters, onFilterChange, onReset }) {
  return (
    <div className="glass-card p-5 mb-6" style={{ animation: 'slideUp 0.3s ease-out' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
          id="reset-filters-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {/* Category */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="glass-select w-full"
            id="filter-category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            className="glass-select w-full"
            id="filter-city"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="glass-select w-full"
            id="filter-status"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            className="glass-input"
            id="filter-date-from"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Date To
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            className="glass-input"
            id="filter-date-to"
          />
        </div>
      </div>

      {/* Active filters count */}
      {Object.values(filters).some(v => v !== '') && (
        <div className="mt-3 flex items-center gap-2 flex-wrap" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Active:</span>
          {filters.category && (
            <span className="badge badge-category text-xs cursor-pointer" onClick={() => onFilterChange('category', '')}>
              {filters.category} ×
            </span>
          )}
          {filters.city && (
            <span className="badge badge-category text-xs cursor-pointer" onClick={() => onFilterChange('city', '')}>
              {filters.city} ×
            </span>
          )}
          {filters.status && (
            <span className={`badge badge-${filters.status.toLowerCase()} text-xs cursor-pointer`} onClick={() => onFilterChange('status', '')}>
              {filters.status} ×
            </span>
          )}
          {filters.dateFrom && (
            <span className="badge badge-category text-xs cursor-pointer" onClick={() => onFilterChange('dateFrom', '')}>
              From: {filters.dateFrom} ×
            </span>
          )}
          {filters.dateTo && (
            <span className="badge badge-category text-xs cursor-pointer" onClick={() => onFilterChange('dateTo', '')}>
              To: {filters.dateTo} ×
            </span>
          )}
        </div>
      )}
    </div>
  );
}
