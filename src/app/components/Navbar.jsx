'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ sidebarCollapsed }) {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass-card rounded-none border-t-0 border-x-0" style={{ borderRadius: 0 }}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3.5">
        {/* Left: Page title (mobile) + Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6l9-4 9 4" />
                <path d="M3 6v8l9 4 9-4V6" />
              </svg>
            </div>
          </div>

          {/* Search */}
          <div className={`relative transition-all duration-300 ${searchFocused ? 'w-full max-w-md' : 'w-64 max-w-xs'} hidden sm:block`}>
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search leads, lawyers..."
              className="glass-input pl-10 pr-4 py-2.5 text-sm"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              id="navbar-search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            className="relative p-2.5 rounded-xl hover:bg-[var(--input-bg)] transition-all duration-200"
            style={{ color: 'var(--text-secondary)' }}
            id="notifications-btn"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2" style={{ ringColor: 'var(--glass-bg)' }}></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--input-bg)] transition-all duration-200"
            style={{ color: 'var(--text-secondary)' }}
            id="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-8 mx-1" style={{ background: 'var(--border-color)' }}></div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-[var(--input-bg)] transition-all duration-200"
              id="profile-dropdown-btn"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                A
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Admin</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Super Admin</div>
              </div>
              <svg
                className={`hidden md:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 animate-scale-in" style={{ animation: 'scaleIn 0.2s ease-out' }}>
                <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Admin User</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>admin@nyaygrid.com</div>
                </div>
                {['Profile', 'Preferences', 'Help Center'].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--input-bg)] transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item}
                  </button>
                ))}
                <div className="border-t border-[var(--border-color)] mt-1 pt-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
