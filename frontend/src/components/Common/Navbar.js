import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';

const links = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/coding', label: '💻 Coding' },
  { to: '/interview', label: '🎯 Interview' },
  { to: '/mock-interview', label: '🎤 Mock' },
  { to: '/quiz', label: '📝 Quiz' },
  { to: '/leaderboard', label: '🏆 Leaderboard' },
  { to: '/notes', label: '📓 Notes' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isMobile = width < 1024;
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* NAV BAR */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        height: '3.75rem',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', whiteSpace: 'nowrap', marginRight: '0.75rem', flexShrink: 0 }}>
          ⚡ GenZ Hub
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '0.375rem 0.625rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: location.pathname === l.to ? 'var(--primary)' : 'var(--text2)',
                background: location.pathname === l.to ? 'var(--bg3)' : 'transparent',
                whiteSpace: 'nowrap',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto', flexShrink: 0 }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.375rem' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/profile" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
            {user?.avatar ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(user?.name)}
          </Link>
          {!isMobile && (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.375rem 0.625rem', color: '#ef4444', fontWeight: 600 }}>
              Logout
            </button>
          )}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem 0.5rem', color: 'var(--text)', fontWeight: 700, lineHeight: 1 }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed',
          top: '3.75rem',
          left: 0,
          right: 0,
          background: 'var(--bg2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0.5rem 2rem rgba(0,0,0,0.3)',
          borderBottom: '3px solid var(--primary)',
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: location.pathname === l.to ? 700 : 500,
                color: location.pathname === l.to ? 'var(--primary)' : 'var(--text)',
                background: location.pathname === l.to ? 'var(--bg3)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                display: 'block',
              }}>
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#ef4444',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
          }}>
            🚪 Logout
          </button>
        </div>
      )}
    </>
  );
}
