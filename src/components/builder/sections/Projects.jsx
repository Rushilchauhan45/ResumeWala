// ─── PROJECTS ─────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EMPTY_PROJ = { id: '', name: '', description: '', tech: [], github: '', live: '', bullets: [''] }
 
export default function Projects({ data, onChange }) {
  const [open, setOpen] = useState(null)
  const [techInput, setTechInput] = useState({})
  const add = () => { const id = Date.now().toString(); onChange([...data, { ...EMPTY_PROJ, id }]); setOpen(id) }
  const remove = id => { onChange(data.filter(p => p.id !== id)); if (open === id) setOpen(null) }
  const update = (id, field, val) => onChange(data.map(p => p.id === id ? { ...p, [field]: val } : p))
  const addTech = (id) => {
    const val = (techInput[id] || '').trim()
    if (!val) return
    const proj = data.find(p => p.id === id)
    update(id, 'tech', [...(proj.tech || []), val])
    setTechInput(t => ({ ...t, [id]: '' }))
  }
  const updateBullet = (id, idx, val) => { const p = data.find(p => p.id === id); const b = [...p.bullets]; b[idx] = val; update(id, 'bullets', b) }
  const addBullet = (id) => { const p = data.find(p => p.id === id); update(id, 'bullets', [...p.bullets, '']) }
 
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>Projects</h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>Showcase your best work. Projects can make a fresher's resume stand out massively.</p>
      </div>
 
      {data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>No projects added yet</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>Hackathon projects, college assignments, personal builds — all count!</div>
          <button onClick={add} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', color: '#818CF8', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>+ Add First Project</button>
        </motion.div>
      )}
 
      <AnimatePresence>
        {data.map(proj => (
          <motion.div key={proj.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${open === proj.id ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: open === proj.id ? 'rgba(99,102,241,0.05)' : 'transparent' }}
              onClick={() => setOpen(open === proj.id ? null : proj.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,220,130,0.15)', border: '1px solid rgba(0,220,130,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🚀</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: proj.name ? 'white' : 'rgba(255,255,255,0.35)', letterSpacing: '-0.02em' }}>{proj.name || 'New Project'}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{proj.tech?.slice(0, 3).join(', ') || 'No tech stack yet'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); remove(proj.id) }} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#F87171', fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Remove</button>
                <motion.div animate={{ rotate: open === proj.id ? 180 : 0 }} style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.div>
              </div>
            </div>
            <AnimatePresence>
              {open === proj.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Project Name *</label>
                      <input value={proj.name} onChange={e => update(proj.id, 'name', e.target.value)} placeholder="E-Commerce Platform, Chat App, Resume Builder..."
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GitHub Link</label>
                        <input value={proj.github} onChange={e => update(proj.id, 'github', e.target.value)} placeholder="github.com/user/project"
                          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Live Link</label>
                        <input value={proj.live} onChange={e => update(proj.id, 'live', e.target.value)} placeholder="your-project.vercel.app"
                          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
                      </div>
                    </div>
                    {/* Tech stack */}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tech Stack</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        {(proj.tech || []).map(t => (
                          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 7, padding: '4px 10px', fontSize: 12.5, color: '#818CF8', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                            {t}
                            <button onClick={() => update(proj.id, 'tech', proj.tech.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818CF8', opacity: 0.6, padding: 0, display: 'flex' }}>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={techInput[proj.id] || ''} onChange={e => setTechInput(t => ({ ...t, [proj.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id) } }}
                          placeholder="React, Node.js, MongoDB..." style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '10px 13px', fontSize: 13.5, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
                        <button onClick={() => addTech(proj.id)} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', color: '#818CF8', fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add</button>
                      </div>
                    </div>
                    {/* Bullets */}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Key Points</label>
                      {proj.bullets.map((b, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                          <div style={{ width: 20, height: 20, flexShrink: 0, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00DC82' }} /></div>
                          <input value={b} onChange={e => updateBullet(proj.id, i, e.target.value)} placeholder="What did you build? What problem did it solve? What was the impact?"
                            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '9px 12px', fontSize: 13.5, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
                        </div>
                      ))}
                      {proj.bullets.length < 4 && (
                        <button onClick={() => addBullet(proj.id)} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 9, padding: '7px', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 12.5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%', transition: 'all 0.2s' }}>+ Add Point</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
 
      {data.length > 0 && (
        <button onClick={add} style={{ width: '100%', background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.25)', borderRadius: 12, padding: '13px', cursor: 'pointer', color: '#818CF8', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>+ Add Another Project</button>
      )}
    </div>
  )
}