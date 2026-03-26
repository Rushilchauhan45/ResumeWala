import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

/* ── Eye Icon ── */
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    {open ? (
      <>
        <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      </>
    ) : (
      <>
        <path d="M2 2l14 14M7.5 7.6A2.5 2.5 0 0 0 11.4 11.5M5.2 5.3C3.3 6.5 2 9 2 9s3 5.5 7 5.5c1.4 0 2.7-.4 3.8-1.2M9 3.5c4.5.3 7 5.5 7 5.5s-.8 1.6-2.2 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </>
    )}
  </svg>
)

/* ── Google Icon ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.1 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.6a3.9 3.9 0 0 1-1.7 2.6v2.1h2.7c1.6-1.5 2.5-3.7 2.5-6.3z" fill="#4285F4"/>
    <path d="M9 18c2.3 0 4.2-.8 5.6-2.1l-2.7-2.1c-.8.5-1.7.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H1.4v2.2A8.5 8.5 0 0 0 9 18z" fill="#34A853"/>
    <path d="M4.2 11.1A5.1 5.1 0 0 1 4.2 7l0 0V4.8H1.4A8.5 8.5 0 0 0 .5 9c0 1.4.3 2.7.9 3.9l2.8-1.8z" fill="#FBBC04"/>
    <path d="M9 3.6c1.2 0 2.3.4 3.2 1.3l2.4-2.4A8.5 8.5 0 0 0 9 0 8.5 8.5 0 0 0 1.4 4.8L4.2 7C4.9 5 6.8 3.6 9 3.6z" fill="#EA4335"/>
  </svg>
)

/* ── GitHub Icon ── */
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M9 .5A9 9 0 0 0 6.16 18c.45.08.61-.2.61-.43v-1.5c-2.5.54-3.02-1.2-3.02-1.2-.41-1.04-1-1.31-1-1.31-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.37 2.1.97 2.6.74.08-.58.31-.97.57-1.19-2-.23-4.1-.99-4.1-4.43 0-.98.35-1.78.92-2.41-.09-.23-.4-1.14.09-2.37 0 0 .75-.24 2.45.91A8.56 8.56 0 0 1 9 4.77c.76 0 1.52.1 2.24.3 1.7-1.15 2.44-.91 2.44-.91.49 1.23.18 2.14.09 2.37.58.63.92 1.43.92 2.41 0 3.45-2.1 4.2-4.1 4.42.32.28.61.83.61 1.67v2.47c0 .24.16.52.62.43A9 9 0 0 0 9 .5z"/>
  </svg>
)

