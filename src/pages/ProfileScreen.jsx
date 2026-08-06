import React, { useState, useEffect } from 'react';
import { MapPin, Link, Calendar, Edit3, Camera, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { V, gradientStyle, fmt } from '../utils/design-system.js';
import Avatar from '../components/ui/Avatar.jsx';
import Ring from '../components/ui/Ring.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getProfileByHandle } from '../lib/profile.js';
import { isFollowing, followUser, unfollowUser } from '../lib/follows.js';

function ProfileScreen({ ui, posts }) {
  const [follows, setFollows] = useState(false);
  const [loading, setLoading] = useState(false);
  const userPosts = (posts || []).filter(p => p.user_id === ui.currentUserId || p.author_handle === ui.handle);

  return (
    <div className="px-4 pt-2 space-y-4">
      <div className="rounded-3xl overflow-hidden" style={{ background: ui.dark ? V.surfaceDark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
        {ui.coverUrl ? <img src={ui.coverUrl} alt="" className="w-full h-32 object-cover" /> : <div className="w-full h-28" style={gradientStyle(140)} />}
        <div className="px-5 pb-5 -mt-8 relative">
          <div className="flex justify-between items-end mb-2">
            <Avatar handle={ui.handle} name={ui.displayName} size={64} url={ui.avatarUrl} />
          </div>
          <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: ui.textPrimary }}>{ui.displayName || ui.handle}</h2>
          <p className="text-[13px]" style={{ color: ui.textMuted }}>@{ui.handle}</p>
          {ui.bio && <p className="text-[14px] mt-2 leading-relaxed" style={{ color: ui.textPrimary }}>{ui.bio}</p>}
          <div className="flex flex-wrap gap-3 mt-3 text-[12px]" style={{ color: ui.textSecondary }}>
            {ui.location && <span className="flex items-center gap-1"><MapPin size={12} />{ui.location}</span>}
            {ui.website && <span className="flex items-center gap-1"><Link size={12} />{ui.website}</span>}
            {ui.joined && <span className="flex items-center gap-1"><Calendar size={12} />Joined {new Date(ui.joined).toLocaleDateString()}</span>}
          </div>
          <div className="flex gap-4 mt-3">
            <span className="text-[13px]" style={{ color: ui.textSecondary }}><strong style={{ color: ui.textPrimary }}>{ui.followersCount || 0}</strong> followers</span>
            <span className="text-[13px]" style={{ color: ui.textSecondary }}><strong style={{ color: ui.textPrimary }}>{ui.followingCount || 0}</strong> following</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard ui={ui} label="Reputation" value={ui.reputation || 0} color={V.royal} />
        <StatCard ui={ui} label="Balance" value={`${fmt(ui.balance)} VCN`} color={V.gold} />
      </div>
      {userPosts.length === 0 ? <EmptyState ui={ui} title="No posts yet" body="Start creating!" /> : userPosts.map(post => <PostCard key={post.id} post={post} ui={ui} isOwn />)}
    </div>
  );
}

export default ProfileScreen;