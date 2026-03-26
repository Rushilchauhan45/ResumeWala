// ─────────────────────────────────────────────────────────────
//  ResumeWala — Vercel Serverless: /api/verify-payment
//  Creates Razorpay orders & verifies payments server-side
// ─────────────────────────────────────────────────────────────

import crypto from 'crypto'

const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const AMOUNT_PAISE        = 1900   // ₹9
const CURRENCY            = 'INR'

export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action } = req.body

  // ─────────────────────────────────────────────────────────
  //  ACTION: CREATE ORDER
  // ─────────────────────────────────────────────────────────
  if (action === 'create_order') {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      // Dev mode — return mock order
      return res.status(200).json({
        success: true,
        orderId: `order_dev_${Date.now()}`,
        amount: AMOUNT_PAISE,
        currency: CURRENCY,
        dev: true,
      })
    }

    try {
      const { email = '' } = req.body

      // Create Razorpay order via their API
      const authHeader = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

      const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: AMOUNT_PAISE,
          currency: CURRENCY,
          receipt: `rw_${Date.now()}`,
          notes: {
            platform: 'ResumeWala',
            user_email: email,
          },
        }),
      })

      if (!orderResponse.ok) {
        const err = await orderResponse.json().catch(() => ({}))
        throw new Error(err.error?.description || `Razorpay error: ${orderResponse.status}`)
      }

      const order = await orderResponse.json()

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      })

    } catch (err) {
      console.error('Create order error:', err)
      return res.status(500).json({
        success: false,
        error: err.message || 'Could not create order',
      })
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ACTION: VERIFY PAYMENT
  // ─────────────────────────────────────────────────────────
  if (action === 'verify') {
    const { orderId, paymentId, signature } = req.body

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'orderId, paymentId, signature required' })
    }

    // Dev mode — auto verify
    if (!RAZORPAY_KEY_SECRET || orderId.startsWith('order_dev_')) {
      console.warn('DEV MODE: Auto-verifying payment')
      return res.status(200).json({ verified: true, dev: true })
    }

    try {
      // Razorpay signature verification
      // signature = HMAC-SHA256(orderId + "|" + paymentId, secret)
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

      const isValid = expectedSignature === signature

      if (!isValid) {
        console.error('Signature mismatch:', { expected: expectedSignature, received: signature })
        return res.status(200).json({ verified: false, error: 'Signature mismatch' })
      }

      // ── Log successful payment (add DB here later) ──
      console.log('✅ Payment verified:', {
        orderId,
        paymentId,
        timestamp: new Date().toISOString(),
      })

      return res.status(200).json({
        verified: true,
        paymentId,
        orderId,
        timestamp: new Date().toISOString(),
      })

    } catch (err) {
      console.error('Verify payment error:', err)
      return res.status(500).json({
        verified: false,
        error: err.message || 'Verification failed',
      })
    }
  }

  // ─────────────────────────────────────────────────────────
  //  UNKNOWN ACTION
  // ─────────────────────────────────────────────────────────
  return res.status(400).json({ error: `Unknown action: ${action}` })
}