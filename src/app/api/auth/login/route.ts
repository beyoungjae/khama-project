import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
   try {
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
         return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
      }

      // 사용자 프로필 조회
      let profile = null
      if (data.user) {
         const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()

         profile = profileData
      }

      return NextResponse.json({
         user: data.user,
         profile,
         session: data.session,
         message: '로그인에 성공했습니다.',
      })
   } catch (error: unknown) {
      console.error('로그인 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
