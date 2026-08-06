import { supabase } from './supabase.js';

export async function reportContent(type, targetId, reason) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('reports').insert({ reporter_id: user.id, type, target_id: targetId, reason });
  return { data, error };
}

export async function getReports() {
  const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
  return { reports: data || [] };
}

export async function resolveReport(reportId, resolution) {
  const { data, error } = await supabase.from('reports').update({ status: 'resolved', resolution }).eq('id', reportId);
  return { data, error };
}