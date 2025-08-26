import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
   try {
      // Supabase Auth를 통한 로그아웃
      const { error } = await supabase.auth.signOut()

      if (error) {
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '로그아웃되었습니다.',
      })
   } catch (error: unknown) {
      console.error('로그아웃 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
