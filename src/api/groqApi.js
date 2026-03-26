// Mock Groq API helpers so the Upload flow works end-to-end without backend deps

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

export const parseAndEnhanceResumeText = async (rawText = '', jobDescription = '') => {
  await delay()
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
      source: 'upload-text',
      matchedJD: jobDescription.length > 0,
      enhancedAt: new Date().toISOString(),
    },
  }
}

export const enhanceResumeWithAI = async (resumeData = {}, jobDescription = '') => {
  await delay()
  return {
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
      source: 'builder-data',
      matchedJD: jobDescription.length > 0,
      enhancedAt: new Date().toISOString(),
    },
  }
}

export default {
  parseAndEnhanceResumeText,
  enhanceResumeWithAI,
}
