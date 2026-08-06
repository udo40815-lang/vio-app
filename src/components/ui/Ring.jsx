import React from 'react';
import { V } from '../../utils/design-system.js';

function Ring({ value, max, size, strokeWidth, color, children }) {
  const r = (size || 64) / 2 - (strokeWidth || 6);
  const circumference = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const offset = circumference - (pct / 100) * circumference;
  const c = color || V.royal;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size || 64, height: size || 64 }}>
      <svg width={size || 64} height={size || 64} className="absolute inset-0 -rotate-90">
        <circle cx={size ? size / 2 : 32} cy={size ? size / 2 : 32} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth || 6} strokeLinecap="round" />
        <circle cx={size ? size / 2 : 32} cy={size ? size / 2 : 32} r={r} fill="none" stroke={c} strokeWidth={strokeWidth || 6} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)' }} />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default Ring;