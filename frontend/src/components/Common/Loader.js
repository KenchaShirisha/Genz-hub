import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>{text}</p>
    </div>
  );
}
