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
      const search = searchParams.get('search') || ''

      const offset = (page - 1) * limit

      // exam_applications 테이블에서 관련 정보와 함께 조회
      let query = supabaseAdmin
         .from('exam_applications')
         .select(
            `
            *,
            exam_schedules (
               exam_date,
               exam_location,
               certification_id,
               certifications (
                  name
               )
            )
            `,
            { count: 'exact' }
         )
         .order('created_at', { ascending: false })

      // 상태 필터
      if (status !== 'all') {
         if (status === 'payment_completed') {
            // 레거시 'confirmed'와 신규 'payment_completed' 함께 포함
            query = query.in('application_status', ['payment_completed', 'confirmed'])
         } else {
            query = query.eq('application_status', status)
         }
      }

      // 검색어 필터 (applicant_name, applicant_email로 검색)
      if (search) {
         query = query.or(`applicant_name.ilike.%${search}%,applicant_email.ilike.%${search}%`)
      }

      const { data: applications, count, error } = await query.range(offset, offset + limit - 1)

      if (error) {
         console.error('시험 신청 목록 조회 오류:', error)
         return NextResponse.json({ error: '시험 신청 목록을 조회할 수 없습니다.' }, { status: 500 })
      }

      // 응답 구성 (JOIN으로 가져온 실제 데이터 사용)
      const enrichedApplications = (applications || []).map((app) => ({
         ...app,
         profiles: {
            name: app.applicant_name,
            email: app.applicant_email,
            phone: app.applicant_phone,
         },
      }))

      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         applications: enrichedApplications,
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
      console.error('시험 신청 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

export async function PATCH(request: NextRequest) {
   try {
      // 관리자 권한 확인 (헤더 또는 쿠키)
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const body = await request.json()
      const { applicationId, status } = body

      if (!applicationId || !status) {
         return NextResponse.json({ error: '신청 ID와 상태는 필수입니다.' }, { status: 400 })
      }

      // exam_applications 테이블 사용
      const { data: updatedApplication, error } = await supabaseAdmin
         .from('exam_applications')
         .update({
            application_status: status,
            updated_at: new Date().toISOString(),
         })
         .eq('id', applicationId)
         .select()
         .single()

      if (error) {
         console.error('시험 신청 상태 업데이트 오류:', error)
         return NextResponse.json({ error: '신청 상태를 업데이트할 수 없습니다.' }, { status: 500 })
      }

      return NextResponse.json({ application: updatedApplication })
   } catch (error) {
      console.error('시험 신청 상태 업데이트 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
