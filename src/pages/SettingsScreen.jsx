import React from 'react';
import { Sun, Moon, LogOut, ChevronRight, Shield, BookOpen, FileText, LockKeyhole } from 'lucide-react';
import { V } from '../utils/design-system.js';
import Avatar from '../components/ui/Avatar.jsx';

function SettingsScreen({ ui, setDark }) {
  const items = [
    { icon: ui.dark ? Sun : Moon, label: 'Appearance', subtitle: ui.dark ? 'Dark mode' : 'Light mode', action: () => setDark(!ui.dark) },
    { icon: Shield, label: 'Privacy', action: null },
    { icon: BookOpen, label: 'Help Centre', action: null },
    { icon: FileText, label: 'Terms of Service', action: null },
    { icon: LockKeyhole, label: 'Privacy Policy', action: null },
  ];
  return (
    <div className="px-4 pt-2 space-y-4">
      <div className="rounded-2xl overflow-hidden" style={{ background: ui.dark ? V.surfaceDark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${ui.border}` }}>
          <Avatar handle={ui.handle} name={ui.displayName} size={44} url={ui.avatarUrl} />
          <div><div className="text-[15px] font-semibold" style={{ color: ui.textPrimary }}>{ui.displayName || ui.handle}</div><div className="text-[12px]" style={{ color: ui.textMuted }}>@{ui.handle}</div></div>
        </div>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:brightness-105" style={{ borderTop: i > 0 ? `1px solid ${ui.border}` : 'none', color: ui.textPrimary }}>
              <Icon size={16} style={{ color: V.royal }} />
              <div className="flex-1"><div className="text-[14px] font-medium">{item.label}</div>{item.subtitle && <div className="text-[12px]" style={{ color: ui.textMuted }}>{item.subtitle}</div>}</div>
              <ChevronRight size={14} style={{ color: ui.textMuted }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsScreen;