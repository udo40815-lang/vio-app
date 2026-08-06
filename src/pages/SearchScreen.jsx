import React, { useState, useCallback } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { V } from '../utils/design-system.js';
import Avatar from '../components/ui/Avatar.jsx';
import { searchProfiles } from '../lib/profile.js';

function SearchScreen({ ui, setTab }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputBg = ui.dark ? 'rgba(255,255,255,0.04)' : '#F5F6F8';

  const handleSearch = useCallback(async (q) => {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    const { profiles } = await searchProfiles(q.trim());
    setResults(profiles || []);
    setLoading(false);
  }, []);

  return (
    <div className="px-4 pt-2 space-y-4">
      <div className="relative">
        <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: ui.textMuted }} />
        <input type="text" placeholder="Search creators..." value={query} onChange={e => handleSearch(e.target.value)} className="w-full py-3 pl-11 pr-4 rounded-2xl text-[15px] outline-none transition-all" style={{ background: inputBg, border: `1px solid ${ui.border}`, color: ui.textPrimary }} />
      </div>
      {loading && <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin" style={{ color: ui.textMuted }} /></div>}
      {!loading && searched && results.length === 0 && <p className="text-center py-8 text-[14px]" style={{ color: ui.textMuted }}>No creators found.</p>}
      {results.map(profile => (
        <button key={profile.id} onClick={() => {}} className="w-full flex items-center gap-3 rounded-2xl p-3 transition-all hover:-translate-y-[1px]" style={{ background: ui.dark ? 'rgba(255,255,255,0.03)' : '#FFFFFF', border: `1px solid ${ui.border}` }}>
          <Avatar handle={profile.handle} name={profile.display_name} size={40} url={profile.avatar_url} />
          <div className="flex-1 text-left"><div className="text-[14px] font-semibold" style={{ color: ui.textPrimary }}>{profile.display_name || profile.handle}</div><div className="text-[12px]" style={{ color: ui.textMuted }}>@{profile.handle}</div></div>
        </button>
      ))}
    </div>
  );
}

export default SearchScreen;