// ─── EDUCATION ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
 
const EMPTY_EDU = { id: '', institution: '', degree: '', field: '', startYear: '', endYear: '', cgpa: '', achievements: '' }
 
const inp = (val, onChange, placeholder) => (
  <input value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }} />
)
 
export default function Education({ data, onChange }) {
  const [open, setOpen] = useState(null)
  const add = () => { const id = Date.now().toString(); onChange([...data, { ...EMPTY_EDU, id }]); setOpen(id) }
  const remove = id => { onChange(data.filter(e => e.id !== id)); if (open === id) setOpen(null) }
  const update = (id, field, val) => onChange(data.map(e => e.id === id ? { ...e, [field]: val } : e))
 
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>Education</h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>Add your degrees, colleges, and academic achievements.</p>
      </div>
 
      {data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎓</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>No education added yet</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>Add your B.Tech, MBA, 12th, or any degree</div>
          <button onClick={add} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', color: '#818CF8', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>+ Add Education</button>
        </motion.div>
      )}
 
      <AnimatePresence>
        {data.map(edu => (
          <motion.div key={edu.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${open === edu.id ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: open === edu.id ? 'rgba(99,102,241,0.05)' : 'transparent' }}
              onClick={() => setOpen(open === edu.id ? null : edu.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎓</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: edu.institution ? 'white' : 'rgba(255,255,255,0.35)', letterSpacing: '-0.02em' }}>{edu.institution || 'New Education'}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.cgpa ? ` · CGPA ${edu.cgpa}` : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); remove(edu.id) }} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#F87171', fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Remove</button>
                <motion.div animate={{ rotate: open === edu.id ? 180 : 0 }} style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.div>
              </div>
            </div>
            <AnimatePresence>
              {open === edu.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Institution Name *</label>{inp(edu.institution, v => update(edu.id, 'institution', v), 'IIT Bombay, NIT Surat, Pune University...')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Degree *</label>{inp(edu.degree, v => update(edu.id, 'degree', v), 'B.Tech, B.E., MBA, MCA...')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Field of Study</label>{inp(edu.field, v => update(edu.id, 'field', v), 'Computer Science, IT, ECE...')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Start Year</label>{inp(edu.startYear, v => update(edu.id, 'startYear', v), '2020')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>End Year</label>{inp(edu.endYear, v => update(edu.id, 'endYear', v), '2024')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CGPA / Percentage</label>{inp(edu.cgpa, v => update(edu.id, 'cgpa', v), '8.5 / 10 or 85%')}</div>
                    <div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Achievements</label>{inp(edu.achievements, v => update(edu.id, 'achievements', v), 'Dean\'s List, Scholarship...')}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
 
      {data.length > 0 && (
        <button onClick={add} style={{ width: '100%', background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.25)', borderRadius: 12, padding: '13px', cursor: 'pointer', color: '#818CF8', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>+ Add Another Degree</button>
      )}
    </div>
  )
}