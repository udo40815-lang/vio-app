import React, { useState, memo, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Check, Edit3, Trash2, Copy, Flag, Send, Loader2 } from 'lucide-react';
import { V, safe, fmt, timeAgo, gradientStyle } from '../../utils/design-system.js';
import Avatar from '../ui/Avatar.jsx';
import PostGradientMedia from './PostGradientMedia.jsx';
import { doAddComment, doDeleteComment } from '../../store/index.js';
import { getPostComments } from '../../lib/comments.js';

function PostCard({ post, ui, liked, saved, onLike, onSave, onEdit, onDelete, isOwn }) {
  const [showMenu, setShowMenu] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const score = Number(post.visibility_score) || 0;
  const boost = safe(post.boost_status) || 'none';
  const handleLike = useCallback(() => { setLikeAnim(true); setTimeout(() => setLikeAnim(false), 400); onLike?.(); }, [onLike]);
  const loadComments = useCallback(async () => {
    if (commentsOpen) { setCommentsOpen(false); return; }
    setCommentsOpen(true); if (comments.length > 0) return;
    setCommentsLoading(true);
    const { comments: c } = await getPostComments(post.id);
    setComments(c || []); setCommentsLoading(false);
  }, [post.id, comments.length, commentsOpen]);
  const handleSubmitComment = useCallback(async () => {
    const text = commentText.trim(); if (!text || submitting) return;
    setSubmitting(true); const result = await doAddComment(post.id, text); setSubmitting(false);
    if (!result.error) { setCommentText(''); setComments(prev => [...prev, { ...result.comment, replies: [] }]); }
  }, [commentText, submitting, post.id]);
  const handleDeleteComment = useCallback(async (commentId) => { await doDeleteComment(commentId, post.id); setComments(prev => prev.filter(c => c.id !== commentId)); }, [post.id]);
  const handleKeyDown = useCallback((e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }, [handleSubmitComment]);
  return (
    <article className="rounded-3xl p-[1px] relative transition-all duration-300 hover:-translate-y-[2px]" style={{ background: boost === 'active' ? `linear-gradient(135deg, ${V.gold}40, ${V.royal}40)` : 'transparent' }} role="article" aria-label={`Post by ${post.author_handle}`}>
      <div className="rounded-3xl p-5" style={{ background: ui.dark ? V.surfaceDark : '#FFFFFF', border: boost === 'active' ? 'none' : `1px solid ${ui.border}`, boxShadow: boost === 'active' ? `0 0 30px -8px ${V.gold}30` : 'none' }}>
        <div className="absolute top-3.5 right-3.5 z-10"><div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${V.royal}18`, color: V.royal }}>{score}</div></div>
        <div className="flex items-center gap-3 mb-3.5">
          <Avatar handle={post.author_handle} name={post.author_name} size={38} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold truncate" style={{ color: ui.textPrimary }}>{post.author_name || post.author_handle}</span>
              <Check size={11} style={{ color: V.electric }} />
              {boost === 'active' && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${V.gold}25`, color: V.gold }}>BOOSTED</span>}
            </div>
            <div className="text-[11px]" style={{ color: ui.textMuted }}>@{post.author_handle} · {timeAgo(post.created_at)}</div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-xl transition-colors hover:bg-black/5" aria-label="Post options"><MoreHorizontal size={15} style={{ color: ui.textMuted }} /></button>
            {showMenu && isOwn && (
              <div className="absolute right-0 top-10 z-20 rounded-xl py-1 shadow-lg min-w-[140px]" style={{ background: ui.dark ? V.dark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
                <button onClick={() => { setShowMenu(false); onEdit?.(post); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-black/5" style={{ color: ui.textPrimary }}><Edit3 size={13} /> Edit post</button>
                <button onClick={() => { setShowMenu(false); onDelete?.(post.id); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-black/5" style={{ color: V.red }}><Trash2 size={13} /> Delete post</button>
              </div>
            )}
            {showMenu && !isOwn && (
              <div className="absolute right-0 top-10 z-20 rounded-xl py-1 shadow-lg min-w-[140px]" style={{ background: ui.dark ? V.dark : '#FFFFFF', border: `1px solid ${ui.border}` }}>
                <button onClick={() => { setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-black/5" style={{ color: ui.textPrimary }}><Flag size={13} /> Report</button>
                <button onClick={() => { setShowMenu(false); navigator.clipboard?.writeText(`${window.location.origin}/post/${post.id}`); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-black/5" style={{ color: ui.textSecondary }}><Copy size={13} /> Copy link</button>
              </div>
            )}
          </div>
        </div>
        {post.content && <p className="text-[15px] leading-relaxed mb-3.5 whitespace-pre-wrap break-words" style={{ color: ui.textPrimary }}>{post.content}</p>}
        {post.media_url && (
          <div className="rounded-2xl overflow-hidden mb-3.5" style={{ border: `1px solid ${ui.border}` }}>
            {post.media_kind === 'image' ? <img src={post.media_url} alt="Post media" loading="lazy" className="w-full h-auto max-h-[320px] object-cover" /> : <PostGradientMedia post={post} />}
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {(typeof post.tags === 'string' ? safe(post.tags).split(',').slice(0, 3) : post.tags.slice(0, 3)).map((tag, i) => (
              <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: `${V.royal}12`, color: V.royal }}>{typeof tag === 'string' ? tag.trim() : tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-5 pt-2" style={{ borderTop: `1px solid ${ui.border}` }}>
          <button onClick={handleLike} className="flex items-center gap-1.5 transition-all duration-200 hover:scale-110" aria-label={`Like. ${post.likes_count || 0} likes`}>
            <Heart size={16} className={likeAnim ? 'animate-[vHeartBounce_350ms_ease]' : ''} style={{ color: liked ? V.red : ui.textMuted, fill: liked ? V.red : 'transparent' }} />
            <span className="text-[12px] font-medium" style={{ color: liked ? V.red : ui.textMuted }}>{post.likes_count || 0}</span>
          </button>
          <button onClick={loadComments} className="flex items-center gap-1.5 transition-all duration-200 hover:scale-110" aria-label={`Comments. ${post.comments_count || 0} comments`}>
            <MessageCircle size={16} style={{ color: commentsOpen ? V.royal : ui.textMuted }} />
            <span className="text-[12px] font-medium" style={{ color: commentsOpen ? V.royal : ui.textMuted }}>{post.comments_count || 0}</span>
          </button>
          <button className="flex items-center gap-1.5 transition-all duration-200 hover:scale-110 ml-auto" aria-label="Share post" onClick={() => navigator.share?.({ url: `${window.location.origin}/post/${post.id}` }) || {}}>
            <Share2 size={16} style={{ color: ui.textMuted }} />
          </button>
          <button onClick={() => onSave?.()} className="flex items-center gap-1.5 transition-all duration-200 hover:scale-110" aria-label={saved ? 'Remove from saved' : 'Save post'}>
            <Bookmark size={16} style={{ color: saved ? V.electric : ui.textMuted, fill: saved ? V.electric : 'transparent' }} />
          </button>
        </div>
        {commentsOpen && (
          <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${ui.border}` }}>
            {commentsLoading ? (
              <div className="flex justify-center py-4"><Loader2 size={16} className="animate-spin" style={{ color: ui.textMuted }} /></div>
            ) : comments.length === 0 ? (
              <p className="text-[12px] text-center py-3" style={{ color: ui.textMuted }}>No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-2.5 mb-3 max-h-[300px] overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <Avatar handle={c.author_handle} name={c.author_name} size={24} />
                    <div className="flex-1 min-w-0">
                      <div className="rounded-2xl px-3 py-1.5" style={{ background: ui.dark ? 'rgba(255,255,255,0.04)' : '#F5F6F8' }}>
                        <span className="text-[11px] font-semibold" style={{ color: ui.textPrimary }}>{c.author_name || c.author_handle}</span>
                        <span className="text-[10px] ml-1.5" style={{ color: ui.textMuted }}>@{c.author_handle}</span>
                        <p className="text-[13px] leading-snug mt-0.5 break-words" style={{ color: ui.textPrimary }}>{c.content}</p>
                      </div>
                      <div className="flex items-center gap-3 px-1 mt-0.5">
                        <span className="text-[10px]" style={{ color: ui.textMuted }}>{timeAgo(c.created_at)}</span>
                        {(c.user_id === ui.currentUserId) && <button onClick={() => handleDeleteComment(c.id)} className="text-[10px] font-medium hover:underline" style={{ color: V.red + 'aa' }}>Delete</button>}
                      </div>
                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-3 mt-2 space-y-2 pl-3" style={{ borderLeft: `2px solid ${ui.border}` }}>
                          {c.replies.map((r) => (
                            <div key={r.id} className="flex gap-2">
                              <Avatar handle={r.author_handle} name={r.author_name} size={18} />
                              <div className="flex-1 min-w-0"><div className="rounded-2xl px-3 py-1" style={{ background: ui.dark ? 'rgba(255,255,255,0.02)' : '#F0F1F4' }}><span className="text-[10px] font-semibold" style={{ color: ui.textPrimary }}>{r.author_name || r.author_handle}</span><span className="text-[9px] ml-1" style={{ color: ui.textMuted }}>@{r.author_handle}</span><p className="text-[12px] leading-snug mt-0.5 break-words" style={{ color: ui.textPrimary }}>{r.content}</p></div><div className="flex items-center gap-3 px-1 mt-0.5"><span className="text-[9px]" style={{ color: ui.textMuted }}>{timeAgo(r.created_at)}</span>{(r.user_id === ui.currentUserId) && <button onClick={() => handleDeleteComment(r.id)} className="text-[9px] font-medium hover:underline" style={{ color: V.red + 'aa' }}>Delete</button>}</div></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${ui.border}` }}>
              <Avatar handle={ui.handle} name={ui.displayName} size={24} />
              <div className="flex-1 flex items-center gap-1.5">
                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Write a comment..." maxLength={500} className="flex-1 text-[13px] py-2 px-3 rounded-xl outline-none" style={{ color: ui.textPrimary, background: ui.dark ? 'rgba(255,255,255,0.04)' : '#F5F6F8', border: `1px solid ${ui.border}` }} aria-label="Write a comment" />
                <button onClick={handleSubmitComment} disabled={!commentText.trim() || submitting} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30" style={{ background: commentText.trim() ? V.royal : 'transparent', border: commentText.trim() ? 'none' : `1px solid ${ui.border}` }} aria-label="Send comment">{submitting ? <Loader2 size={13} className="animate-spin" style={{ color: '#FFF' }} /> : <Send size={13} style={{ color: commentText.trim() ? '#FFF' : ui.textMuted }} />}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(PostCard);