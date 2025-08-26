import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 자격증 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')
      const status = searchParams.get('status') || 'active'
      const search = searchParams.get('search')

      let query = supabaseAdmin.from('certifications').select('*').eq('status', status)

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      // 검색 필터
      if (search) {
         query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data: certifications, error } = await query.order('name', { ascending: true })

      if (error) {
         console.error('자격증 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
         certifications: certifications || [],
         count: certifications?.length || 0,
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
