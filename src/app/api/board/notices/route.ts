import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { type Notice } from '@/lib/supabase'

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const category = searchParams.get('category')
      const search = searchParams.get('search')

      const offset = (page - 1) * limit

      // 공지사항 목록 조회 (notices 테이블 사용)
      let query = supabaseAdmin.from('notices').select('*', { count: 'exact' }).eq('is_published', true).order('is_pinned', { ascending: false }).order('created_at', { ascending: false })

      // 카테고리 필터
      if (category && category !== '전체') {
         query = query.eq('category', category)
      }

      // 검색어 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      const { data: notices, count, error } = await query.range(offset, offset + limit - 1)

      if (error) {
         console.error('공지사항 조회 오류:', error)
         return NextResponse.json({ error: '공지사항을 조회할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({
         notices: notices || [],
         total: count || 0,
         page,
         limit,
         totalPages: Math.ceil((count || 0) / limit),
      })
   } catch (error) {
      console.error('공지사항 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
