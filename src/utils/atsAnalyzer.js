// ─────────────────────────────────────────────────────────────
//  ResumeWala — ATS Analyzer
//  Calculates real ATS score & gives improvement suggestions
// ─────────────────────────────────────────────────────────────

// ── Power Action Verbs (ATS loves these) ──
const POWER_VERBS = [
  'achieved','improved','increased','decreased','reduced','saved','generated',
  'developed','built','created','designed','implemented','launched','delivered',
  'led','managed','coordinated','collaborated','mentored','trained',
  'analyzed','optimized','automated','streamlined','refactored',
  'deployed','integrated','architected','engineered','spearheaded',
  'established','initiated','transformed','accelerated','enhanced',
  'resolved','debugged','maintained','monitored','documented',
  'researched','evaluated','recommended','presented','negotiated',
]

// ── High-Value Tech Keywords ──
const TECH_KEYWORDS = [
  // Languages
  'javascript','typescript','python','java','c++','c#','go','rust','kotlin','swift',
  'php','ruby','scala','r','matlab','sql','html','css',
  // Frameworks
  'react','nextjs','vuejs','angular','nodejs','express','django','flask',
  'spring','fastapi','graphql','rest','api',
  // Tools & DevOps
  'git','docker','kubernetes','aws','gcp','azure','ci/cd','jenkins','github actions',
  'terraform','ansible','linux','bash',
  // Databases
  'mongodb','postgresql','mysql','redis','elasticsearch','firebase','supabase',
  // Concepts
  'machine learning','deep learning','nlp','data structures','algorithms',
  'system design','microservices','agile','scrum','oop','tdd',
]

// ── Weak Phrases to Penalize ──
const WEAK_PHRASES = [
  'responsible for','worked on','helped with','assisted in','involved in',
  'familiar with','exposure to','knowledge of','good understanding',
  'team player','hard worker','fast learner','detail oriented',
  'passionate about','enthusiastic','dynamic','synergy','leverage',
]

// ── Required Sections for Full Score ──
const REQUIRED_SECTIONS = [
  { key: 'personalInfo', label: 'Contact Information', weight: 15 },
  { key: 'experience',   label: 'Work Experience',     weight: 25 },
  { key: 'education',    label: 'Education',            weight: 20 },
  { key: 'skills',       label: 'Skills Section',       weight: 20 },
  { key: 'projects',     label: 'Projects',             weight: 20 },
]

// ─────────────────────────────────────────────────────────────
//  HELPER: Extract all text from resume data
// ─────────────────────────────────────────────────────────────
const extractAllText = (data) => {
  const parts = []

  if (data.personalInfo) {
    const p = data.personalInfo
    parts.push(p.fullName, p.email, p.phone, p.summary, p.location)
  }

  if (Array.isArray(data.experience)) {
    data.experience.forEach(e => {
      parts.push(e.role, e.title, e.company, e.description, e.bullets)
    })
  }

  if (Array.isArray(data.education)) {
    data.education.forEach(e => {
      parts.push(e.degree, e.field, e.institution, e.coursework)
    })
  }

  if (data.skills) {
    const s = data.skills
    if (typeof s === 'string') parts.push(s)
    else {
      Object.values(s).forEach(v => {
        if (Array.isArray(v)) parts.push(...v)
        else if (typeof v === 'string') parts.push(v)
      })
    }
  }

  if (Array.isArray(data.projects)) {
    data.projects.forEach(p => {
      parts.push(p.title, p.description, p.techStack, p.technologies, p.bullets)
    })
  }

  return parts.filter(Boolean).join(' ').toLowerCase()
}

