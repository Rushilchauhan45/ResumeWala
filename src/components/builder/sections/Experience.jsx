import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const EMPTY_EXP = { id: '', company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }

const inp = (val, onChange, placeholder, style = {}) => (
  <input value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, outline: 'none', transition: 'all 0.2s', ...style }}
    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }} />
)

export default function Experience({ data, onChange }) {
  const [open, setOpen] = useState(null)
  const [enhancing, setEnhancing] = useState(null)

  const add = () => {
    const id = Date.now().toString()
    const newExp = { ...EMPTY_EXP, id }
    onChange([...data, newExp])
    setOpen(id)
  }

  const remove = (id) => { onChange(data.filter(e => e.id !== id)); if (open === id) setOpen(null) }

  const update = (id, field, val) => onChange(data.map(e => e.id === id ? { ...e, [field]: val } : e))

  const updateBullet = (id, idx, val) => {
    const exp = data.find(e => e.id === id)
    const bullets = [...exp.bullets]
    bullets[idx] = val
    update(id, 'bullets', bullets)
  }

  const addBullet = (id) => {
    const exp = data.find(e => e.id === id)
    if (exp.bullets.length >= 6) { toast.error('Max 6 bullet points per role'); return }
    update(id, 'bullets', [...exp.bullets, ''])
  }

  const removeBullet = (id, idx) => {
    const exp = data.find(e => e.id === id)
    if (exp.bullets.length === 1) return
    const bullets = exp.bullets.filter((_, i) => i !== idx)
    update(id, 'bullets', bullets)
  }

  const aiEnhance = async (id) => {
    const exp = data.find(e => e.id === id)
    if (!exp.role && !exp.company) { toast.error('Please fill Role and Company first!'); return }
    setEnhancing(id)
    toast.loading('AI is writing your bullet points...', { id: 'exp-enhance' })
    await new Promise(r => setTimeout(r, 2200))
    const bullets = [
      `Led development of scalable ${exp.role?.toLowerCase().includes('data') ? 'data pipelines' : 'web applications'} that improved system performance by 40%, reducing load time from 3s to 1.8s`,
      `Collaborated with cross-functional teams of 8+ engineers and designers to deliver 3 major product features on schedule, increasing user retention by 25%`,
      `Implemented automated testing suite with 85% code coverage using Jest and Cypress, reducing production bugs by 60%`,
      `Mentored 2 junior developers through code reviews and pair programming sessions, accelerating team velocity by 30%`,
    ]
    update(id, 'bullets', bullets)
    toast.success('Bullet points enhanced by AI! ✨', { id: 'exp-enhance' })
    setEnhancing(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>Work Experience</h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>Add your jobs, internships, and roles. AI will write powerful bullet points for you.</p>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💼</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>No experience added yet</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>Fresher? Add internships, part-time jobs, or freelance work</div>
          <button onClick={add} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', color: '#818CF8', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            + Add First Experience
          </button>
        </motion.div>
      )}

      {/* Experience cards */}
      <AnimatePresence>
        {data.map((exp, idx) => (
          <motion.div key={exp.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${open === exp.id ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>

            {/* Card header */}
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: open === exp.id ? 'rgba(99,102,241,0.05)' : 'transparent' }}
              onClick={() => setOpen(open === exp.id ? null : exp.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💼</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: exp.role ? 'white' : 'rgba(255,255,255,0.35)', letterSpacing: '-0.02em' }}>{exp.role || 'New Experience'}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{exp.company || 'Company name'}{exp.startDate ? ` · ${exp.startDate}` : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); remove(exp.id) }}
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#F87171', fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Remove
                </button>
                <motion.div animate={{ rotate: open === exp.id ? 180 : 0 }} style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.div>
              </div>
            </div>

            {/* Expanded form */}
            <AnimatePresence>
              {open === exp.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Job Title / Role *</label>
                      {inp(exp.role, v => update(exp.id, 'role', v), 'Software Engineer Intern')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Company Name *</label>
                      {inp(exp.company, v => update(exp.id, 'company', v), 'Google, Flipkart, Startup...')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Location</label>
                      {inp(exp.location, v => update(exp.id, 'location', v), 'Bengaluru / Remote')}</div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Start Date</label>
                      {inp(exp.startDate, v => update(exp.id, 'startDate', v), 'Jun 2023')}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>End Date</label>
                      {inp(exp.endDate, v => update(exp.id, 'endDate', v), exp.current ? 'Present' : 'Dec 2023', { opacity: exp.current ? 0.4 : 1 })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20 }}>
                      <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={e => { update(exp.id, 'current', e.target.checked); if (e.target.checked) update(exp.id, 'endDate', 'Present') }}
                        style={{ width: 16, height: 16, accentColor: '#6366F1', cursor: 'pointer' }} />
                      <label htmlFor={`current-${exp.id}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 500 }}>Currently working here</label>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Key Achievements / Responsibilities</label>
                      <button onClick={() => aiEnhance(exp.id)} disabled={enhancing === exp.id}
                        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '5px 12px', cursor: enhancing === exp.id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#818CF8', fontSize: 11.5, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {enhancing === exp.id
                          ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ width: 10, height: 10, border: '1.5px solid rgba(129,140,248,0.3)', borderTopColor: '#818CF8', borderRadius: '50%' }} /> Writing...</>
                          : <>✨ AI Write Bullets</>}
                      </button>
                    </div>
                    {exp.bullets.map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, flexShrink: 0, marginTop: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366F1' }} />
                        </div>
                        <textarea value={b} onChange={e => updateBullet(exp.id, i, e.target.value)} rows={2}
                          placeholder={`Achievement ${i + 1}: Start with action verb (Led, Built, Improved, Reduced...)`}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '9px 12px', fontSize: 13.5, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.6, transition: 'all 0.2s' }}
                          onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.08)' }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }} />
                        {exp.bullets.length > 1 && (
                          <button onClick={() => removeBullet(exp.id, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,63,94,0.5)', padding: '10px 4px', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,63,94,0.5)'}>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2L2 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {exp.bullets.length < 6 && (
                      <button onClick={() => addBullet(exp.id)}
                        style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 9, padding: '8px 14px', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 12.5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%', transition: 'all 0.2s', marginTop: 4 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#818CF8' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}>
                        + Add Bullet Point
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length > 0 && (
        <button onClick={add} style={{ width: '100%', background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.25)', borderRadius: 12, padding: '13px', cursor: 'pointer', color: '#818CF8', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)' }}>
          + Add Another Experience
        </button>
      )}

      <div style={{ marginTop: 16, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(245,158,11,0.8)', fontWeight: 600, marginBottom: 4 }}>💡 ATS Pro Tip</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>Start each bullet with a strong action verb (Led, Built, Improved, Designed, Reduced). Add numbers whenever possible — "Improved performance by 40%" beats "Improved performance".</div>
      </div>
    </div>
  )
}