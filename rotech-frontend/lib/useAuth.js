'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (cancelled) return

        if (!session) {
          routerRef.current.push('/auth/login')
          setLoading(false)
          return
        }

        setUser(session.user)

        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (cancelled) return

        setProfile(profileData)
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    checkSession()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, profile, loading }
}
