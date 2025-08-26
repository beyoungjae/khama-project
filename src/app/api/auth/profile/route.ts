import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 프로필 조회
export async function GET(request: NextRequest) {
   try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]

      // JWT 토큰으로 사용자 확인
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 프로필 조회
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      if (profileError) {
         return NextResponse.json({ error: '프로필을 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({
         profile,
      })
   } catch (error: unknown) {
      console.error('프로필 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 프로필 업데이트
export async function PUT(request: NextRequest) {
   try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]

      // JWT 토큰으로 사용자 확인
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const updateData = await request.json()

      // 허용된 필드만 업데이트
      const allowedFields = ['name', 'phone', 'birth_date', 'gender', 'postal_code', 'address', 'detail_address', 'marketing_agreed']

      const filteredData: Record<string, unknown> = {}
      Object.keys(updateData).forEach((key) => {
         if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key]
         }
      })

      // 마케팅 동의 시간 업데이트
      if ('marketing_agreed' in filteredData) {
         filteredData.marketing_agreed_at = filteredData.marketing_agreed ? new Date().toISOString() : null
      }

      // 프로필 업데이트
      const { data: profile, error: updateError } = await supabase.from('profiles').update(filteredData).eq('id', user.id).select().single()

      if (updateError) {
         return NextResponse.json({ error: '프로필 업데이트에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         profile,
         message: '프로필이 업데이트되었습니다.',
      })
   } catch (error: unknown) {
      console.error('프로필 업데이트 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
