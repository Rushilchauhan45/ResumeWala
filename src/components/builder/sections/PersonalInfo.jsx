import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Field = ({ label, placeholder, value, onChange, type = 'text', icon, hint }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em' }}>
      {icon && <span style={{ color: 'rgba(255,255,255,0.3)' }}>{icon}</span>}
      {label}
    </label>
    <input type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 11, padding: '12px 14px', fontSize: 14.5, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.background = 'rgba(99,102,241,0.05)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }}
    />
    {hint && <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)', marginTop: 5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{hint}</p>}
  </div>
)

export default function PersonalInfo({ data, onChange }) {
  const [enhancing, setEnhancing] = useState(false)
  const set = (k, v) => onChange({ ...data, [k]: v })

  const enhanceSummary = async () => {
    if (!data.summary.trim()) { toast.error('Please write something first!'); return }
    setEnhancing(true)
    toast.loading('AI is enhancing your summary...', { id: 'enhance' })
    await new Promise(r => setTimeout(r, 2000))
    const enhanced = `Results-driven ${data.name || 'professional'} with a proven track record of delivering high-impact solutions. Passionate about leveraging cutting-edge technologies to solve complex problems. Strong collaborator with excellent communication skills, seeking to contribute to a dynamic team at a forward-thinking organization.`
    set('summary', enhanced)
    toast.success('Summary enhanced by AI! ✨', { id: 'enhance' })
    setEnhancing(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>Personal Information</h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
          Your basic contact details. These appear at the top of your resume.
        </p>
      </div>

      {/* Name + Email row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
        <Field label="Full Name *" placeholder="Rahul Sharma" value={data.name} onChange={v => set('name', v)}
          icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 11c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} />
        <Field label="Email Address *" placeholder="rahul@gmail.com" value={data.email} onChange={v => set('email', v)} type="email"
          icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4l5 3.5L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} />
      </div>

      {/* Phone + Location */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Phone Number" placeholder="+91 98765 43210" value={data.phone} onChange={v => set('phone', v)}
          icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="3" y="1" width="6" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="9" r="0.5" fill="currentColor"/></svg>} />
        <Field label="Location" placeholder="Mumbai, Maharashtra" value={data.location} onChange={v => set('location', v)}
          icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="4.5" r="1" fill="currentColor"/></svg>} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0 20px' }} />
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Online Presence</div>

      {/* LinkedIn + GitHub */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="LinkedIn URL" placeholder="linkedin.com/in/rahulsharma" value={data.linkedin} onChange={v => set('linkedin', v)}
          hint="Paste your full LinkedIn URL"
          icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 5v4M3.5 3.5v.01M5.5 9V6.5a1 1 0 0 1 2 0V9M7.5 7V6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>} />
        <Field label="GitHub URL" placeholder="github.com/rahulsharma" value={data.github} onChange={v => set('github', v)}
          hint="Optional but recommended"
          icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 .5A5.5 5.5 0 0 0 4.2 11.2c.28.05.38-.12.38-.26v-.9c-1.53.33-1.85-.74-1.85-.74-.25-.63-.61-.8-.61-.8-.5-.34.04-.33.04-.33.55.04.84.57.84.57.49.84 1.28.6 1.6.46.05-.36.19-.6.34-.74-1.22-.14-2.5-.61-2.5-2.72 0-.6.21-1.09.57-1.48-.06-.14-.25-.7.05-1.46 0 0 .47-.15 1.53.57a5.3 5.3 0 0 1 2.8 0c1.06-.72 1.52-.57 1.52-.57.3.76.11 1.32.06 1.46.35.39.56.88.56 1.48 0 2.12-1.29 2.58-2.51 2.72.2.17.37.5.37 1.01v1.5c0 .14.1.31.38.26A5.5 5.5 0 0 0 6 .5z" fill="currentColor"/></svg>} />
      </div>

      <Field label="Portfolio / Website" placeholder="https://rahulsharma.dev" value={data.website} onChange={v => set('website', v)}
        icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h10M6 1c-1.5 1.5-2 3-2 5s.5 3.5 2 5M6 1c1.5 1.5 2 3 2 5s-.5 3.5-2 5" stroke="currentColor" strokeWidth="1.2"/></svg>} />

      {/* Professional Summary */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0 20px' }} />
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Professional Summary</div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Summary / Objective</label>
          <button onClick={enhanceSummary} disabled={enhancing}
            style={{ background: enhancing ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '5px 12px', cursor: enhancing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#818CF8', fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}>
            {enhancing
              ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ width: 10, height: 10, border: '1.5px solid rgba(129,140,248,0.3)', borderTopColor: '#818CF8', borderRadius: '50%' }} /> Enhancing...</>
              : <><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1l1 2.5L9 4l-2 2 .5 2.5L5.5 7 3 8.5 3.5 6 1.5 4l2.5-.5L5.5 1z" fill="currentColor"/></svg> AI Enhance</>
            }
          </button>
        </div>
        <textarea placeholder="Write 2-3 sentences about yourself, your goals, and key skills. Or click 'AI Enhance' to generate automatically!"
          value={data.summary} onChange={e => set('summary', e.target.value)} rows={4}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 11, padding: '12px 14px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, outline: 'none', resize: 'vertical', lineHeight: 1.7, transition: 'all 0.2s' }}
          onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recommended: 50–100 words</p>
          <p style={{ fontSize: 11.5, color: data.summary.split(' ').filter(Boolean).length > 100 ? '#F87171' : 'rgba(255,255,255,0.2)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{data.summary.split(' ').filter(Boolean).length} words</p>
        </div>
      </div>

      {/* Preview card */}
      {(data.name || data.email) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(0,220,130,0.05)', border: '1px solid rgba(0,220,130,0.15)', borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>✓ Resume Header Preview</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 20, color: 'white', letterSpacing: '-0.03em' }}>{data.name || '—'}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {[data.email, data.phone, data.location].filter(Boolean).join(' · ')}
          </div>
        </motion.div>
      )}
    </div>
  )
}