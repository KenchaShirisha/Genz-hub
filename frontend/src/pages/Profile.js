import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getInitials, formatDate } from '../utils/helpers';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const res = await api.put('/user/update', { name });
      updateUser(res.data.user);
      setMsg('Profile updated!');
    } catch (err) { setMsg('Update failed'); }
    finally { setSaving(false); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setUploading(true);
    try {
      const res = await api.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: res.data.avatar });
      setMsg('Avatar updated!');
    } catch (err) { setMsg('Upload failed'); }
    finally { setUploading(false); }
  };

  const p = user?.progress || {};

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>👤 Profile</h2>

        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card">
            <h3 style={styles.sectionTitle}>Account Info</h3>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>
                {user?.avatar
                  ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{getInitials(user?.name)}</span>}
              </div>
              <label style={styles.uploadBtn}>
                {uploading ? '⏳ Uploading...' : '📷 Change Photo'}
                <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
              </label>
            </div>

            {msg && <div style={{ ...styles.msg, background: msg.includes('failed') ? '#fee2e2' : '#d1fae5', color: msg.includes('failed') ? '#991b1b' : '#065f46' }}>{msg}</div>}

            <form onSubmit={handleUpdate} style={{ marginTop: 16 }}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Member Since</label>
                <input value={formatDate(user?.createdAt || Date.now())} disabled style={{ opacity: 0.6 }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={styles.sectionTitle}>📊 My Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
              {[
                { label: '💻 Problems Solved', value: p.coding?.solved || 0, max: 15 },
                { label: '⭐ Coding Points', value: p.coding?.points || 0, max: 300 },
                { label: '📝 Quiz Attempted', value: p.quiz?.attempted || 0, max: 100 },
                { label: '🎯 Interview Completed', value: p.interview?.completed || 0, max: 165 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span>{s.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min((s.value / s.max) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
              <div style={styles.streakBox}>
                <span style={{ fontSize: 24 }}>🔥</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{p.streak || 0} Day Streak</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>Keep it going!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px 16px', background: 'var(--bg)', minHeight: 'calc(100vh - 60px)' },
  container: { maxWidth: 900, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 800, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  avatarSection: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  uploadBtn: { padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  field: { marginBottom: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 4 },
  msg: { padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 8 },
  streakBox: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg3)', borderRadius: 10, padding: 14, marginTop: 4 }
};
