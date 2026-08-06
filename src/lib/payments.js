import { supabase } from './supabase.js';

export async function getPaymentMethods(userId) {
  const { data } = await supabase.from('payment_methods').select('*').eq('user_id', userId);
  return { methods: data || [] };
}

export async function addPaymentMethod(method) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('payment_methods').insert({ ...method, user_id: user.id });
  return { data, error };
}

export async function createPaymentIntent(amount, currency) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('payment_intents').insert({ user_id: user.id, amount, currency: currency || 'usd' });
  return { intent: data?.[0], error };
}