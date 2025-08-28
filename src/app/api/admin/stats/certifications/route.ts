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

      // 전체 자격증 수
      const { count: totalCertifications } = await supabaseAdmin.from('certifications').select('*', { count: 'exact', head: true })

      // 활성 자격증 수
      const { count: activeCertifications } = await supabaseAdmin.from('certifications').select('*', { count: 'exact', head: true }).eq('status', 'active')

      return NextResponse.json({
         total: totalCertifications || 0,
         active: activeCertifications || 0,
      })
   } catch (error) {
      console.error('자격증 통계 조회 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
