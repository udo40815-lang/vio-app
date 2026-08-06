import { supabase } from './supabase.js';

export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
  if (!error) await supabase.rpc('increment_like_count', { post_id: postId });
  return { data, error };
}

export async function unlikePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
  if (!error) await supabase.rpc('decrement_like_count', { post_id: postId });
  return { error };
}

export async function isLiked(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { liked: false };
  const { data } = await supabase.from('likes').select('*').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
  return { liked: !!data };
}

export async function getLikes(postId) {
  const { data } = await supabase.from('likes').select('user_id').eq('post_id', postId);
  return { likes: (data || []).map(r => r.user_id) };
}