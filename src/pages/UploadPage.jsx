import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadResume from '../components/upload/UploadResume'

export default function UploadPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#050512', color: 'white', fontFamily: "'Outfit', sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #6366F1, #00DC82); border-radius: 10px; }
        .rw-display { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.04em; }
        .rw-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .upload-topbar { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); background: rgba(5,5,18,0.92); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .upload-back { border: none; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 8px 12px; color: rgba(255,255,255,0.65); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; letter-spacing: -0.01em; transition: all 0.2s; }
        .upload-back:hover { color: white; background: rgba(255,255,255,0.06); }
      `}</style>

      <div className="upload-topbar" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="upload-back" onClick={() => navigate('/dashboard')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Dashboard
        </button>
        <div style={{ textAlign: 'right' }}>
          <div className="rw-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>ResumeWala</div>
          <div className="rw-display" style={{ fontSize: 18 }}>Upload & Enhance</div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}
      >
        <UploadResume />
      </motion.div>
    </div>
  )
}
