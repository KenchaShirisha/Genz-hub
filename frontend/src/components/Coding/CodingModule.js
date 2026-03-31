import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CODING_CATEGORIES, LANGUAGES, DIFFICULTIES } from '../../utils/helpers';
import Loader from '../Common/Loader';

export default function CodingModule() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [filters, setFilters] = useState({ category: '', difficulty: '', search: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, [filters]);

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
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2 style={styles.title}>💻 Coding Practice</h2>
        <div style={styles.filters}>
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
        {loading ? <Loader text="Loading problems..." /> : (
          <div style={styles.problemList}>
            {problems.map((p, i) => (
              <div key={p._id} onClick={() => selectProblem(p)}
                style={{ ...styles.problemItem, ...(selected?._id === p._id ? styles.problemActive : {}) }}>
                <span style={{ color: 'var(--text2)', fontSize: 12 }}>{i + 1}.</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{p.title}</span>
                <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              </div>
            ))}
            {problems.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13, padding: 16 }}>No problems found</p>}
          </div>
        )}
      </div>

      <div style={styles.editor}>
        {!selected ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 60 }}>💻</div>
            <h3>Select a problem to start coding</h3>
            <p style={{ color: 'var(--text2)' }}>Choose from {problems.length} problems</p>
          </div>
        ) : (
          <>
            <div style={styles.problemHeader}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{selected.title}</h2>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className={`badge badge-${selected.difficulty.toLowerCase()}`}>{selected.difficulty}</span>
                  <span className="tag">{selected.category}</span>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>⭐ {selected.points} pts</span>
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

            <div style={styles.split}>
              <div style={styles.description}>
                <p style={{ lineHeight: 1.7, color: 'var(--text2)' }}>{selected.description}</p>
                {selected.examples?.map((ex, i) => (
                  <div key={i} style={styles.example}>
                    <strong>Example {i + 1}:</strong>
                    <div style={styles.exCode}><b>Input:</b> {ex.input}</div>
                    <div style={styles.exCode}><b>Output:</b> {ex.output}</div>
                    {ex.explanation && <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>💡 {ex.explanation}</div>}
                  </div>
                ))}
                {selected.constraints?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <strong style={{ fontSize: 13 }}>Constraints:</strong>
                    {selected.constraints.map((c, i) => <div key={i} style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>• {c}</div>)}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <textarea className="code-editor" value={code} onChange={e => setCode(e.target.value)}
                  spellCheck={false} style={{ minHeight: 350 }} />
                {result && (
                  <div style={{ ...styles.result, background: result.error ? '#fee2e2' : result.result?.status === 'Accepted' ? '#d1fae5' : '#fef3c7' }}>
                    {result.error ? (
                      <span style={{ color: '#991b1b' }}>❌ {result.error}</span>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, color: result.result?.status === 'Accepted' ? '#065f46' : '#92400e' }}>
                          {result.result?.status === 'Accepted' ? '✅' : '⚠️'} {result.result?.status}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4, color: 'var(--text2)' }}>
                          ⏱ {result.result?.runtime} | 💾 {result.result?.memory}
                          {result.alreadySolved && <span style={{ marginLeft: 8 }}>• Already solved</span>}
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
    </div>
  );
}

const styles = {
  page: { display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' },
  sidebar: { width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0 },
  title: { padding: '16px 16px 8px', fontSize: 16, fontWeight: 700 },
  filters: { padding: '0 12px 12px' },
  problemList: { flex: 1, overflowY: 'auto', padding: '0 8px 8px' },
  problemItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, transition: 'background 0.15s' },
  problemActive: { background: 'var(--bg3)', borderLeft: '3px solid var(--primary)' },
  editor: { flex: 1, overflow: 'auto', padding: 20, background: 'var(--bg)' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text2)' },
  problemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  split: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  description: { flex: 1, minWidth: 280 },
  example: { background: 'var(--bg3)', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13 },
  exCode: { fontFamily: 'monospace', marginTop: 4, color: 'var(--text)' },
  result: { marginTop: 12, padding: 14, borderRadius: 8, fontSize: 14 }
};
