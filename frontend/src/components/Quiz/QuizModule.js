import React, { useState } from 'react';
import api from '../../utils/api';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/helpers';
import Loader from '../Common/Loader';

export default function QuizModule() {
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  const allCategories = [...CATEGORIES.web, ...CATEGORIES.programming];

  const startQuiz = async () => {
    setLoading(true); setAnswers({}); setResult(null);
    try {
      const params = category ? `?category=${category}&limit=10` : '?limit=10';
      const res = await api.get(`/quiz${params}`);
      setQuestions(res.data.questions);
      setStarted(true);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAnswer = (qId, optionIdx) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }
    setSubmitting(true);
    try {
      const payload = questions.map(q => ({ questionId: q._id, selectedOption: answers[q._id] }));
      const res = await api.post('/quiz/submit', { answers: payload });
      setResult(res.data);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const resetQuiz = () => { setStarted(false); setQuestions([]); setAnswers({}); setResult(null); };

  if (loading) return <Loader text="Loading quiz..." />;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>📝 Quiz Challenge</h2>

        {!started ? (
          <div className="card" style={styles.startCard}>
            <div style={{ fontSize: 60, textAlign: 'center', marginBottom: 16 }}>🧠</div>
            <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Test Your Knowledge</h3>
            <p style={{ color: 'var(--text2)', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>
              10 MCQ questions • Instant feedback • Track your score
            </p>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginBottom: 16 }}>
              <option value="">🎲 Random Category</option>
              {allCategories.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} onClick={startQuiz}>
              🚀 Start Quiz
            </button>
          </div>
        ) : result ? (
          <div className="fade-in">
            <div className="card" style={styles.resultCard}>
              <div style={{ fontSize: 60, textAlign: 'center' }}>
                {result.score / result.total >= 0.8 ? '🏆' : result.score / result.total >= 0.5 ? '👍' : '📚'}
              </div>
              <h2 style={{ textAlign: 'center', marginTop: 12 }}>
                {result.score}/{result.total} Correct
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--text2)', marginTop: 4 }}>
                {Math.round((result.score / result.total) * 100)}% accuracy
              </p>
              <div className="progress-bar" style={{ margin: '16px 0' }}>
                <div className="progress-fill" style={{ width: `${(result.score / result.total) * 100}%` }} />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={resetQuiz}>
                🔄 Try Again
              </button>
            </div>

            <h3 style={{ margin: '24px 0 12px', fontWeight: 700 }}>📋 Review Answers</h3>
            {questions.map((q, i) => {
              const r = result.results.find(r => r.questionId === q._id);
              return (
                <div key={q._id} className="card" style={{ marginBottom: 12, borderLeft: `4px solid ${r?.correct ? '#43d9ad' : '#ef4444'}` }}>
                  <p style={{ fontWeight: 600, marginBottom: 10 }}>{i + 1}. {q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {q.options.map((opt, idx) => (
                      <div key={idx} style={{
                        padding: '8px 12px', borderRadius: 6, fontSize: 14,
                        background: idx === r?.correctAnswer ? '#d1fae5' : idx === answers[q._id] && !r?.correct ? '#fee2e2' : 'var(--bg3)',
                        color: idx === r?.correctAnswer ? '#065f46' : idx === answers[q._id] && !r?.correct ? '#991b1b' : 'var(--text)'
                      }}>
                        {idx === r?.correctAnswer ? '✅' : idx === answers[q._id] && !r?.correct ? '❌' : '○'} {opt}
                      </div>
                    ))}
                  </div>
                  {r?.explanation && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text2)', fontStyle: 'italic' }}>💡 {r.explanation}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="fade-in">
            <div style={styles.quizHeader}>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>{Object.keys(answers).length}/{questions.length} answered</span>
              <div className="progress-bar" style={{ flex: 1, margin: '0 12px' }}>
                <div className="progress-fill" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
              </div>
              <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={resetQuiz}>✕ Exit</button>
            </div>

            {questions.map((q, i) => (
              <div key={q._id} className="card" style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
                  <span style={styles.qNum}>{i + 1}</span> {q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(q._id, idx)}
                      style={{ ...styles.option, ...(answers[q._id] === idx ? styles.optionSelected : {}) }}>
                      <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16 }}
              onClick={handleSubmit} disabled={submitting}>
              {submitting ? '⏳ Submitting...' : '📤 Submit Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px 16px', minHeight: 'calc(100vh - 60px)', background: 'var(--bg)' },
  container: { maxWidth: 720, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 800, marginBottom: 20 },
  startCard: { maxWidth: 400, margin: '0 auto', padding: 32 },
  resultCard: { padding: 32, textAlign: 'center', marginBottom: 24 },
  quizHeader: { display: 'flex', alignItems: 'center', marginBottom: 20, gap: 8 },
  qNum: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, background: 'var(--primary)', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 700, marginRight: 8 },
  option: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'var(--bg3)', border: '1.5px solid var(--border)', cursor: 'pointer', fontSize: 14, color: 'var(--text)', textAlign: 'left', transition: 'all 0.15s' },
  optionSelected: { background: 'var(--bg3)', borderColor: 'var(--primary)', color: 'var(--primary)' },
  optionLetter: { width: 24, height: 24, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }
};
