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

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.logo}>⚡ GenZ Hub</Link>

        {/* Desktop — hidden on mobile via CSS */}
        <div className="nb-desktop">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              ...styles.link,
              ...(location.pathname === l.to ? styles.activeLink : {})
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div style={styles.right}>
          <button onClick={toggleTheme} style={styles.iconBtn}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/profile" style={styles.avatar}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={styles.avatarImg} />
              : getInitials(user?.name)}
          </Link>
          {/* Logout — hidden on mobile via CSS */}
          <button onClick={handleLogout} className="nb-logout-btn" style={{ ...styles.iconBtn, color: '#ef4444' }}>
            Logout
          </button>
          {/* Hamburger — shown only on mobile via CSS */}
          <button className="nb-hamburger" style={styles.iconBtn} onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...styles.mobileLink, ...(location.pathname === l.to ? styles.mobileLinkActive : {}) }}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={styles.mobileLogout}>🚪 Logout</button>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0 1rem',
    height: '3.75rem',
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  logo: { fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', whiteSpace: 'nowrap', marginRight: '0.5rem' },
  link: { padding: '0.375rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text2)', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  activeLink: { background: 'var(--bg3)', color: 'var(--primary)', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto', flexShrink: 0 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: '0.375rem 0.625rem', borderRadius: '0.5rem', color: 'var(--text)', fontWeight: 500, display: 'flex', alignItems: 'center' },
  avatar: { width: '2.125rem', height: '2.125rem', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, overflow: 'hidden', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  mobileMenu: {
    position: 'fixed',
    top: '3.75rem',
    left: 0,
    right: 0,
    background: 'var(--bg2)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.25)',
    borderBottom: '2px solid var(--primary)',
  },
  mobileLink: { padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 500, color: 'var(--text)', borderBottom: '1px solid var(--border)', display: 'block' },
  mobileLinkActive: { color: 'var(--primary)', fontWeight: 700, background: 'var(--bg3)' },
  mobileLogout: { padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 600, color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' },
};
