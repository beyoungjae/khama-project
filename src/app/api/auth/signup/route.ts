import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { email, password, name, phone, birth_date, gender, postal_code, address, detail_address, marketing_agreed } = body

      // 필수 필드 검증
      if (!email || !password || !name || !phone || !birth_date) {
         return NextResponse.json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 })
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         return NextResponse.json({ error: '올바른 이메일 형식을 입력해주세요.' }, { status: 400 })
      }

      // 비밀번호 강도 검증
      if (password.length < 8) {
         return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 })
      }

      // Supabase Auth로 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
         email,
         password,
         options: {
            data: {
               name: name,
            },
         },
      })

      if (authError) {
         console.error('회원가입 오류:', authError)

         // 에러 메시지 한국어 변환
         let errorMessage = '회원가입 중 오류가 발생했습니다.'
         if (authError.message.includes('User already registered')) {
            errorMessage = '이미 가입된 이메일입니다.'
         } else if (authError.message.includes('Password should be')) {
            errorMessage = '비밀번호가 요구사항을 만족하지 않습니다.'
         } else if (authError.message.includes('Invalid email')) {
            errorMessage = '올바르지 않은 이메일 형식입니다.'
         }

         return NextResponse.json({ error: errorMessage }, { status: 400 })
      }

      if (!authData.user) {
         return NextResponse.json({ error: '사용자 생성에 실패했습니다.' }, { status: 500 })
      }

      // 프로필 정보 업데이트 (트리거로 생성된 기본 프로필에 추가 정보 업데이트)
      const { error: profileError } = await supabase
         .from('profiles')
         .update({
            name,
            phone,
            birth_date,
            gender,
            postal_code,
            address,
            detail_address,
            marketing_agreed,
            marketing_agreed_at: marketing_agreed ? new Date().toISOString() : null,
         })
         .eq('id', authData.user.id)

      if (profileError) {
         console.error('프로필 업데이트 오류:', profileError)
         // 프로필 업데이트 실패해도 회원가입은 성공으로 처리
         // 사용자가 나중에 프로필을 수정할 수 있음
      }

      // 이메일 확인이 필요한 경우
      if (!authData.session && authData.user && !authData.user.email_confirmed_at) {
         return NextResponse.json({
            message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.',
            user: {
               id: authData.user.id,
               email: authData.user.email,
               email_confirmed: false,
            },
         })
      }

      // 즉시 로그인된 경우
      return NextResponse.json({
         message: '회원가입이 완료되었습니다.',
         user: {
            id: authData.user.id,
            email: authData.user.email,
            email_confirmed: true,
         },
         session: authData.session,
      })
   } catch (error: unknown) {
      console.error('회원가입 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
