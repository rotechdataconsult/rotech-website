'use client'

import { useRef, useEffect, useState } from 'react'

/**
 * Fades + slides children up when they enter the viewport.
 * Content is visible in the server HTML (so crawlers and no-JS visitors see
 * everything); only items still below the fold are hidden after hydration and
 * then revealed. Skipped entirely for people who prefer reduced motion.
 */
export default function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [state, setState] = useState('static') // static | hidden | shown

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return // already on screen

    // One-off measurement after mount: hide only what is still below the fold.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState('hidden')
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const style =
    state === 'static'
      ? undefined
      : {
          opacity: state === 'shown' ? 1 : 0,
          transform: state === 'shown' ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
