import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || err.message
        || 'Registration failed. Make sure the backend is running on port 5000.';
      setError(msg);
      console.error('Register error:', err.response?.data || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <div style={styles.header}>
          <h1 style={styles.logo}>⚡ GenZ Hub</h1>
          <p style={styles.sub}>Join the grind. Get placed. 💪</p>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" placeholder="John Doe" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 16 },
  card: { background: 'var(--bg2)', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(108,99,255,0.15)', border: '1px solid var(--border)' },
  header: { textAlign: 'center', marginBottom: 28 },
  logo: { fontSize: 28, fontWeight: 800, color: 'var(--primary)' },
  sub: { color: 'var(--text2)', marginTop: 6, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text2)' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }
};
