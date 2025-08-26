import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

export async function GET(request: NextRequest) {
   try {
      // URL 쿼리 파라미터 추출
      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status') || 'active'

      // 자격증 목록 조회
      let query = supabaseAdmin.from('certifications').select('*')

      if (status) {
         query = query.eq('status', status)
      }

      const { data: certifications, error } = await query.order('created_at', { ascending: true })

      if (error) {
         console.error('자격증 조회 오류:', error)
         return NextResponse.json({ error: '자격증 정보를 조회할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         certifications,
         count: certifications.length,
      })
   } catch (error: unknown) {
      console.error('자격증 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
