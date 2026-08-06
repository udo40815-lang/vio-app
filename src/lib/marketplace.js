import { supabase } from './supabase.js';

export async function getMarketplaceItems() {
  const { data } = await supabase.from('marketplace').select('*').order('created_at', { ascending: false });
  return { items: data || [] };
}

export async function createMarketplaceItem(item) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('marketplace').insert({ ...item, seller_id: user.id });
  return { item: data?.[0], error };
}

export async function purchaseItem(itemId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data, error } = await supabase.from('marketplace_purchases').insert({ item_id: itemId, buyer_id: user.id });
  return { data, error };
}