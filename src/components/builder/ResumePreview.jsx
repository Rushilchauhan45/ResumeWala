import { useMemo } from 'react'

export default function ResumePreview({ data }) {
  const { personal, experience, education, skills, projects } = data

  const hasContent = personal?.name || experience?.length > 0 || education?.length > 0

  const allSkills = useMemo(() => [
    ...(skills?.technical || []),
    ...(skills?.tools || []),
  ], [skills])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Preview header bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'rgba(5,5,18,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00DC82' }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>LIVE PREVIEW</span>
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Updates as you type</div>
      </div>

      {/* Paper */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: 'rgba(255,255,255,0.005)' }}>
        {!hasContent ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📄</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Your resume will appear here</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.15)', lineHeight: 1.6 }}>Start filling in the form on the left to see a live preview of your professional resume</div>
          </div>
        ) : (
          <div style={{
            background: 'white', borderRadius: 8, padding: '32px 28px', minHeight: 500,
            fontFamily: "'Times New Roman', Georgia, serif", color: '#1a1a1a',
            boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
            fontSize: 9.5, lineHeight: 1.4,
          }}>

            {/* ── HEADER ── */}
            {personal?.name && (
              <div style={{ textAlign: 'center', borderBottom: '1.5px solid #1a1a1a', paddingBottom: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 3, fontFamily: "'Arial', sans-serif" }}>
                  {personal.name}
                </div>
                <div style={{ fontSize: 8.5, color: '#333', letterSpacing: '0.02em', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                  {[personal.phone, personal.email, personal.location, personal.linkedin, personal.github].filter(Boolean).map((item, i, arr) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item}
                      {i < arr.length - 1 && <span style={{ color: '#999' }}>|</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUMMARY ── */}
            {personal?.summary && (
              <Section title="Professional Summary">
                <p style={{ fontSize: 9, color: '#333', lineHeight: 1.6, textAlign: 'justify' }}>{personal.summary}</p>
              </Section>
            )}

            {/* ── EDUCATION ── */}
            {education?.length > 0 && (
              <Section title="Education">
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: i < education.length - 1 ? 8 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 9.5, fontFamily: "'Arial', sans-serif" }}>{edu.institution}</span>
                      <span style={{ fontSize: 8.5, color: '#555' }}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 9, fontStyle: 'italic', color: '#444' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
                      {edu.cgpa && <span style={{ fontSize: 8.5, color: '#555', fontWeight: 700 }}>CGPA: {edu.cgpa}</span>}
                    </div>
                    {edu.achievements && <div style={{ fontSize: 8.5, color: '#666', marginTop: 2 }}>🏆 {edu.achievements}</div>}
                  </div>
                ))}
              </Section>
            )}

            {/* ── EXPERIENCE ── */}
            {experience?.length > 0 && (
              <Section title="Work Experience">
                {experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: i < experience.length - 1 ? 10 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 9.5, fontFamily: "'Arial', sans-serif" }}>{exp.role}</span>
                      <span style={{ fontSize: 8.5, color: '#555' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontStyle: 'italic', color: '#444' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                    </div>
                    {exp.bullets?.filter(Boolean).map((b, j) => (
                      <div key={j} style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
                        <span style={{ marginTop: 1, flexShrink: 0, color: '#1a1a1a' }}>•</span>
                        <span style={{ fontSize: 8.5, color: '#333', lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}

            {/* ── SKILLS ── */}
            {(allSkills.length > 0 || skills?.soft?.length > 0 || skills?.languages?.length > 0) && (
              <Section title="Technical Skills">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {allSkills.length > 0 && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 9, minWidth: 80, fontFamily: "'Arial', sans-serif" }}>Technologies:</span>
                      <span style={{ fontSize: 9, color: '#333' }}>{allSkills.join(', ')}</span>
                    </div>
                  )}
                  {skills?.languages?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 9, minWidth: 80, fontFamily: "'Arial', sans-serif" }}>Languages:</span>
                      <span style={{ fontSize: 9, color: '#333' }}>{skills.languages.join(', ')}</span>
                    </div>
                  )}
                  {skills?.soft?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 9, minWidth: 80, fontFamily: "'Arial', sans-serif" }}>Soft Skills:</span>
                      <span style={{ fontSize: 9, color: '#333' }}>{skills.soft.join(', ')}</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── PROJECTS ── */}
            {projects?.length > 0 && (
              <Section title="Projects">
                {projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 9.5, fontFamily: "'Arial', sans-serif" }}>
                        {proj.name}
                        {proj.tech?.length > 0 && <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#555', fontSize: 8.5 }}> | {proj.tech.join(', ')}</span>}
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {proj.github && <span style={{ fontSize: 8, color: '#4F46E5' }}>GitHub</span>}
                        {proj.live && <span style={{ fontSize: 8, color: '#059669' }}>Live</span>}
                      </div>
                    </div>
                    {proj.bullets?.filter(Boolean).map((b, j) => (
                      <div key={j} style={{ display: 'flex', gap: 5, marginBottom: 2, marginTop: 3 }}>
                        <span style={{ marginTop: 1, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: 8.5, color: '#333', lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}
          </div>
        )}
      </div>

      {/* ATS Score indicator */}
      {hasContent && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,18,0.5)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>Estimated ATS Score</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 13, color: '#00DC82' }}>
              {Math.min(60 + (personal?.name ? 5 : 0) + (personal?.email ? 5 : 0) + (personal?.summary ? 8 : 0) + (experience?.length > 0 ? 10 : 0) + (education?.length > 0 ? 5 : 0) + (allSkills.length > 3 ? 7 : 0), 97)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 100,
              width: `${Math.min(60 + (personal?.name ? 5 : 0) + (personal?.email ? 5 : 0) + (personal?.summary ? 8 : 0) + (experience?.length > 0 ? 10 : 0) + (education?.length > 0 ? 5 : 0) + (allSkills.length > 3 ? 7 : 0), 97)}%`,
              background: 'linear-gradient(to right, #6366F1, #00DC82)',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10.5, color: 'rgba(255,255,255,0.2)', marginTop: 5 }}>
            Fill all sections to reach 94%+ guaranteed
          </div>
        </div>
      )}
    </div>
  )
}

// ── Section component ──
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: "'Arial', sans-serif", fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #1a1a1a', paddingBottom: 2, marginBottom: 6, color: '#1a1a1a' }}>
        {title}
      </div>
      {children}
    </div>
  )
}