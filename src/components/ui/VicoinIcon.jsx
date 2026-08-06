import React from 'react';

function VicoinIcon({ size, color }) {
  const s = size || 20;
  const c = color || 'currentColor';
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill={c} opacity="0.12" />
      <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill={c}>V</text>
    </svg>
  );
}

export default VicoinIcon;