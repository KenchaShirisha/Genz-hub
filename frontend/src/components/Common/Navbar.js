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

      {/* Desktop links */}
      <div className="nav-desktop">
        {links.map(l => (
          <Link key={l.to} to={l.to}
            style={{ ...styles.link, ...(location.pathname === l.to ? styles.activeLink : {}) }}
            onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        <button onClick={toggleTheme} style={styles.iconBtn}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        <Link to="/profile" style={styles.avatar}>
          {user?.avatar ? <img src={user.avatar} alt="avatar" style={styles.avatarImg} /> : getInitials(user?.name)}
        </Link>
        <button onClick={handleLogout} style={{ ...styles.iconBtn, color: '#ef4444' }} className="nav-logout">Logout</button>
        <button className="nav-hamburger" style={styles.iconBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...styles.mobileLink, ...(location.pathname === l.to ? styles.mobileLinkActive : {}) }}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={styles.mobileLogout}>🚪 Logout</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 60, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap' },
  logo: { fontWeight: 800, fontSize: 20, color: 'var(--primary)', whiteSpace: 'nowrap', marginRight: 8 },
  link: { padding: '6px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text2)', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  activeLink: { background: 'var(--bg3)', color: 'var(--primary)', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '6px 10px', borderRadius: 8, color: 'var(--text)', fontWeight: 500 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, overflow: 'hidden', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  mobileMenu: { width: '100%', background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '8px 0' },
  mobileLink: { padding: '12px 20px', fontSize: 15, fontWeight: 500, color: 'var(--text2)', borderBottom: '1px solid var(--border)' },
  mobileLinkActive: { color: 'var(--primary)', fontWeight: 700, background: 'var(--bg3)' },
  mobileLogout: { padding: '12px 20px', fontSize: 15, fontWeight: 500, color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }
};
