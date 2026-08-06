import React from 'react';
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { V, gradientStyle, fmt, timeAgo } from '../utils/design-system.js';
import StatCard from '../components/ui/StatCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

function WalletScreen({ ui, ledger }) {
  const entries = ledger || [];
  return (
    <div className="px-4 pt-2 space-y-4">
      <div className="rounded-3xl p-5 text-center" style={{ background: ui.dark ? V.surfaceDark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
        <Coins size={32} style={{ color: V.gold }} className="mx-auto mb-2" />
        <div className="text-[28px] font-bold tracking-[-0.03em]" style={{ color: ui.textPrimary }}>{fmt(ui.balance)} <span className="text-[16px] font-medium" style={{ color: ui.textMuted }}>VCN</span></div>
        <div className="flex justify-center gap-6 mt-3">
          <div className="text-center"><div className="text-[11px]" style={{ color: ui.textMuted }}>Earned</div><div className="text-[15px] font-semibold" style={{ color: '#10B981' }}>+{fmt(ui.earned)}</div></div>
          <div className="text-center"><div className="text-[11px]" style={{ color: ui.textMuted }}>Spent</div><div className="text-[15px] font-semibold" style={{ color: V.red }}>-{fmt(ui.spent)}</div></div>
        </div>
      </div>
      <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase px-1" style={{ color: ui.textMuted }}>Transactions</h3>
      {entries.length === 0 ? <EmptyState ui={ui} icon={Coins} title="No transactions" body="Start creating content to earn Vicoins." /> : entries.map((entry, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: ui.dark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', border: `1px solid ${ui.border}` }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: entry.amount > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
            {entry.amount > 0 ? <ArrowUpRight size={14} style={{ color: '#10B981' }} /> : <ArrowDownRight size={14} style={{ color: V.red }} />}
          </div>
          <div className="flex-1"><div className="text-[13px] font-medium" style={{ color: ui.textPrimary }}>{entry.reason || 'Transaction'}</div><div className="text-[11px]" style={{ color: ui.textMuted }}>{timeAgo(entry.created_at)}</div></div>
          <div className="text-[14px] font-semibold" style={{ color: entry.amount > 0 ? '#10B981' : V.red }}>{entry.amount > 0 ? '+' : ''}{fmt(entry.amount)}</div>
        </div>
      ))}
    </div>
  );
}

export default WalletScreen;