import { supabase } from './supabase.js';

export async function getNotifications(userId) {
  const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
  return { notifications: data || [] };
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
  return { error };
}

export async function markAllNotificationsRead(userId) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
  return { error };
}

export async function getUnreadCount(userId) {
  const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false);
  return { count: count || 0 };
}

export async function createNotification(notification) {
  const { data, error } = await supabase.from('notifications').insert(notification);
  return { data, error };
}