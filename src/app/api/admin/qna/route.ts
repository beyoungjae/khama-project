import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인 (헤더 또는 쿠키)
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20') || 20))
      const status = searchParams.get('status') || 'all'
      const category = searchParams.get('category') || 'all'
      const search = searchParams.get('search') || ''

      const offset = (page - 1) * limit

      // Q&A 목록 조회 (qna_questions 테이블)
      let query = supabaseAdmin.from('qna_questions').select('*', { count: 'exact' }).order('created_at', { ascending: false })

      // 상태 필터 (answered/pending 기준)
      if (status === 'answered') {
         query = query.eq('is_answered', true)
      } else if (status === 'pending') {
         query = query.eq('is_answered', false)
      } else if (status === 'closed') {
         query = query.eq('status', 'closed')
      }

      // 카테고리 필터
      if (category !== 'all') {
         query = query.eq('category', category)
      }

      // 검색어 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      const { data: questions, count, error } = await query.range(offset, offset + limit - 1)

      if (error) {
         console.error('Q&A 목록 조회 오류:', error)
         return NextResponse.json({ error: 'Q&A 목록을 조회할 수 없습니다.' }, { status: 500 })
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         posts: questions || [],
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
      console.error('Q&A 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
