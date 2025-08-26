import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const category = searchParams.get('category')
      const search = searchParams.get('search')

      const offset = (page - 1) * limit

      // 기본 쿼리
      let query = supabaseAdmin
         .from('notices')
         .select('*', { count: 'exact' })
         .eq('is_published', true)
         .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      // 검색 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // 정렬 및 페이지네이션
      const {
         data: notices,
         count,
         error,
      } = await query
         .order('is_pinned', { ascending: false })
         .order('published_at', { ascending: false })
         .range(offset, offset + limit - 1)

      if (error) {
         console.error('공지사항 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 페이지네이션 정보
      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         notices: notices || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
         },
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// POST: 조회수 증가 (별도 엔드포인트로 처리하는 것이 좋지만 간단히 여기서)
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { noticeId, action } = body

      if (action === 'increment_view') {
         // 조회수 증가 (RLS 우회)
         await supabaseAdmin
            .from('notices')
            .update({
               view_count: supabaseAdmin.rpc('increment', { x: 1 }),
            })
            .eq('id', noticeId)

         return NextResponse.json({ success: true })
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
