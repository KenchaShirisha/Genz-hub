import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { calcProgress, CATEGORIES } from '../../utils/helpers';
import Loader from '../Common/Loader';

function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [leaderRank, setLeaderRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const width = useWidth();
  const isMobile = width < 768;

  useEffect(() => {
    api.get('/leaderboard').then(res => {
      const me = res.data.leaderboard.find(u => u.id === user?._id || u.id === user?.id);
      if (me) setLeaderRank(me.rank);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loader />;

  const p = user?.progress || {};
  const totalInterviewQ = 165;
  const interviewDone = p.interview?.completed || 0;

  const stats = [
    { label: 'Problems Solved', value: p.coding?.solved || 0, icon: '💻', color: '#6c63ff', link: '/coding' },
    { label: 'Coding Points', value: p.coding?.points || 0, icon: '⭐', color: '#ffd166', link: '/coding' },
    { label: 'Quiz Score', value: p.quiz?.score || 0, icon: '📝', color: '#43d9ad', link: '/quiz' },
    { label: 'Leaderboard Rank', value: leaderRank ? `#${leaderRank}` : 'N/A', icon: '🏆', color: '#ff6584', link: '/leaderboard' },
  ];

  const modules = [
    { title: '💻 Coding Practice', desc: 'Solve problems in Java, Python, JS, C++, SQL', link: '/coding', color: '#6c63ff' },
    { title: '🎯 Interview Prep', desc: '165+ questions across 10 categories', link: '/interview', color: '#43d9ad' },
    { title: '🎤 Mock Interview', desc: 'Timed random questions with performance tracking', link: '/mock-interview', color: '#ff6584' },
    { title: '📝 Quiz', desc: 'Test your knowledge with MCQs', link: '/quiz', color: '#ffd166' },
    { title: '🏆 Leaderboard', desc: 'See how you rank against others', link: '/leaderboard', color: '#f97316' },
    { title: '📓 Notes', desc: 'Save your study notes', link: '/notes', color: '#8b5cf6' },
  ];

  const cols = isMobile ? '1fr' : width < 1024 ? '1fr 1fr' : '1fr 1fr 1fr 1fr';
  const cols3 = isMobile ? '1fr' : width < 1024 ? '1fr 1fr' : '1fr 1fr 1fr';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '1rem' : '1.5rem 1rem' }}>
      {/* Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: 800 }}>Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4, fontSize: '0.9rem' }}>Keep grinding. Placement season is on! 🔥</p>
        </div>
        <div style={{ background: 'var(--bg3)', padding: '0.5rem 1rem', borderRadius: 20, fontWeight: 700, fontSize: '0.875rem', border: '1px solid var(--border)' }}>
          🔥 {p.streak || 0} day streak
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '1rem', marginBottom: '1.5rem' }}>
        {stats.map(s => (
          <Link to={s.link} key={s.label} className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: `3px solid ${s.color}`, cursor: 'pointer' }}>
            <div style={{ fontSize: '1.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Interview Progress */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>📊 Interview Progress</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Overall ({interviewDone}/{totalInterviewQ})</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>{calcProgress(interviewDone, totalInterviewQ)}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${calcProgress(interviewDone, totalInterviewQ)}%` }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: cols3, gap: '0.75rem', marginTop: '1rem' }}>
          {[...CATEGORIES.web, ...CATEGORIES.programming].map(cat => {
            const done = p.interview?.categories?.[cat] || 0;
            return (
              <div key={cat} style={{ fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ color: 'var(--text2)' }}>{cat}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{done}/15</span>
                </div>
                <div className="progress-bar" style={{ height: 5 }}>
                  <div className="progress-fill" style={{ width: `${calcProgress(done, 15)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>🚀 Quick Access</h3>
      <div style={{ display: 'grid', gridTemplateColumns: cols3, gap: '1rem' }}>
        {modules.map(m => (
          <Link to={m.link} key={m.title} className="card" style={{ borderLeft: `4px solid ${m.color}`, cursor: 'pointer' }}>
            <h4 style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{m.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
