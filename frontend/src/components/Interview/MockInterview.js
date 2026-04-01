import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/helpers';

const TIMER_DURATION = 45;

function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

export default function MockInterview() {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const intervalRef = useRef(null);
  const width = useWidth();
  const isMobile = width < 768;

  useEffect(() => {
    if (running && timer > 0) {
      intervalRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      clearInterval(intervalRef.current);
      setShowAnswer(true);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timer]);

  const fetchQuestion = async () => {
    setLoading(true); setShowAnswer(false); setUserAnswer(''); setTimer(TIMER_DURATION);
    clearInterval(intervalRef.current);
    try {
      const params = category ? `?category=${category}` : '';
      const res = await api.get(`/interview/random${params}`);
      setQuestion(res.data.question);
      setRunning(true);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReveal = () => { clearInterval(intervalRef.current); setRunning(false); setShowAnswer(true); };

  const handleRate = (correct) => {
    if (!question) return;
    setHistory(prev => [{ question: question.question, correct, category: question.category }, ...prev.slice(0, 9)]);
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    api.post('/interview/complete', { category: question.category }).catch(() => {});
    fetchQuestion();
  };

  const allCategories = [...CATEGORIES.web, ...CATEGORIES.programming];
  const timerColor = timer > 20 ? '#43d9ad' : timer > 10 ? '#ffd166' : '#ef4444';
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 'calc(100vh - 3.75rem)' }}>

      {/* Main */}
      <div style={{ flex: 1, padding: isMobile ? '1rem' : '1.5rem 1.25rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.375rem', fontWeight: 700 }}>🎤 Mock Interview</h2>
          <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg2)', padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid var(--border)', fontSize: '0.875rem', fontWeight: 600, alignItems: 'center' }}>
            <span>✅ {score.correct}/{score.total}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{accuracy}%</span>
            {isMobile && (
              <button onClick={() => setShowHistory(h => !h)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                📋 History
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1, minWidth: '10rem' }}>
              <option value="">🎲 Random Category</option>
              {allCategories.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
            <button className="btn btn-primary" onClick={fetchQuestion} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? '⏳ Loading...' : question ? '⏭ Next' : '▶ Start'}
            </button>
          </div>
        </div>

        {/* Mobile history toggle */}
        {isMobile && showHistory && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>📋 Session History</h3>
            {history.length === 0 ? <p style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>No questions yet</p> : (
              history.map((h, i) => (
                <div key={i} style={{ background: 'var(--bg3)', borderRadius: 6, padding: '0.5rem 0.625rem', marginBottom: 6, borderLeft: `3px solid ${h.correct ? '#43d9ad' : '#ef4444'}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{h.correct ? '✅' : '❌'} {h.category}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{h.question?.slice(0, 60)}...</div>
                </div>
              ))
            )}
          </div>
        )}

        {question && (
          <div className="card fade-in" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="tag">{CATEGORY_ICONS[question.category]} {question.category}</span>
              <span className={`badge badge-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
              <div style={{ marginLeft: 'auto', fontSize: '1.125rem', fontWeight: 800, border: '2px solid', borderRadius: 8, padding: '0.25rem 0.75rem', color: timerColor, borderColor: timerColor }}>
                ⏱ {timer}s
              </div>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${(timer / TIMER_DURATION) * 100}%`, background: timerColor, transition: 'width 1s linear' }} />
            </div>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.125rem', fontWeight: 600, lineHeight: 1.5 }}>{question.question}</h3>

            {!showAnswer ? (
              <>
                <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here... (optional)"
                  style={{ width: '100%', minHeight: '7.5rem', marginTop: '1rem', resize: 'vertical', padding: '0.75rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.875rem' }} />
                <button className="btn btn-outline" style={{ marginTop: '0.75rem' }} onClick={handleReveal}>👁 Reveal Answer</button>
              </>
            ) : (
              <div className="fade-in">
                {userAnswer && (
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '0.875rem', marginTop: '1rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Your Answer:</strong>
                    <p style={{ marginTop: 6, fontSize: '0.875rem' }}>{userAnswer}</p>
                  </div>
                )}
                <div style={{ background: '#d1fae5', borderRadius: 8, padding: '0.875rem', marginTop: '0.75rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#065f46' }}>✅ Correct Answer:</strong>
                  <p style={{ marginTop: 8, fontSize: '0.875rem', lineHeight: 1.7 }}>{question.answer}</p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginBottom: '0.625rem' }}>How did you do?</p>
                  <div style={{ display: 'flex', gap: '0.625rem' }}>
                    <button className="btn" style={{ background: '#d1fae5', color: '#065f46', flex: 1 }} onClick={() => handleRate(true)}>😊 Got it!</button>
                    <button className="btn" style={{ background: '#fee2e2', color: '#991b1b', flex: 1 }} onClick={() => handleRate(false)}>😅 Need practice</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!question && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '18.75rem', gap: '0.75rem', color: 'var(--text2)' }}>
            <div style={{ fontSize: '3.75rem' }}>🎤</div>
            <h3>Ready for your mock interview?</h3>
            <p>Select a category and start practicing!</p>
          </div>
        )}
      </div>

      {/* Desktop history panel */}
      {!isMobile && (
        <div style={{ width: '16.25rem', borderLeft: '1px solid var(--border)', background: 'var(--bg2)', padding: '1rem', overflowY: 'auto', flexShrink: 0 }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>📋 Session History</h3>
          {history.length === 0 ? <p style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>No questions answered yet</p> : (
            history.map((h, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 6, padding: '0.5rem 0.625rem', marginBottom: 8, borderLeft: `3px solid ${h.correct ? '#43d9ad' : '#ef4444'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>{h.correct ? '✅' : '❌'} {h.category}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text2)', lineHeight: 1.4 }}>{h.question?.slice(0, 80)}...</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
