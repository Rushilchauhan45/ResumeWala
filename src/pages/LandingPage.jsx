import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useInView } from 'framer-motion'

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
const Counter = ({ end, suffix = '', prefix = '', decimals = 0 }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const duration = 2200
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const p = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - p, 4)
          setVal(+(eased * end).toFixed(decimals))
          if (p < 1) requestAnimationFrame(tick)
          else setVal(end)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, decimals])
  return <span ref={ref}>{prefix}{typeof val === 'number' ? val.toLocaleString() : val}{suffix}</span>
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────── */
const MagneticBtn = ({ children, onClick, className, style }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  const reset = () => { x.set(0); y.set(0) }
  return (
    <motion.button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={reset}
      onClick={onClick} style={{ x, y, ...style }} className={className} whileTap={{ scale: 0.97 }}>
      {children}
    </motion.button>
  )
}

/* ─────────────────────────────────────────
   ATS SCORE RING
───────────────────────────────────────── */
const ATSRing = ({ score = 96, size = 140 }) => {
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const progress = useSpring(0, { stiffness: 55, damping: 18 })
  useEffect(() => {
    if (inView) setTimeout(() => progress.set(score / 100), 500)
  }, [inView, score, progress])
  const dashOffset = useTransform(progress, p => circ * (1 - p))
  return (
    <div ref={ref} style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ} style={{ strokeDashoffset: dashOffset }}/>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00DC82"/>
            <stop offset="100%" stopColor="#36E4DA"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.21, fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.03em' }}>{score}%</span>
        <span style={{ fontSize: size * 0.085, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginTop: 3, fontWeight: 600 }}>ATS</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 60], ['rgba(5,5,18,0)', 'rgba(5,5,18,0.96)'])
  const navBorder = useTransform(scrollY, [0, 60], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.07)'])

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'results', label: 'Results' },
    { id: 'pricing', label: 'Pricing' },
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.4 }
    )
    navLinks.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const features = [
    { icon: '🎯', tag: 'ATS Optimization', title: '94–97% ATS Score. Guaranteed.', body: 'Every resume engineered to pass the exact ATS filters at Google, Amazon, Microsoft, and 500+ Indian companies. Not guesswork — proven science.', accent: '#00DC82', glow: 'rgba(0,220,130,0.1)' },
    { icon: '⚡', tag: 'Groq AI Engine', title: 'World\'s Fastest AI Rewrites Everything', body: 'Industry-specific power verbs, quantified achievements, and recruiter-magnet keywords — all automatically generated in under 60 seconds.', accent: '#818CF8', glow: 'rgba(129,140,248,0.1)' },
    { icon: '📐', tag: 'LaTeX Precision', title: 'The Format IITians & NITians Use', body: 'LaTeX-rendered, pixel-perfect PDFs. The same clean, scannable format that top candidates use to get into FAANG companies globally.', accent: '#F59E0B', glow: 'rgba(245,158,11,0.1)' },
    { icon: '🏆', tag: 'FAANG Templates', title: 'Designed from 10,000+ Hired Resumes', body: 'We studied successful resumes from Google, Meta, Amazon, Flipkart & Razorpay hires. Every template is a distillation of what actually works.', accent: '#F43F5E', glow: 'rgba(244,63,94,0.1)' },
    { icon: '⏱️', tag: '60-Second Build', title: 'Faster Than Writing Your Name', body: 'Upload your old resume → AI scans → AI rewrites → Professional PDF ready. The whole process takes less time than making chai.', accent: '#06B6D4', glow: 'rgba(6,182,212,0.1)' },
    { icon: '💎', tag: 'Transparent Pricing', title: 'Less Than a Samosa. Seriously.', body: 'No subscription. No trial. No upsells. Build free, preview free, pay ₹19 only when you download. We succeed only when you get hired.', accent: '#10B981', glow: 'rgba(16,185,129,0.1)' },
  ]

  const steps = [
    { num: '01', title: 'Sign Up in 15 Seconds', body: 'Email + password. No credit card. No verification loops. You are in immediately.', accent: '#6366F1' },
    { num: '02', title: 'Upload or Build Fresh', body: 'Drop your old resume OR fill our guided 5-section smart form. Both paths take under 3 minutes.', accent: '#8B5CF6' },
    { num: '03', title: 'Groq AI Enhances Everything', body: 'Keywords, formatting, bullet points, impact statements — AI rewrites every single line with precision.', accent: '#06B6D4' },
    { num: '04', title: 'Live ATS Score Reveal', body: 'Watch your score jump in real-time. See exactly what changed. Before vs after — completely transparent.', accent: '#00DC82' },
    { num: '05', title: 'Preview Free. Pay ₹19. Download.', body: 'See the complete final resume before paying a single rupee. Zero risk. Pay only when you love it.', accent: '#F59E0B' },
  ]

  const testimonials = [
    { name: 'Rahul Mehta', role: 'SDE-2 at Amazon', before: 29, after: 97, quote: '6 mahine se rejections aa rahi thi. ResumeWala ne ek din mein sab badal diya. Amazon offer aaya aur main roya.', initials: 'RM', color: '#FF9900' },
    { name: 'Priya Iyer', role: 'Software Engineer, Google', before: 31, after: 95, quote: 'Fresher thi, kuch samajh nahi aata tha. ₹19 mein itna powerful resume? This is genuinely unreal. Google interview aya.', initials: 'PI', color: '#4285F4' },
    { name: 'Karan Sharma', role: 'Data Analyst, Microsoft', before: 44, after: 96, quote: 'Tried Zety, Novoresume, Resume.io — nothing worked. One upload here and Microsoft shortlisted me in 4 days.', initials: 'KS', color: '#00A4EF' },
    { name: 'Ananya Das', role: 'Product Manager, Razorpay', before: 38, after: 94, quote: 'Non-tech background entering product. The AI understood context I never even wrote. Genuinely shocked by the output.', initials: 'AD', color: '#2D9CDB' },
    { name: 'Sneha Kulkarni', role: 'UX Designer, Swiggy', before: 37, after: 93, quote: 'Food-tech portfolio ko kaise polish karu yeh samajh nahi aa raha tha. ResumeWala ne meri case studies ko aise rephrase kiya ki Swiggy design panel seedha shortlist kar gaya.', initials: 'SK', color: '#FF6B6B' },
    { name: 'Mohammed Faizal', role: 'Cloud Architect, Flipkart', before: 46, after: 98, quote: 'Infra projects ko quantify karna impossible lagta tha. Yeh tool ne har bullet ko numbers se fill kar diya. Flipkart ne pehle hi round mein hire kar liya.', initials: 'MF', color: '#F97316' },
    { name: 'Neha Thomas', role: 'Product Marketing, Freshworks', before: 41, after: 95, quote: 'Marketing ke liye story telling sab kuch hota hai. Groq AI ne meri GTM wins ko itna crisp banaya ki hiring manager ne call par hi compliment diya.', initials: 'NT', color: '#EC4899' },
    { name: 'Rohan Patel', role: 'Data Scientist, Paytm', before: 34, after: 96, quote: 'Mera resume pehle Excel report jaisa lagta tha. ResumeWala ne models + impact ko highlight kiya aur Paytm Labs ne bina referrals ke shortlist kar diya.', initials: 'RP', color: '#3B82F6' },
    { name: 'Ishita Verma', role: 'Business Analyst, McKinsey', before: 52, after: 97, quote: 'Consulting ke liye frameworks aur numbers zaroori hote hain. Yeh platform ne mere NGO work ko bhi ROI language mein convert kar diya. Final round crack ho gaya.', initials: 'IV', color: '#0EA5E9' },
    { name: 'Devansh Gupta', role: 'Hardware Engineer, Nvidia', before: 33, after: 92, quote: 'ECE projects ko English mein explain karna mere liye struggle tha. AI rewrites ne meri VLSI internship ko Hollywood trailer bana diya. Nvidia offer secure.', initials: 'DG', color: '#22C55E' },
  ]

  const totalTestimonials = testimonials.length
  const activeTestimonial = testimonials[testimonialIndex]
  const handlePrevTestimonial = () => setTestimonialIndex(i => (i - 1 + totalTestimonials) % totalTestimonials)
  const handleNextTestimonial = () => setTestimonialIndex(i => (i + 1) % totalTestimonials)

  return (
    <div style={{ background: '#050512', color: 'white', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #6366F1, #00DC82); border-radius: 10px; }

        .rw-display { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.04em; }
        .rw-body { font-family: 'Plus Jakarta Sans', sans-serif; }

        .grad-text { background: linear-gradient(135deg, #C7D2FE 0%, #818CF8 35%, #00DC82 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-green { background: linear-gradient(135deg, #00DC82, #36E4DA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-warm { background: linear-gradient(135deg, #F59E0B, #F97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* Nav */
        .rw-nav-pill { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px); border-radius: 16px; display: flex; align-items: center; padding: 5px; gap: 1px; }
        .rw-nav-link { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4); cursor: pointer; padding: 7px 15px; border-radius: 10px; transition: all 0.2s; border: none; background: transparent; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em; position: relative; }
        .rw-nav-link:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.06); }
        .rw-nav-link.active { color: white; background: rgba(99,102,241,0.18); }

        /* Buttons */
        .btn-p { background: linear-gradient(135deg, #6366F1, #4F46E5); border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 700; color: white; border-radius: 13px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 4px 20px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.12); letter-spacing: -0.02em; position: relative; overflow: hidden; }
        .btn-p::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.12), transparent); opacity:0; transition:opacity 0.3s; }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(99,102,241,0.55), 0 0 0 1px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15); }
        .btn-p:hover::after { opacity: 1; }
        .btn-g { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: rgba(255,255,255,0.65); border-radius: 13px; transition: all 0.25s; }
        .btn-g:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: white; transform: translateY(-1px); }

        /* Cards */
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
        .feat-card:hover { transform: translateY(-8px) scale(1.01); border-color: rgba(255,255,255,0.13); background: rgba(255,255,255,0.04); }
        .testi-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 22px; transition: all 0.3s ease; }
        .testi-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .testi-carousel { position: relative; padding: 52px 48px 72px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.06); background: radial-gradient(circle at top, rgba(255,255,255,0.06), rgba(5,5,18,0.8)); overflow: hidden; }
        .testi-carousel::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 20% 0%, rgba(99,102,241,0.15), transparent 55%); opacity: 0.4; }
        .testi-carousel-inner { position: relative; max-width: 720px; margin: 0 auto; min-height: 320px; }
        .testi-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); background: rgba(5,5,18,0.6); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s; z-index: 2; backdrop-filter: blur(12px); }
        .testi-arrow:hover { border-color: rgba(255,255,255,0.3); background: rgba(99,102,241,0.2); color: white; }
        .testi-arrow.left { left: 18px; }
        .testi-arrow.right { right: 18px; }
        .testi-meta { margin-top: 36px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 18px; }
        .testi-count { font-size: 13px; letter-spacing: 0.2em; color: rgba(255,255,255,0.35); text-transform: uppercase; font-weight: 700; }
        .testi-pagination { display: flex; gap: 10px; }
        .testi-dot { width: 32px; height: 6px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); cursor: pointer; transition: all 0.25s; }
        .testi-dot.active { background: linear-gradient(135deg, #00DC82, #36E4DA); border-color: transparent; width: 48px; }

        /* Pill label */
        .section-pill { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Grid overlay */
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 80px 80px; }

        /* Marquee */
        @keyframes rw-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .rw-marquee { animation: rw-marquee 30s linear infinite; }
        .rw-marquee:hover { animation-play-state: paused; }

        /* Noise */
        .rw-noise { position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: 0.015; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }

        /* Step connector line */
        .step-connector { position: absolute; left: 25px; top: 56px; bottom: -16px; width: 1px; background: linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(0,220,130,0.15), transparent); }

        /* Responsive */
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .hero-h1 { font-size: 44px !important; }
          .hero-sub { font-size: 16px !important; }
          .hero-ctas { flex-direction: column !important; align-items: center !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .steps-max { max-width: 100% !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
          .testi-carousel { padding: 32px 24px 64px !important; }
          .testi-arrow { display: none !important; }
          .testi-carousel-inner { min-height: unset !important; }
          .pricing-inner { padding: 32px 24px !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
          .score-compare { grid-template-columns: 1fr !important; }
          .score-arrow { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .hero-h1 { font-size: 62px !important; }
          .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .testi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div className="rw-noise" />

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <motion.header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '10px 0', backgroundColor: navBg, borderBottomColor: navBorder, borderBottomWidth: 1, borderBottomStyle: 'solid', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <motion.div onClick={() => scrollTo('home')} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 40, height: 40, filter: 'drop-shadow(0 0 14px rgba(99,102,241,0.65))' }}>
              <svg width="40" height="40" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="12" fill="url(#lg1)"/>
                <rect width="42" height="42" rx="12" fill="rgba(0,0,0,0.15)"/>
                <rect x="10" y="8" width="16" height="20" rx="3" fill="rgba(255,255,255,0.93)"/>
                <rect x="13" y="13" width="10" height="1.5" rx="0.75" fill="#6366F1" opacity="0.7"/>
                <rect x="13" y="16.5" width="10" height="1.5" rx="0.75" fill="#6366F1" opacity="0.5"/>
                <rect x="13" y="20" width="6" height="1.5" rx="0.75" fill="#6366F1" opacity="0.3"/>
                <circle cx="28" cy="28" r="9.5" fill="#050512"/>
                <circle cx="28" cy="28" r="8" fill="url(#lg2)"/>
                <path d="M24.5 28l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4338CA"/></linearGradient>
                  <linearGradient id="lg2" x1="20" y1="20" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#00DC82"/><stop offset="1" stopColor="#059669"/></linearGradient>
                </defs>
              </svg>
            </div>
            <div style={{ lineHeight: 1 }}>
              <div className="rw-display" style={{ fontSize: 20, background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.65))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Resume<span style={{ background: 'linear-gradient(135deg, #A5B4FC, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wala</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', fontWeight: 700, marginTop: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI RESUME PLATFORM</div>
            </div>
          </motion.div>

          {/* Desktop Nav — Terminal Shape */}
          <motion.nav className="rw-nav-pill hide-mobile" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {/* Terminal dots */}
            <div style={{ display: 'flex', gap: 4.5, padding: '2px 10px', marginRight: 6, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.65 }}/>
              ))}
            </div>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className={`rw-nav-link ${activeSection === l.id ? 'active' : ''}`}>{l.label}</button>
            ))}
          </motion.nav>

          {/* Right buttons */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => navigate('/auth')} className="btn-g hide-mobile" style={{ padding: '9px 18px', fontSize: 13.5 }}>Login</button>
            <button onClick={() => navigate('/auth?mode=signup')} className="btn-p" style={{ padding: '10px 22px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              Start Free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 4l3.5 3L8 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {/* Mobile hamburger */}
            <button className="show-mobile btn-g" onClick={() => setMenuOpen(m => !m)} style={{ padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {menuOpen
                  ? <path d="M4 4l10 10M14 4L4 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  : <><path d="M3 6h12M3 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              style={{ background: 'rgba(5,5,18,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '10px 20px 20px' }}>
              {navLinks.map(l => (
                <div key={l.id} onClick={() => scrollTo(l.id)} className="rw-body"
                  style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 15, fontWeight: 600, color: activeSection === l.id ? 'white' : 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>
                  {l.label}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => navigate('/auth')} className="btn-g" style={{ flex: 1, padding: '12px', fontSize: 14 }}>Login</button>
                <button onClick={() => navigate('/auth?mode=signup')} className="btn-p" style={{ flex: 2, padding: '12px', fontSize: 14 }}>Get Started Free</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="home" className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 100, position: 'relative', overflow: 'hidden' }}>

        {/* Ambient blobs */}
        {[
          { top: '8%', left: '4%', w: 580, color: 'rgba(99,102,241,0.13)', delay: 0 },
          { top: '25%', right: '3%', w: 460, color: 'rgba(0,220,130,0.09)', delay: 2 },
          { bottom: '8%', left: '32%', w: 380, color: 'rgba(6,182,212,0.07)', delay: 4 },
        ].map((b, i) => (
          <motion.div key={i} animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
            style={{ position: 'absolute', top: b.top, left: b.left, right: b.right, bottom: b.bottom, width: b.w, height: b.w, borderRadius: '50%', background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1060, margin: '0 auto', padding: '56px 24px 80px', textAlign: 'center' }}>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 100, padding: '7px 18px 7px 7px', marginBottom: 32, backdropFilter: 'blur(16px)' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', borderRadius: 100, padding: '3px 10px', fontSize: 10.5, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>NEW</div>
            <span className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Groq AI · 94–97% ATS Score · Only ₹19</span>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rw-display hero-h1" style={{ fontSize: 82, lineHeight: 1.02, marginBottom: 26 }}>
            Your Resume Is
            <br />
            <span className="grad-text">Blocking Your</span>
            <br />
            Dream Job
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="rw-body hero-sub" style={{ fontSize: 18.5, color: 'rgba(255,255,255,0.48)', maxWidth: 600, margin: '0 auto 44px', lineHeight: 1.75, fontWeight: 400 }}>
            Students aur freshers ke liye India ka most powerful AI resume builder. Upload karo,{' '}
            <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 700 }}>94–97% ATS score guaranteed</span>,
            download for just <span className="grad-warm" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>₹19</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.45 }}
            className="hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 68 }}>
            <MagneticBtn onClick={() => navigate('/auth?mode=signup')} className="btn-p"
              style={{ padding: '17px 38px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M4 8l5 5 5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="white" strokeWidth="1.7" strokeLinecap="round"/></svg>
              Build My Resume — Free
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M9 4.5l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </MagneticBtn>
            <button onClick={() => scrollTo('results')} className="btn-g"
              style={{ padding: '17px 32px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 9 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" strokeLinecap="round"/></svg>
              See Real Results
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.55 }}
            className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 780, margin: '0 auto' }}>
            {[
              { value: 12847, suffix: '+', label: 'Resumes Built', icon: '📄', color: '#818CF8' },
              { value: 8392, suffix: '+', label: 'Users Hired', icon: '🎯', color: '#00DC82' },
              { value: 96, suffix: '%', label: 'Avg ATS Score', icon: '⚡', color: '#F59E0B' },
              { value: 19, prefix: '₹', suffix: '', label: 'One-time Price', icon: '💎', color: '#F43F5E' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '18px 10px', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div className="rw-display" style={{ fontSize: 28, color: s.color, lineHeight: 1, marginBottom: 5 }}>
                  <Counter end={s.value} suffix={s.suffix} prefix={s.prefix || ''} />
                </div>
                <div className="rw-body" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', fontWeight: 600, letterSpacing: '0.02em' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, #050512, transparent)', pointerEvents: 'none' }} />
      </section>

      {/* ══════════════════ MARQUEE ══════════════════ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '20px 0', overflow: 'hidden', background: 'rgba(255,255,255,0.007)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="rw-body" style={{ flexShrink: 0, padding: '0 28px', fontSize: 10.5, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.06)', marginRight: 36 }}>Trusted by users at</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="rw-marquee" style={{ display: 'flex', gap: 60, width: 'max-content', alignItems: 'center' }}>
              {[...Array(2)].flatMap(() => ['Google','Microsoft','Amazon','Meta','Flipkart','Razorpay','CRED','Swiggy','PhonePe','Zepto','Infosys','Wipro','Zomato','Paytm']).map((c, i) => (
                <span key={i} className="rw-display" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.13)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section id="how-it-works" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 80 }}>
            <div className="section-pill" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#A5B4FC', marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v4l2.5 2.5" stroke="#A5B4FC" strokeWidth="1.3" strokeLinecap="round"/></svg>
              How It Works
            </div>
            <h2 className="rw-display" style={{ fontSize: 'clamp(34px,5vw,58px)', marginBottom: 16, lineHeight: 1.04 }}>
              5 Steps to Your<br /><span className="grad-text">Dream Job Interview</span>
            </h2>
            <p className="rw-body" style={{ color: 'rgba(255,255,255,0.38)', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Itna simple hai — pehli baar mein hi perfect resume ban jaata hai</p>
          </motion.div>

          <div className="steps-max" style={{ maxWidth: 660, margin: '0 auto' }}>
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', gap: 22, padding: '26px 0', position: 'relative' }}>
                {i < steps.length - 1 && <div className="step-connector" />}
                <div style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 15, background: `${s.accent}18`, border: `1px solid ${s.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' }}>
                  <span className="rw-display" style={{ fontSize: 15, color: s.accent }}>{s.num}</span>
                </div>
                <div style={{ paddingTop: 6, flex: 1 }}>
                  <h3 className="rw-display" style={{ fontSize: 19.5, marginBottom: 8, letterSpacing: '-0.035em' }}>{s.title}</h3>
                  <p className="rw-body" style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.72 }}>{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section id="features" style={{ padding: '80px 24px 120px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.007)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-pill" style={{ background: 'rgba(0,220,130,0.07)', border: '1px solid rgba(0,220,130,0.2)', color: '#34D399', marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="#34D399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Platform Features
            </div>
            <h2 className="rw-display" style={{ fontSize: 'clamp(34px,5vw,58px)', marginBottom: 16, lineHeight: 1.04 }}>
              Why <span className="grad-text">ResumeWala</span> Wins<br />Against Every Competitor
            </h2>
            <p className="rw-body" style={{ color: 'rgba(255,255,255,0.38)', fontSize: 17, maxWidth: 460, margin: '0 auto' }}>Built from ground up for the Indian job market — by people who were rejected too.</p>
          </motion.div>

          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="feat-card" onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)}
                style={{ padding: '30px 28px' }}>
                <AnimatePresence>
                  {hoveredCard === i && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 25% 25%, ${f.glow}, transparent 65%)`, pointerEvents: 'none', borderRadius: 22 }} />
                  )}
                </AnimatePresence>
                <div style={{ fontSize: 28, marginBottom: 18, display: 'inline-flex', width: 54, height: 54, background: f.glow, border: `1px solid ${f.accent}20`, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                <div className="rw-body" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: f.accent, textTransform: 'uppercase', marginBottom: 10 }}>{f.tag}</div>
                <h3 className="rw-display" style={{ fontSize: 18.5, marginBottom: 12, lineHeight: 1.25 }}>{f.title}</h3>
                <p className="rw-body" style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ RESULTS / BEFORE-AFTER ══════════════════ */}
      <section id="results" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-pill" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)', color: '#FB7185', marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1l1.5 3.5H10l-3 2 1 3.5L5 8 1.5 10l1-3.5L0 4.5h3.5L5 1z" fill="#FB7185" opacity="0.8"/></svg>
              Real Results
            </div>
            <h2 className="rw-display" style={{ fontSize: 'clamp(34px,5vw,58px)', marginBottom: 16, lineHeight: 1.04 }}>
              Watch Your ATS Score<br /><span className="grad-green">Explode In Real-Time</span>
            </h2>
            <p className="rw-body" style={{ color: 'rgba(255,255,255,0.38)', fontSize: 17 }}>Average improvement: <strong style={{ color: 'white', fontWeight: 700 }}>+62 percentage points</strong></p>
          </motion.div>

          <div className="score-compare" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', maxWidth: 880, margin: '0 auto' }}>
            {/* Before */}
            <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.14)', borderRadius: 24, padding: '36px 28px', textAlign: 'center' }}>
              <div className="rw-body" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#F87171', textTransform: 'uppercase', marginBottom: 24 }}>✗ Before ResumeWala</div>
              <ATSRing score={32} size={130} />
              <div style={{ marginTop: 24 }}>
                {['No relevant keywords','Poor formatting','Weak bullet points','Missing skills section','No quantified impact'].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6" fill="rgba(239,68,68,0.15)"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#F87171" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    <span className="rw-body" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.38)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div className="score-arrow" animate={{ x: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '16px 14px' }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M5 13h16M15 7l6 6-6 6" stroke="url(#arrG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="arrG" x1="5" y1="13" x2="21" y2="13" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#00DC82"/></linearGradient></defs></svg>
            </motion.div>

            {/* After */}
            <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              style={{ background: 'rgba(0,220,130,0.04)', border: '1px solid rgba(0,220,130,0.14)', borderRadius: 24, padding: '36px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #00DC82, #36E4DA)' }} />
              <div className="rw-body" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#34D399', textTransform: 'uppercase', marginBottom: 24 }}>✓ After ResumeWala</div>
              <ATSRing score={97} size={130} />
              <div style={{ marginTop: 24 }}>
                {['ATS-optimized keywords','LaTeX perfect format','Quantified achievements','Complete skills matrix','FAANG-ready structure'].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6" fill="rgba(0,220,130,0.15)"/><path d="M5.5 8l2 2 3-3" stroke="#34D399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="rw-body" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section style={{ padding: '80px 24px 120px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.007)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-pill" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#FCD34D', marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="#FCD34D" opacity="0.8"><path d="M5 1l1.2 3.2H9.5L6.4 6.4l1.1 3.3L5 7.8 2.5 9.7l1.1-3.3L.5 4.2h3.3L5 1z"/></svg>
              Success Stories
            </div>
            <h2 className="rw-display" style={{ fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.04 }}>
              Real People. <span className="grad-green">Real Offers.</span>
            </h2>
          </motion.div>

          <div className="testi-carousel">
            <button type="button" className="testi-arrow left" onClick={handlePrevTestimonial} aria-label="Previous testimonial">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4l-5 5 5 5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" className="testi-arrow right" onClick={handleNextTestimonial} aria-label="Next testimonial">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="testi-carousel-inner">
              <AnimatePresence mode="wait">
                {activeTestimonial && (
                  <motion.div key={activeTestimonial.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="testi-card"
                    style={{ padding: '34px 36px', position: 'relative', overflow: 'hidden', minHeight: 320 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${activeTestimonial.color}99, transparent)` }} />
                    <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
                      {Array(5).fill(0).map((_, j) => (
                        <svg key={j} width="14" height="14" viewBox="0 0 12 12" fill="#FBBF24"><path d="M6 1l1.2 3.2H10L7.4 6.4l.9 3.3L6 7.8 3.7 9.7l.9-3.3L2 4.2h2.8L6 1z"/></svg>
                      ))}
                    </div>
                    <p className="rw-body" style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9, marginBottom: 24, fontStyle: 'italic' }}>&ldquo;{activeTestimonial.quote}&rdquo;</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
                      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 999, padding: '6px 16px', fontSize: 13, color: '#F87171', fontWeight: 700 }}>Before {activeTestimonial.before}%</div>
                      <div style={{ background: 'rgba(0,220,130,0.08)', border: '1px solid rgba(0,220,130,0.2)', borderRadius: 999, padding: '6px 16px', fontSize: 13, color: '#34D399', fontWeight: 700 }}>After {activeTestimonial.after}%</div>
                      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999, padding: '6px 16px', fontSize: 13, color: '#A5B4FC', fontWeight: 700 }}>+{activeTestimonial.after - activeTestimonial.before} pts</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 18 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${activeTestimonial.color}18`, border: `1px solid ${activeTestimonial.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: activeTestimonial.color }}>{activeTestimonial.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div className="rw-display" style={{ fontSize: 18, letterSpacing: '-0.03em' }}>{activeTestimonial.name}</div>
                        <div className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{activeTestimonial.role}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="rw-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>ATS Score</div>
                        <div className="rw-display" style={{ fontSize: 24, background: 'linear-gradient(135deg, #00DC82, #36E4DA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{activeTestimonial.after}%</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="testi-meta">
              <div className="testi-count">{String(testimonialIndex + 1).padStart(2, '0')} / {String(totalTestimonials).padStart(2, '0')}</div>
              <div className="testi-pagination">
                {testimonials.map((_, idx) => (
                  <button key={idx} type="button" aria-label={`Show testimonial ${idx + 1}`}
                    className={`testi-dot ${idx === testimonialIndex ? 'active' : ''}`}
                    onClick={() => setTestimonialIndex(idx)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section id="pricing" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 52 }}>
            <div className="section-pill" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#A5B4FC', marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1l1.2 3.2H9.5L6.4 6.4l1.1 3.3L5 7.8 2.5 9.7l1.1-3.3L.5 4.2h3.3L5 1z" stroke="#A5B4FC" strokeWidth="0.5" fill="none"/></svg>
              Simple Pricing
            </div>
            <h2 className="rw-display" style={{ fontSize: 'clamp(34px,5vw,58px)', marginBottom: 16, lineHeight: 1.04 }}>
              Less Than a Samosa.<br /><span className="grad-warm">₹19. Period.</span>
            </h2>
            <p className="rw-body" style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>No subscription. No trial. Build free, preview free, pay ₹19 only when you download your final PDF.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 36, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="pricing-inner"
            style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(0,220,130,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 28, padding: '56px 52px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,130,0.15), transparent)', filter: 'blur(35px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(0,220,130,0.09)', border: '1px solid rgba(0,220,130,0.2)', padding: '6px 16px', borderRadius: 100, fontSize: 12.5, color: '#34D399', marginBottom: 28, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00DC82' }} />
                No subscription · Pay once at download
              </div>

              <div style={{ marginBottom: 10 }}>
                <span className="rw-display" style={{ fontSize: 108, lineHeight: 1, background: 'linear-gradient(135deg, #00DC82, #36E4DA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.05em' }}>₹19</span>
              </div>
              <p className="rw-body" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, marginBottom: 40 }}>One-time · Per resume download · No tricks, ever</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9, marginBottom: 44 }}>
                {['✅ 94–97% ATS Score','✅ Groq AI Enhanced','✅ LaTeX PDF Format','✅ FAANG-Ready Template','✅ Instant Download','✅ Preview Before Paying','✅ Works for Freshers','✅ No Subscription Ever'].map((item, i) => (
                  <div key={i} className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', background: 'rgba(255,255,255,0.04)', padding: '7px 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.07)', fontWeight: 500 }}>
                    {item}
                  </div>
                ))}
              </div>

              <MagneticBtn onClick={() => navigate('/auth?mode=signup')} className="btn-p"
                style={{ padding: '18px 52px', fontSize: 17, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M5 10l5 5 5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16h14" stroke="white" strokeWidth="1.7" strokeLinecap="round"/></svg>
                Start Building — It's Free
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M9 4.5l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </MagneticBtn>
              <p className="rw-body" style={{ color: 'rgba(255,255,255,0.17)', fontSize: 12.5, marginTop: 16 }}>No credit card needed · Preview 100% free · Pay ₹19 only at download</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <section style={{ padding: '40px 24px 100px' }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 860, margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(0,220,130,0.07))', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 24, padding: '52px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 90% at 50% 50%, rgba(99,102,241,0.07), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h2 className="rw-display" style={{ fontSize: 'clamp(26px,4vw,46px)', marginBottom: 14, lineHeight: 1.08 }}>
              Stop Getting Filtered Out.<br /><span className="grad-text">Start Getting Interviews.</span>
            </h2>
            <p className="rw-body" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
              12,847 resumes built · 8,392 users hired · One platform · ₹19
            </p>
            <button onClick={() => navigate('/auth?mode=signup')} className="btn-p"
              style={{ padding: '16px 42px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Build My Resume Now — Free
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M9 4.5l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          <div className="footer-inner" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="11" fill="url(#flg1)"/>
                <rect x="10" y="8" width="16" height="20" rx="3" fill="rgba(255,255,255,0.9)"/>
                <rect x="13" y="13" width="10" height="1.5" rx="0.75" fill="#6366F1" opacity="0.7"/>
                <rect x="13" y="16.5" width="10" height="1.5" rx="0.75" fill="#6366F1" opacity="0.5"/>
                <rect x="13" y="20" width="6" height="1.5" rx="0.75" fill="#6366F1" opacity="0.3"/>
                <circle cx="28" cy="28" r="9.5" fill="#050512"/>
                <circle cx="28" cy="28" r="7.5" fill="url(#flg2)"/>
                <path d="M24.5 28l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="flg1" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4338CA"/></linearGradient>
                  <linearGradient id="flg2" x1="20" y1="20" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#00DC82"/><stop offset="1" stopColor="#059669"/></linearGradient>
                </defs>
              </svg>
              <div>
                <div className="rw-display" style={{ fontSize: 16, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, white, rgba(255,255,255,0.55))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Resume<span style={{ background: 'linear-gradient(135deg, #A5B4FC, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wala</span>
                </div>
                <div className="rw-body" style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', fontWeight: 700 }}>AI RESUME PLATFORM</div>
              </div>
            </div>

            {/* Footer nav */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="rw-nav-link" style={{ border: 'none', background: 'transparent', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l.label}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 18 }}>
              {['Privacy','Terms','Contact'].map(l => (
                <span key={l} className="rw-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500 }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.22)'}>{l}</span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 22, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p className="rw-body" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.18)' }}>© 2025 ResumeWala Technologies Pvt. Ltd. · Made with ❤️ for India's future workforce.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#00DC82' }} />
              <span className="rw-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}