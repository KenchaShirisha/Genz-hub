import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    { icon: '💻', title: 'Coding Practice', desc: 'Solve problems in Java, Python, JS, C++, SQL with a built-in code editor' },
    { icon: '🎯', title: '165+ Interview Questions', desc: 'Curated questions across HTML, CSS, JS, React, Node, Java, Python, C++, SQL' },
    { icon: '🎤', title: 'Mock Interviews', desc: 'Timed practice sessions with performance tracking and scoring' },
    { icon: '📝', title: 'Quiz System', desc: 'MCQ quizzes with instant feedback and detailed explanations' },
    { icon: '🏆', title: 'Leaderboard', desc: 'Compete with peers and track your ranking in real-time' },
    { icon: '📓', title: 'Smart Notes', desc: 'Save and organize your study notes in one place' },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>⚡ GenZ Hub</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.badge}>🚀 Placement Season Ready</div>
        <h1 style={styles.heroTitle}>
          Your All-in-One<br />
          <span style={{ color: 'var(--primary)' }}>Placement Prep Hub</span>
        </h1>
        <p style={styles.heroSub}>
          Master coding, ace interviews, and track your progress — all in one place.
          Built for GenZ developers who want to get placed fast.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
            🚀 Start for Free
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: 16 }}>
            Login
          </Link>
        </div>
        <div style={styles.stats}>
          {[['165+', 'Interview Questions'], ['15+', 'Coding Problems'], ['5', 'Languages'], ['10', 'Categories']].map(([n, l]) => (
            <div key={l} style={styles.stat}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{n}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.features}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Everything You Need</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 40 }}>One platform. Complete preparation.</p>
        <div className="grid-3">
          {features.map(f => (
            <div key={f.title} className="card" style={styles.featureCard}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.cta}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Ready to Get Placed? 🎯</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Join thousands of students preparing for their dream job</p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 16 }}>
          Create Free Account
        </Link>
      </div>

      <footer style={styles.footer}>
        <p style={{ color: 'var(--text2)', fontSize: 13 }}>⚡ GenZ Hub — Built for placement warriors 💪</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' },
  logo: { fontSize: 22, fontWeight: 800, color: 'var(--primary)' },
  hero: { textAlign: 'center', padding: '80px 20px 60px', maxWidth: 700, margin: '0 auto' },
  badge: { display: 'inline-block', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 20 },
  heroTitle: { fontSize: 48, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 },
  heroSub: { fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 32 },
  stats: { display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  features: { padding: '60px 40px', maxWidth: 1100, margin: '0 auto' },
  featureCard: { padding: 28, transition: 'transform 0.2s' },
  cta: { textAlign: 'center', padding: '60px 20px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' },
  footer: { textAlign: 'center', padding: '20px', borderTop: '1px solid var(--border)' }
};
