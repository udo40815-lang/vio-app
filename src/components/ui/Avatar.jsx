import React from 'react';
import { gradientStyle, V } from '../../utils/design-system.js';

function Avatar({ handle, name, size, url }) {
  const s = size || 32;
  const initial = (name || handle || 'U').charAt(0).toUpperCase();
  const colors = ['#5B3DF5', '#7C3AED', '#F5A623', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6'];
  const seed = (handle || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = colors[seed % colors.length];
  if (url) return <img src={url} alt={name || handle} className="rounded-full object-cover" style={{ width: s, height: s, flexShrink: 0 }} />;
  return (
    <div className="rounded-full flex items-center justify-center text-white font-semibold" style={{ width: s, height: s, flexShrink: 0, background: color, fontSize: s * 0.42 }}>
      {initial}
    </div>
  );
}

export default Avatar;