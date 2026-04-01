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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.logo}>⚡ GenZ Hub</Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={styles.desktopLinks}>
            {links.map(l => (
              <Link key={l.to} to={l.to}
                style={{ ...styles.link, ...(location.pathname === l.to ? styles.activeLink : {}) }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        <div style={styles.right}>
          <button onClick={toggleTheme} style={styles.iconBtn}>{theme === 'dark' ? '☀️' : '🌙'}</button>
          <Link to="/profile" style={styles.avatar}>
            {user?.avatar ? <img src={user.avatar} alt="avatar" style={styles.avatarImg} /> : getInitials(user?.name)}
          </Link>
          {!isMobile && (
            <button onClick={handleLogout} style={{ ...styles.iconBtn, color: '#ef4444' }}>Logout</button>
          )}
          {isMobile && (
            <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
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
  nav: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 60, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontWeight: 800, fontSize: 20, color: 'var(--primary)', whiteSpace: 'nowrap', marginRight: 8 },
  desktopLinks: { display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' },
  link: { padding: '6px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text2)', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  activeLink: { background: 'var(--bg3)', color: 'var(--primary)', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '6px 10px', borderRadius: 8, color: 'var(--text)', fontWeight: 500 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, overflow: 'hidden', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  hamburger: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text)', padding: '4px 8px' },
  mobileMenu: { position: 'fixed', top: 60, left: 0, right: 0, background: 'var(--bg2)', borderBottom: '2px solid var(--border)', zIndex: 99, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
  mobileLink: { padding: '14px 20px', fontSize: 15, fontWeight: 500, color: 'var(--text)', borderBottom: '1px solid var(--border)', display: 'block' },
  mobileLinkActive: { color: 'var(--primary)', fontWeight: 700, background: 'var(--bg3)' },
  mobileLogout: { padding: '14px 20px', fontSize: 15, fontWeight: 500, color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid var(--border)' }
};
