import { supabase } from './supabase'

const DUMMY_DOMAIN = '@todo-app.local'

export async function checkUsername(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
  if (error) return false
  return data.length === 0
}

export async function signUp(username, password) {
  const email = `${username}${DUMMY_DOMAIN}`
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, username })
  if (profileError) return { error: profileError }

  return { user: data.user }
}

export async function signIn(username, password) {
  const email = `${username}${DUMMY_DOMAIN}`
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error }
  return { user: data.user }
}

export async function signOut() {
  localStorage.removeItem('todo-app-username')
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export async function getUsername(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle()
  return data?.username ?? null
}

// パスワード変更
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error }
}

// アカウント削除
export async function deleteAccount() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error('ユーザーが見つかりません') }

  // プロフィール削除（タスク・メモ・カテゴリはカスケード削除）
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)
  if (error) return { error }

  await supabase.auth.signOut()
  localStorage.removeItem('todo-app-username')
  return { error: null }
}