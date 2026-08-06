import React, { useState, useEffect } from 'react';
import { MapPin, Link, Calendar, Edit3, Camera, UserPlus, UserMinus, Loader2, ArrowLeft } from 'lucide-react';
import { V, gradientStyle, fmt } from '../utils/design-system.js';
import Avatar from '../components/ui/Avatar.jsx';
import Ring from '../components/ui/Ring.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getProfileByHandle } from '../lib/profile.js';
import { isFollowing, followUser, unfollowUser } from '../lib/follows.js';
import { useVioStore, clearViewProfile } from '../store/index.js';

function ProfileScreen({ ui, posts }) {
  const viewProfile = useVioStore(s => s.viewProfile);
  const viewProfileLoading = useVioStore(s => s.viewProfileLoading);
  const viewPosts = useVioStore(s => s.viewPosts);
  const [follows, setFollows] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwn = !viewProfile || (viewProfile.id === ui.currentUserId);
  const displayName = isOwn ? (ui.displayName || ui.handle) : (viewProfile.displayName || viewProfile.handle);
  const handle = isOwn ? ui.handle : viewProfile.handle;
  const avatarUrl = isOwn ? ui.avatarUrl : viewProfile.avatarUrl;
  const coverUrl = isOwn ? ui.coverUrl : viewProfile.coverUrl;
  const bio = isOwn ? ui.bio : viewProfile.bio;
  const website = isOwn ? ui.website : viewProfile.website;
  const location = isOwn ? ui.location : viewProfile.location;
  const joined = isOwn ? ui.joined : viewProfile.joined;
  const followersCount = isOwn ? (ui.followersCount || 0) : (viewProfile.followersCount || 0);
  const followingCount = isOwn ? (ui.followingCount || 0) : (viewProfile.followingCount || 0);
  const reputation = ui.reputation || viewProfile.reputation || 0;

  useEffect(() => {
    if (!viewProfile || viewProfile.id === ui.currentUserId) return;
    let cancelled = false;
    (async () => {
      const { following } = await isFollowing(viewProfile.id);
      if (!cancelled) setFollows(following);
    })();
    return () => { cancelled = true; };
  }, [viewProfile?.id, ui.currentUserId]);

  const handleFollow = async () => {
    if (!viewProfile) return;
    setLoading(true);
    if (follows) {
      await unfollowUser(viewProfile.id);
      setFollows(false);
    } else {
      await followUser(viewProfile.id);
      setFollows(true);
    }
    setLoading(false);
  };

  const handleBack = () => { clearViewProfile(); };
  const displayPosts = isOwn ? (posts || []).filter(p => p.user_id === ui.currentUserId || p.author_handle === ui.handle) : (viewPosts || []);

  return (
    <div className="px-4 pt-2 space-y-4">
      {!isOwn && (
        <button onClick={handleBack} className="flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: ui.textPrimary }}>
          <ArrowLeft size={16} /> Back to search
        </button>
      )}
      <div className="rounded-3xl overflow-hidden" style={{ background: ui.dark ? V.surfaceDark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
        {coverUrl ? <img src={coverUrl} alt="" className="w-full h-32 object-cover" /> : <div className="w-full h-28" style={gradientStyle(140)} />}
        <div className="px-5 pb-5 -mt-8 relative">
          <div className="flex justify-between items-end mb-2">
            <Avatar handle={handle} name={displayName} size={64} url={avatarUrl} />
            {!isOwn && viewProfile && (
              <button onClick={handleFollow} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                style={follows ? { background: `${V.red}15`, color: V.red, border: `1px solid ${V.red}30` } : { background: V.royal, color: '#FFF' }}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : follows ? <><UserMinus size={14} /> Unfollow</> : <><UserPlus size={14} /> Follow</>}
              </button>
            )}
          </div>
          <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: ui.textPrimary }}>{displayName || handle}</h2>
          <p className="text-[13px]" style={{ color: ui.textMuted }}>@{handle}</p>
          {bio && <p className="text-[14px] mt-2 leading-relaxed" style={{ color: ui.textPrimary }}>{bio}</p>}
          <div className="flex flex-wrap gap-3 mt-3 text-[12px]" style={{ color: ui.textSecondary }}>
            {location && <span className="flex items-center gap-1"><MapPin size={12} />{location}</span>}
            {website && <span className="flex items-center gap-1"><Link size={12} />{website}</span>}
            {joined && <span className="flex items-center gap-1"><Calendar size={12} />Joined {new Date(joined).toLocaleDateString()}</span>}
          </div>
          <div className="flex gap-4 mt-3">
            <span className="text-[13px]" style={{ color: ui.textSecondary }}><strong style={{ color: ui.textPrimary }}>{followersCount}</strong> followers</span>
            <span className="text-[13px]" style={{ color: ui.textSecondary }}><strong style={{ color: ui.textPrimary }}>{followingCount}</strong> following</span>
          </div>
        </div>
      </div>
      {isOwn && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard ui={ui} label="Reputation" value={reputation} color={V.royal} />
          <StatCard ui={ui} label="Balance" value={`${fmt(ui.balance)} VCN`} color={V.gold} />
        </div>
      )}
      {viewProfileLoading ? (
        <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin" style={{ color: ui.textMuted }} /></div>
      ) : displayPosts.length === 0 ? (
        <EmptyState ui={ui} title="No posts yet" body="Start creating!" />
      ) : (
        displayPosts.map(post => <PostCard key={post.id} post={post} ui={ui} isOwn={isOwn} />)
      )}
    </div>
  );
}

export default ProfileScreen;