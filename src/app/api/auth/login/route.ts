import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { userSessionOptions, type SessionData } from '@/lib/session'

export async function POST(request: NextRequest) {
   try {
      console.log('사용자 로그인 API 호출')
      
      const { email, password } = await request.json()

      // 입력 검증
      if (!email || !password) {
         return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
      }

      // Supabase Auth를 통한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
      })

      if (error) {
         console.error('Supabase 로그인 오류:', error)
         return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
      }

      if (!data.user) {
         return NextResponse.json({ error: '로그인에 실패했습니다.' }, { status: 401 })
      }

      console.log('Supabase 로그인 성공:', { userId: data.user.id, email: data.user.email })

      // 사용자 프로필 조회
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      
      console.log('프로필 조회 결과:', profileData)

      // iron-session에 사용자 정보 저장 (cookies() 먼저 세션 저장 후 응답 생성)
      const cookieStore = await cookies()
      const session = await getIronSession<SessionData>(cookieStore, userSessionOptions)
      
      session.user = {
         id: data.user.id,
         email: data.user.email,
         name: profileData?.name,
         role: 'user'
      }

      await session.save()
      
      console.log('iron-session 저장 완료:', session.user)

      return NextResponse.json({
         user: data.user,
         profile: profileData,
         message: '로그인에 성공했습니다.',
      })
   } catch (error: unknown) {
      console.error('로그인 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
