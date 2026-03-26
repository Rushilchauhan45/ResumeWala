// ─── SKILLS ──────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Skills({ data, onChange }) {
  const [inputs, setInputs] = useState({ technical: '', soft: '', languages: '', tools: '' })
  const set = (cat, v) => onChange({ ...data, [cat]: v })
  const addSkill = (cat) => {
    const val = inputs[cat].trim()
    if (!val) return
    if (data[cat].includes(val)) return
    set(cat, [...data[cat], val])
    setInputs(i => ({ ...i, [cat]: '' }))
  }
  const removeSkill = (cat, skill) => set(cat, data[cat].filter(s => s !== skill))
  const handleKey = (e, cat) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(cat) } }
 
  const suggestedTech = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'TypeScript', 'Next.js', 'Flutter', 'Kotlin']
  const suggestedSoft = ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking']
 
  const SkillSection = ({ cat, label, color, placeholder, suggested }) => (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10, minHeight: 36 }}>
        <AnimatePresence>
          {data[cat].map(skill => (
            <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 8, padding: '5px 10px 5px 12px', fontSize: 13, color: color, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
              {skill}
              <button onClick={() => removeSkill(cat, skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: color, opacity: 0.6, padding: 0, display: 'flex', lineHeight: 1 }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 2l7 7M9 2L2 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {data[cat].length === 0 && <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', paddingTop: 6 }}>No {label.toLowerCase()} added yet</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={inputs[cat]} onChange={e => setInputs(i => ({ ...i, [cat]: e.target.value }))} onKeyDown={e => handleKey(e, cat)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '10px 13px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'all 0.2s' }}
          onFocus={e => { e.target.style.borderColor = `${color}60`; e.target.style.boxShadow = `0 0 0 3px ${color}12` }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }} />
        <button onClick={() => addSkill(cat)} style={{ background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', color: color, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>Add</button>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Press Enter or comma to add quickly</div>
      {suggested && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Quick add:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {suggested.filter(s => !data[cat].includes(s)).slice(0, 8).map(s => (
              <button key={s} onClick={() => set(cat, [...data[cat], s])}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.color = color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
 
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>Skills</h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>Add your technical skills, tools, and soft skills. These are crucial for ATS scoring.</p>
      </div>
      <SkillSection cat="technical" label="Technical Skills *" color="#818CF8" placeholder="React, Python, SQL..." suggested={suggestedTech} />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 24 }} />
      <SkillSection cat="tools" label="Tools & Platforms" color="#F59E0B" placeholder="VS Code, Figma, Jira, AWS..." />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 24 }} />
      <SkillSection cat="languages" label="Languages" color="#00DC82" placeholder="Hindi, English, Gujarati..." />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 24 }} />
      <SkillSection cat="soft" label="Soft Skills" color="#F43F5E" placeholder="Leadership, Communication..." suggested={suggestedSoft} />
    </div>
  )
}