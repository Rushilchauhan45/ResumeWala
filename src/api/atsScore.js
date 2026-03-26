// ─────────────────────────────────────────────────────────────
//  ResumeWala — ATS Score API
//  Connects frontend with ATS analyzer + Groq AI
// ─────────────────────────────────────────────────────────────

import { calculateATSScore, calculateEnhancedScore, parseResumeText } from '../utils/atsAnalyzer'
import { parseAndEnhanceResumeText, enhanceResumeWithAI } from './groqApi'

// ─────────────────────────────────────────────────────────────
//  1. SCORE FROM FORM DATA
//  Used in Builder — score updates as user fills form
// ─────────────────────────────────────────────────────────────
export const scoreFromFormData = (resumeData) => {
  try {
    return calculateATSScore(resumeData)
  } catch (err) {
    console.error('ATS scoring error:', err)
    return {
      score: 0,
      label: 'Error',
      color: '#F43F5E',
      issues: [],
      strengths: [],
      previewIssues: [],
      lockedIssues: [],
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  2. SCORE FROM UPLOADED FILE TEXT
//  Used in Upload page — score raw resume text
// ─────────────────────────────────────────────────────────────
export const scoreFromUploadedText = (rawText) => {
  try {
    const parsedData = parseResumeText(rawText)
    const result = calculateATSScore(parsedData)
    return { ...result, parsedData }
  } catch (err) {
    console.error('Upload scoring error:', err)
    return {
      score: 15,
      label: 'Needs Work',
      color: '#F43F5E',
      issues: [{ severity: 'high', message: 'Could not fully parse resume', fix: 'Try uploading a cleaner PDF or use the builder instead' }],
      strengths: [],
      previewIssues: [],
      lockedIssues: [],
      parsedData: {},
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  3. FULL ENHANCE FLOW
//  Before → AI Enhance → After score
//  Returns: { before, enhanced, after, resumeData }
// ─────────────────────────────────────────────────────────────
export const fullEnhanceFlow = async ({
  resumeData = null,
  rawText = null,
  jobDescription = '',
  onProgress = () => {},
}) => {
  try {
    let originalData = resumeData
    let beforeScore

    // ── Step 1: Get before score ──
    onProgress({ step: 1, message: 'Analyzing your resume...', percent: 10 })

    if (rawText && !resumeData) {
      const parsed = parseResumeText(rawText)
      beforeScore = calculateATSScore(parsed)
      originalData = parsed
    } else {
      beforeScore = calculateATSScore(resumeData)
    }

    await delay(600)

    // ── Step 2: AI Enhancement ──
    onProgress({ step: 2, message: 'Groq AI is rewriting your resume...', percent: 35 })

    let enhancedData
    if (rawText && !resumeData) {
      enhancedData = await parseAndEnhanceResumeText(rawText, jobDescription)
      if (!enhancedData) enhancedData = originalData
    } else {
      enhancedData = await enhanceResumeWithAI(resumeData, jobDescription)
    }

    await delay(400)

    // ── Step 3: Calculate after score ──
    onProgress({ step: 3, message: 'Calculating your new ATS score...', percent: 75 })

    const afterScore = calculateEnhancedScore(beforeScore.score)

    await delay(500)

    // ── Step 4: Done ──
    onProgress({ step: 4, message: 'Resume enhanced! Ready to preview.', percent: 100 })

    return {
      success: true,
      before: beforeScore.score,
      after: afterScore,
      beforeResult: beforeScore,
      enhancedData,
      improvement: afterScore - beforeScore.score,
    }
  } catch (err) {
    console.error('Enhance flow error:', err)
    return {
      success: false,
      error: err.message || 'Enhancement failed. Please try again.',
      before: 0,
      after: 0,
      enhancedData: resumeData,
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  4. LIVE SCORE (debounced — for real-time builder updates)
// ─────────────────────────────────────────────────────────────
let scoreDebounceTimer = null

export const getLiveScore = (resumeData, callback, debounceMs = 800) => {
  if (scoreDebounceTimer) clearTimeout(scoreDebounceTimer)
  scoreDebounceTimer = setTimeout(() => {
    const result = scoreFromFormData(resumeData)
    callback(result)
  }, debounceMs)
}

// ─────────────────────────────────────────────────────────────
//  5. SECTION-WISE SCORE BREAKDOWN
//  Shows user which section is weakest
// ─────────────────────────────────────────────────────────────
export const getSectionScores = (resumeData) => {
  const result = calculateATSScore(resumeData)

  return [
    {
      section: 'Contact Info',
      score: result.breakdown?.contact ?? 0,
      maxScore: 15,
      percent: Math.round(((result.breakdown?.contact ?? 0) / 15) * 100),
      icon: '👤',
      color: '#6366F1',
    },
    {
      section: 'Sections Complete',
      score: result.breakdown?.sections ?? 0,
      maxScore: 40,
      percent: Math.round(((result.breakdown?.sections ?? 0) / 40) * 100),
      icon: '📄',
      color: '#818CF8',
    },
    {
      section: 'Keywords',
      score: result.breakdown?.keywords ?? 0,
      maxScore: 20,
      percent: Math.round(((result.breakdown?.keywords ?? 0) / 20) * 100),
      icon: '🎯',
      color: '#00DC82',
    },
    {
      section: 'Action Verbs',
      score: result.breakdown?.verbs ?? 0,
      maxScore: 10,
      percent: Math.round(((result.breakdown?.verbs ?? 0) / 10) * 100),
      icon: '⚡',
      color: '#F59E0B',
    },
    {
      section: 'Quantified Impact',
      score: result.breakdown?.quantified ?? 0,
      maxScore: 10,
      percent: Math.round(((result.breakdown?.quantified ?? 0) / 10) * 100),
      icon: '📊',
      color: '#F43F5E',
    },
  ]
}

// ─────────────────────────────────────────────────────────────
//  6. SCORE COLOR HELPER
// ─────────────────────────────────────────────────────────────
export const getScoreColor = (score) => {
  if (score >= 90) return '#00DC82'
  if (score >= 75) return '#F59E0B'
  if (score >= 55) return '#F97316'
  return '#F43F5E'
}

export const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent 🏆'
  if (score >= 75) return 'Good ⚡'
  if (score >= 55) return 'Fair ⚠️'
  return 'Needs Work ❌'
}

// ─────────────────────────────────────────────────────────────
//  HELPER
// ─────────────────────────────────────────────────────────────
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
  scoreFromFormData,
  scoreFromUploadedText,
  fullEnhanceFlow,
  getLiveScore,
  getSectionScores,
  getScoreColor,
  getScoreLabel,
}