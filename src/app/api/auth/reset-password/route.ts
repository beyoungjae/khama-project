import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
   try {
      const { email } = await request.json()

      // 입력 검증
      if (!email) {
         return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 })
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         return NextResponse.json({ error: '올바른 이메일 형식을 입력해주세요.' }, { status: 400 })
      }

      // Supabase Auth를 통한 비밀번호 재설정 이메일 발송
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      })

      if (error) {
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '비밀번호 재설정 링크를 이메일로 발송했습니다.',
      })
   } catch (error: unknown) {
      console.error('비밀번호 재설정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
