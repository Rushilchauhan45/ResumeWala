import { generateFAANGTemplate } from './latexTemplates'

const triggerDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export const downloadResumePdf = async ({
  resumeData,
  fileName = 'ResumeWala-Resume',
}) => {
  if (!resumeData) {
    return { success: false, error: 'Missing resume data' }
  }

  const latexCode = generateFAANGTemplate(resumeData)

  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latexCode, fileName }),
    })

    const contentType = response.headers.get('content-type') || ''

    if (response.ok && contentType.includes('application/pdf')) {
      const blob = await response.blob()
      triggerDownload(blob, `${fileName}.pdf`)
      return { success: true, format: 'pdf' }
    }

    const payload = await response.json().catch(() => ({}))

    if (payload.fallback) {
      // Download the LaTeX source so the user can compile manually
      triggerDownload(new Blob([latexCode], { type: 'text/plain' }), `${fileName}.tex`)
      return {
        success: false,
        fallback: true,
        message: payload.message || 'PDF service unavailable. Downloaded LaTeX file instead.',
      }
    }

    throw new Error(payload.error || 'PDF generation failed')
  } catch (err) {
    console.error('downloadResumePdf error:', err)
    return {
      success: false,
      error: err.message || 'Unable to download resume',
    }
  }
}

export default downloadResumePdf
