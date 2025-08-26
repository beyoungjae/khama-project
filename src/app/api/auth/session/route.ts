import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
   try {
      // Authorization 헤더에서 토큰 추출
      const authHeader = request.headers.get('authorization')

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증 토큰이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.replace('Bearer ', '')

      // Supabase에서 사용자 정보 조회
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 프로필 정보 조회
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single()

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
            id: user.id,
            email: user.email,
            email_confirmed: !!user.email_confirmed_at,
         },
         profile,
      })
   } catch (error: unknown) {
      console.error('세션 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
