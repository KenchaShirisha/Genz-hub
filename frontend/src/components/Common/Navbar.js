import React, { useState } from 'react';
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

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>⚡ GenZ Hub</Link>

      <div style={styles.right}>
        <button onClick={toggleTheme} style={styles.iconBtn} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link to="/profile" style={styles.avatar} title="Profile">
          {user?.avatar ? <img src={user.avatar} alt="avatar" style={styles.avatarImg} /> : getInitials(user?.name)}
        </Link>
        <button onClick={handleLogout} style={{ ...styles.iconBtn, color: '#ef4444' }}>Logout</button>
        <button style={styles.hamburger} className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...styles.mobileLink, ...(location.pathname === l.to ? styles.activeLink : {}) }}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <div style={styles.desktopLinks} className="nav-desktop">
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{ ...styles.link, ...(location.pathname === l.to ? styles.activeLink : {}) }}
            onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

const styles = {
  nav: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 60, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap' },
  logo: { fontWeight: 800, fontSize: 20, color: 'var(--primary)', whiteSpace: 'nowrap', flex: 1 },
  desktopLinks: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  mobileMenu: { width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '8px 0' },
  mobileLink: { padding: '10px 16px', fontSize: 14, fontWeight: 500, color: 'var(--text2)', borderRadius: 0 },
  link: { padding: '6px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text2)', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  activeLink: { background: 'var(--bg3)', color: 'var(--primary)', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '6px 10px', borderRadius: 8, color: 'var(--text)', fontWeight: 500 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  hamburger: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text)' }
};
