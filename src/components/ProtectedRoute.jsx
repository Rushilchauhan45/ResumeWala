import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#050512', color: 'white', fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)',
            borderTopColor: '#6366F1', margin: '0 auto 16px', animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Checking your session...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" replace />
}

export default ProtectedRoute