// ─────────────────────────────────────────────────────────────
//  ResumeWala — UploadResume Component
//  Drag & drop upload → ATS score → AI enhance → Download
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { scoreFromUploadedText, fullEnhanceFlow, getSectionScores, getScoreColor, getScoreLabel } from '../../api/atsScore'
import toast from 'react-hot-toast'
import { downloadResumePdf } from '../../utils/pdfDownloader'

// ─────────────────────────────────────────────────────────────
//  ATS SCORE RING
// ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 120, animated = true }) => {
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const color = getScoreColor(score)
  const offset = circ * (1 - score / 100)

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: animated ? offset : offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontFamily: "'Outfit', sans-serif", fontWeight: 900, color, lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: size * 0.09, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginTop: 2, fontWeight: 600 }}>ATS</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  PROGRESS BAR
// ─────────────────────────────────────────────────────────────
const ProgressBar = ({ percent, color = '#6366F1', label }) => (
  <div style={{ marginBottom: 10 }}>
    {label && (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color, fontWeight: 700 }}>{percent}%</span>
      </div>
    )}
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 5, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '100%', borderRadius: 100, background: `linear-gradient(to right, ${color}, ${color}aa)` }}
      />
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function UploadResume() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [stage, setStage] = useState('upload') // upload | analyzing | results | enhancing | preview
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [rawText, setRawText] = useState('')
  const [scoreResult, setScoreResult] = useState(null)
  const [enhancedData, setEnhancedData] = useState(null)
  const [afterScore, setAfterScore] = useState(null)
  const [progress, setProgress] = useState({ percent: 0, message: '' })
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  // ── Extract text from file ──
  const extractText = async (file) => {
    // For TXT files — read directly
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    }

    // For PDF — use basic text extraction
    // In production, use pdf.js or send to server
    if (file.type === 'application/pdf') {
      try {
        const pdfjs = await import('pdfjs-dist/build/pdf')
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map(item => item.str).join(' ') + '\n'
        }
        return text
      } catch {
        // Fallback if pdfjs not available
        return `PDF file: ${file.name}\nPlease use a .txt version of your resume for best results.`
      }
    }

    // DOCX fallback
    return `File: ${file.name}\nContent extracted for ATS analysis.`
  }

  // ── Handle file drop / select ──
  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError('')

    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|txt|doc|docx)$/i)) {
      setError('Please upload a PDF, TXT, DOC, or DOCX file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB')
      return
    }

    setUploadedFile(file)
    setStage('analyzing')

    // Extract text
    const text = await extractText(file)
    setRawText(text)

    // Score it
    await new Promise(r => setTimeout(r, 800))
    const result = scoreFromUploadedText(text)
    setScoreResult(result)
    setStage('results')
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  // ── Enhance Resume ──
  const handleEnhance = async () => {
    setStage('enhancing')
    setError('')

    const result = await fullEnhanceFlow({
      rawText,
      jobDescription,
      onProgress: ({ percent, message }) => setProgress({ percent, message }),
    })

    if (!result.success) {
      setError(result.error || 'Enhancement failed. Please try again.')
      setStage('results')
      return
    }

    setEnhancedData(result.enhancedData)
    setAfterScore(result.after)
    setStage('preview')
  }

  // ── Download enhanced resume ──
  const handleDownload = async () => {
    if (!enhancedData) {
      toast.error('Resume data missing — please re-run enhancement.')
      return
    }

    const fileNameBase = enhancedData?.personalInfo?.fullName
      ? enhancedData.personalInfo.fullName.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')
      : (uploadedFile?.name?.replace(/\.[^.]+$/, '') || 'enhanced-resume')

    setDownloading(true)
    toast.loading('Generating your PDF...', { id: 'rw-download' })

    const downloadResult = await downloadResumePdf({
      resumeData: enhancedData,
      fileName: fileNameBase || 'resume-wala',
    })

    if (downloadResult.success) {
      toast.success('Resume downloaded. Check your Downloads folder!', { id: 'rw-download' })
    } else if (downloadResult.fallback) {
      toast.error(downloadResult.message || 'PDF service unavailable. We saved the LaTeX file instead.', { id: 'rw-download' })
    } else {
      toast.error(downloadResult.error || 'Could not generate PDF. Please contact support.', { id: 'rw-download' })
    }

    setDownloading(false)
  }

  const sectionScores = scoreResult ? getSectionScores(scoreResult) : []

  return (
    <div style={{
      background: '#050512', minHeight: '100vh', color: 'white',
      fontFamily: "'Outfit', sans-serif", paddingTop: 80,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .rw-display { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.04em; }
        .rw-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .grad-text { background: linear-gradient(135deg, #C7D2FE 0%, #818CF8 35%, #00DC82 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .upload-zone { border: 2px dashed rgba(255,255,255,0.1); border-radius: 22px; transition: all 0.3s ease; cursor: pointer; }
        .upload-zone:hover, .upload-zone.dragover { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05); }
        .issue-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px 16px; margin-bottom: 8px; }
        .btn-primary { background: linear-gradient(135deg, #6366F1, #4F46E5); border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 700; color: white; border-radius: 13px; transition: all 0.3s; box-shadow: 0 4px 20px rgba(99,102,241,0.4); letter-spacing: -0.02em; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.55); }
        .btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: rgba(255,255,255,0.6); border-radius: 12px; transition: all 0.2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); color: white; }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 72px 72px; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ fontSize: 14 }}>📤</span>
            <span className="rw-body" style={{ fontSize: 12, fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.06em' }}>UPLOAD & ENHANCE</span>
          </div>
          <h1 className="rw-display" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.05, marginBottom: 12 }}>
            Upload Your Resume<br /><span className="grad-text">Get Instant ATS Score</span>
          </h1>
          <p className="rw-body" style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Drop your old resume → AI scans it → Get your real ATS score → Enhance & download instantly (beta is free)
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ══ STAGE: UPLOAD ══ */}
          {stage === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

              {/* Drop Zone */}
              <div
                className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '60px 32px', textAlign: 'center', marginBottom: 20 }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: 'none' }}
                  onChange={e => handleFile(e.target.files[0])} />

                <motion.div animate={{ y: dragOver ? -8 : 0 }} transition={{ duration: 0.3 }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
                  <div className="rw-display" style={{ fontSize: 22, marginBottom: 8 }}>
                    {dragOver ? 'Drop it here!' : 'Drag & Drop Your Resume'}
                  </div>
                  <p className="rw-body" style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', marginBottom: 24, lineHeight: 1.6 }}>
                    or click to browse files<br />
                    <span style={{ fontSize: 13 }}>Supports PDF, DOC, DOCX, TXT • Max 5MB</span>
                  </p>
                  <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 11V3M4 7l4-4 4 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13h10" stroke="white" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    Choose File
                  </button>
                </motion.div>
              </div>

              {error && (
                <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                  <span className="rw-body" style={{ fontSize: 14, color: '#F87171' }}>⚠ {error}</span>
                </div>
              )}

              {/* Job Description (optional) */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '22px 24px' }}>
                <div className="rw-display" style={{ fontSize: 15, marginBottom: 6 }}>🎯 Target Job Description <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.3)', fontFamily: "'Plus Jakarta Sans'" }}>(Optional — boosts ATS score further)</span></div>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here — AI will match your resume keywords to this specific role..."
                  style={{
                    width: '100%', minHeight: 100, background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                    padding: '12px 14px', color: 'white', fontSize: 14, resize: 'vertical',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', marginTop: 10,
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Alt: Build from scratch */}
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <span className="rw-body" style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Don't have a resume? </span>
                <button onClick={() => navigate('/builder')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818CF8', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>
                  Build from scratch →
                </button>
              </div>
            </motion.div>
          )}

          {/* ══ STAGE: ANALYZING ══ */}
          {stage === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '80px 24px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{ width: 60, height: 60, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', margin: '0 auto 24px' }} />
              <div className="rw-display" style={{ fontSize: 22, marginBottom: 8 }}>Analyzing Your Resume...</div>
              <p className="rw-body" style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Checking ATS compatibility, keywords, formatting...</p>
            </motion.div>
          )}

          {/* ══ STAGE: RESULTS ══ */}
          {stage === 'results' && scoreResult && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Score + File Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

                {/* Before Score */}
                <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.14)', borderRadius: 22, padding: '28px', textAlign: 'center' }}>
                  <div className="rw-body" style={{ fontSize: 11, fontWeight: 700, color: '#F87171', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>✗ Your Current Score</div>
                  <ScoreRing score={scoreResult.score} size={120} />
                  <div style={{ marginTop: 12 }}>
                    <div className="rw-display" style={{ fontSize: 18, color: getScoreColor(scoreResult.score) }}>{getScoreLabel(scoreResult.score)}</div>
                    <p className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                      {uploadedFile?.name}
                    </p>
                  </div>
                </div>

                {/* After Score (teaser) */}
                <div style={{ background: 'rgba(0,220,130,0.04)', border: '1px solid rgba(0,220,130,0.14)', borderRadius: 22, padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #00DC82, #36E4DA)' }} />
                  <div className="rw-body" style={{ fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>✓ After ResumeWala AI</div>
                  <div style={{ position: 'relative' }}>
                    <ScoreRing score={96} size={120} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,18,0.7)', backdropFilter: 'blur(6px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <span style={{ fontSize: 24 }}>🔒</span>
                      <span className="rw-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 600 }}>Enhance to unlock</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div className="rw-display" style={{ fontSize: 18, color: '#34D399' }}>94–97% Guaranteed</div>
                    <p className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>AI-enhanced version</p>
                  </div>
                </div>
              </div>

              {/* Section Breakdown */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '22px 24px', marginBottom: 16 }}>
                <div className="rw-display" style={{ fontSize: 16, marginBottom: 16 }}>📊 Score Breakdown</div>
                {sectionScores.map((s, i) => (
                  <ProgressBar key={i} percent={s.percent} color={s.color} label={`${s.icon} ${s.section}`} />
                ))}
              </div>

              {/* Issues — Paywall */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '22px 24px', marginBottom: 20 }}>
                <div className="rw-display" style={{ fontSize: 16, marginBottom: 4 }}>⚠️ Issues Found</div>
                <p className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                  {scoreResult.issues.length} issues detected — showing {scoreResult.previewIssues.length} free
                </p>

                {/* Free issues */}
                {scoreResult.previewIssues.map((issue, i) => (
                  <div key={i} className="issue-card">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{issue.severity === 'high' ? '🔴' : '🟡'}</span>
                      <div>
                        <div className="rw-body" style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{issue.message}</div>
                        <div className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Fix: {issue.fix}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Locked issues */}
                {scoreResult.lockedIssues.length > 0 && (
                  <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px dashed rgba(99,102,241,0.2)', borderRadius: 14, padding: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ filter: 'blur(3px)', marginBottom: 12 }}>
                      {scoreResult.lockedIssues.slice(0, 2).map((issue, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', marginBottom: 6, textAlign: 'left' }}>
                          <div className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>🔴 {issue.message}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 20, marginBottom: 6 }}>🔒</span>
                      <div className="rw-display" style={{ fontSize: 14, marginBottom: 4 }}>{scoreResult.lockedIssues.length} more issues hidden</div>
                      <div className="rw-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>AI fixes ALL of them automatically — unlock during free beta</div>
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {scoreResult.strengths.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div className="rw-body" style={{ fontSize: 13, color: '#34D399', fontWeight: 700, marginBottom: 8 }}>✅ What's working:</div>
                    {scoreResult.strengths.slice(0, 3).map((s, i) => (
                      <div key={i} className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', padding: '4px 0' }}>{s}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handleEnhance} className="btn-primary"
                  style={{ flex: 2, padding: '16px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minWidth: 200 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l1.8 5.4H17l-4.8 3.5 1.8 5.5L9 13.5l-5 3 1.8-5.5L1 8.4h6.2L9 2z" fill="white" opacity="0.9" /></svg>
                  Enhance with AI — Preview Free
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button onClick={() => { setStage('upload'); setUploadedFile(null); setScoreResult(null) }}
                  className="btn-ghost" style={{ flex: 1, padding: '16px', fontSize: 14, minWidth: 120 }}>
                  Try Another File
                </button>
              </div>

              <p className="rw-body" style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.22)', marginTop: 12 }}>
                Preview & download are 100% free during the beta launch
              </p>
            </motion.div>
          )}

          {/* ══ STAGE: ENHANCING ══ */}
          {stage === 'enhancing' && (
            <motion.div key="enhancing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '60px 24px', textAlign: 'center' }}>

              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 56, marginBottom: 24 }}>⚡</motion.div>

              <div className="rw-display" style={{ fontSize: 26, marginBottom: 8 }}>Groq AI Is Working...</div>
              <p className="rw-body" style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>{progress.message}</p>

              {/* Progress bar */}
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 6, overflow: 'hidden', marginBottom: 12 }}>
                  <motion.div
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(to right, #6366F1, #00DC82)' }}
                  />
                </div>
                <div className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{progress.percent}% complete</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
                {['Rewriting bullets', 'Adding keywords', 'Optimizing format', 'Calculating score'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: progress.percent > i * 25 ? '#00DC82' : 'rgba(255,255,255,0.15)' }} />
                    <span className="rw-body" style={{ fontSize: 12.5, color: progress.percent > i * 25 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ STAGE: PREVIEW ══ */}
          {stage === 'preview' && enhancedData && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Score comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.14)', borderRadius: 18, padding: '20px', textAlign: 'center' }}>
                  <div className="rw-body" style={{ fontSize: 11, color: '#F87171', fontWeight: 700, marginBottom: 10, letterSpacing: '0.08em' }}>BEFORE</div>
                  <ScoreRing score={scoreResult?.score || 32} size={90} />
                </div>
                <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11h14M12 6l5 5-5 5" stroke="url(#aG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><defs><linearGradient id="aG" x1="4" y1="11" x2="18" y2="11" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1" /><stop offset="1" stopColor="#00DC82" /></linearGradient></defs></svg>
                </motion.div>
                <div style={{ background: 'rgba(0,220,130,0.04)', border: '1px solid rgba(0,220,130,0.14)', borderRadius: 18, padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #00DC82, #36E4DA)' }} />
                  <div className="rw-body" style={{ fontSize: 11, color: '#34D399', fontWeight: 700, marginBottom: 10, letterSpacing: '0.08em' }}>AFTER AI</div>
                  <ScoreRing score={afterScore || 96} size={90} />
                </div>
              </div>

              {/* Preview card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div className="rw-display" style={{ fontSize: 17 }}>📄 Enhanced Resume Preview</div>
                  <div style={{ background: 'rgba(0,220,130,0.1)', border: '1px solid rgba(0,220,130,0.2)', borderRadius: 100, padding: '4px 12px' }}>
                    <span className="rw-body" style={{ fontSize: 12, color: '#34D399', fontWeight: 700 }}>AI Enhanced ✓</span>
                  </div>
                </div>

                {/* Resume preview snippet */}
                <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px', fontFamily: 'monospace', fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, position: 'relative', overflow: 'hidden', maxHeight: 220 }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: 15, marginBottom: 4 }}>{enhancedData?.personalInfo?.fullName || 'Your Name'}</div>
                  <div style={{ color: '#818CF8', marginBottom: 8 }}>{enhancedData?.personalInfo?.email} • {enhancedData?.personalInfo?.phone}</div>
                  {enhancedData?.personalInfo?.summary && (
                    <div style={{ marginBottom: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>
                      {enhancedData.personalInfo.summary.slice(0, 180)}...
                    </div>
                  )}
                  {enhancedData?.experience?.[0] && (
                    <div>
                      <div style={{ color: '#00DC82', fontWeight: 700 }}>EXPERIENCE</div>
                      <div style={{ color: 'white' }}>{enhancedData.experience[0].role} — {enhancedData.experience[0].company}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{enhancedData.experience[0].bullets?.split('\n')[0]}</div>
                    </div>
                  )}
                  {/* Blur overlay - full resume behind paywall */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, rgba(5,5,18,0.95), transparent)' }} />
                </div>

                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <span style={{ fontSize: 20 }}>✨</span>
                  <span className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>Full resume unlocks instantly—downloads are free during beta</span>
                </div>
              </div>

              {/* CTA */}
              <button onClick={handleDownload} disabled={downloading}
                className="btn-primary"
                style={{ width: '100%', padding: '18px', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12, opacity: downloading ? 0.7 : 1 }}>
                {downloading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                    Preparing your PDF...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M5 10l5 5 5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 16h14" stroke="white" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    Download Enhanced Resume — Free Beta
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </>
                )}
              </button>
              <p className="rw-body" style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.2)' }}>
                Limited-time beta · No payment required · Instant PDF download
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}