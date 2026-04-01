import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CODING_CATEGORIES, LANGUAGES, DIFFICULTIES } from '../../utils/helpers';
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

export default function CodingModule() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [filters, setFilters] = useState({ category: '', difficulty: '', search: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const width = useWidth();
  const isMobile = width < 768;

  useEffect(() => { fetchProblems(); }, [filters]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      const res = await api.get(`/problems?${params}`);
      setProblems(res.data.problems);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const selectProblem = (p) => {
    setSelected(p);
    setCode(p.starterCode?.[language] || '// Write your solution here');
    setResult(null);
    if (isMobile) setShowSidebar(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (selected) setCode(selected.starterCode?.[lang] || '// Write your solution here');
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true); setResult(null);
    try {
      const res = await api.post(`/problems/${selected._id}/submit`, { language, code });
      setResult(res.data);
    } catch (err) { setResult({ error: err.response?.data?.message || 'Submission failed' }); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: isMobile ? 'auto' : 'calc(100vh - 3.75rem)', overflow: isMobile ? 'visible' : 'hidden' }}>

      {/* Sidebar */}
      {(!isMobile || showSidebar) && (
        <div style={{ width: isMobile ? '100%' : '18rem', borderRight: isMobile ? 'none' : '1px solid var(--border)', borderBottom: isMobile ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0, maxHeight: isMobile ? '22rem' : 'none', overflowY: 'auto' }}>
          <h2 style={{ padding: '1rem 1rem 0.5rem', fontSize: '1rem', fontWeight: 700 }}>💻 Coding Practice</h2>
          <div style={{ padding: '0 0.75rem 0.75rem' }}>
            <input placeholder="🔍 Search problems..." value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })} style={{ marginBottom: 8 }} />
            <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              {CODING_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })} style={{ marginTop: 8 }}>
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          {loading ? <Loader text="Loading..." /> : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem 0.5rem' }}>
              {problems.map((p, i) => (
                <div key={p._id} onClick={() => selectProblem(p)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.625rem 0.5rem', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: selected?._id === p._id ? 'var(--bg3)' : 'transparent', borderLeft: selected?._id === p._id ? '3px solid var(--primary)' : '3px solid transparent' }}>
                  <span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{i + 1}.</span>
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{p.title}</span>
                  <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                </div>
              ))}
              {problems.length === 0 && <p style={{ color: 'var(--text2)', fontSize: '0.8rem', padding: '1rem' }}>No problems found</p>}
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      {(!isMobile || !showSidebar) && (
        <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? '1rem' : '1.25rem', background: 'var(--bg)' }}>
          {isMobile && (
            <button onClick={() => setShowSidebar(true)} className="btn btn-outline" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
              ← Back to Problems
            </button>
          )}
          {!selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: isMobile ? '60vh' : '100%', gap: 12, color: 'var(--text2)' }}>
              <div style={{ fontSize: '3.5rem' }}>💻</div>
              <h3>Select a problem to start coding</h3>
              <p>Choose from {problems.length} problems</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 700 }}>{selected.title}</h2>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <span className={`badge badge-${selected.difficulty.toLowerCase()}`}>{selected.difficulty}</span>
                    <span className="tag">{selected.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>⭐ {selected.points} pts</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select value={language} onChange={e => handleLanguageChange(e.target.value)} style={{ width: 'auto' }}>
                    {(selected.supportedLanguages || LANGUAGES).map(l => <option key={l}>{l}</option>)}
                  </select>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? '⏳ Running...' : '▶ Run & Submit'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: isMobile ? '100%' : '17.5rem' }}>
                  <p style={{ lineHeight: 1.7, color: 'var(--text2)', fontSize: '0.9rem' }}>{selected.description}</p>
                  {selected.examples?.map((ex, i) => (
                    <div key={i} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '0.75rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                      <strong>Example {i + 1}:</strong>
                      <div style={{ fontFamily: 'monospace', marginTop: 4 }}><b>Input:</b> {ex.input}</div>
                      <div style={{ fontFamily: 'monospace', marginTop: 2 }}><b>Output:</b> {ex.output}</div>
                      {ex.explanation && <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 4 }}>💡 {ex.explanation}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: isMobile ? '100%' : '17.5rem' }}>
                  <textarea className="code-editor" value={code} onChange={e => setCode(e.target.value)}
                    spellCheck={false} style={{ minHeight: isMobile ? '12rem' : '22rem' }} />
                  {result && (
                    <div style={{ marginTop: '0.75rem', padding: '0.875rem', borderRadius: 8, fontSize: '0.875rem', background: result.error ? '#fee2e2' : result.result?.status === 'Accepted' ? '#d1fae5' : '#fef3c7' }}>
                      {result.error ? <span style={{ color: '#991b1b' }}>❌ {result.error}</span> : (
                        <div>
                          <div style={{ fontWeight: 700, color: result.result?.status === 'Accepted' ? '#065f46' : '#92400e' }}>
                            {result.result?.status === 'Accepted' ? '✅' : '⚠️'} {result.result?.status}
                          </div>
                          <div style={{ fontSize: '0.8rem', marginTop: 4, color: 'var(--text2)' }}>
                            ⏱ {result.result?.runtime} | 💾 {result.result?.memory}
                            {!result.alreadySolved && result.progress && <span style={{ marginLeft: 8 }}>• +{result.progress.points} pts</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
