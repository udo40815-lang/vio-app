import { useState, useEffect } from 'react';

export default function useTheme() {
  const [dark, setDark] = useState(() => { try { return JSON.parse(localStorage.getItem('vio-theme') || 'true'); } catch { return true; } });
  useEffect(() => { localStorage.setItem('vio-theme', JSON.stringify(dark)); }, [dark]);
  return [dark, setDark];
}