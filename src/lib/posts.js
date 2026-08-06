import { supabase } from './supabase.js';

export async function createPost(content, mediaUrl, mediaKind, tags) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content, media_url: mediaUrl || null, media_kind: mediaKind || null, tags: tags || [] });
  return { post: data?.[0], error };
}

export async function getPosts(limit, offset) {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).range(offset || 0, (offset || 0) + (limit || 20) - 1);
  return { posts: data || [], error };
}

export async function getUserPosts(userId, limit, offset) {
  const { data, error } = await supabase.from('posts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(offset || 0, (offset || 0) + (limit || 20) - 1);
  return { posts: data || [], error };
}

export async function getPost(postId) {
  const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single();
  return { post: data, error };
}

export async function deletePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', user.id);
  return { error };
}

export async function updatePost(postId, updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('posts').update(updates).eq('id', postId).eq('user_id', user.id);
  return { post: data?.[0], error };
}

export async function searchPosts(query) {
  const { data } = await supabase.from('posts').select('*').or(`content.ilike.%${query}%,tags.cs.{${query}}`).order('created_at', { ascending: false }).limit(30);
  return { posts: data || [] };
}