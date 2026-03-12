'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Returns [ref, inView].
 * inView flips to true once the element enters the viewport and stays true.
 */
export function useInView(threshold = 0.15) {
  const ref    = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView]
}