// ─────────────────────────────────────────────────────────────
//  SCORE CALCULATOR
// ─────────────────────────────────────────────────────────────
export const calculateATSScore = (resumeData) => {
  const issues = []
  const strengths = []
  let totalScore = 0

  const allText = extractAllText(resumeData)

  // ── 1. SECTION COMPLETENESS (40 pts) ──
  let sectionScore = 0
  REQUIRED_SECTIONS.forEach(({ key, label, weight }) => {
    const section = resumeData[key]
    const hasContent =
      key === 'personalInfo'
        ? section && section.fullName && section.email
        : key === 'skills'
        ? section && (typeof section === 'string' ? section.length > 10 : Object.values(section).some(v => v?.length > 0))
        : Array.isArray(section) && section.length > 0

    if (hasContent) {
      sectionScore += weight * 0.4 // 40% of weight for section existence
      strengths.push(`✅ ${label} section found`)
    } else {
      issues.push({
        severity: 'high',
        section: key,
        message: `Missing ${label} — ATS will skip your resume`,
        fix: `Add your ${label} to improve score by +${weight * 0.4} points`,
      })
    }
  })
  totalScore += Math.min(sectionScore, 40)

  // ── 2. CONTACT INFO COMPLETENESS (15 pts) ──
  let contactScore = 0
  const p = resumeData.personalInfo || {}
  if (p.email) { contactScore += 5; strengths.push('✅ Email found') }
  else issues.push({ severity: 'high', section: 'personalInfo', message: 'No email address found', fix: 'Add your professional email' })

  if (p.phone) { contactScore += 4; strengths.push('✅ Phone number found') }
  else issues.push({ severity: 'medium', section: 'personalInfo', message: 'Phone number missing', fix: 'Add your 10-digit phone number' })

  if (p.linkedin) { contactScore += 3; strengths.push('✅ LinkedIn profile linked') }
  else issues.push({ severity: 'medium', section: 'personalInfo', message: 'LinkedIn URL missing', fix: 'Add your LinkedIn — recruiters always check' })

  if (p.github) { contactScore += 3; strengths.push('✅ GitHub profile linked') }
  else issues.push({ severity: 'low', section: 'personalInfo', message: 'GitHub not linked', fix: 'Add GitHub for tech roles — shows real work' })

  totalScore += Math.min(contactScore, 15)

  // ── 3. KEYWORD DENSITY (20 pts) ──
  const foundKeywords = TECH_KEYWORDS.filter(kw => allText.includes(kw))
  const keywordRatio = foundKeywords.length / TECH_KEYWORDS.length
  const keywordScore = Math.round(keywordRatio * 20)
  totalScore += Math.min(keywordScore, 20)

  if (foundKeywords.length >= 10) strengths.push(`✅ Strong keyword density (${foundKeywords.length} tech keywords)`)
  else if (foundKeywords.length >= 5) strengths.push(`⚠️ Moderate keywords (${foundKeywords.length} found)`)
  else issues.push({
    severity: 'high',
    section: 'skills',
    message: `Only ${foundKeywords.length} tech keywords found — ATS will rank you low`,
    fix: 'Add more relevant skills: languages, frameworks, tools you know',
  })

  // ── 4. ACTION VERBS (10 pts) ──
  const foundVerbs = POWER_VERBS.filter(v => allText.includes(v))
  const verbScore = Math.min(Math.round((foundVerbs.length / 8) * 10), 10)
  totalScore += verbScore

  if (foundVerbs.length >= 6) strengths.push(`✅ Strong action verbs used (${foundVerbs.length})`)
  else issues.push({
    severity: 'medium',
    section: 'experience',
    message: 'Weak bullet points — not using strong action verbs',
    fix: `Start bullets with: ${POWER_VERBS.slice(0, 6).join(', ')}`,
  })

  // ── 5. QUANTIFIED ACHIEVEMENTS (10 pts) ──
  const quantPattern = /\d+[\s]*(%|percent|x|times|users|customers|projects|teams|months|days|hours|k|\+|million|crore|lakh)/gi
  const quantMatches = allText.match(quantPattern) || []
  const quantScore = Math.min(quantMatches.length * 2, 10)
  totalScore += quantScore

  if (quantMatches.length >= 3) strengths.push(`✅ ${quantMatches.length} quantified achievements found`)
  else issues.push({
    severity: 'high',
    section: 'experience',
    message: 'No measurable impact — vague bullet points hurt ATS score',
    fix: 'Add numbers: "Reduced load time by 40%", "Led team of 5", "Served 10k users"',
  })

  // ── 6. WEAK PHRASES PENALTY ──
  const foundWeak = WEAK_PHRASES.filter(w => allText.includes(w))
  if (foundWeak.length > 0) {
    const penalty = Math.min(foundWeak.length * 1.5, 8)
    totalScore = Math.max(totalScore - penalty, 0)
    issues.push({
      severity: 'medium',
      section: 'experience',
      message: `Weak phrases found: "${foundWeak.slice(0, 3).join('", "')}"`,
      fix: 'Replace with strong action verbs — AI will fix these automatically',
    })
  } else {
    strengths.push('✅ No weak filler phrases detected')
  }

  // ── 7. EXPERIENCE BULLET QUALITY (5 pts) ──
  if (Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
    const exp = resumeData.experience[0]
    const desc = exp.bullets || exp.description || ''
    const bulletCount = desc.split('\n').filter(b => b.trim()).length
    if (bulletCount >= 3) { totalScore += 5; strengths.push('✅ Good bullet point count per role') }
    else if (bulletCount > 0) { totalScore += 2; issues.push({ severity: 'medium', section: 'experience', message: 'Too few bullet points per role', fix: 'Add 3–5 bullet points per job — describe impact clearly' }) }
  }

  // ── CLAMP FINAL SCORE ──
  const rawScore = Math.round(Math.min(Math.max(totalScore, 5), 100))

  // ── Score Label ──
  const getLabel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: '#00DC82', emoji: '🏆' }
    if (score >= 75) return { label: 'Good', color: '#F59E0B', emoji: '⚡' }
    if (score >= 55) return { label: 'Fair', color: '#F97316', emoji: '⚠️' }
    return { label: 'Needs Work', color: '#F43F5E', emoji: '❌' }
  }

  const scoreInfo = getLabel(rawScore)

  return {
    score: rawScore,
    label: scoreInfo.label,
    color: scoreInfo.color,
    emoji: scoreInfo.emoji,
    issues: issues.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.severity] - order[b.severity]
    }),
    strengths,
    foundKeywords,
    foundVerbs,
    quantifiedCount: quantMatches.length,
    breakdown: {
      sections: Math.min(sectionScore, 40),
      contact: Math.min(contactScore, 15),
      keywords: Math.min(keywordScore, 20),
      verbs: verbScore,
      quantified: quantScore,
    },
    // Preview: show only 2-3 issues (rest behind paywall)
    previewIssues: issues.filter(i => i.severity === 'high').slice(0, 2),
    lockedIssues: issues.slice(2),
  }
}

