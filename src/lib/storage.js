import { supabase } from './supabase.js';

export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return { error };
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: urlData.publicUrl };
}

export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { error };
}

export async function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function uploadPostMedia(postId, file) {
  const ext = file.name.split('.').pop();
  const path = `posts/${postId}.${ext}`;
  return uploadFile('media', path, file);
}