import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
   try {
      // Authorization 헤더에서 토큰 추출
      const authHeader = request.headers.get('authorization')

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증 토큰이 필요합니다.' }, { status: 401 })
      }

      // Supabase Auth로 로그아웃
      const { error } = await supabase.auth.signOut()

      if (error) {
         console.error('로그아웃 오류:', error)
         return NextResponse.json({ error: '로그아웃 중 오류가 발생했습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         message: '로그아웃이 완료되었습니다.',
      })
   } catch (error: unknown) {
      console.error('로그아웃 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
