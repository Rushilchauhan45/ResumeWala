// ─────────────────────────────────────────────────────────────
//  ResumeWala — Vercel Serverless: /api/generate-pdf
//  Compiles LaTeX → PDF using latex.codecogs.com or similar
//  NOTE: For production, use latexonline.cc or self-hosted LaTeX
// ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { latexCode, fileName = 'resume' } = req.body

    if (!latexCode) {
      return res.status(400).json({ error: 'latexCode is required' })
    }

    // ── Strategy 1: latexonline.cc (free, no signup) ──
    // Encode LaTeX and send to external compiler
    const encoded = encodeURIComponent(latexCode)
    const compilerUrl = `https://latexonline.cc/compile?text=${encoded}&command=pdflatex`

    const pdfResponse = await fetch(compilerUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' },
      timeout: 30000,
    })

    if (pdfResponse.ok && pdfResponse.headers.get('content-type')?.includes('pdf')) {
      const pdfBuffer = await pdfResponse.arrayBuffer()

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`)
      res.setHeader('Content-Length', pdfBuffer.byteLength)

      return res.status(200).send(Buffer.from(pdfBuffer))
    }

    // ── Strategy 2: Return LaTeX code for client-side handling ──
    // If external compiler fails, return the LaTeX so client
    // can use an alternative method
    return res.status(200).json({
      success: false,
      fallback: true,
      latexCode,
      message: 'External LaTeX compiler unavailable. Use fallback PDF generation.',
    })

  } catch (err) {
    console.error('generate-pdf error:', err)

    // Always return something useful
    return res.status(200).json({
      success: false,
      fallback: true,
      message: err.message || 'PDF generation failed',
    })
  }
}
