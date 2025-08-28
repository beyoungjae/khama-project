import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { userSessionOptions, type SessionData } from '@/lib/session'

export async function POST(request: NextRequest) {
   try {
      console.log('사용자 로그아웃 API 호출')

      // iron-session에서 사용자 세션 삭제
      const cookieStore = await cookies()
      const session = await getIronSession<SessionData>(cookieStore, userSessionOptions)
      
      console.log('현재 세션:', session.user)
      
      // 세션 삭제
      await session.destroy()
      
      console.log('iron-session 삭제 완료')

      // Supabase Auth를 통한 로그아웃 (선택적)
      const { error } = await supabase.auth.signOut()

      if (error) {
         console.error('Supabase 로그아웃 오류:', error)
         // iron-session 삭제는 성공했으므로 계속 진행
      }

      return NextResponse.json({ message: '로그아웃되었습니다.' })
   } catch (error: unknown) {
      console.error('로그아웃 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
