import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
   // 쿠키를 처리할 응답 객체 생성
   let response = NextResponse.next({
      request: {
         headers: request.headers,
      },
   })

   // Supabase 클라이언트 생성
   const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
         get(name: string) {
            return request.cookies.get(name)?.value
         },
         set(name: string, value: string, options) {
            // 요청과 응답 모두에 쿠키 설정
            request.cookies.set({
               name,
               value,
               ...options,
            })
            response = NextResponse.next({
               request: {
                  headers: request.headers,
               },
            })
            response.cookies.set({
               name,
               value,
               ...options,
            })
         },
         remove(name: string, options) {
            // 요청과 응답 모두에서 쿠키 제거
            request.cookies.set({
               name,
               value: '',
               ...options,
            })
            response = NextResponse.next({
               request: {
                  headers: request.headers,
               },
            })
            response.cookies.set({
               name,
               value: '',
               ...options,
            })
         },
      },
   })

   const { pathname } = request.nextUrl

   // 정적 파일들은 미들웨어를 거치지 않음
   if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/static') || pathname.includes('.')) {
      return response
   }

   // 공개/보호 경로 정의
   const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/admin/login', '/api/admin/login', '/api/admin/verify-token', '/api/auth', '/', '/about', '/business', '/exam', '/services', '/support', '/board/notice', '/board/qna', '/terms', '/privacy', '/sitemap']

   // 보호된 경로들 (로그인이 필요)
   const protectedPaths = ['/mypage', '/exam/apply', '/support/inquiry', '/board/qna/write']
   const adminPaths = ['/admin']

   try {
      // 사용자 세션 새로고침 (쿠키가 자동으로 업데이트됨)
      const {
         data: { user },
      } = await supabase.auth.getUser()

      // iron-session 기반 사용자 쿠키 존재 여부도 인증으로 인정
      const hasIronUser = !!request.cookies.get('khama_user_session')?.value
      const isAuthenticated = !!user || hasIronUser

      // 일반 보호된 경로에 접근하려는데 인증되지 않은 경우
      if (protectedPaths.some((path) => pathname.startsWith(path)) && !isAuthenticated) {
         // 요구사항: redirectTo 없이 /login 으로만 이동
         const redirectUrl = new URL('/login', request.url)
         return NextResponse.redirect(redirectUrl)
      }

      // 공개 경로는 인증 확인 없이 통과
      if (publicPaths.some((path) => pathname.startsWith(path))) {
         return response
      }

      // 관리자 페이지는 클라이언트에서 인증 처리 (middleware에서는 통과)
      // 단순히 정적 파일과 API만 필터링

      // 이미 로그인된 사용자가 로그인 페이지에 접근하려는 경우
      if (pathname === '/login' && isAuthenticated) {
         const redirectTo = request.nextUrl.searchParams.get('redirectTo')
         const redirectUrl = new URL(redirectTo || '/mypage', request.url)
         return NextResponse.redirect(redirectUrl)
      }

      return response
   } catch (error) {
      console.error('Middleware Error:', error)

      // 오류가 발생한 경우 보호된 경로는 로그인 페이지로 리디렉션
      if (protectedPaths.some((path) => pathname.startsWith(path))) {
         const redirectUrl = new URL('/login', request.url)
         return NextResponse.redirect(redirectUrl)
      }

      // 관리자 페이지는 클라이언트에서 처리

      return response
   }
}

export const config = {
   matcher: [
      /**
       * 다음을 제외한 모든 요청 경로와 매치:
       * - _next/static (정적 파일)
       * - _next/image (이미지 최적화 파일)
       * - favicon.ico (파비콘 파일)
       * - . 이 포함된 파일 (정적 파일)
       */
      '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
   ],
}
