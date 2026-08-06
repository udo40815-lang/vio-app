import { supabase } from './supabase.js';

export async function trackEvent(event, data) {
  try {
    await supabase.from('analytics_events').insert({ event, data, timestamp: new Date().toISOString() });
  } catch (e) { /* silently fail */ }
}

export async function getPostAnalytics(postId) {
  const { data } = await supabase.from('post_analytics').select('*').eq('post_id', postId).single();
  return data;
}

export async function getUserAnalytics(userId) {
  const { data } = await supabase.from('user_analytics').select('*').eq('user_id', userId).single();
  return data;
}