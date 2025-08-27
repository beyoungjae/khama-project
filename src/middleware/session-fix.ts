// Vercel 환경에서 Supabase 세션 쿠키 문제를 해결하기 위한 헬퍼

import { NextRequest, NextResponse } from 'next/server'

export function fixSupabaseSession(req: NextRequest, res: NextResponse) {
  // Vercel 환경에서 쿠키 도메인 설정 문제 해결
  const isVercel = req.nextUrl.hostname.includes('vercel.app')
  const isLocalhost = req.nextUrl.hostname === 'localhost'
  
  if (isVercel) {
    // Vercel 환경에서 SameSite 설정을 완화
    const authCookies = [
      'sb-access-token',
      'sb-refresh-token', 
      'khama-auth-token'
    ]
    
    authCookies.forEach(cookieName => {
      const cookieValue = req.cookies.get(cookieName)
      if (cookieValue) {
        // Vercel 환경에 맞는 쿠키 재설정
        res.cookies.set(cookieName, cookieValue.value, {
          httpOnly: false,
          secure: true,
          sameSite: 'lax', // Vercel에서는 lax가 더 안정적
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7일
        })
      }
    })
  }
  
  return res
}