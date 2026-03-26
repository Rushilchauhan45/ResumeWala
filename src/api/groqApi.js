const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms))

const baseEnhancedResume = {
  personalInfo: {
    fullName: 'AI Enhanced Candidate',
    email: 'hireme@resumewala.in',
    phone: '+91-90000-00000',
    summary: 'Full-stack engineer optimized by Groq AI. Crafts measurable impact, leads cross-functional pods, and ships delightful experiences for millions of users.',
  },
  experience: [
    {
      role: 'Software Engineer',
      company: 'High-Growth Startup',
      duration: '2022 — Present',
      bullets: '- Boosted conversion by 34% via data-led experiments.\n- Automated ops workflows saving 18 engineer-hours/week.\n- Led 4-person pod shipping new payments stack in 6 weeks.',
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      school: 'Top Tier Institute',
      year: '2021',
      gpa: '8.8 / 10',
    },
  ],
  skills: {
    technical: ['React', 'Node.js', 'TypeScript', 'AWS', 'SQL'],
    tools: ['Jest', 'Docker', 'Figma', 'Postman'],
    languages: ['English', 'Hindi'],
  },
}

const callGroqEndpoint = async (payload) => {
  try {
    const response = await fetch('/api/enhance-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || `Groq endpoint error: ${response.status}`)
    }

    const data = await response.json()
    if (data.success && data.enhancedData) return data.enhancedData

    throw new Error(data.error || 'Groq returned empty payload')
  } catch (err) {
    console.warn('Groq endpoint unavailable, using fallback data', err)
    return null
  }
}

const buildFallbackFromText = (rawText = '', jobDescription = '') => {
  const firstLine = rawText.split(/\n|,/)[0]?.trim()
  const derivedName = firstLine && firstLine.length < 60 ? firstLine : baseEnhancedResume.personalInfo.fullName

  return {
    ...baseEnhancedResume,
    personalInfo: {
      ...baseEnhancedResume.personalInfo,
      fullName: derivedName || baseEnhancedResume.personalInfo.fullName,
      summary: jobDescription
        ? `${baseEnhancedResume.personalInfo.summary} Tailored for: ${jobDescription.slice(0, 90)}...`
        : baseEnhancedResume.personalInfo.summary,
    },
    meta: {
      source: 'upload-text-fallback',
      matchedJD: jobDescription.length > 0,
      enhancedAt: new Date().toISOString(),
      fallback: true,
    },
  }
}

const buildFallbackFromData = (resumeData = {}, jobDescription = '') => ({
  ...baseEnhancedResume,
  ...resumeData,
  personalInfo: {
    ...baseEnhancedResume.personalInfo,
    ...resumeData?.personalInfo,
    summary: jobDescription
      ? `${resumeData?.personalInfo?.summary || baseEnhancedResume.personalInfo.summary} Tailored for: ${jobDescription.slice(0, 90)}...`
      : resumeData?.personalInfo?.summary || baseEnhancedResume.personalInfo.summary,
  },
  meta: {
    source: 'builder-data-fallback',
    matchedJD: jobDescription.length > 0,
    enhancedAt: new Date().toISOString(),
    fallback: true,
  },
})

export const parseAndEnhanceResumeText = async (rawText = '', jobDescription = '') => {
  await delay(400)
  const enhanced = await callGroqEndpoint({ rawText, jobDescription, mode: 'parse' })
  if (enhanced) return enhanced
  return buildFallbackFromText(rawText, jobDescription)
}

export const enhanceResumeWithAI = async (resumeData = {}, jobDescription = '') => {
  await delay(400)
  const enhanced = await callGroqEndpoint({ resumeData, jobDescription, mode: 'enhance' })
  if (enhanced) return enhanced
  return buildFallbackFromData(resumeData, jobDescription)
}

export default {
  parseAndEnhanceResumeText,
  enhanceResumeWithAI,
}
