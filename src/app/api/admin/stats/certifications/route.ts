import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../login/route'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const { valid } = verifyAdminToken(token)
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
