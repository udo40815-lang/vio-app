import { supabase } from './supabase.js';

export async function boostPost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('boosts').insert({ post_id: postId, user_id: user.id });
  return { data, error };
}

export async function getBoostStatus(postId) {
  const { data } = await supabase.from('boosts').select('*').eq('post_id', postId).maybeSingle();
  return { boost: data };
}

export async function getBoostedPosts() {
  const { data } = await supabase.from('boosts').select('*').order('created_at', { ascending: false });
  return { boosts: data || [] };
}

export async function cancelBoost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('boosts').delete().eq('post_id', postId).eq('user_id', user.id);
  return { data, error };
}