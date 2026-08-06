import { supabase } from './supabase.js';

export async function getBalance(userId) {
  const { data } = await supabase.from('vicoin_balances').select('*').eq('user_id', userId).single();
  return { balance: data?.balance || 0, earned: data?.earned || 0, spent: data?.spent || 0 };
}

export async function addVicoins(userId, amount, reason) {
  const { data, error } = await supabase.from('vicoin_transactions').insert({ user_id: userId, amount, reason, type: 'earn' });
  if (!error) await supabase.rpc('add_vicoins', { user_id: userId, amount });
  return { data, error };
}

export async function spendVicoins(userId, amount, reason) {
  const { data: balance } = await getBalance(userId);
  if (balance < amount) return { error: 'Insufficient balance' };
  const { data, error } = await supabase.from('vicoin_transactions').insert({ user_id: userId, amount, reason, type: 'spend' });
  if (!error) await supabase.rpc('spend_vicoins', { user_id: userId, amount });
  return { data, error };
}

export async function getTransactions(userId, limit) {
  const { data } = await supabase.from('vicoin_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit || 50);
  return { transactions: data || [] };
}