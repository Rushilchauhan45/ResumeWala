/**
 * Payment helpers are temporarily paused (free beta phase).
 * We expose no-op stubs so existing imports won't break, and
 * keep the full Razorpay implementation commented below for quick reactivation.
 */

export const PAYMENT_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
  DISMISSED: 'dismissed',
}

export const getPaymentStatusMessage = () => ''

const logDisabled = () => {
  if (import.meta.env?.DEV) {
    console.warn('[payment] Payment flow is disabled during beta. Skipping request.')
  }
}

export const initiatePayment = async () => {
  logDisabled()
  return { disabled: true }
}

export const devModePayment = initiatePayment
export const smartPay = initiatePayment

export const savePaymentRecord = () => {}
export const getPaymentHistory = () => []
export const hasUserPaid = () => true
export const clearPaymentHistory = () => {}

export default {
  initiatePayment,
  smartPay,
  devModePayment,
  hasUserPaid,
  getPaymentHistory,
  savePaymentRecord,
  PAYMENT_STATUS,
  getPaymentStatusMessage,
}

/*
// ─────────────────────────────────────────────────────────────
//  ResumeWala — Payment API
//  Razorpay integration for ₹9 resume download
// ─────────────────────────────────────────────────────────────

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''
const AMOUNT_PAISE = 1900 
const CURRENCY = 'INR'

// ─────────────────────────────────────────────────────────────
//  LOAD RAZORPAY SCRIPT DYNAMICALLY
// ─────────────────────────────────────────────────────────────
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) return resolve(true)

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// ─────────────────────────────────────────────────────────────
//  CREATE ORDER (calls our Vercel serverless API)
// ─────────────────────────────────────────────────────────────
const createOrder = async (userEmail) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_order',
        amount: AMOUNT_PAISE,
        currency: CURRENCY,
        email: userEmail,
      }),
    })

    if (!response.ok) throw new Error('Order creation failed')
    const data = await response.json()
    return data.orderId || null
  } catch (err) {
    console.error('Create order error:', err)
    // In dev mode without backend, return mock order
    return `order_dev_${Date.now()}`
  }
}

// ─────────────────────────────────────────────────────────────
//  VERIFY PAYMENT (calls our Vercel serverless API)
// ─────────────────────────────────────────────────────────────
const verifyPayment = async ({ orderId, paymentId, signature }) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        orderId,
        paymentId,
        signature,
      }),
    })

    if (!response.ok) throw new Error('Verification failed')
    const data = await response.json()
    return data.verified === true
  } catch (err) {
    console.error('Verify payment error:', err)
    // Dev mode fallback — always verify in development
    if (import.meta.env.DEV) {
      console.warn('DEV MODE: Payment auto-verified')
      return true
    }
    return false
  }
}

// ─────────────────────────────────────────────────────────────
//  MAIN: INITIATE PAYMENT
//  Opens Razorpay checkout modal
// ─────────────────────────────────────────────────────────────
export const initiatePayment = async ({
  user,
  resumeTitle = 'Resume',
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  // ── Step 1: Load Razorpay ──
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    onFailure?.('Failed to load payment gateway. Check your internet connection.')
    return
  }

  // ── Step 2: Create Order ──
  const orderId = await createOrder(user?.email || '')

  // ── Step 3: Open Razorpay Modal ──
  const options = {
    key: RAZORPAY_KEY || 'rzp_test_placeholder', // Replace with real key
    amount: AMOUNT_PAISE,
    currency: CURRENCY,
    name: 'ResumeWala',
    description: `Download: ${resumeTitle}`,
    image: '', // Add your logo URL here
    order_id: orderId,

    // Prefill user details
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.phone || '',
    },

    // Theme matching ResumeWala brand
    theme: {
      color: '#6366F1',
      backdrop_color: 'rgba(5,5,18,0.85)',
    },

    // Notes (for your records)
    notes: {
      resume_title: resumeTitle,
      user_id: user?.id || '',
      platform: 'ResumeWala',
    },

    // ── Handlers ──
    handler: async (response) => {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response

      // Verify payment server-side
      const verified = await verifyPayment({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      })

      if (verified) {
        // Save payment record to localStorage
        savePaymentRecord({
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          resumeTitle,
          amount: 19,
          timestamp: new Date().toISOString(),
        })
        onSuccess?.({ paymentId: razorpay_payment_id, orderId: razorpay_order_id })
      } else {
        onFailure?.('Payment verification failed. Please contact support.')
      }
    },

    modal: {
      ondismiss: () => {
        onDismiss?.()
      },
      confirm_close: true,
      escape: true,
    },
  }

  const rzp = new window.Razorpay(options)

  rzp.on('payment.failed', (response) => {
    console.error('Payment failed:', response.error)
    onFailure?.(response.error?.description || 'Payment failed. Please try again.')
  })

  rzp.open()
}

// ─────────────────────────────────────────────────────────────
//  DEV MODE: BYPASS PAYMENT (for testing without Razorpay)
// ─────────────────────────────────────────────────────────────
export const devModePayment = async ({ onSuccess }) => {
  console.warn('🔧 DEV MODE: Bypassing payment for testing')
  await new Promise(r => setTimeout(r, 1500))
  const mockPaymentId = `pay_dev_${Date.now()}`
  savePaymentRecord({
    orderId: `order_dev_${Date.now()}`,
    paymentId: mockPaymentId,
    resumeTitle: 'Dev Test',
    amount: 19,
    timestamp: new Date().toISOString(),
  })
  onSuccess?.({ paymentId: mockPaymentId, orderId: `order_dev_${Date.now()}` })
}

// ─────────────────────────────────────────────────────────────
//  SMART PAY: Uses dev bypass in DEV, real Razorpay in PROD
// ─────────────────────────────────────────────────────────────
export const smartPay = async (options) => {
  if (import.meta.env.DEV && !RAZORPAY_KEY) {
    return devModePayment(options)
  }
  return initiatePayment(options)
}

// ─────────────────────────────────────────────────────────────
//  PAYMENT RECORD HELPERS (localStorage)
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'rw_payments'

export const savePaymentRecord = (record) => {
  try {
    const existing = getPaymentHistory()
    existing.push(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch (err) {
    console.error('Save payment record error:', err)
  }
}

export const getPaymentHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const hasUserPaid = (resumeTitle = '') => {
  try {
    const history = getPaymentHistory()
    if (!resumeTitle) return history.length > 0
    return history.some(p => p.resumeTitle === resumeTitle)
  } catch {
    return false
  }
}

export const clearPaymentHistory = () => {
  localStorage.removeItem(STORAGE_KEY)
}

// ─────────────────────────────────────────────────────────────
//  PAYMENT STATUS DISPLAY HELPERS
// ─────────────────────────────────────────────────────────────
export const PAYMENT_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
  DISMISSED: 'dismissed',
}

export const getPaymentStatusMessage = (status) => {
  const messages = {
    idle: '',
    loading: 'Opening payment gateway...',
    success: '✅ Payment successful! Preparing your download...',
    failed: '❌ Payment failed. Please try again.',
    dismissed: 'Payment cancelled. Your resume is still saved.',
  }
  return messages[status] || ''
}

export default {
  initiatePayment,
  smartPay,
  devModePayment,
  hasUserPaid,
  getPaymentHistory,
  savePaymentRecord,
  PAYMENT_STATUS,
  getPaymentStatusMessage,
}

*/