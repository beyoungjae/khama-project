import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 1:1 문의 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const status = searchParams.get('status') || 'all'
      const search = searchParams.get('search')
      const userId = searchParams.get('userId')

      const offset = (page - 1) * limit

      // posts 테이블에서 type이 'inquiry'인 데이터 조회
      let query = supabaseAdmin.from('posts').select('*', { count: 'exact' }).eq('type', 'qna')

      // 상태 필터
      if (status !== 'all') {
         query = query.eq('status', status)
      }

      // 사용자 필터
      if (userId) {
         query = query.eq('author_id', userId)
      }

      // 검색 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // 정렬 및 페이지네이션
      const { data: inquiries, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      if (error) {
         console.error('1:1 문의 목록 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 페이지네이션 정보
      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         inquiries: inquiries || [],
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

// POST: 1:1 문의 생성
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { title, content, category, is_private = false, author_id, author_name } = body

      // 필수 필드 검증
      if (!title || !content || !category || !author_id || !author_name) {
         return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
      }

      // 1:1 문의 생성 (posts 테이블에 type='inquiry'로 저장)
      const { data: inquiry, error } = await supabaseAdmin
         .from('posts')
         .insert({
            title,
            content,
            category,
            type: 'qna',
            is_private,
            author_id,
            author_name,
            status: 'published',
            view_count: 0,
            is_answered: false,
         })
         .select()
         .single()

      if (error) {
         console.error('1:1 문의 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ inquiry, message: '1:1 문의가 성공적으로 등록되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
