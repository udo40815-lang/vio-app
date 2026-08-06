import React from 'react';

function VioMark({ size, color }) {
  const s = size || 32;
  const c = color || '#5B3DF5';
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`vm-g-${s}`} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B3DF5" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <path d="M16 16 C 16 32, 34 40, 32 52 C 30 40, 48 32, 48 16" stroke={`url(#vm-g-${s})`} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="17" r="2.8" fill={`url(#vm-g-${s})`} />
    </svg>
  );
}

export default VioMark;