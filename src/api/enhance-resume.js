// ─────────────────────────────────────────────────────────────
//  ResumeWala — Vercel Serverless: /api/enhance-resume
//  Calls Groq API server-side (keeps API key secure)
// ─────────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama3-8b-8192'

export default async function handler(req, res) {
  // ── CORS Headers ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const GROQ_API_KEY = process.env.GROQ_API_KEY
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured on server' })
  }

  try {
    const { resumeData, rawText, jobDescription = '', mode = 'enhance' } = req.body

    if (!resumeData && !rawText) {
      return res.status(400).json({ error: 'resumeData or rawText is required' })
    }

    // ── Build prompt based on mode ──
    let prompt = ''

    if (mode === 'parse' && rawText) {
      prompt = `You are an expert resume parser and writer.

Extract all information from this resume text AND enhance it for maximum ATS impact.

Rules:
1. Extract every piece of information accurately
2. Enhance bullet points with strong action verbs and quantified achievements
3. Keep all facts accurate — only improve the wording
4. If a field is not found, use empty string or empty array
5. Return ONLY valid JSON, no extra text or markdown

Resume Text:
${rawText.slice(0, 4000)}

Return in this EXACT JSON structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": "", "summary": "" },
  "experience": [{ "company": "", "role": "", "location": "", "startDate": "", "endDate": "", "bullets": "" }],
  "education": [{ "institution": "", "degree": "", "field": "", "location": "", "startDate": "", "endDate": "", "gpa": "", "coursework": "" }],
  "skills": { "languages": [], "frameworks": [], "tools": [], "databases": [], "cloud": [], "soft": [] },
  "projects": [{ "title": "", "techStack": "", "date": "", "link": "", "description": "" }]
}`
    } else {
      const jobContext = jobDescription
        ? `\nTarget Job Description:\n${jobDescription.slice(0, 800)}`
        : ''

      prompt = `You are an expert resume writer who has helped 10,000+ candidates get hired at Google, Amazon, Microsoft.

Transform this resume data into a POWERFUL, ATS-optimized version.

Rules:
1. Rewrite ALL experience bullet points using strong action verbs
2. Add quantified metrics to every bullet point where possible
3. Add relevant tech keywords naturally throughout
4. Make the summary powerful and keyword-rich (3-4 sentences)
5. Keep all factual information accurate — only improve wording
6. Each bullet point must start with a past-tense action verb
7. Return ONLY valid JSON, no extra text${jobContext}

Resume Data:
${JSON.stringify(resumeData, null, 2).slice(0, 3000)}

Return enhanced resume in this EXACT JSON structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": "", "summary": "" },
  "experience": [{ "company": "", "role": "", "location": "", "startDate": "", "endDate": "", "bullets": "" }],
  "education": [{ "institution": "", "degree": "", "field": "", "location": "", "startDate": "", "endDate": "", "gpa": "", "coursework": "" }],
  "skills": { "languages": [], "frameworks": [], "tools": [], "databases": [], "cloud": [], "soft": [] },
  "projects": [{ "title": "", "techStack": "", "date": "", "link": "", "description": "" }]
}`
    }

    // ── Call Groq ──
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: mode === 'parse' ? 0.4 : 0.6,
        max_tokens: 3000,
      }),
    })

    if (!groqResponse.ok) {
      const err = await groqResponse.json().catch(() => ({}))
      throw new Error(err.error?.message || `Groq error: ${groqResponse.status}`)
    }

    const groqData = await groqResponse.json()
    const rawContent = groqData.choices?.[0]?.message?.content?.trim() || ''

    // ── Parse JSON response ──
    const cleaned = rawContent
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim()

    let enhancedData
    try {
      enhancedData = JSON.parse(cleaned)
    } catch {
      return res.status(200).json({
        success: false,
        error: 'AI returned invalid format',
        enhancedData: resumeData || {},
      })
    }

    return res.status(200).json({
      success: true,
      enhancedData,
      model: MODEL,
    })

  } catch (err) {
    console.error('enhance-resume error:', err)
    return res.status(500).json({
      success: false,
      error: err.message || 'Enhancement failed',
    })
  }
}