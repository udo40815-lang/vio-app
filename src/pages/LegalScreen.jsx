import React from 'react';

function LegalScreen({ ui, activePage }) {
  const textStyle = { color: ui.textPrimary, fontSize: 14, lineHeight: 1.7 };
  return (
    <div className="px-4 pt-2 space-y-4" style={{ paddingBottom: '40px' }}>
      <div className="rounded-2xl p-5" style={{ background: ui.dark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', border: `1px solid ${ui.border}` }}>
        <h2 className="text-[20px] font-bold mb-4" style={{ color: ui.textPrimary }}>Legal</h2>
        <p style={textStyle}>Vio is a social platform designed to help creators share their work and get discovered based on the value they create.</p>
        <h3 className="text-[16px] font-semibold mt-4 mb-2" style={{ color: ui.textPrimary }}>Terms of Service</h3>
        <p style={textStyle}>By using Vio, you agree to our community guidelines and terms. Be respectful. Create value. Don't spam.</p>
        <h3 className="text-[16px] font-semibold mt-4 mb-2" style={{ color: ui.textPrimary }}>Privacy Policy</h3>
        <p style={textStyle}>We collect minimal data to provide our service. Your content is yours. We never sell your personal information.</p>
        <h3 className="text-[16px] font-semibold mt-4 mb-2" style={{ color: ui.textPrimary }}>Community Guidelines</h3>
        <p style={textStyle}>1. Be authentic. 2. Create value. 3. Respect others. 4. No harassment. 5. No spam or manipulation.</p>
      </div>
    </div>
  );
}

export default LegalScreen;