import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { userSessionOptions, type SessionData } from '@/lib/session'

export async function GET(request: NextRequest) {
   try {
      console.log('사용자 세션 확인 API 호출')
      
      // iron-session에서 사용자 세션 확인 (App Router: cookies 사용; await 필요)
      const cookieStore = await cookies()
      const session = await getIronSession<SessionData>(cookieStore, userSessionOptions)
      
      console.log('현재 세션 상태:', { hasUser: !!session.user, userId: session.user?.id })
      
      if (!session.user) {
         return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
      }

      // 프로필 정보 조회
      const { data: profile, error: profileError } = await supabaseAdmin
         .from('profiles')
         .select('*')
         .eq('id', session.user.id)
         .single()

      if (profileError) {
         console.error('프로필 조회 오류:', profileError)
         return NextResponse.json({ error: '프로필 정보를 조회할 수 없습니다.' }, { status: 500 })
      }

      // 계정 상태 확인
      if (profile.status !== 'active') {
         let statusMessage = '계정에 문제가 있습니다.'
         if (profile.status === 'suspended') {
            statusMessage = '계정이 정지되었습니다.'
         } else if (profile.status === 'inactive') {
            statusMessage = '계정이 비활성화되었습니다.'
         }

         return NextResponse.json({ error: statusMessage }, { status: 403 })
      }

      return NextResponse.json({
         user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
         },
         profile,
         session: session.user
      })
   } catch (error: unknown) {
      console.error('세션 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
