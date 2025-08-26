import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
   const res = NextResponse.next()
   const pathname = req.nextUrl.pathname

   // Supabase 클라이언트 생성
   const supabase = createMiddlewareClient({ req, res })

   // 세션 확인
   const {
      data: { session },
   } = await supabase.auth.getSession()

   // 보호된 경로 정의
   const protectedRoutes = ['/mypage', '/exam/apply', '/board/qna/write']

   // 관리자 전용 경로
   const adminRoutes = ['/admin']

   // 인증이 필요한 페이지 접근 시 리디렉션
   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      if (!session) {
         const loginUrl = new URL('/login', req.url)
         loginUrl.searchParams.set('redirectTo', pathname)
         return NextResponse.redirect(loginUrl)
      }
   }

   // 관리자 페이지 접근 시 권한 확인
   if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (!session) {
         const loginUrl = new URL('/admin/login', req.url)
         return NextResponse.redirect(loginUrl)
      }

      // 프로필에서 관리자 권한 확인
      const { data: profileData } = await supabase.from('profiles').select('id, status, role').eq('id', session.user.id).single()

      if (!profileData || !['admin', 'super_admin'].includes(profileData.role) || profileData.status !== 'active') {
         return NextResponse.redirect(new URL('/403', req.url))
      }
   }

   // 로그인된 사용자가 인증 페이지 접근 시 리디렉션
   const authPages = ['/login', '/signup', '/forgot-password']
   if (authPages.includes(pathname) && session) {
      const redirectTo = req.nextUrl.searchParams.get('redirectTo')
      if (redirectTo) {
         return NextResponse.redirect(new URL(redirectTo, req.url))
      }
      return NextResponse.redirect(new URL('/mypage', req.url))
   }

   return res
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
   ],
}
