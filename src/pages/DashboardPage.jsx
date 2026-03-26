import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import BrandLogo from '../components/BrandLogo'

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard = ({ icon, label, value, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 18,
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div style={{
      width: 46, height: 46, borderRadius: 13,
      background: `${accent}15`,
      border: `1px solid ${accent}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: accent, lineHeight: 1, letterSpacing: '-0.04em' }}>{value}</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginTop: 3 }}>{label}</div>
    </div>
  </motion.div>
)

/* ─────────────────────────────────────────
   RESUME CARD
───────────────────────────────────────── */
const ResumeCard = ({ resume, onView, onDownload, onDelete, index }) => {
  const [hovered, setHovered] = useState(false)

  const statusColor = resume.atsScore >= 90
    ? '#00DC82' : resume.atsScore >= 70
    ? '#F59E0B' : '#F43F5E'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 20,
        padding: '22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, ${statusColor}90, ${statusColor}20)`,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 16, letterSpacing: '-0.03em', marginBottom: 4, color: 'white',
          }}>{resume.title}</div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12.5, color: 'rgba(255,255,255,0.3)', fontWeight: 500,
          }}>{resume.date}</div>
        </div>

        {/* ATS Score Badge */}
        <div style={{
          background: `${statusColor}12`,
          border: `1px solid ${statusColor}30`,
          borderRadius: 10, padding: '6px 12px',
          textAlign: 'center', flexShrink: 0,
        }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 18, color: statusColor, lineHeight: 1 }}>{resume.atsScore}%</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9.5, color: statusColor, opacity: 0.7, letterSpacing: '0.08em', fontWeight: 700 }}>ATS</div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {resume.tags.map((tag, i) => (
          <span key={i} style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, fontWeight: 600,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 100, padding: '3px 10px',
            color: 'rgba(255,255,255,0.38)',
          }}>{tag}</span>
        ))}
      </div>

      {/* ATS Progress bar */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${resume.atsScore}%` }}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', borderRadius: 100, background: `linear-gradient(to right, ${statusColor}, ${statusColor}aa)` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onView(resume)} style={{
          flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
          color: 'rgba(255,255,255,0.55)', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4S1 6.5 1 6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="6.5" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/></svg>
          Preview
        </button>

        <button onClick={() => onDownload(resume)} style={{
          flex: 1, padding: '9px', borderRadius: 10,
          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
          border: 'none', cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 700,
          color: 'white', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: '0 3px 12px rgba(99,102,241,0.35)',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(99,102,241,0.35)' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v7M3.5 6l3 3 3-3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 10.5h9" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
          Download
        </button>

        <button onClick={() => onDelete(resume.id)} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.06)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M5.5 6v4M7.5 6v4M3 3.5l.5 7h6l.5-7" stroke="#F87171" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
const EmptyState = ({ onBuild }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    style={{
      gridColumn: '1 / -1',
      background: 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: 22, padding: '60px 40px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 52, marginBottom: 16 }}>📄</div>
    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 10, letterSpacing: '-0.03em' }}>Abhi tak koi resume nahi</div>
    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.35)', marginBottom: 28, lineHeight: 1.7 }}>
      Apna pehla AI-powered resume banao aur<br />94–97% ATS score guarantee karo!
    </p>
    <button onClick={onBuild} style={{
      background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
      border: 'none', cursor: 'pointer',
      fontFamily: "'Outfit', sans-serif", fontWeight: 700,
      color: 'white', borderRadius: 13,
      padding: '14px 32px', fontSize: 15,
      boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
      Build My First Resume
    </button>
  </motion.div>
)

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('resumes')
  const [profileOpen, setProfileOpen] = useState(false)
  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: 'Software Engineer Resume',
      date: 'Updated 2 days ago',
      atsScore: 96,
      tags: ['FAANG-Ready', 'LaTeX PDF', 'AI Enhanced'],
      downloaded: true,
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      date: 'Updated 5 days ago',
      atsScore: 94,
      tags: ['Tech Profile', 'LaTeX PDF'],
      downloaded: false,
    },
  ])

  const handleDelete = (id) => {
    setResumes(r => r.filter(x => x.id !== id))
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      toast.error(error?.message || 'Unable to log out. Please try again.')
    }
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'User'
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const tabs = [
    { id: 'resumes', label: 'My Resumes', icon: '📄' },
    { id: 'builder', label: 'Build New', icon: '⚡' },
    { id: 'upload', label: 'Upload & Enhance', icon: '📤' },
  ]

  return (
    <div style={{
      background: '#050512', color: 'white', minHeight: '100vh',
      fontFamily: "'Outfit', sans-serif", overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #6366F1, #00DC82); border-radius: 10px; }
        .rw-display { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.04em; }
        .rw-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .grad-text { background: linear-gradient(135deg, #C7D2FE 0%, #818CF8 35%, #00DC82 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 72px 72px; }
        .rw-noise { position: fixed; inset:0; pointer-events:none; z-index:999; opacity:0.015; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .dash-tab { fontFamily: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; font-weight: 600; padding: 9px 18px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 7px; }
        .action-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 26px; cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); text-align: center; }
        .action-card:hover { transform: translateY(-6px) scale(1.02); border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-main { margin-left: 0 !important; }
          .stats-row { grid-template-columns: repeat(2,1fr) !important; }
          .resumes-grid { grid-template-columns: 1fr !important; }
          .actions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="rw-noise" />

      {/* ── TOPBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(5,5,18,0.92)', backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '0 24px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <BrandLogo size={52} onClick={() => navigate('/')} />

        {/* Center tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13, padding: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.id === 'builder' ? navigate('/builder') : tab.id === 'upload' ? navigate('/upload') : setActiveTab(tab.id)}
              className="dash-tab"
              style={{
                background: activeTab === tab.id ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: activeTab === tab.id ? '#A5B4FC' : 'rgba(255,255,255,0.38)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              <span className="rw-body" style={{ fontSize: 13.5, fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right — Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 12, padding: '7px 14px 7px 8px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 12, color: 'white',
            }}>{initials}</div>
            <div style={{ textAlign: 'left' }}>
              <div className="rw-display" style={{ fontSize: 13, letterSpacing: '-0.02em' }}>{userName}</div>
              <div className="rw-body" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)' }}>Free Plan</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 2 }}>
              <path d={profileOpen ? "M3 9l4-4 4 4" : "M3 5l4 4 4-4"} stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 200, background: 'rgba(10,10,30,0.98)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 14, overflow: 'hidden',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                {[
                  { icon: '👤', label: 'My Profile' },
                  { icon: '📄', label: 'My Resumes' },
                  { icon: '⚙️', label: 'Settings' },
                ].map((item, i) => (
                  <button key={i} style={{
                    width: '100%', padding: '12px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
                    color: 'rgba(255,255,255,0.6)', transition: 'all 0.15s', textAlign: 'left',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}
                  </button>
                ))}
                <button onClick={handleLogout} style={{
                  width: '100%', padding: '12px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
                  color: '#F87171', transition: 'all 0.15s', textAlign: 'left',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5.5 7.5h7M10 5l2.5 2.5L10 10M8 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h5" stroke="#F87171" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ── MAIN CONTENT ── */}
      <main className="grid-bg dash-main" style={{ paddingTop: 88, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>

          {/* Welcome banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(0,220,130,0.06))',
              border: '1px solid rgba(99,102,241,0.18)',
              borderRadius: 22, padding: '28px 32px',
              marginBottom: 28, position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
              flexWrap: 'wrap',
            }}
          >
            {/* Glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#00DC82' }} />
                <span className="rw-body" style={{ fontSize: 12, color: '#34D399', fontWeight: 700, letterSpacing: '0.06em' }}>DASHBOARD</span>
              </div>
              <h1 className="rw-display" style={{ fontSize: 'clamp(22px,3vw,32px)', lineHeight: 1.1, marginBottom: 8 }}>
                Welcome back, <span className="grad-text">{userName}! 👋</span>
              </h1>
              <p className="rw-body" style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 }}>
                Tera resume aaj kisi company mein pehunch sakta hai — build, enhance, download karo totally free beta mein.
              </p>
            </div>
            <button
              onClick={() => navigate('/builder')}
              style={{
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                color: 'white', borderRadius: 13,
                padding: '13px 26px', fontSize: 14.5,
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                display: 'flex', alignItems: 'center', gap: 8,
                flexShrink: 0, position: 'relative',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              Build New Resume
            </button>
          </motion.div>

          {/* Stats Row */}
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
            <StatCard icon="📄" label="Total Resumes" value={resumes.length} accent="#818CF8" delay={0.1} />
            <StatCard icon="⚡" label="Avg ATS Score" value={resumes.length ? Math.round(resumes.reduce((a, r) => a + r.atsScore, 0) / resumes.length) + '%' : '—'} accent="#00DC82" delay={0.15} />
            <StatCard icon="📥" label="Downloaded" value={resumes.filter(r => r.downloaded).length} accent="#F59E0B" delay={0.2} />
            <StatCard icon="💎" label="Beta Pricing" value="Free" accent="#F43F5E" delay={0.25} />
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.55 }}
            style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="rw-display" style={{ fontSize: 18 }}>Quick Actions</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)', marginLeft: 8 }} />
            </div>
            <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { icon: '⚡', title: 'Build From Scratch', desc: 'Step-by-step guided form. 5 sections, 3 minutes, done.', accent: '#6366F1', path: '/builder' },
                { icon: '📤', title: 'Upload & Enhance', desc: 'Drop your old resume. AI rewrites everything in 60 sec.', accent: '#00DC82', path: '/upload' },
                { icon: '🎯', title: 'Check ATS Score', desc: 'Free instant ATS scan. See exactly what to fix.', accent: '#F59E0B', path: '/upload' },
              ].map((action, i) => (
                <motion.div
                  key={i}
                  className="action-card"
                  onClick={() => navigate(action.path)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `${action.accent}15`,
                    border: `1px solid ${action.accent}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, margin: '0 auto 14px',
                  }}>{action.icon}</div>
                  <div className="rw-display" style={{ fontSize: 16, marginBottom: 7, letterSpacing: '-0.03em' }}>{action.title}</div>
                  <p className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{action.desc}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 14, color: action.accent, fontSize: 12.5, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                    Start Now
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resumes Grid */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.55 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="rw-display" style={{ fontSize: 18 }}>My Resumes</span>
                {resumes.length > 0 && (
                  <div style={{
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 100, padding: '2px 10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#A5B4FC',
                  }}>{resumes.length}</div>
                )}
              </div>
              {resumes.length > 0 && (
                <button
                  onClick={() => navigate('/builder')}
                  style={{
                    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700,
                    color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'none' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#A5B4FC" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  New Resume
                </button>
              )}
            </div>

            <div className="resumes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {resumes.length === 0
                ? <EmptyState onBuild={() => navigate('/builder')} />
                : resumes.map((resume, i) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    index={i}
                    onView={() => {}}
                    onDownload={() => {}}
                    onDelete={handleDelete}
                  />
                ))
              }
            </div>
          </motion.div>

          {/* Bottom tip banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              marginTop: 32,
              background: 'rgba(0,220,130,0.04)',
              border: '1px solid rgba(0,220,130,0.12)',
              borderRadius: 16, padding: '18px 24px',
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: 22 }}>💡</div>
            <div style={{ flex: 1 }}>
              <div className="rw-display" style={{ fontSize: 15, marginBottom: 3 }}>Pro Tip: Tailor your resume for each job</div>
              <p className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
                Job description se keywords copy karke "Skills" section mein add karo — ATS score 5–10% instantly badhta hai.
              </p>
            </div>
            <button
              onClick={() => navigate('/builder')}
              style={{
                background: 'rgba(0,220,130,0.1)', border: '1px solid rgba(0,220,130,0.2)',
                borderRadius: 10, padding: '9px 18px', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700,
                color: '#34D399', flexShrink: 0, transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,220,130,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,220,130,0.1)'}
            >
              Try It Now →
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  )
}