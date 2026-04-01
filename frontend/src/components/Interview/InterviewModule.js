import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CATEGORIES, CATEGORY_ICONS, DIFFICULTIES } from '../../utils/helpers';
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

export default function InterviewModule() {
  const [questions, setQuestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('HTML');
  const [expanded, setExpanded] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [filters, setFilters] = useState({ difficulty: '', search: '' });
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const width = useWidth();
  const isMobile = width < 768;

  useEffect(() => { fetchQuestions(); }, [activeCategory]);

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

  const handleComplete = async () => {
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
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 'calc(100vh - 3.75rem)' }}>

      {/* Mobile category bar */}
      {isMobile && (
        <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', overflowX: 'auto', display: 'flex', gap: '0.375rem', flexWrap: 'nowrap' }}>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '0.375rem 0.75rem', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', background: activeCategory === cat ? 'var(--primary)' : 'var(--bg3)', color: activeCategory === cat ? '#fff' : 'var(--text2)' }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div style={{ width: '13.75rem', borderRight: '1px solid var(--border)', background: 'var(--bg2)', padding: '1rem 0.5rem', flexShrink: 0, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, padding: '0 0.5rem 0.75rem' }}>🎯 Interview Prep</h2>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text2)', letterSpacing: 1, padding: '0.25rem 0.5rem', textTransform: 'uppercase' }}>WEB</p>
          {CATEGORIES.web.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '0.5rem 0.625rem', borderRadius: 8, background: activeCategory === cat ? 'var(--bg3)' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: activeCategory === cat ? 'var(--primary)' : 'var(--text)', fontWeight: activeCategory === cat ? 600 : 400, textAlign: 'left', marginBottom: 2 }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
          <p style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text2)', letterSpacing: 1, padding: '0.75rem 0.5rem 0.25rem', textTransform: 'uppercase' }}>PROGRAMMING</p>
          {CATEGORIES.programming.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '0.5rem 0.625rem', borderRadius: 8, background: activeCategory === cat ? 'var(--bg3)' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: activeCategory === cat ? 'var(--primary)' : 'var(--text)', fontWeight: activeCategory === cat ? 600 : 400, textAlign: 'left', marginBottom: 2 }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: isMobile ? '1rem' : '1.5rem 1.25rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.375rem', fontWeight: 700 }}>{CATEGORY_ICONS[activeCategory]} {activeCategory}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input placeholder="🔍 Search..." value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ width: isMobile ? '100%' : '11.25rem' }} />
            <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })} style={{ width: isMobile ? '100%' : '8.75rem' }}>
              <option value="">All Levels</option>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <p style={{ color: 'var(--text2)', fontSize: '0.8rem', marginBottom: '1rem' }}>{filtered.length} questions • Click to reveal answer</p>

        {loading ? <Loader /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {filtered.map((q, i) => (
              <div key={q._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0.875rem 1rem', cursor: 'pointer', gap: '0.75rem' }}
                  onClick={() => setExpanded(expanded === q._id ? null : q._id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                    <span style={{ background: 'var(--bg3)', color: 'var(--primary)', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontWeight: 600, fontSize: isMobile ? '0.875rem' : '0.9375rem', lineHeight: 1.4 }}>{q.question}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    <button onClick={e => { e.stopPropagation(); handleBookmark(q._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 4 }}>
                      {bookmarks.includes(q._id) ? '🔖' : '📌'}
                    </button>
                    <span style={{ color: 'var(--text2)', fontSize: '1.125rem' }}>{expanded === q._id ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expanded === q._id && (
                  <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border)' }} className="fade-in">
                    <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '0.875rem', fontSize: '0.875rem', lineHeight: 1.7, marginTop: '0.75rem' }}>{q.answer}</div>
                    <button className="btn btn-primary" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }} onClick={handleComplete}>
                      ✅ Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text2)' }}>No questions found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
