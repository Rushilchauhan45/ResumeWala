import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const shapeUser = (supabaseUser) => {
  if (!supabaseUser) return null
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
    avatar: supabaseUser.user_metadata?.avatar_url || null,
    metadata: supabaseUser.user_metadata || {},
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setUser(shapeUser(data.session?.user))
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(shapeUser(session?.user))
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    if (!supabase) throw new Error('Supabase client is not configured')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const shaped = shapeUser(data.user)
    setUser(shaped)
    return shaped
  }

  const signup = async ({ name, email, password }) => {
    if (!supabase) throw new Error('Supabase client is not configured')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth?mode=login`,
      },
    })
    if (error) throw error
    const requiresEmailConfirmation = !data.session
    if (!requiresEmailConfirmation) {
      const shaped = shapeUser(data.user)
      setUser(shaped)
    }
    return { user: data.user, requiresEmailConfirmation }
  }

  const loginWithProvider = async (provider) => {
    if (!supabase) throw new Error('Supabase client is not configured')
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard`
      : undefined

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) throw error

    if (data?.url && typeof window !== 'undefined') {
      window.location.href = data.url
    }
  }

  const logout = async () => {
    if (!supabase) {
      setUser(null)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, loginWithProvider }),
    [user, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext