import { supabase } from './supabase.js';

export async function requestVerification(type, evidence) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('verification_requests').insert({ user_id: user.id, type, evidence });
  return { data, error };
}

export async function getVerificationStatus(userId) {
  const { data } = await supabase.from('verification_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
  return { status: data?.[0] };
}

export async function checkVerification(userId) {
  const { data } = await supabase.from('profiles').select('verified').eq('id', userId).single();
  return { verified: data?.verified || false };
}