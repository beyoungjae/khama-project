'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function VercelAuthFix() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // 로딩 중이면 아무것도 하지 않음

    // 로그인된 사용자가 로그인 페이지에 있는 경우
    if (user && pathname === '/login') {
      console.log('🚀 Vercel Fix: 로그인된 사용자가 로그인 페이지에 있음, 강제 리다이렉트')
      
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo') || '/mypage'
      
      console.log('리다이렉트 대상:', redirectTo)
      window.location.href = redirectTo
      return
    }

  }, [user, loading, pathname, router])

  return null
}
