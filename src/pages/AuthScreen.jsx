import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { V, gradientStyle } from '../utils/design-system.js';
import VioMark from '../components/ui/VioMark.jsx';
import { doSignUp, doSignIn } from '../store/index.js';

function AuthScreen({ dark, setDark, onAuthed }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const bg = dark ? V.darkest : '#F8FAFC';
  const cardBg = dark ? V.surfaceDark : '#FFFFFF';
  const inputBg = dark ? 'rgba(255,255,255,0.04)' : '#F5F6F8';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,18,38,0.06)';
  const textPrimary = dark ? '#F8FAFC' : V.ink;
  const textSecondary = dark ? 'rgba(248,250,252,0.60)' : 'rgba(15,18,38,0.58)';
  const textMuted = dark ? 'rgba(248,250,252,0.40)' : 'rgba(15,18,38,0.42)';
  const inputStyle = { background: inputBg, border: `1px solid ${border}`, color: textPrimary, outline: 'none', borderRadius: 14, padding: '12px 16px', fontSize: 15, width: '100%', transition: 'all 200ms' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !handle) { setError('Please choose a handle.'); return; }
    setLoading(true);
    try {
      const result = mode === 'signup' ? await doSignUp(email, password, handle) : await doSignIn(email, password);
      if (result.error) { setError(result.error.message || 'Authentication failed.'); setLoading(false); return; }
      onAuthed();
    } catch (e) { setError(e.message || 'Something went wrong.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: bg }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8"><VioMark size={48} /><h1 className="mt-3 text-[24px] font-bold tracking-[-0.03em]" style={{ color: textPrimary }}>Vio</h1><p className="text-[13px] mt-1" style={{ color: textSecondary }}>Where value gets discovered</p></div>
        <div className="rounded-3xl p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="flex mb-6 rounded-2xl p-1" style={{ background: inputBg }}>
            <button onClick={() => setMode('signin')} className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 ${mode === 'signin' ? '' : ''}`} style={mode === 'signin' ? { background: dark ? 'rgba(255,255,255,0.08)' : '#FFFFFF', color: textPrimary, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: textMuted }}>Sign in</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200`} style={mode === 'signup' ? { background: dark ? 'rgba(255,255,255,0.08)' : '#FFFFFF', color: textPrimary, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: textMuted }}>Create account</button>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl text-[13px] font-medium" style={{ background: `${V.red}15`, color: V.red, border: `1px solid ${V.red}33` }}>{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textMuted }} /><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, paddingLeft: 44 }} /></div>
            {mode === 'signup' && <div className="relative"><User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textMuted }} /><input type="text" placeholder="Handle" value={handle} onChange={e => setHandle(e.target.value)} style={{ ...inputStyle, paddingLeft: 44 }} /></div>}
            <div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textMuted }} /><input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingLeft: 44, paddingRight: 44 }} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">{showPw ? <EyeOff size={16} style={{ color: textMuted }} /> : <Eye size={16} style={{ color: textMuted }} />}</button></div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-110 disabled:opacity-50" style={gradientStyle(140)}>{loading ? <Loader2 size={18} className="animate-spin" /> : <><span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span><ArrowRight size={16} /></>}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;