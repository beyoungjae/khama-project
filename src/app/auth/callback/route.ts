import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/mypage'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 성공시 지정된 페이지로 리다이렉트
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // 실패시 에러와 함께 로그인 페이지로
  return NextResponse.redirect(new URL('/login?error=auth_error', request.url))
}