// ─────────────────────────────────────────────────────────────
//  ENHANCED SCORE (after AI enhancement — simulated boost)
// ─────────────────────────────────────────────────────────────
export const calculateEnhancedScore = (originalScore) => {
  // After AI enhancement, score always jumps to 94-97 range
  const base = Math.max(originalScore + 35, 88)
  const enhanced = Math.min(base + Math.floor(Math.random() * 4), 97)
  return Math.max(enhanced, 94)
}

// ─────────────────────────────────────────────────────────────
//  PARSE PLAIN TEXT RESUME (for uploaded resumes)
// ─────────────────────────────────────────────────────────────
export const parseResumeText = (rawText = '') => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean)

  // Very basic parser — Groq AI will do the real parsing
  const data = {
    personalInfo: { fullName: '', email: '', phone: '', linkedin: '', github: '' },
    experience: [],
    education: [],
    skills: { languages: [], frameworks: [], tools: [] },
    projects: [],
  }

  // Extract email
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) data.personalInfo.email = emailMatch[0]

  // Extract phone
  const phoneMatch = rawText.match(/(\+91[\s-]?)?[6-9]\d{9}|(\+1[\s-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/)
  if (phoneMatch) data.personalInfo.phone = phoneMatch[0]

  // Extract LinkedIn
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[\w-]+/)
  if (linkedinMatch) data.personalInfo.linkedin = `https://${linkedinMatch[0]}`

  // Extract GitHub
  const githubMatch = rawText.match(/github\.com\/[\w-]+/)
  if (githubMatch) data.personalInfo.github = `https://${githubMatch[0]}`

  // First non-empty line is usually the name
  if (lines.length > 0) data.personalInfo.fullName = lines[0]

  return data
}

// ─────────────────────────────────────────────────────────────
//  SCORE COMPARISON HELPER
// ─────────────────────────────────────────────────────────────
export const getScoreComparison = (before, after) => ({
  before,
  after,
  improvement: after - before,
  improvementLabel: `+${after - before} points`,
  percentageJump: `${Math.round(((after - before) / before) * 100)}% better`,
})

export default calculateATSScore