'use client'

import { useRef, useEffect, useState } from 'react'

function parse(str) {
  // Handles values like "500+", "98%", "3×", "10+"
  const digits  = parseInt(String(str).replace(/[^0-9]/g, ''), 10)
  const suffix  = String(str).replace(/[0-9,]/g, '')
  return { digits: isNaN(digits) ? null : digits, suffix }
}

/**
 * Counts from 0 up to the target value when scrolled into view.
 * Works with values like "500+", "98%", "3×", "5".
 */
export default function AnimatedCounter({ value, duration = 1600 }) {
  const ref     = useRef(null)
  const [display, setDisplay]  = useState('0')
  const [started, setStarted]  = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const { digits, suffix } = parse(value)
    if (digits === null) { setDisplay(value); return }

    let rafId
    let startTime = null

    function step(ts) {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      // ease-out cubic
      const eased   = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * digits)
      setDisplay(`${current.toLocaleString()}${suffix}`)
      if (progress < 1) rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [started, value, duration])

  return <span ref={ref}>{display}</span>
}
