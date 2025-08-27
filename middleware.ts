import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { fixSupabaseSession } from '@/middleware/session-fix'

export async function middleware(req: NextRequest) {
   const res = NextResponse.next()
   const pathname = req.nextUrl.pathname

   // Supabase 클라이언트 생성 (기존 방식 유지)
   const supabase = createMiddlewareClient({ req, res })

   // 세션 확인 (더 상세한 로그)
   const {
      data: { session },
      error: sessionError
   } = await supabase.auth.getSession()
   
   console.log('Middleware - Path:', pathname, 'Session:', session?.user?.email || '없음', 'Error:', sessionError)

   // 보호된 경로 정의
   const protectedRoutes = ['/mypage', '/exam/apply', '/board/qna/write']

   // 관리자 전용 경로
   const adminRoutes = ['/admin']

   // 인증이 필요한 페이지 접근 시 리디렉션
   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      if (!session) {
         console.log('Protected route 리다이렉트:', pathname, '-> /login')
         const loginUrl = new URL('/login', req.url)
         loginUrl.searchParams.set('redirectTo', pathname)
         return NextResponse.redirect(loginUrl)
      }
   }

   // 관리자 페이지 접근 시 권한 확인 (로그인 페이지 제외)
   if (adminRoutes.some((route) => pathname.startsWith(route)) && !pathname.startsWith('/admin/login')) {
      // Admin token 확인 (더 우선시)
      const adminToken = req.cookies.get('admin-token')?.value
      
      if (adminToken) {
         // JWT 토큰 검증
         try {
            const tokenResponse = await fetch(new URL('/api/admin/verify-token', req.url), {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ token: adminToken })
            })
            
            if (tokenResponse.ok) {
               console.log('Admin token valid, proceeding')
               return res // Admin token이 유효하면 계속 진행
            }
         } catch (tokenError) {
            console.log('Token verification failed:', tokenError)
         }
      }
      
      // Admin token이 없거나 무효한 경우, Supabase 세션도 확인
      if (!session) {
         console.log('Admin route 리다이렉트:', pathname, '-> /admin/login')
         const loginUrl = new URL('/admin/login', req.url)
         return NextResponse.redirect(loginUrl)
      }

      // Supabase 세션이 있는 경우 프로필에서 관리자 권한 확인
      try {
         const { data: profileData, error: profileError } = await supabase.from('profiles').select('id, status, role').eq('id', session.user.id).single()
         
         console.log('Admin 권한 확인:', profileData, '오류:', profileError)

         if (!profileData || !['admin', 'super_admin'].includes(profileData.role) || profileData.status !== 'active') {
            console.log('관리자 권한 없음, 403으로 리다이렉트')
            return NextResponse.redirect(new URL('/403', req.url))
         }
      } catch (profileError) {
         console.error('Profile check failed:', profileError)
         return NextResponse.redirect(new URL('/admin/login', req.url))
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

   // Vercel 환경에서 세션 수정
   return fixSupabaseSession(req, res)
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
