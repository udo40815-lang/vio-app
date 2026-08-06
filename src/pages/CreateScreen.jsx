import React, { useState, useRef } from 'react';
import { Image, X, Loader2, Send, Camera } from 'lucide-react';
import { V, gradientStyle } from '../utils/design-system.js';
import Avatar from '../components/ui/Avatar.jsx';
import { doCreatePost } from '../store/index.js';

function CreateScreen({ ui, onCreated }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMedia(file);
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !media) { setError('Add some content or media to your post.'); return; }
    setLoading(true); setError('');
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    const result = await doCreatePost(content.trim(), media, tagList);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setContent(''); setMedia(null); setMediaPreview(''); setTags('');
    onCreated?.();
  };

  return (
    <div className="px-4 pt-2 space-y-4">
      <div className="rounded-3xl p-5" style={{ background: ui.dark ? 'rgba(91,61,245,0.06)' : 'rgba(91,61,245,0.03)', border: `1px solid ${ui.border}` }}>
        <div className="flex items-center gap-3 mb-4"><Avatar handle={ui.handle} name={ui.displayName} size={36} /><div className="text-[14px] font-semibold" style={{ color: ui.textPrimary }}>Create a post</div></div>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What are you creating today?" maxLength={2000} rows={4} className="w-full text-[15px] p-3 rounded-2xl resize-none outline-none mb-3" style={{ background: ui.dark ? 'rgba(255,255,255,0.04)' : '#F5F6F8', border: `1px solid ${ui.border}`, color: ui.textPrimary }} />
        {mediaPreview && (
          <div className="relative mb-3 rounded-xl overflow-hidden"><img src={mediaPreview} alt="Preview" className="w-full max-h-[240px] object-cover" /><button onClick={() => { setMedia(null); setMediaPreview(''); }} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 text-white"><X size={14} /></button></div>
        )}
        <div className="flex items-center gap-3">
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-xl transition-all" style={{ background: `${V.royal}15`, color: V.royal }}><Camera size={14} /> Media</button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="flex-1 text-[13px] py-2 px-3 rounded-xl outline-none" style={{ background: ui.dark ? 'rgba(255,255,255,0.04)' : '#F5F6F8', border: `1px solid ${ui.border}`, color: ui.textPrimary }} />
        </div>
      </div>
      {error && <div className="p-3 rounded-xl text-[13px] font-medium" style={{ background: `${V.red}15`, color: V.red }}>{error}</div>}
      <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50" style={gradientStyle(140)}>{loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Post</>}</button>
    </div>
  );
}

export default CreateScreen;