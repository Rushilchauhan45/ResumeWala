import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Payment({ user, resumeTitle, onSuccess, onClose }) {
  const [processing, setProcessing] = useState(false)

  const handlePay = async () => {
    if (processing) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1200))
    setProcessing(false)
    onSuccess?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,18,0.85)', backdropFilter: 'blur(12px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 420, background: 'rgba(13,13,34,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '30px 28px', color: 'white', fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(99,102,241,0.25), transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>PAYMENT</div>
              <div className="rw-display" style={{ fontSize: 24, letterSpacing: '-0.03em' }}>Download Enhanced Resume</div>
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: 34, height: 34, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, marginBottom: 18 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Resume</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{resumeTitle}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Requested by {user?.name || user?.email || 'ResumeWala user'}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Amount</div>
              <div className="rw-display" style={{ fontSize: 42, letterSpacing: '-0.05em', background: 'linear-gradient(135deg, #00DC82, #36E4DA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹19</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>One-time · GST inclusive</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Payment Method</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {['UPI', 'Card', 'NetBanking'].map(method => (
                  <span key={method} style={{ fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '4px 10px' }}>{method}</span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            style={{ width: '100%', padding: '15px 18px', borderRadius: 14, border: 'none', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', boxShadow: '0 6px 24px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
          >
            {processing ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} />
                Processing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.7" strokeLinecap="round" /></svg>
                Pay ₹19 & Download
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Powered by Mock Gateway · Secure & encrypted · Instant confirmation
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
