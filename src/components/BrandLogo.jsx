import { useId, useMemo } from 'react'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export default function BrandLogo({
  size = 60,
  variant = 'full', // 'full' | 'stacked' | 'mark'
  tagline = false,
  taglineText = 'AI RESUME PLATFORM',
  glow = true,
  align = 'center',
  className,
  style,
  onClick,
}) {
  const id = useId()
  const ids = useMemo(() => ({
    bg: `${id}-bg`,
    rim: `${id}-rim`,
    aurora: `${id}-aurora`,
    ribbon: `${id}-ribbon`,
    ribbonLight: `${id}-ribbonLight`,
    tail: `${id}-tail`,
    tailHighlight: `${id}-tailHighlight`,
    spark: `${id}-spark`,
    shadow: `${id}-shadow`,
  }), [id])

  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={ids.bg} x1="10" y1="6" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#080C1F" />
          <stop offset="0.45" stopColor="#160F3A" />
          <stop offset="1" stopColor="#2B0F4C" />
        </linearGradient>
        <radialGradient id={ids.rim} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 40) scale(40)">
          <stop stopColor="#6EE7B7" stopOpacity="0.35" />
          <stop offset="1" stopColor="#111827" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.aurora} x1="18" y1="14" x2="78" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A5B4FC" stopOpacity="0.65" />
          <stop offset="0.4" stopColor="#7C3AED" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2DD4BF" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={ids.ribbon} x1="26" y1="20" x2="78" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8C5BFF" />
          <stop offset="0.5" stopColor="#5B21B6" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id={ids.ribbonLight} x1="40" y1="26" x2="82" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F3FF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C4B5FD" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.tail} x1="22" y1="54" x2="58" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F5A0" />
          <stop offset="1" stopColor="#00D9F5" />
        </linearGradient>
        <linearGradient id={ids.tailHighlight} x1="32" y1="56" x2="56" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CFFAFE" stopOpacity="0.8" />
          <stop offset="1" stopColor="#4ADE80" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={ids.spark} x1="66" y1="18" x2="84" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#7DD3FC" stopOpacity="0" />
        </linearGradient>
        <filter id={ids.shadow} x="-20" y="-10" width="136" height="148" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#47136B" floodOpacity="0.55" />
        </filter>
      </defs>

      <g filter={glow ? `url(#${ids.shadow})` : undefined}>
        <rect width="96" height="96" rx="28" fill={`url(#${ids.bg})`} />
        <rect x="2" y="2" width="92" height="92" rx="26" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <circle cx="48" cy="48" r="32" fill={`url(#${ids.rim})`} />
        <path d="M18 54C18 31.908 35.908 14 58 14c17.673 0 32 14.327 32 32s-14.327 32-32 32c-7.934 0-15.212-2.898-20.834-7.711" stroke={`url(#${ids.aurora})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <path d="M30 69.5V38.8c0-9.8 8-17.8 17.8-17.8H59c13 0 23.5 10.5 23.5 23.5S72 68 59 68h-7.2l11.5 18.1c2.5 3.9-0.8 8.9-5.4 8.6-1.8-0.1-3.6-1.1-4.7-2.6L44.9 69.8l-7.6 8.1c-3 3.2-7.9 1.1-7.9-2.8Z" fill={`url(#${ids.ribbon})`} />
        <path d="M36 68V39.5c0-6.6 5.4-12 12-12h11.2c9.4 0 17 7.6 17 17s-7.6 17-17 17h-9.8" stroke={`url(#${ids.ribbonLight})`} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M27.4 57.8c-3.43 1.08-5.41 4.84-4.38 8.31l2.8 9.52c1.44 4.92 7.33 6.55 10.89 3.2l11.8-11.28c1.85-1.77 2.42-4.47 1.42-6.82l-3.7-8.55c-1.09-2.51-3.96-3.76-6.57-2.89l-12.24 4.51Z" fill={`url(#${ids.tail})`} opacity="0.95" />
        <path d="M31 59.4c-2.18.74-3.44 3.07-2.84 5.32l1.67 6.31c.91 3.44 5.14 4.73 7.68 2.3l8.16-7.77c1.27-1.2 1.66-3.04.98-4.66l-2.25-5.24c-.75-1.75-2.75-2.62-4.54-2.02l-8.86 2.76Z" fill={`url(#${ids.tailHighlight})`} opacity="0.8" />
        <circle cx="72" cy="20" r="6" fill={`url(#${ids.spark})`} opacity="0.8" />
        <circle cx="66" cy="24" r="2" fill="#E0E7FF" opacity="0.8" />
      </g>
    </svg>
  )

  const displaySize = clamp(size * 0.55, 22, 42)
  const taglineSize = clamp(size * 0.2, 9, 14)
  const direction = variant === 'stacked' ? 'column' : 'row'
  const gap = variant === 'mark' ? 0 : direction === 'column' ? clamp(size * 0.26, 12, 24) : clamp(size * 0.34, 14, 28)

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: align,
        justifyContent: 'center',
        flexDirection: direction,
        lineHeight: 1,
        gap,
        cursor: onClick ? 'pointer' : 'inherit',
        ...style,
      }}
      onClick={onClick}
    >
      <span style={{ lineHeight: 0 }}>{icon}</span>
      {variant !== 'mark' && (
        <div style={{ lineHeight: 1 }}>
          <div
            className="rw-display"
            style={{
              fontSize: displaySize,
              letterSpacing: '-0.04em',
              color: '#F8FAFF',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Resume</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #C7D2FE 0%, #7C3AED 45%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Wala
            </span>
          </div>
          {tagline && (
            <div
              className="rw-body"
              style={{
                fontSize: taglineSize,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {taglineText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
