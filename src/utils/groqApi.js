// ─────────────────────────────────────────────────────────────
//  ResumeWala — Groq AI Integration
//  Uses Groq's ultra-fast LLaMA model to enhance resumes
// ─────────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const MODEL = 'llama3-8b-8192' // Fast + Free on Groq

// ─────────────────────────────────────────────────────────────
//  BASE GROQ CALLER
// ─────────────────────────────────────────────────────────────
const callGroq = async (messages, options = {}) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key missing! Add VITE_GROQ_API_KEY to your .env file.')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
      top_p: 0.9,
      stream: false,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

// ─────────────────────────────────────────────────────────────
//  SAFE JSON PARSER
// ─────────────────────────────────────────────────────────────
const safeParseJSON = (text) => {
  try {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────
//  1. ENHANCE FULL RESUME DATA
//  Takes raw form data → returns AI-enhanced resume data
// ─────────────────────────────────────────────────────────────
export const enhanceResumeWithAI = async (resumeData, jobDescription = '') => {
  const jobContext = jobDescription
    ? `\nTarget Job Description:\n${jobDescription.slice(0, 800)}`
    : ''

  const prompt = `You are an expert resume writer who has helped 10,000+ candidates get hired at Google, Amazon, Microsoft, and top Indian tech companies.

Your task: Transform this resume data into a POWERFUL, ATS-optimized version.

Rules:
1. Rewrite ALL experience bullet points using strong action verbs (Led, Built, Developed, Optimized, Reduced, Increased, Deployed, etc.)
2. Add quantified metrics to every bullet point where possible (%, numbers, team size, time saved)
3. Add relevant tech keywords naturally throughout
4. Make the summary powerful and keyword-rich (3-4 sentences max)
5. Keep all factual information accurate — only improve wording
6. Each bullet point must start with a past-tense action verb
7. Return ONLY valid JSON, no extra text${jobContext}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return enhanced resume in this EXACT JSON structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "summary": "Enhanced 3-4 sentence professional summary with keywords"
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "bullets": "• Action verb + task + quantified impact\n• Action verb + task + quantified impact\n• Action verb + task + quantified impact"
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "coursework": ""
    }
  ],
  "skills": {
    "languages": [""],
    "frameworks": [""],
    "tools": [""],
    "databases": [""],
    "cloud": [""],
    "soft": [""]
  },
  "projects": [
    {
      "title": "",
      "techStack": "",
      "date": "",
      "link": "",
      "description": "• Built X using Y, resulting in Z\n• Implemented A which improved B by C%"
    }
  ]
}`

  const raw = await callGroq(
    [{ role: 'user', content: prompt }],
    { temperature: 0.6, maxTokens: 3000 }
  )

  const parsed = safeParseJSON(raw)
  if (!parsed) {
    // Fallback: return original data if parsing fails
    console.warn('Groq returned non-JSON, using original data')
    return resumeData
  }

  return parsed
}

// ─────────────────────────────────────────────────────────────
//  2. ENHANCE UPLOADED RESUME TEXT
//  Takes plain text (from PDF/DOCX) → returns structured data
// ─────────────────────────────────────────────────────────────
export const parseAndEnhanceResumeText = async (rawText, jobDescription = '') => {
  const jobContext = jobDescription
    ? `\nTarget Job:\n${jobDescription.slice(0, 600)}`
    : ''

  const prompt = `You are an expert resume parser and writer.

Extract all information from this resume text AND enhance it for maximum ATS impact.

Rules:
1. Extract every piece of information accurately
2. Enhance bullet points with strong action verbs and quantified achievements
3. Keep all facts accurate — only improve the wording
4. If a field is not found, use empty string or empty array
5. Return ONLY valid JSON${jobContext}

Resume Text:
${rawText.slice(0, 4000)}

Return in this EXACT JSON structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "summary": ""
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "bullets": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "coursework": ""
    }
  ],
  "skills": {
    "languages": [],
    "frameworks": [],
    "tools": [],
    "databases": [],
    "cloud": [],
    "soft": []
  },
  "projects": [
    {
      "title": "",
      "techStack": "",
      "date": "",
      "link": "",
      "description": ""
    }
  ]
}`

  const raw = await callGroq(
    [{ role: 'user', content: prompt }],
    { temperature: 0.4, maxTokens: 3000 }
  )

  const parsed = safeParseJSON(raw)
  return parsed || null
}

// ─────────────────────────────────────────────────────────────
//  3. ENHANCE SINGLE SECTION
//  For live section-by-section enhancement in builder
// ─────────────────────────────────────────────────────────────
export const enhanceSection = async (sectionName, sectionData, context = '') => {
  const prompts = {
    experience: `Rewrite these job experience bullet points to be powerful, ATS-optimized, and quantified.
Use strong action verbs. Add metrics where logical. Keep facts accurate.
Experience: ${JSON.stringify(sectionData)}
Return ONLY the enhanced "bullets" as a string with each point on a new line starting with •`,

    summary: `Write a powerful 3-4 sentence professional summary for this candidate.
Include: their role, key skills, years of experience, and career goal.
Make it keyword-rich and ATS-friendly.
Data: ${JSON.stringify(sectionData)}
Return ONLY the summary paragraph, no extra text.`,

    skills: `Organize and expand these skills into proper categories.
Add related technologies the candidate likely knows based on their stack.
Data: ${JSON.stringify(sectionData)}
Return ONLY valid JSON: {"languages":[],"frameworks":[],"tools":[],"databases":[],"cloud":[],"soft":[]}`,

    projects: `Enhance these project descriptions to be impressive and ATS-optimized.
Add technical depth, quantify impact, use strong verbs.
Projects: ${JSON.stringify(sectionData)}
Return ONLY the enhanced description as bullet points starting with •`,
  }

  const userPrompt = prompts[sectionName] || `Enhance this resume section: ${JSON.stringify(sectionData)}`

  const raw = await callGroq(
    [{ role: 'user', content: userPrompt }],
    { temperature: 0.7, maxTokens: 1000 }
  )

  return raw
}

// ─────────────────────────────────────────────────────────────
//  4. GENERATE PROFESSIONAL SUMMARY
//  Quick summary generator from form data
// ─────────────────────────────────────────────────────────────
export const generateSummary = async (resumeData) => {
  const { personalInfo, experience, skills } = resumeData

  const prompt = `Write a powerful 3-4 sentence professional resume summary.

Candidate Info:
- Name: ${personalInfo?.fullName || 'Candidate'}
- Experience: ${experience?.length || 0} roles, most recent: ${experience?.[0]?.role || 'Software Developer'} at ${experience?.[0]?.company || 'Tech Company'}
- Skills: ${Object.values(skills || {}).flat().slice(0, 10).join(', ')}

Rules:
1. Start with years of experience + role title
2. Mention 3-4 key technical skills
3. End with career goal / value proposition
4. Keep it under 80 words
5. Make it ATS-friendly with keywords
6. Return ONLY the summary text, no quotes or extra text`

  return await callGroq(
    [{ role: 'user', content: prompt }],
    { temperature: 0.8, maxTokens: 200 }
  )
}

// ─────────────────────────────────────────────────────────────
//  5. ATS KEYWORD SUGGESTIONS
//  Given a job description, suggest missing keywords
// ─────────────────────────────────────────────────────────────
export const suggestKeywords = async (resumeData, jobDescription) => {
  if (!jobDescription) return []

  const prompt = `Compare this resume with the job description and find missing ATS keywords.

Job Description:
${jobDescription.slice(0, 1000)}

Resume Skills:
${JSON.stringify(resumeData.skills || {})}

Return ONLY a JSON array of missing keywords the candidate should add:
["keyword1", "keyword2", "keyword3"]
Maximum 10 keywords. Only include relevant technical skills/tools.`

  const raw = await callGroq(
    [{ role: 'user', content: prompt }],
    { temperature: 0.3, maxTokens: 300 }
  )

  const parsed = safeParseJSON(raw)
  return Array.isArray(parsed) ? parsed : []
}

// ─────────────────────────────────────────────────────────────
//  6. QUICK BULLET POINT ENHANCER
//  Single bullet point → enhanced version
// ─────────────────────────────────────────────────────────────
export const enhanceBullet = async (bullet, role = '') => {
  const prompt = `Rewrite this resume bullet point to be powerful and ATS-optimized.
Role: ${role || 'Software Developer'}
Original: "${bullet}"

Rules:
- Start with strong action verb (past tense)
- Add quantified metric if possible
- Keep under 20 words
- Return ONLY the improved bullet, no quotes`

  return await callGroq(
    [{ role: 'user', content: prompt }],
    { temperature: 0.7, maxTokens: 100 }
  )
}

export default {
  enhanceResumeWithAI,
  parseAndEnhanceResumeText,
  enhanceSection,
  generateSummary,
  suggestKeywords,
  enhanceBullet,
}