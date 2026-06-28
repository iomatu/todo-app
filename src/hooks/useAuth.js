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
      if (!mounted) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      const u = session?.user ?? null
      setUser(u)

      if (u && !localStorage.getItem(USERNAME_KEY)) {
        const name = await getUsername(u.id)
        if (name) {
          localStorage.setItem(USERNAME_KEY, name)
          setUsername(name)
        }
      }

      if (!u) {
        localStorage.removeItem(USERNAME_KEY)
        setUsername(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, username, loading }
}