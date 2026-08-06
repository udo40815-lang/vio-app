import React from 'react';
import { Compass } from 'lucide-react';
import { V } from '../utils/design-system.js';
import PostCard from '../components/feed/PostCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

function DiscoverScreen({ ui, posts }) {
  const discoverPosts = (posts || []).filter(p => p.visibility_score > 30).sort((a, b) => (b.visibility_score || 0) - (a.visibility_score || 0));
  return (
    <div className="px-4 pt-2 space-y-4">
      <div className="rounded-3xl p-5" style={{ background: ui.dark ? 'rgba(91,61,245,0.08)' : 'rgba(91,61,245,0.04)', border: `1px solid ${ui.border}` }}>
        <div className="flex items-center gap-2 mb-1"><Compass size={18} style={{ color: V.royal }} /><span className="text-[15px] font-semibold" style={{ color: ui.textPrimary }}>Discover</span></div>
        <p className="text-[13px]" style={{ color: ui.textSecondary }}>Top-ranked posts across the platform, ranked by craft and resonance.</p>
      </div>
      {discoverPosts.length === 0 ? <EmptyState ui={ui} icon={Compass} title="No discoveries yet" body="Be the first to create something great!" /> : discoverPosts.map(post => <PostCard key={post.id} post={post} ui={ui} />)}
    </div>
  );
}

export default DiscoverScreen;