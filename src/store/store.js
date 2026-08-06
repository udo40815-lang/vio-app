import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';
import { getProfile } from '../lib/profile.js';
import { getPosts } from '../lib/posts.js';
import { getBalance, getTransactions } from '../lib/vicoins.js';
import { signUp, signIn, signOut as authSignOut, getSession } from '../lib/auth.js';
import { addComment, deleteComment } from '../lib/comments.js';
import { createPost } from '../lib/posts.js';
import { uploadFile } from '../lib/storage.js';

export const useVioStore = create((set, get) => ({
  initialized: false,
  loading: true,
  session: { authenticated: false, userId: '', handle: '', theme: 'dark' },
  profile: {},
  posts: [],
  ledger: [],
  earned: 0,
  spent: 0,
  balance: 0,
}));

export async function initSession() {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('vio-session') : null;
    const local = stored ? JSON.parse(stored) : {};
    useVioStore.setState(s => ({ ...s, session: { ...s.session, ...local, theme: local.theme || 'dark' } }));
    const { session } = await getSession();
    if (session?.user) {
      useVioStore.setState(s => ({ ...s, session: { ...s.session, authenticated: true, userId: session.user.id, handle: session.user.user_metadata?.handle || '' } }));
      const { profile } = await getProfile(session.user.id);
      if (profile) useVioStore.setState(s => ({ ...s, profile }));
      const { posts } = await getPosts(20, 0);
      if (posts) useVioStore.setState(s => ({ ...s, posts }));
      const { balance, earned, spent } = await getBalance(session.user.id);
      useVioStore.setState(s => ({ ...s, balance: balance || 0, earned: earned || 0, spent: spent || 0 }));
      const { transactions } = await getTransactions(session.user.id, 20);
      useVioStore.setState(s => ({ ...s, ledger: transactions || [] }));
    }
    useVioStore.setState(s => ({ ...s, initialized: true, loading: false }));
  } catch (e) {
    console.error('Vio: initSession error', e);
    useVioStore.setState(s => ({ ...s, initialized: true, loading: false }));
  }
}

export function setSession(updates) {
  const current = useVioStore.getState().session;
  const next = { ...current, ...updates };
  useVioStore.setState(s => ({ ...s, session: next }));
  if (typeof window !== 'undefined') localStorage.setItem('vio-session', JSON.stringify(next));
}

export async function doSignUp(email, password, handle) {
  const result = await signUp(email, password, handle);
  if (result.user) { setSession({ authenticated: true, userId: result.user.id, handle }); useVioStore.setState(s => ({ ...s, initialized: true })); }
  return result;
}

export async function doSignIn(email, password) {
  const result = await signIn(email, password);
  if (result.user) { setSession({ authenticated: true, userId: result.user.id, handle: result.user.user_metadata?.handle || '' }); useVioStore.setState(s => ({ ...s, initialized: true })); }
  return result;
}

export async function doSignOut() {
  await authSignOut();
  setSession({ authenticated: false, userId: '', handle: '' });
  useVioStore.setState(s => ({ ...s, profile: {}, posts: [], ledger: [], balance: 0, earned: 0, spent: 0 }));
}

export async function doCreatePost(content, mediaFile, tags) {
  const { session } = useVioStore.getState();
  if (!session.authenticated) return { error: 'Not authenticated' };
  let mediaUrl = null;
  let mediaKind = null;
  if (mediaFile) {
    const result = await uploadFile('media', `posts/${Date.now()}-${mediaFile.name}`, mediaFile);
    if (result.url) { mediaUrl = result.url; mediaKind = 'image'; }
  }
  const result = await createPost(content, mediaUrl, mediaKind, tags);
  if (result.post) {
    const { posts } = useVioStore.getState();
    useVioStore.setState(s => ({ ...s, posts: [result.post, ...posts] }));
  }
  return result;
}

export async function doAddComment(postId, content) {
  const result = await addComment(postId, content);
  return result;
}

export async function doDeleteComment(commentId, postId) {
  const result = await deleteComment(commentId);
  return result;
}

export default useVioStore;