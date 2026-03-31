import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/user/profile')
      .then(res => setNotes(res.data.user.notes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      const res = await api.post('/user/notes', form);
      setNotes(res.data.notes);
      setForm({ title: '', content: '' });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (noteId) => {
    try {
      const res = await api.delete(`/user/notes/${noteId}`);
      setNotes(res.data.notes);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>📓 My Notes</h2>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>✏️ Add New Note</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input placeholder="Note title..." value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
            <textarea placeholder="Write your note here..." value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              style={{ minHeight: 100, resize: 'vertical' }} required />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
              {saving ? '⏳ Saving...' : '➕ Add Note'}
            </button>
          </form>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text2)', textAlign: 'center' }}>Loading notes...</p>
        ) : notes.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📓</div>
            <p>No notes yet. Add your first note above!</p>
          </div>
        ) : (
          <div className="grid-3">
            {[...notes].reverse().map(note => (
              <div key={note._id} className="card" style={styles.noteCard}>
                <div style={styles.noteHeader}>
                  <h4 style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>{note.title}</h4>
                  <button onClick={() => handleDelete(note._id)} style={styles.deleteBtn} title="Delete">🗑</button>
                </div>
                <p style={styles.noteContent}>{note.content}</p>
                <p style={styles.noteDate}>{formatDate(note.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px 16px', background: 'var(--bg)', minHeight: 'calc(100vh - 60px)' },
  container: { maxWidth: 1100, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 800, marginBottom: 20 },
  empty: { textAlign: 'center', padding: 40, color: 'var(--text2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  noteCard: { display: 'flex', flexDirection: 'column', gap: 8 },
  noteHeader: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  noteContent: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  noteDate: { fontSize: 11, color: 'var(--text2)', marginTop: 'auto' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2, opacity: 0.6, flexShrink: 0 }
};
