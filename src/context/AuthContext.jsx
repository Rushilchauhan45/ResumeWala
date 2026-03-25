import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('rb_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('rb_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rb_user')
    localStorage.removeItem('rb_token')
  }

  const signup = (userData) => {
    setUser(userData)
    localStorage.setItem('rb_user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext