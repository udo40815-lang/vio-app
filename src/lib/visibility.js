import { supabase } from './supabase.js';

export async function calculateVisibilityScore(post) {
  let score = 50;
  if (post.content && post.content.length > 50) score += 10;
  if (post.content && post.content.length > 200) score += 5;
  if (post.media_url) score += 15;
  if (post.tags && post.tags.length > 0) score += 5;
  if (post.tags && post.tags.length > 2) score += 5;
  const likeWeight = (post.likes_count || 0) * 2;
  const commentWeight = (post.comments_count || 0) * 3;
  score += Math.min(likeWeight + commentWeight, 40);
  return Math.min(100, Math.max(0, score));
}

export async function updatePostVisibility(postId) {
  const { data: post } = await supabase.from('posts').select('*').eq('id', postId).single();
  if (!post) return;
  const score = await calculateVisibilityScore(post);
  await supabase.from('posts').update({ visibility_score: score }).eq('id', postId);
  return score;
}

export async function getTrendingPosts(limit) {
  const { data } = await supabase.from('posts').select('*').order('visibility_score', { ascending: false }).limit(limit || 20);
  return { posts: data || [] };
}

export async function getDiscoverFeed(userId, limit) {
  const { data } = await supabase.from('posts').select('*').neq('user_id', userId || '').order('visibility_score', { ascending: false }).limit(limit || 20);
  return { posts: data || [] };
}