import { useNavigate } from 'react-router-dom'

const BuilderPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Builder — Coming Soon</h1>
        <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300">
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default BuilderPage