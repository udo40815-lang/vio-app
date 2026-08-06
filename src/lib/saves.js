import { supabase } from './supabase.js';

export async function savePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('saved_posts').insert({ user_id: user.id, post_id: postId });
  return { data, error };
}

export async function unsavePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', postId);
  return { error };
}

export async function getSavedPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: [] };
  const { data } = await supabase.from('saved_posts').select('post_id').eq('user_id', user.id);
  return { saved: (data || []).map(r => r.post_id) };
}

export async function isSaved(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false };
  const { data } = await supabase.from('saved_posts').select('*').eq('user_id', user.id).eq('post_id', postId).maybeSingle();
  return { saved: !!data };
}