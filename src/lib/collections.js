import { supabase } from './supabase.js';

export async function createCollection(name, description) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('collections').insert({ user_id: user.id, name, description });
  return { data, error };
}

export async function getUserCollections() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { collections: [] };
  const { data } = await supabase.from('collections').select('*').eq('user_id', user.id);
  return { collections: data || [] };
}

export async function addToCollection(collectionId, postId) {
  const { data, error } = await supabase.from('collection_items').insert({ collection_id: collectionId, post_id: postId });
  return { data, error };
}