export default function AuthPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { login, signup } = useAuth()

  const validate = () => {
    const e = {}
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (mode === 'signup' && form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const userData = {
      id: Date.now().toString(),
      name: form.name || form.email.split('@')[0],
      email: form.email,
      createdAt: new Date().toISOString(),
      plan: 'free',
    }
    if (mode === 'login') login(userData)
    else signup(userData)
    toast.success(mode === 'login' ? `Welcome back! 👋` : `Account created! Let's build your resume 🚀`)
    navigate('/dashboard')
    setLoading(false)
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const features = [
    { icon: '⚡', text: 'Groq AI-powered enhancement' },
    { icon: '🎯', text: '94–97% ATS score guaranteed' },
    { icon: '📐', text: 'LaTeX professional PDF output' },
    { icon: '💎', text: 'Only ₹19 to download — no subscription' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050512', display: 'flex', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .rw-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 13px 16px; font-size: 15px; color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; transition: all 0.2s; outline: none; }
        .rw-input::placeholder { color: rgba(255,255,255,0.25); font-weight: 400; }
        .rw-input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.05); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .rw-input.error { border-color: rgba(244,63,94,0.5); background: rgba(244,63,94,0.04); }
        .rw-input.error:focus { box-shadow: 0 0 0 3px rgba(244,63,94,0.1); }
        .btn-primary { background: linear-gradient(135deg, #6366F1, #4F46E5); border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 700; color: white; border-radius: 13px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 4px 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.12); letter-spacing: -0.02em; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.15); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-social { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 12px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.65); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 9px; }
        .btn-social:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); color: white; transform: translateY(-1px); }
        .rw-display { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.04em; }
        .rw-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .tab-btn { flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; border-radius: 10px; transition: all 0.2s; }
        .tab-btn.active { background: rgba(99,102,241,0.18); color: #A5B4FC; }
        .tab-btn:not(.active) { color: rgba(255,255,255,0.35); }
        .tab-btn:not(.active):hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 72px 72px; }
        .rw-noise { position: fixed; inset:0; pointer-events:none; z-index:999; opacity:0.015; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @media (max-width: 900px) { .auth-left { display: none !important; } .auth-right { max-width: 100% !important; padding: 40px 24px !important; } }
      `}</style>

      <div className="rw-noise" />

      {/* ── LEFT PANEL ── */}
      <div className="auth-left grid-bg" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 56px' }}>

        {/* Ambient blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '10%', left: '10%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{ position: 'absolute', bottom: '15%', right: '5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,130,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div style={{ filter: 'drop-shadow(0 0 14px rgba(99,102,241,0.65))' }}>
              <svg width="38" height="38" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="12" fill="url(#alg1)"/>
                <rect x="10" y="8" width="16" height="20" rx="3" fill="rgba(255,255,255,0.93)"/>
                <rect x="13" y="13" width="10" height="1.5" rx="0.75" fill="#6366F1" opacity="0.7"/>
                <rect x="13" y="16.5" width="10" height="1.5" rx="0.75" fill="#6366F1" opacity="0.5"/>
                <rect x="13" y="20" width="6" height="1.5" rx="0.75" fill="#6366F1" opacity="0.3"/>
                <circle cx="28" cy="28" r="9.5" fill="#050512"/>
                <circle cx="28" cy="28" r="8" fill="url(#alg2)"/>
                <path d="M24.5 28l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="alg1" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4338CA"/></linearGradient>
                  <linearGradient id="alg2" x1="20" y1="20" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#00DC82"/><stop offset="1" stopColor="#059669"/></linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="rw-display" style={{ fontSize: 20, background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Resume<span style={{ background: 'linear-gradient(135deg, #A5B4FC, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wala</span>
              </div>
              <div className="rw-body" style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', fontWeight: 700, marginTop: 2 }}>AI RESUME PLATFORM</div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <h1 className="rw-display" style={{ fontSize: 48, lineHeight: 1.04, marginBottom: 20, color: 'white' }}>
              Build a Resume<br />
              <span style={{ background: 'linear-gradient(135deg, #C7D2FE 0%, #818CF8 40%, #00DC82 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                That Gets You Hired
              </span>
            </h1>
            <p className="rw-body" style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 44 }}>
              Join 8,392 students and freshers who turned rejection into offers using ResumeWala's AI-powered platform.
            </p>
          </motion.div>

          {/* Features list */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 52 }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                <span className="rw-body" style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{f.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial quote */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 22px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #6366F1, #00DC82)', borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
              {Array(5).fill(0).map((_,i) => <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B"><path d="M6 1l1.2 3.2H10L7.4 6.4l.9 3.3L6 7.8 3.7 9.7l.9-3.3L2 4.2h2.8L6 1z"/></svg>)}
            </div>
            <p className="rw-body" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 12 }}>
              "My ATS score went from 31% to 95%. Got Google's call within 2 weeks. Best ₹19 I ever spent."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(66,133,244,0.2)', border: '1px solid rgba(66,133,244,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#4285F4' }}>PI</div>
              <div>
                <div className="rw-display" style={{ fontSize: 13, letterSpacing: '-0.02em', color: 'white' }}>Priya Iyer</div>
                <div className="rw-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Software Engineer at Google</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL (FORM) ── */}
      <div className="auth-right" style={{ width: '100%', maxWidth: 520, background: 'rgba(255,255,255,0.015)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px', position: 'relative', overflowY: 'auto' }}>

        {/* Back to home */}
        <button onClick={() => navigate('/')} className="rw-body"
          style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to home
        </button>

        <div style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}>

          {/* Mobile logo */}
          <div className="rw-body" style={{ display: 'none', marginBottom: 32 }}>
            <div className="rw-display" style={{ fontSize: 22 }}>ResumeWala</div>
          </div>

          {/* Tab switcher */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 5, display: 'flex', marginBottom: 36 }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}) }}
                className={`tab-btn ${mode === m ? 'active' : ''}`}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <h2 className="rw-display" style={{ fontSize: 28, marginBottom: 8, color: 'white' }}>
                {mode === 'login' ? 'Welcome back 👋' : 'Join ResumeWala 🚀'}
              </h2>
              <p className="rw-body" style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.38)', marginBottom: 32, lineHeight: 1.6 }}>
                {mode === 'login'
                  ? 'Sign in to access your resumes and continue building.'
                  : 'Create your free account. No credit card required.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Social buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            <button className="btn-social" onClick={() => toast('Google login coming soon! Use email for now.', { icon: '🔜' })}>
              <GoogleIcon /> Google
            </button>
            <button className="btn-social" onClick={() => toast('GitHub login coming soon! Use email for now.', { icon: '🔜' })}>
              <GitHubIcon /> GitHub
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span className="rw-body" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>OR CONTINUE WITH EMAIL</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                  <div style={{ marginBottom: 0 }}>
                    <label className="rw-body" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 7, letterSpacing: '0.01em' }}>Full Name</label>
                    <input className={`rw-input ${errors.name ? 'error' : ''}`} type="text" placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
                    {errors.name && <p className="rw-body" style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>⚠ {errors.name}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="rw-body" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 7 }}>Email Address</label>
              <input className={`rw-input ${errors.email ? 'error' : ''}`} type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              {errors.email && <p className="rw-body" style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label className="rw-body" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Password</label>
                {mode === 'login' && (
                  <button type="button" className="rw-body" onClick={() => toast('Password reset coming soon!', { icon: '📧' })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#818CF8', fontWeight: 600 }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input className={`rw-input ${errors.password ? 'error' : ''}`} type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingRight: 44 }} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex' }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {errors.password && <p className="rw-body" style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>⚠ {errors.password}</p>}
            </div>

            {/* Confirm password */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                  <div>
                    <label className="rw-body" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 7 }}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input className={`rw-input ${errors.confirm ? 'error' : ''}`} type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={e => set('confirm', e.target.value)} style={{ paddingRight: 44 }} autoComplete="new-password" />
                      <button type="button" onClick={() => setShowConfirm(s => !s)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex' }}>
                        <EyeIcon open={showConfirm} />
                      </button>
                    </div>
                    {errors.confirm && <p className="rw-body" style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>⚠ {errors.confirm}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms */}
            {mode === 'signup' && (
              <p className="rw-body" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>
                By creating an account you agree to our{' '}
                <span style={{ color: '#818CF8', cursor: 'pointer' }}>Terms of Service</span> and{' '}
                <span style={{ color: '#818CF8', cursor: 'pointer' }}>Privacy Policy</span>.
              </p>
            )}

            {/* Submit */}
            <motion.button type="submit" disabled={loading} className="btn-primary" whileTap={{ scale: 0.98 }}
              style={{ padding: '15px', fontSize: 15.5, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4 }}>
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? (
                    <>
                      Sign In to Dashboard
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l4 3-4 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </>
                  ) : (
                    <>
                      Create Free Account
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </>
                  )}
                </>
              )}
            </motion.button>
          </form>

          {/* Switch mode */}
          <p className="rw-body" style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818CF8', fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Trust signals */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { icon: '🔒', text: 'Secure & Private' },
              { icon: '⚡', text: 'Free to Start' },
              { icon: '💎', text: 'No Spam' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 13 }}>{t.icon}</span>
                <span className="rw-body" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.22)', fontWeight: 600 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}