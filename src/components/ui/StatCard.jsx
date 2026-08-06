import React from 'react';
import { V } from '../../utils/design-system.js';

function StatCard({ ui, label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:-translate-y-[1px]" style={{ background: ui.dark ? V.surfaceDark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
      {Icon && <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color || V.royal}18` }}><Icon size={14} style={{ color: color || V.royal }} /></div>}
      <div><div className="text-[10px] font-medium tracking-[0.08em] uppercase" style={{ color: ui.textMuted }}>{label}</div><div className="text-[15px] font-bold tracking-[-0.02em]" style={{ color: ui.textPrimary }}>{value}</div></div>
    </div>
  );
}

export default StatCard;