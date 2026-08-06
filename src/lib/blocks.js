import { supabase } from './supabase.js';

export async function blockUser(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('blocks').insert({ blocker_id: user.id, blocked_id: targetUserId });
  return { data, error };
}

export async function unblockUser(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('blocks').delete().eq('blocker_id', user.id).eq('blocked_id', targetUserId);
  return { data, error };
}

export async function getBlockedUsers() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { blocked: [] };
  const { data } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', user.id);
  return { blocked: (data || []).map(r => r.blocked_id) };
}

export async function isBlocked(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { blocked: false };
  const { data } = await supabase.from('blocks').select('*').eq('blocker_id', user.id).eq('blocked_id', targetUserId).maybeSingle();
  return { blocked: !!data };
}