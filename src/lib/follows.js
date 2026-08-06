import { supabase } from './supabase.js';

export async function followUser(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('follows').insert({ follower_id: user.id, following_id: targetUserId });
  return { data, error };
}

export async function unfollowUser(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetUserId);
  return { data, error };
}

export async function getFollowers(userId) {
  const { data } = await supabase.from('follows').select('follower_id').eq('following_id', userId);
  return { followers: (data || []).map(r => r.follower_id) };
}

export async function getFollowing(userId) {
  const { data } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
  return { following: (data || []).map(r => r.following_id) };
}

export async function isFollowing(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { following: false };
  const { data } = await supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', targetUserId).maybeSingle();
  return { following: !!data };
}