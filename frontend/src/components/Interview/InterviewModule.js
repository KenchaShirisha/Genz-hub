import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CATEGORIES, CATEGORY_ICONS, DIFFICULTIES } from '../../utils/helpers';
import Loader from '../Common/Loader';

export default function InterviewModule() {
  const [questions, setQuestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('HTML');
  const [expanded, setExpanded] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [filters, setFilters] = useState({ difficulty: '', search: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [activeCategory]);

  const fetchQuestions = async () => {
    setLoading(true); setExpanded(null);
    try {
      const res = await api.get(`/interview/${activeCategory}`);
      setQuestions(res.data.questions);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleBookmark = async (id) => {
    try {
      await api.post('/interview/bookmark', { questionId: id });
      setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
    } catch (err) { console.error(err); }
  };

  const handleComplete = async (id) => {
    try {
      await api.post('/interview/complete', { category: activeCategory });
      setExpanded(null);
    } catch (err) { console.error(err); }
  };

  const filtered = questions.filter(q => {
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    if (filters.search && !q.question.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const allCategories = [...CATEGORIES.web, ...CATEGORIES.programming];

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2 style={styles.title}>🎯 Interview Prep</h2>
        <div style={{ padding: '0 8px 8px' }}>
          <p style={styles.groupLabel}>WEB</p>
          {CATEGORIES.web.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ ...styles.catBtn, ...(activeCategory === cat ? styles.catActive : {}) }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
          <p style={{ ...styles.groupLabel, marginTop: 12 }}>PROGRAMMING</p>
          {CATEGORIES.programming.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ ...styles.catBtn, ...(activeCategory === cat ? styles.catActive : {}) }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>{CATEGORY_ICONS[activeCategory]} {activeCategory} Questions</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input placeholder="🔍 Search..." value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 180 }} />
            <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })} style={{ width: 140 }}>
              <option value="">All Levels</option>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16 }}>
          {filtered.length} questions • Click to reveal answer
        </p>

        {loading ? <Loader /> : (
          <div style={styles.list}>
            {filtered.map((q, i) => (
              <div key={q._id} className="card" style={styles.qCard}>
                <div style={styles.qHeader} onClick={() => setExpanded(expanded === q._id ? null : q._id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                    <span style={styles.qNum}>{i + 1}</span>
                    <span style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.4 }}>{q.question}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleBookmark(q._id); }}
                      style={styles.iconBtn} title="Bookmark">
                      {bookmarks.includes(q._id) ? '🔖' : '📌'}
                    </button>
                    <span style={{ color: 'var(--text2)', fontSize: 18 }}>{expanded === q._id ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expanded === q._id && (
                  <div style={styles.answer} className="fade-in">
                    <div style={styles.answerText}>{q.answer}</div>
                    <button className="btn btn-primary" style={{ marginTop: 12, fontSize: 13 }}
                      onClick={() => handleComplete(q._id)}>
                      ✅ Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
                No questions found for current filters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: 'calc(100vh - 60px)' },
  sidebar: { width: 220, borderRight: '1px solid var(--border)', background: 'var(--bg2)', padding: '16px 8px', flexShrink: 0, overflowY: 'auto' },
  title: { fontSize: 15, fontWeight: 700, padding: '0 8px 12px' },
  groupLabel: { fontSize: 10, fontWeight: 700, color: 'var(--text2)', letterSpacing: 1, padding: '4px 8px', textTransform: 'uppercase' },
  catBtn: { display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text)', textAlign: 'left', transition: 'all 0.15s', marginBottom: 2 },
  catActive: { background: 'var(--bg3)', color: 'var(--primary)', fontWeight: 600 },
  content: { flex: 1, padding: '24px 20px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 12 },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  qCard: { padding: 0, overflow: 'hidden' },
  qHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer', gap: 12 },
  qNum: { background: 'var(--bg3)', color: 'var(--primary)', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  answer: { padding: '0 16px 16px', borderTop: '1px solid var(--border)', marginTop: 0 },
  answerText: { background: 'var(--bg3)', borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.7, color: 'var(--text)', marginTop: 12 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4 }
};
