import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../login/route'

// 관리자용 공지사항 목록 조회
export async function GET(request: NextRequest) {
   try {
      // 인증 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const { valid } = verifyAdminToken(token)

      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status') || 'all'
      const category = searchParams.get('category')
      const search = searchParams.get('search')
      const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20') || 20))
      const offset = (page - 1) * limit

      let query = supabaseAdmin.from('notices').select('*', { count: 'exact' })

      // 상태 필터 (published/unpublished)
      if (status === 'published') {
         query = query.eq('is_published', true)
      } else if (status === 'unpublished') {
         query = query.eq('is_published', false)
      }
      // 'all'인 경우 필터 없음

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      // 검색
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      const {
         data: posts,
         error,
         count,
      } = await query
         .order('is_pinned', { ascending: false })
         .order('created_at', { ascending: false })
         .range(offset, offset + limit - 1)

      if (error) {
         console.error('공지사항 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         notices: posts || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
         },
      })
   } catch (error: unknown) {
      console.error('공지사항 관리 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 공지사항 생성
export async function POST(request: NextRequest) {
   try {
      // 인증 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const { valid } = verifyAdminToken(token)

      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { title, content, category, status, is_pinned, is_important } = await request.json()

      // 필수 필드 검증
      if (!title || !content) {
         return NextResponse.json({ error: '제목과 내용은 필수입니다.' }, { status: 400 })
      }

      const { data, error } = await supabaseAdmin
         .from('notices')
         .insert([
            {
               title,
               content,
               excerpt: content.replace(/<[^>]*>/g, '').substring(0, 200),
               category: category || 'general',
               is_published: status === 'published',
               is_pinned: is_pinned || false,
               is_important: is_important || false,
               author_name: '관리자',
               published_at: status === 'published' ? new Date().toISOString() : null,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            },
         ])
         .select()
         .single()

      if (error) {
         console.error('공지사항 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '공지사항이 성공적으로 생성되었습니다.',
         notice: data,
      })
   } catch (error: unknown) {
      console.error('공지사항 생성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
