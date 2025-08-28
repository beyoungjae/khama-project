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

      // 전체 회원 수
      const { count: totalMembers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true })

      // 오늘 가입한 회원 수
      const today = new Date().toISOString().split('T')[0]
      const { count: newMembersToday } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today)

      return NextResponse.json({
         total: totalMembers || 0,
         today: newMembersToday || 0,
      })
   } catch (error) {
      console.error('회원 통계 조회 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
