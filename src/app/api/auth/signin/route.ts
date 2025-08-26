import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { email, password } = body

      // 필수 필드 검증
      if (!email || !password) {
         return NextResponse.json({ error: '이메일과 비밀번호를 모두 입력해주세요.' }, { status: 400 })
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         return NextResponse.json({ error: '올바른 이메일 형식을 입력해주세요.' }, { status: 400 })
      }

      // Supabase Auth로 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
         email,
         password,
      })

      if (authError) {
         console.error('로그인 오류:', authError)

         // 에러 메시지 한국어 변환
         let errorMessage = '로그인 중 오류가 발생했습니다.'
         if (authError.message.includes('Invalid login credentials')) {
            errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
         } else if (authError.message.includes('Email not confirmed')) {
            errorMessage = '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
         } else if (authError.message.includes('Too many requests')) {
            errorMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
         }

         return NextResponse.json({ error: errorMessage }, { status: 401 })
      }

      if (!authData.user || !authData.session) {
         return NextResponse.json({ error: '로그인에 실패했습니다.' }, { status: 401 })
      }

      // 프로필 정보 조회
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single()

      if (profileError) {
         console.error('프로필 조회 오류:', profileError)
         // 프로필이 없는 경우 기본 프로필 생성 (트리거가 실패한 경우 대비)
         if (profileError.code === 'PGRST116') {
            // No rows found
            const { error: createError } = await supabase.from('profiles').insert([
               {
                  id: authData.user.id,
                  name: authData.user.email,
                  role: 'user',
                  status: 'active',
               },
            ])

            if (createError) {
               console.error('프로필 생성 오류:', createError)
            }
         }
      }

      // 마지막 로그인 시간 업데이트
      await supabase.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', authData.user.id)

      // 계정 상태 확인
      if (profile && profile.status !== 'active') {
         let statusMessage = '계정에 문제가 있습니다.'
         if (profile.status === 'suspended') {
            statusMessage = '계정이 정지되었습니다. 관리자에게 문의해주세요.'
         } else if (profile.status === 'inactive') {
            statusMessage = '계정이 비활성화되었습니다. 관리자에게 문의해주세요.'
         }

         return NextResponse.json({ error: statusMessage }, { status: 403 })
      }

      return NextResponse.json({
         message: '로그인이 완료되었습니다.',
         user: {
            id: authData.user.id,
            email: authData.user.email,
            email_confirmed: !!authData.user.email_confirmed_at,
         },
         profile: profile || null,
         session: {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at,
         },
      })
   } catch (error: unknown) {
      console.error('로그인 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
