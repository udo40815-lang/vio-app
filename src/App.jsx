import React, { useState, useEffect, Suspense, lazy } from 'react';
import { V, safe, fmt, timeAgo, gradientStyle, softGradientStyle } from './utils/design-system.js';
import { useVioStore, setSession, initSession, doSignOut } from './store/index.js';
import SplashScreen from './pages/SplashScreen.jsx';
import AuthScreen from './pages/AuthScreen.jsx';
import HomeScreen from './pages/HomeScreen.jsx';
import DiscoverScreen from './pages/DiscoverScreen.jsx';
import SearchScreen from './pages/SearchScreen.jsx';
import CreateScreen from './pages/CreateScreen.jsx';
import ProfileScreen from './pages/ProfileScreen.jsx';
import WalletScreen from './pages/WalletScreen.jsx';
import NotificationsScreen from './pages/NotificationsScreen.jsx';
import SettingsScreen from './pages/SettingsScreen.jsx';
import LegalScreen from './pages/LegalScreen.jsx';
import TopRail from './components/navigation/TopRail.jsx';
import Drawer from './components/navigation/Drawer.jsx';
import BottomNav from './components/navigation/BottomNav.jsx';

export default function App() {
  const store = useVioStore();
  const { initialized, loading, session, profile, posts, ledger, earned, spent, balance } = store;
  const [flow, setFlow] = useState('splash');
  const [dark, setDarkState] = useState(session.theme !== 'light');
  const [tab, setTab] = useState('home');
  const [splashOut, setSplashOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const setDark = (d) => { setDarkState(d); setSession({ theme: d ? 'dark' : 'light' }); };
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    if (!navigator.onLine) setIsOffline(true);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);
  useEffect(() => { initSession(); }, []);
  useEffect(() => {
    const exit = setTimeout(() => setSplashOut(true), 2200);
    const route = setTimeout(() => { if (initialized) setFlow(session.authenticated ? 'app' : 'auth'); }, 2700);
    return () => { clearTimeout(exit); clearTimeout(route); };
  }, [initialized, session.authenticated]);
  const handleAuthed = () => setFlow('app');
  const handleSignOut = async () => { await doSignOut(); setFlow('auth'); };
  if (flow === 'splash' || (loading && !initialized)) return <SplashScreen out={splashOut} />;
  if (flow === 'auth') return <AuthScreen dark={dark} setDark={setDark} onAuthed={handleAuthed} />;
  const bg = dark ? V.dark : V.light;
  const surface = dark ? V.surfaceDark : '#FFFFFF';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,18,38,0.06)';
  const textPrimary = dark ? '#F8FAFC' : V.ink;
  const textSecondary = dark ? 'rgba(248,250,252,0.60)' : 'rgba(15,18,38,0.58)';
  const textMuted = dark ? 'rgba(248,250,252,0.40)' : 'rgba(15,18,38,0.42)';
  const uiCtx = { dark, bg, surface, border, textPrimary, textSecondary, textMuted, currentUserId: session?.userId || '', handle: session.handle, displayName: profile.displayName || profile.name, reputation: profile.reputation || 0, balance, earned, spent, avatarUrl: profile.avatarUrl || '', coverUrl: profile.coverUrl || '', bio: profile.bio || '', website: profile.website || '', location: profile.location || '', joined: profile.joined || '', followersCount: profile.followersCount || 0, followingCount: profile.followingCount || 0 };
  const pageMap = {
    home: <HomeScreen ui={uiCtx} posts={posts} />,
    discover: <DiscoverScreen ui={uiCtx} posts={posts} />,
    search: <SearchScreen ui={uiCtx} posts={posts} />,
    create: <CreateScreen ui={uiCtx} onCreated={() => setTab('home')} />,
    profile: <ProfileScreen ui={uiCtx} posts={posts} />,
    wallet: <WalletScreen ui={uiCtx} ledger={ledger} />,
    notifications: <NotificationsScreen ui={uiCtx} />,
    settings: <SettingsScreen ui={uiCtx} setDark={setDark} />,
    legal: <LegalScreen ui={uiCtx} activePage="tos" />,
  };
  return (
    <div style={{ background: bg, minHeight: '100vh', color: textPrimary }} className="antialiased font-sans">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-20 w-[480px] h-[480px] rounded-full opacity-[0.14]" style={{ background: `radial-gradient(closest-side, ${V.royal}, transparent 70%)`, filter: 'blur(30px)' }} />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.10]" style={{ background: `radial-gradient(closest-side, ${V.gold}, transparent 70%)`, filter: 'blur(30px)' }} />
        <div className="absolute -bottom-20 left-1/4 w-[320px] h-[320px] rounded-full opacity-[0.08]" style={{ background: `radial-gradient(closest-side, ${V.electric}, transparent 70%)`, filter: 'blur(30px)' }} />
      </div>
      <Drawer ui={uiCtx} open={drawerOpen} onClose={() => setDrawerOpen(false)} setTab={setTab} setDark={setDark} onSignOut={handleSignOut} />
      <TopRail ui={uiCtx} setDark={setDark} tab={tab} onMenu={() => setDrawerOpen(true)} onSignOut={handleSignOut} setTab={setTab} />
      {isOffline && (
        <div className="max-w-[520px] mx-auto px-5" role="alert" aria-live="polite">
          <div className="rounded-2xl p-3 text-center text-[13px] font-medium" style={{ background: `${V.red}15`, color: V.red, border: `1px solid ${V.red}33` }}>You are offline. Some features may be unavailable.</div>
        </div>
      )}
      <main className="relative max-w-[520px] mx-auto pb-32 pt-2">
        <div key={tab} className="animate-[vFade_280ms_cubic-bezier(0.22,1,0.36,1)]">{pageMap[tab] || <HomeScreen ui={uiCtx} posts={posts} />}</div>
      </main>
      <BottomNav tab={tab} setTab={setTab} dark={dark} />
    </div>
  );
}