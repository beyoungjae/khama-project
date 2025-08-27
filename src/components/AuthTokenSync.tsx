'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthTokenSync() {
  const { user } = useAuth()

  useEffect(() => {
    // 로그인된 사용자가 있으면 쿠키에 토큰 동기화
    if (user && typeof window !== 'undefined') {
      console.log('🔄 토큰 동기화 시작:', user.email)
      
      // localStorage에서 토큰 확인
      const authToken = localStorage.getItem('khama-auth-token')
      
      if (authToken) {
        // 쿠키에 토큰 설정 (middleware가 읽을 수 있도록)
        document.cookie = `sb-access-token=${authToken}; path=/; max-age=86400; SameSite=Lax; Secure=${location.protocol === 'https:'}`
        console.log('✅ 토큰을 쿠키에 동기화 완료')
      }
      
      // Supabase 세션에서 토큰 추출 시도
      const syncSupabaseTokens = async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.access_token) {
            document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=86400; SameSite=Lax; Secure=${location.protocol === 'https:'}`
            console.log('✅ Supabase 토큰을 쿠키에 동기화 완료')
          }
          
          if (session?.refresh_token) {
            document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=86400; SameSite=Lax; Secure=${location.protocol === 'https:'}`
            console.log('✅ Refresh 토큰을 쿠키에 동기화 완료')
          }
        } catch (error) {
          console.error('토큰 동기화 실패:', error)
        }
      }
      
      syncSupabaseTokens()
    }
  }, [user])

  return null // 화면에 렌더링되지 않는 컴포넌트
}