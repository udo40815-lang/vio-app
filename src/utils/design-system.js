export const V = {
  royal: '#5B3DF5',
  royalDark: '#7C3AED',
  gold: '#F5A623',
  electric: '#06B6D4',
  red: '#EF4444',
  dark: '#0B1020',
  darkest: '#070A18',
  light: '#F8FAFC',
  surfaceDark: '#131837',
  surfaceLight: '#FFFFFF',
  ink: '#0F1226',
};

export function safe(val) { return val ?? ''; }

export function fmt(n) {
  if (n == null) return '0';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Number(n).toLocaleString();
}

export function timeAgo(date) {
  if (!date) return '';
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.max(0, (now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd';
  return new Date(date).toLocaleDateString();
}

export function gradientStyle(deg) {
  return { background: `linear-gradient(${deg || 135}deg, ${V.royal}, ${V.royalDark})` };
}

export function softGradientStyle(deg, opacity) {
  return { background: `linear-gradient(${deg || 135}deg, ${V.royal}${Math.round((opacity || 0.06) * 100)}, ${V.electric}${Math.round((opacity || 0.06) * 100)})` };
}