import React from 'react';
import { V } from '../utils/design-system.js';
import VioMark from '../components/ui/VioMark.jsx';

function SplashScreen({ out }) {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${out ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ background: V.darkest }}>
      <div className={`text-center transition-all duration-700 ${out ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="mb-6 animate-pulse"><VioMark size={72} /></div>
        <h1 className="text-[28px] font-bold tracking-[-0.04em] text-white mb-2">Vio</h1>
        <p className="text-[14px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Where value gets discovered</p>
      </div>
    </div>
  );
}

export default SplashScreen;