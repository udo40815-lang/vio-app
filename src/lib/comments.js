import { supabase } from './supabase.js';

export async function addComment(postId, content, parentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('comments').insert({ post_id: postId, user_id: user.id, content, parent_id: parentId || null });
  if (!error) {
    await supabase.rpc('increment_comment_count', { post_id: postId });
  }
  return { comment: data?.[0], error };
}

export async function getPostComments(postId) {
  const { data: comments, error } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
  if (error) return { comments: [], error };
  return { comments: comments || [] };
}

export async function deleteComment(commentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id);
  return { error };
}