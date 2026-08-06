import { supabase } from './supabase.js';

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return { profile: data, error };
}

export async function getProfileByHandle(handle) {
  const { data, error } = await supabase.from('profiles').select('*').eq('handle', handle).single();
  return { profile: data, error };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId);
  return { profile: data?.[0], error };
}

export async function searchProfiles(query) {
  const { data } = await supabase.from('profiles').select('*').or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`).limit(20);
  return { profiles: data || [] };
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `avatars/${userId}.${ext}`;
  const { data, error } = await supabase.storage.from('profiles').upload(path, file, { upsert: true });
  if (error) return { error };
  const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(path);
  await updateProfile(userId, { avatar_url: urlData.publicUrl });
  return { url: urlData.publicUrl };
}