import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import Loader from '../Common/Loader';

export default function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/leaderboard')
      .then(res => setBoard(res.data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const myId = user?._id || user?.id;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🏆 Leaderboard</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14 }}>
        Ranked by: Coding Points + Quiz Score × 5 + Interview Completed × 3
      </p>

      {board.slice(0, 3).length > 0 && (
        <div style={styles.podium}>
          {[board[1], board[0], board[2]].filter(Boolean).map((u, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            return (
              <div key={u.id} style={{ ...styles.podiumItem, ...(actualRank === 1 ? styles.podiumFirst : {}) }}>
                <div style={styles.podiumAvatar}>
                  {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : getInitials(u.name)}
                </div>
                <div style={{ fontSize: 24 }}>{medals[actualRank - 1]}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 18 }}>{u.totalScore}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>pts</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>💻 Coding</th>
              <th style={styles.th}>📝 Quiz</th>
              <th style={styles.th}>🎯 Interview</th>
              <th style={styles.th}>⭐ Total</th>
            </tr>
          </thead>
          <tbody>
            {board.map(u => (
              <tr key={u.id} style={{ ...styles.tr, ...(u.id === myId ? styles.myRow : {}) }}>
                <td style={styles.td}>
                  {u.rank <= 3 ? medals[u.rank - 1] : <span style={{ color: 'var(--text2)', fontWeight: 600 }}>#{u.rank}</span>}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={styles.avatar}>
                      {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : getInitials(u.name)}
                    </div>
                    <span style={{ fontWeight: u.id === myId ? 700 : 500 }}>
                      {u.name} {u.id === myId && <span style={{ color: 'var(--primary)', fontSize: 12 }}>(You)</span>}
                    </span>
                  </div>
                </td>
                <td style={styles.td}>{u.codingPoints}</td>
                <td style={styles.td}>{u.quizScore}</td>
                <td style={styles.td}>{u.interviewCompleted}</td>
                <td style={{ ...styles.td, fontWeight: 800, color: 'var(--primary)', fontSize: 16 }}>{u.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {board.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
            No users yet. Be the first to score!
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 900, margin: '0 auto', padding: '24px 16px' },
  title: { fontSize: 26, fontWeight: 800, marginBottom: 4 },
  podium: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 32 },
  podiumItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', minWidth: 120 },
  podiumFirst: { transform: 'scale(1.08)', boxShadow: '0 8px 30px rgba(108,99,255,0.2)', borderColor: 'var(--primary)' },
  podiumAvatar: { width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'var(--bg3)' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text2)', borderBottom: '1px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  myRow: { background: 'rgba(108,99,255,0.06)' },
  td: { padding: '12px 16px', fontSize: 14 },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, overflow: 'hidden', flexShrink: 0 }
};
