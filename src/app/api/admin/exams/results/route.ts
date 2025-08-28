import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인 - JWT 토큰 검증
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const applicationNumber = searchParams.get('applicationNumber')

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      let query = supabaseAdmin
         .from('exam_applications')
         .select(
            `
            *,
            exam_schedules (
               exam_date,
               exam_location,
               exam_address,
               certifications (
                  name,
                  registration_number,
                  description,
                  passing_criteria
               )
            )
         `
         )
         .eq('user_id', userId)
         .not('exam_result', 'is', null) // 결과가 있는 것만

      // 신청번호가 있으면 특정 결과 조회
      if (applicationNumber) {
         query = query.eq('application_number', applicationNumber)
      }

      const { data: results, error } = await query.order('created_at', { ascending: false })

      if (error) {
         console.error('시험 결과 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 결과 데이터 가공
      const processedResults = results?.map((result: { exam_result: 'pass' | 'fail' | null; [key: string]: unknown }) => ({
         ...result,
         is_passed: result.exam_result === 'pass' || false,
      }))

      return NextResponse.json({ results: processedResults || [] })
   } catch (error) {
      console.error('시험 결과 조회 API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// POST: 시험 결과 입력 (관리자용)
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { applicationId, examScore, examResult, certificateNumber, adminId } = body

      if (!applicationId || !examScore || !examResult) {
         return NextResponse.json({ error: 'Application ID, score, and result are required' }, { status: 400 })
      }

      // 관리자 권한 확인
      if (adminId) {
         const { data: admin } = await supabaseAdmin.from('profiles').select('role, status').eq('id', adminId).single()

         if (!admin || !admin.role || !['admin', 'super_admin'].includes(admin.role) || admin.status !== 'active') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
         }
      }

      // 시험 결과 업데이트
      const updateData: Record<string, unknown> = {
         exam_score: examScore,
         exam_result: examResult,
         updated_at: new Date().toISOString(),
      }

      // 합격인 경우 자격증 번호 생성
      if (examResult === 'pass') {
         if (certificateNumber) {
            updateData.certificate_number = certificateNumber
         } else {
            // 자동 생성: KHAMA-YYYY-순번
            const year = new Date().getFullYear()
            const { count } = await supabaseAdmin.from('exam_applications').select('id', { count: 'exact' }).eq('exam_result', 'pass').like('certificate_number', `KHAMA-${year}-%`)

            updateData.certificate_number = `KHAMA-${year}-${String((count || 0) + 1).padStart(4, '0')}`
         }
         updateData.certificate_issued_date = new Date().toISOString()
      }

      const { data: updatedApplication, error } = await supabaseAdmin
         .from('exam_applications')
         .update(updateData)
         .eq('id', applicationId)
         .select(
            `
            *,
            exam_schedules (
               exam_date,
               certifications (
                  name,
                  registration_number
               )
            )
         `
         )
         .single()

      if (error) {
         console.error('시험 결과 업데이트 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 신청 상태도 완료로 변경
      await supabaseAdmin
         .from('exam_applications')
         .update({
            application_status: 'completed',
            updated_at: new Date().toISOString(),
         })
         .eq('id', applicationId)

      console.log('시험 결과 업데이트 성공:', updatedApplication)
      return NextResponse.json({ application: updatedApplication })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
