import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { calcProgress, CATEGORIES } from '../../utils/helpers';
import Loader from '../Common/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [leaderRank, setLeaderRank] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={styles.page}>
      <div style={styles.welcome}>
        <div>
          <h1 style={styles.greeting}>Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4 }}>Keep grinding. Placement season is on! 🔥</p>
        </div>
        <div style={styles.streak}>🔥 {p.streak || 0} day streak</div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <Link to={s.link} key={s.label} className="card" style={{ ...styles.statCard, borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={styles.sectionTitle}>📊 Interview Progress</h3>
        <div style={{ marginTop: 12 }}>
          <div className="flex-between" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>Overall ({interviewDone}/{totalInterviewQ})</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{calcProgress(interviewDone, totalInterviewQ)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${calcProgress(interviewDone, totalInterviewQ)}%` }} />
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 16 }}>
          {[...CATEGORIES.web, ...CATEGORIES.programming].map(cat => {
            const done = p.interview?.categories?.[cat] || 0;
            return (
              <div key={cat} style={{ fontSize: 12 }}>
                <div className="flex-between" style={{ marginBottom: 3 }}>
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

      <h3 style={styles.sectionTitle}>🚀 Quick Access</h3>
      <div className="grid-3" style={{ marginTop: 12 }}>
        {modules.map(m => (
          <Link to={m.link} key={m.title} className="card" style={{ ...styles.moduleCard, borderLeft: `4px solid ${m.color}` }}>
            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{m.title}</h4>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '24px 16px' },
  welcome: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  greeting: { fontSize: 26, fontWeight: 800 },
  streak: { background: 'var(--bg3)', padding: '8px 16px', borderRadius: 20, fontWeight: 700, fontSize: 14, border: '1px solid var(--border)' },
  statCard: { textAlign: 'center', padding: 20, transition: 'transform 0.2s', cursor: 'pointer' },
  sectionTitle: { fontSize: 18, fontWeight: 700 },
  moduleCard: { padding: 20, transition: 'transform 0.2s', cursor: 'pointer' }
};
