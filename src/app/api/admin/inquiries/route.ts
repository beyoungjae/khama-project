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
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const category = searchParams.get('category')
      const search = searchParams.get('search')

      // inquiries 테이블에서 문의 데이터 조회
      let query = supabaseAdmin.from('inquiries').select('*', { count: 'exact' })

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      // 검색 필터
      if (search) {
         query = query.or(`subject.ilike.%${search}%,content.ilike.%${search}%,author_name.ilike.%${search}%`)
      }

      // 페이지네이션
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: inquiries, error, count } = await query.range(from, to).order('created_at', { ascending: false })

      if (error) {
         console.error('관리자 문의 목록 조회 오류:', error)
         return NextResponse.json({ error: '문의 목록을 불러오는데 실패했습니다.' }, { status: 500 })
      }

      // 데이터 매핑 (inquiries 테이블 -> inquiry 형태로)
      const mappedInquiries = inquiries?.map((inquiry) => ({
         id: inquiry.id,
         name: inquiry.author_name,
         email: inquiry.author_email,
         phone: inquiry.author_phone,
         category: inquiry.category,
         subject: inquiry.subject,
         content: inquiry.content,
         status: inquiry.status,
         is_answered: inquiry.is_answered || false,
         admin_response: inquiry.admin_response,
         created_at: inquiry.created_at,
         answered_at: inquiry.answered_at,
      }))

      const totalPages = count ? Math.ceil(count / limit) : 1

      return NextResponse.json({
         inquiries: mappedInquiries || [],
         pagination: {
            currentPage: page,
            totalPages,
            totalCount: count || 0,
            limit,
         },
      })
   } catch (error) {
      console.error('관리자 문의 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
