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

    // 既存セッションを先に取得
    const { data: { session: existingSession } } = await supabase.auth.getSession()

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }

    // プロフィールをサービスロールで作成
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username })
    if (profileError) return { error: profileError }

    localStorage.setItem('todo-app-username', username)

    // 登録後に明示的にログインし直す
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (signInError) return { error: signInError }

    return { user: signInData.user }
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
    const { error } = await supabase.rpc('delete_user')
    if (error) return { error }
    localStorage.removeItem('todo-app-username')
    await supabase.auth.signOut()
    return { error: null }
}