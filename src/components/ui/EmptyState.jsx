import React from 'react';

function EmptyState({ ui, icon: Icon, title, body, action }) {
  return (
    <div className="rounded-3xl p-8 text-center" style={{ background: ui.dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px dashed ${ui.border}` }}>
      {Icon && <Icon size={36} style={{ color: ui.textMuted }} className="mx-auto mb-3" />}
      <h3 className="text-[15px] font-semibold mb-1.5" style={{ color: ui.textPrimary }}>{title || 'Nothing here yet'}</h3>
      <p className="text-[13px] leading-relaxed mb-4" style={{ color: ui.textSecondary }}>{body || 'Check back soon for new content.'}</p>
      {action}
    </div>
  );
}

export default EmptyState;