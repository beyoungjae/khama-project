import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('Auth callback 시작')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/mypage'

  console.log('Callback params:', { code: !!code, next })

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Session exchange result:', { 
        success: !error, 
        user: data.user?.email, 
        error: error?.message 
      })
      
      if (!error && data.session) {
        // 성공시 세션 검증
        const { data: sessionCheck } = await supabase.auth.getSession()
        console.log('Session verification:', !!sessionCheck.session)
        
        // 성공 후 지정된 페이지로 리다이렉트
        return NextResponse.redirect(new URL(next, request.url))
      }
    } catch (exchangeError) {
      console.error('Exchange error:', exchangeError)
    }
  }

  // 실패시 에러와 함께 로그인 페이지로
  console.log('Auth callback 실패, 로그인으로 리다이렉트')
  return NextResponse.redirect(new URL('/login?error=auth_error', request.url))
}