import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { getUsername } from '../services/auth'

const USERNAME_KEY = 'todo-app-username'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('getSession結果:', session)
            if (!mounted) return
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('authイベント:', event, session?.user?.id)
            if (!mounted) return

            // パスワードリセットイベントは無視
            if (event === 'PASSWORD_RECOVERY') return

            const u = session?.user ?? null
            setUser(u)

            if (event === 'SIGNED_OUT') {
                console.log('SIGNED_OUTが発生しました')
                localStorage.removeItem(USERNAME_KEY)
                setUsername(null)
                setLoading(false)
                return
            }

            if (u) {
                const stored = localStorage.getItem(USERNAME_KEY)
                if (!stored) {
                    const name = await getUsername(u.id)
                    if (name && mounted) {
                        localStorage.setItem(USERNAME_KEY, name)
                        setUsername(name)
                    }
                } else {
                    setUsername(stored)
                }
            }

            setLoading(false)
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return { user, username, loading }
}