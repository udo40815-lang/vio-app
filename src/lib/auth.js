import { supabase } from './supabase.js';

export async function signUp(email, password, handle) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { handle } } });
  if (error) return { error };
  if (data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, handle, email, created_at: new Date().toISOString() });
  }
  return { user: data.user, session: data.session };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error };
  return { user: data.user, session: data.session };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { error };
  return { session: data.session };
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return { error };
  return { user: data.user };
}

export { supabase };