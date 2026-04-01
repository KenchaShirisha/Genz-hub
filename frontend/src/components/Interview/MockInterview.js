import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/helpers';

const TIMER_DURATION = 45;

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
  const intervalRef = useRef(null);

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

  const handleReveal = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setShowAnswer(true);
  };

  const handleRate = (correct) => {
    if (!question) return;
    const entry = { question: question.question, answer: question.answer, userAnswer, correct, category: question.category };
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    api.post('/interview/complete', { category: question.category }).catch(() => {});
    fetchQuestion();
  };

  const allCategories = [...CATEGORIES.web, ...CATEGORIES.programming];
  const timerColor = timer > 20 ? '#43d9ad' : timer > 10 ? '#ffd166' : '#ef4444';
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div style={styles.page} className="mock-layout">
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>🎤 Mock Interview</h2>
          <div style={styles.scoreBox}>
            <span>✅ {score.correct}/{score.total}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{accuracy}% accuracy</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1, minWidth: 160 }}>
              <option value="">🎲 Random Category</option>
              {allCategories.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
            <button className="btn btn-primary" onClick={fetchQuestion} disabled={loading}>
              {loading ? '⏳ Loading...' : question ? '⏭ Next Question' : '▶ Start Mock Interview'}
            </button>
          </div>
        </div>

        {question && (
          <div className="card fade-in" style={styles.questionCard}>
            <div style={styles.qMeta}>
              <span className="tag">{CATEGORY_ICONS[question.category]} {question.category}</span>
              <span className={`badge badge-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ ...styles.timer, color: timerColor, borderColor: timerColor }}>
                  ⏱ {timer}s
                </div>
              </div>
            </div>

            <div style={styles.timerBar}>
              <div style={{ ...styles.timerFill, width: `${(timer / TIMER_DURATION) * 100}%`, background: timerColor }} />
            </div>

            <h3 style={styles.questionText}>{question.question}</h3>

            {!showAnswer ? (
              <>
                <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here... (optional)"
                  style={{ width: '100%', minHeight: 120, marginTop: 16, resize: 'vertical', padding: 12, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'inherit', fontSize: 14 }} />
                <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={handleReveal}>
                  👁 Reveal Answer
                </button>
              </>
            ) : (
              <div className="fade-in">
                {userAnswer && (
                  <div style={styles.userAnswerBox}>
                    <strong style={{ fontSize: 13, color: 'var(--text2)' }}>Your Answer:</strong>
                    <p style={{ marginTop: 6, fontSize: 14 }}>{userAnswer}</p>
                  </div>
                )}
                <div style={styles.correctAnswer}>
                  <strong style={{ fontSize: 13, color: '#065f46' }}>✅ Correct Answer:</strong>
                  <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>{question.answer}</p>
                </div>
                <div style={styles.rateButtons}>
                  <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 10 }}>How did you do?</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn" style={{ background: '#d1fae5', color: '#065f46', flex: 1 }} onClick={() => handleRate(true)}>
                      😊 Got it right!
                    </button>
                    <button className="btn" style={{ background: '#fee2e2', color: '#991b1b', flex: 1 }} onClick={() => handleRate(false)}>
                      😅 Need more practice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!question && !loading && (
          <div style={styles.empty}>
            <div style={{ fontSize: 60 }}>🎤</div>
            <h3>Ready for your mock interview?</h3>
            <p style={{ color: 'var(--text2)' }}>Select a category and start practicing!</p>
          </div>
        )}
      </div>

      <div style={styles.historyPanel} className="mock-history">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📋 Session History</h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text2)', fontSize: 13 }}>No questions answered yet</p>
        ) : (
          history.map((h, i) => (
            <div key={i} style={{ ...styles.historyItem, borderLeft: `3px solid ${h.correct ? '#43d9ad' : '#ef4444'}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{h.correct ? '✅' : '❌'} {h.category}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>{h.question.slice(0, 80)}...</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: 'calc(100vh - 60px)', gap: 0 },
  main: { flex: 1, padding: '24px 20px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  scoreBox: { display: 'flex', gap: 16, background: 'var(--bg2)', padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)', fontSize: 14, fontWeight: 600 },
  questionCard: { padding: 24 },
  qMeta: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  timer: { fontSize: 18, fontWeight: 800, border: '2px solid', borderRadius: 8, padding: '4px 12px', transition: 'color 0.3s, border-color 0.3s' },
  timerBar: { height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 2, transition: 'width 1s linear, background 0.3s' },
  questionText: { fontSize: 18, fontWeight: 600, lineHeight: 1.5 },
  userAnswerBox: { background: 'var(--bg3)', borderRadius: 8, padding: 14, marginTop: 16 },
  correctAnswer: { background: '#d1fae5', borderRadius: 8, padding: 14, marginTop: 12 },
  rateButtons: { marginTop: 16 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--text2)' },
  historyPanel: { width: 260, borderLeft: '1px solid var(--border)', background: 'var(--bg2)', padding: 16, overflowY: 'auto', flexShrink: 0 },
  historyItem: { background: 'var(--bg3)', borderRadius: 6, padding: '8px 10px', marginBottom: 8, paddingLeft: 10 }
};
