import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import PersonalInfo from '../components/builder/sections/PersonalInfo'
import Experience from '../components/builder/sections/Experience'
import Education from '../components/builder/sections/Education'
import Skills from '../components/builder/sections/Skills'
import Projects from '../components/builder/sections/Projects'
import ResumePreview from '../components/builder/ResumePreview'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ), desc: 'Name, email, phone, links' },
  { id: 'experience', label: 'Experience', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ), desc: 'Jobs, internships, roles' },
  { id: 'education', label: 'Education', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L2 5.5l6 3.5 6-3.5L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M2 5.5V10M5 7.2V11.5a6 6 0 0 0 6 0V7.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ), desc: 'Degrees, CGPA, courses' },
  { id: 'skills', label: 'Skills', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h2l2-5 2 10 2-5 1 3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ), desc: 'Technical & soft skills' },
  { id: 'projects', label: 'Projects', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v10H2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 6l2 2-2 2M9 10h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ), desc: 'GitHub, live projects' },
]

const EMPTY_DATA = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: { technical: [], soft: [], languages: [], tools: [] },
  projects: [],
}

export default function BuilderPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(EMPTY_DATA)
  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mobileTab, setMobileTab] = useState('form') // 'form' | 'preview'

  const update = useCallback((section, val) => {
    setData(d => ({ ...d, [section]: val }))
  }, [])

  const progress = Math.round(((step + 1) / STEPS.length) * 100)

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleFinish()
  }

  const handleBack = () => { if (step > 0) setStep(s => s - 1) }

  const handleFinish = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    localStorage.setItem('rw_resume_data', JSON.stringify(data))
    toast.success('Resume saved! Redirecting to preview... 🎉')
    setTimeout(() => navigate('/dashboard'), 1200)
    setSaving(false)
  }

  const isStepComplete = (idx) => {
    if (idx === 0) return !!data.personal.name && !!data.personal.email
    if (idx === 1) return data.experience.length > 0
    if (idx === 2) return data.education.length > 0
    if (idx === 3) return data.skills.technical.length > 0
    if (idx === 4) return data.projects.length > 0
    return false
  }

  const completedCount = STEPS.filter((_, i) => isStepComplete(i)).length
  const totalProgress = Math.round((completedCount / STEPS.length) * 100)

  return (
    <div style={{ height: '100vh', background: '#050512', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.5); border-radius: 10px; }
        .rw-display { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.04em; }
        .rw-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .step-btn { background: none; border: none; cursor: pointer; width: 100%; text-align: left; transition: all 0.2s; border-radius: 12px; padding: 10px 12px; }
        .step-btn:hover { background: rgba(255,255,255,0.04); }
        .step-btn.active { background: rgba(99,102,241,0.12); }
        .nav-btn { border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 700; border-radius: 11px; transition: all 0.25s; letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
        .btn-primary { background: linear-gradient(135deg, #6366F1, #4F46E5); color: white; box-shadow: 0 4px 16px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.12); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.55); }
        .btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09) !important; color: rgba(255,255,255,0.6); }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); color: white; }
        .mobile-tab { flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          .desktop-preview { display: none !important; }
          .mobile-tabs { display: flex !important; }
          .builder-main { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) {
          .mobile-tabs { display: none !important; }
          .mobile-preview { display: none !important; }
        }
      `}</style>

      {/* ── TOP NAVBAR ── */}
      <div style={{ height: 58, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(5,5,18,0.95)', backdropFilter: 'blur(20px)', flexShrink: 0, zIndex: 50 }}>

        {/* Left: Logo + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="rw-body" style={{ fontSize: 13, fontWeight: 600 }}>Dashboard</span>
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="2" stroke="#818CF8" strokeWidth="1.4"/><path d="M5 5h6M5 8h6M5 11h4" stroke="#818CF8" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <span className="rw-display" style={{ fontSize: 15, color: 'white' }}>Resume Builder</span>
          </div>
        </div>

        {/* Center: Progress bar */}
        <div style={{ flex: 1, maxWidth: 320, margin: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span className="rw-body" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="rw-body" style={{ fontSize: 11.5, color: '#818CF8', fontWeight: 700 }}>{totalProgress}% complete</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
            <motion.div animate={{ width: `${totalProgress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(to right, #6366F1, #00DC82)', borderRadius: 100 }} />
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => { localStorage.setItem('rw_resume_data', JSON.stringify(data)); toast.success('Draft saved!') }}
            className="rw-body" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>
            Save Draft
          </button>
          <button onClick={handleFinish}
            className="nav-btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M3 7l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Finish & Preview
          </button>
        </div>
      </div>

      {/* ── MOBILE TABS ── */}
      <div className="mobile-tabs" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,18,0.95)', flexShrink: 0 }}>
        {['form', 'preview'].map(t => (
          <button key={t} onClick={() => setMobileTab(t)} className="mobile-tab"
            style={{ color: mobileTab === t ? '#818CF8' : 'rgba(255,255,255,0.35)', borderBottom: mobileTab === t ? '2px solid #6366F1' : '2px solid transparent' }}>
            {t === 'form' ? '✏️ Edit Resume' : '👁️ Preview'}
          </button>
        ))}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="builder-main" style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr 420px', overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="desktop-sidebar" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', overflowY: 'auto', padding: '20px 12px' }}>

          {/* User info */}
          <div style={{ padding: '12px', marginBottom: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="rw-display" style={{ fontSize: 13, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
                <div className="rw-body" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="rw-body" style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 4px', marginBottom: 8 }}>Sections</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {STEPS.map((s, i) => {
              const done = isStepComplete(i)
              const active = step === i
              return (
                <button key={s.id} onClick={() => setStep(i)} className={`step-btn ${active ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'rgba(0,220,130,0.15)' : active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${done ? 'rgba(0,220,130,0.3)' : active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      color: done ? '#00DC82' : active ? '#818CF8' : 'rgba(255,255,255,0.3)' }}>
                      {done
                        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : s.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="rw-body" style={{ fontSize: 13, fontWeight: 600, color: active ? 'white' : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', lineHeight: 1.2 }}>{s.label}</div>
                      <div className="rw-body" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>{s.desc}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Overall progress */}
          <div style={{ marginTop: 20, padding: '14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="rw-body" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Completion</span>
              <span className="rw-display" style={{ fontSize: 13, color: '#818CF8' }}>{totalProgress}%</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${totalProgress}%` }} transition={{ duration: 0.5 }}
                style={{ height: '100%', background: 'linear-gradient(to right, #6366F1, #00DC82)', borderRadius: 100 }} />
            </div>
            <div className="rw-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{completedCount} of {STEPS.length} sections filled</div>
          </div>

          {/* ATS tip */}
          <div style={{ marginTop: 12, padding: '12px', background: 'rgba(0,220,130,0.06)', border: '1px solid rgba(0,220,130,0.15)', borderRadius: 12 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
              <div>
                <div className="rw-body" style={{ fontSize: 11, fontWeight: 700, color: '#34D399', marginBottom: 3 }}>ATS TIP</div>
                <div className="rw-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>Fill all 5 sections to get 94+ ATS score. AI enhances each section automatically.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER: FORM ── */}
        <div style={{ overflowY: 'auto', display: (mobileTab === 'preview') ? 'none' : 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '28px 32px 100px' }}>

            {/* Step header */}
            <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 9, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, color: '#818CF8' }}>
                  {STEPS[step].icon}
                  <span className="rw-body" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{STEPS[step].label}</span>
                </div>
                <div className="rw-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>Step {step + 1} / {STEPS.length}</div>
              </div>
            </motion.div>

            {/* Section content */}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                {step === 0 && <PersonalInfo data={data.personal} onChange={v => update('personal', v)} />}
                {step === 1 && <Experience data={data.experience} onChange={v => update('experience', v)} />}
                {step === 2 && <Education data={data.education} onChange={v => update('education', v)} />}
                {step === 3 && <Skills data={data.skills} onChange={v => update('skills', v)} />}
                {step === 4 && <Projects data={data.projects} onChange={v => update('projects', v)} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── BOTTOM NAV ── */}
          <div style={{ position: 'sticky', bottom: 0, background: 'rgba(5,5,18,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <button onClick={handleBack} disabled={step === 0} className="nav-btn btn-ghost"
              style={{ padding: '10px 20px', fontSize: 14, opacity: step === 0 ? 0.3 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer', border: '1px solid rgba(255,255,255,0.09)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {STEPS.map((_, i) => (
                <motion.div key={i} onClick={() => setStep(i)}
                  animate={{ width: i === step ? 20 : 6, background: i === step ? '#6366F1' : isStepComplete(i) ? '#00DC82' : 'rgba(255,255,255,0.12)' }}
                  style={{ height: 6, borderRadius: 100, cursor: 'pointer' }} transition={{ duration: 0.3 }} />
              ))}
            </div>

            <button onClick={handleNext} disabled={saving} className="nav-btn btn-primary"
              style={{ padding: '10px 22px', fontSize: 14 }}>
              {saving ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                  Saving...
                </>
              ) : step === STEPS.length - 1 ? (
                <>
                  Finish & Preview
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M3 7l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </>
              ) : (
                <>
                  Next Section
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT: LIVE PREVIEW ── */}
        <div className="desktop-preview" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', background: 'rgba(255,255,255,0.008)' }}>
          <ResumePreview data={data} />
        </div>

        {/* Mobile preview */}
        {mobileTab === 'preview' && (
          <div className="mobile-preview" style={{ overflowY: 'auto', background: 'rgba(255,255,255,0.008)' }}>
            <ResumePreview data={data} />
          </div>
        )}
      </div>
    </div>
  )
}