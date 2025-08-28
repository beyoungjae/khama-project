import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { type Profile } from '@/lib/supabase'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20') || 20))
      const status = searchParams.get('status') || 'all'
      const role = searchParams.get('role') || 'all'
      const search = searchParams.get('search') || ''

      const offset = (page - 1) * limit

      // 회원 목록 조회
      let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false })

      // 상태 필터
      if (status !== 'all') {
         query = query.eq('status', status)
      }

      // 역할 필터
      if (role !== 'all') {
         query = query.eq('role', role)
      }

      // 검색어 필터 (profiles 테이블에 있는 필드만 사용)
      if (search) {
         query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,address.ilike.%${search}%`)
      }

      const { data: members, count, error } = await query.range(offset, offset + limit - 1)

      if (error) {
         console.error('회원 목록 조회 오류:', error)
         return NextResponse.json({ error: '회원 목록을 조회할 수 없습니다.' }, { status: 500 })
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         members: members || [],
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
      console.error('회원 관리 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
