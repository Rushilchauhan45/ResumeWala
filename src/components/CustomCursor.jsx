import { useEffect, useRef, useState } from 'react'

const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .btn-primary, .cursor-focus'
const DOT_SIZE = 10
const OUTLINE_SIZE = 38

const CustomCursor = () => {
  const dotRef = useRef(null)
  const outlineRef = useRef(null)
  const rafRef = useRef(null)
  const targetRef = useRef({ x: -100, y: -100 })
  const scaleRef = useRef(1)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const pointerMedia = window.matchMedia('(pointer: fine)')
    const handleChange = (event) => {
      setIsActive(event.matches)
      if (!event.matches) {
        document.body.classList.remove('has-custom-cursor')
      }
    }

    setIsActive(pointerMedia.matches)
    pointerMedia.addEventListener('change', handleChange)

    return () => {
      pointerMedia.removeEventListener('change', handleChange)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return

    const dotEl = dotRef.current
    const outlineEl = outlineRef.current
    if (!dotEl || !outlineEl) return

    document.body.classList.add('has-custom-cursor')

    let currentX = -100
    let currentY = -100

    const handlePointerMove = (event) => {
      const { clientX, clientY } = event
      targetRef.current = { x: clientX - OUTLINE_SIZE / 2, y: clientY - OUTLINE_SIZE / 2 }
      dotEl.style.transform = `translate3d(${clientX - DOT_SIZE / 2}px, ${clientY - DOT_SIZE / 2}px, 0)`
    }

    const animate = () => {
      const { x, y } = targetRef.current
      currentX += (x - currentX) * 0.15
      currentY += (y - currentY) * 0.15
      outlineEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scaleRef.current})`
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    const handlePointerDown = () => {
      outlineEl.classList.add('is-clicked')
      scaleRef.current = 0.85
    }

    const handlePointerUp = () => {
      outlineEl.classList.remove('is-clicked')
      scaleRef.current = outlineEl.classList.contains('is-hovering') ? 1.3 : 1
    }

    const handlePointerOver = (event) => {
      if (event.target.closest(interactiveSelectors)) {
        outlineEl.classList.add('is-hovering')
        dotEl.classList.add('is-hovering')
        scaleRef.current = 1.3
      } else {
        outlineEl.classList.remove('is-hovering')
        dotEl.classList.remove('is-hovering')
        scaleRef.current = 1
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerover', handlePointerOver)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerover', handlePointerOver)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isActive])

  if (!isActive) {
    return null
  }

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={outlineRef} className="custom-cursor-outline" />
    </>
  )
}

export default CustomCursor
