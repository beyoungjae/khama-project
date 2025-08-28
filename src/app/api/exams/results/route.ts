import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// 시험 결과 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const applicationId = searchParams.get('applicationId')
      const scheduleId = searchParams.get('scheduleId')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const offset = (page - 1) * limit

      // exam_applications 테이블에서 결과를 가져오기
      let query = supabaseAdmin
         .from('exam_applications')
         .select(
            `
            id,
            exam_number,
            written_score,
            practical_score,
            total_score,
            pass_status,
            exam_taken_at,
            created_at,
            exam_schedules (
               id,
               exam_date,
               exam_location,
               exam_address,
               result_announcement_date,
               certifications (
                  id,
                  name,
                  registration_number
               )
            )
         `,
            { count: 'exact' }
         )
         .not('total_score', 'is', null) // 결과가 있는 항목만

      // 사용자별 결과 조회
      if (userId) {
         query = query.eq('user_id', userId)
      }

      // 특정 신청별 결과 조회
      if (applicationId) {
         query = query.eq('application_id', applicationId)
      }

      // 특정 시험 일정별 결과 조회
      if (scheduleId) {
         const { data: applicationIds } = await supabaseAdmin.from('exam_applications').select('id').eq('exam_schedule_id', scheduleId)

         if (applicationIds && applicationIds.length > 0) {
            const ids = applicationIds.map((app) => app.id)
            query = query.in('application_id', ids)
         } else {
            // 해당 일정에 신청한 사람이 없으면 빈 결과 반환
            return NextResponse.json({
               results: [],
               pagination: {
                  page,
                  limit,
                  total: 0,
                  totalPages: 0,
                  hasNext: false,
                  hasPrev: false,
               },
            })
         }
      }

      const { data: results, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      // 데이터 구조를 result 형태로 변환
      const transformedResults = (results || []).map((app) => ({
         id: app.id,
         written_score: app.written_score,
         practical_score: app.practical_score,
         total_score: app.total_score,
         result_status: app.pass_status || 'pending',
         announced_at: app.exam_schedules?.result_announcement_date || app.exam_taken_at,
         exam_applications: {
            id: app.id,
            application_number: app.exam_number,
            exam_schedules: {
               exam_date: app.exam_schedules?.exam_date,
               certifications: {
                  name: app.exam_schedules?.certifications?.name,
               },
            },
         },
      }))

      if (error) {
         console.error('시험 결과 조회 오류:', error)
         return NextResponse.json({ error: '시험 결과를 조회할 수 없습니다.' }, { status: 500 })
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         results: transformedResults,
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
      console.error('시험 결과 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// POST: 시험 결과 등록 (관리자용)
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { applicationId, userId, scoreData, status, certificateIssued } = body

      if (!applicationId || !userId || !scoreData) {
         return NextResponse.json({ error: 'Application ID, User ID, and score data are required' }, { status: 400 })
      }

      // 신청 정보 확인
      const { data: application, error: appError } = await supabaseAdmin.from('exam_applications').select('*, exam_schedules(*, certifications(*))').eq('id', applicationId).single()

      if (appError || !application) {
         return NextResponse.json({ error: '시험 신청을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 이미 결과가 등록되었는지 확인
      if (application.pass_status !== null) {
         return NextResponse.json({ error: '이미 등록된 결과가 있습니다.' }, { status: 400 })
      }

      // 합격/불합격 결정
      const passStatus = scoreData.total_score >= (scoreData.pass_score || 60)

      // exam_applications 테이블에 결과 업데이트
      const { data: result, error } = await supabaseAdmin
         .from('exam_applications')
         .update({
            written_score: scoreData.written_score,
            practical_score: scoreData.practical_score,
            total_score: scoreData.total_score,
            pass_status: passStatus,
            exam_taken_at: new Date().toISOString(),
         })
         .eq('id', applicationId)
         .select()
         .single()

      if (error) {
         console.error('시험 결과 등록 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 신청 상태 업데이트
      await supabaseAdmin
         .from('exam_applications')
         .update({
            application_status: passStatus === 'pass' ? 'passed' : 'failed',
         })
         .eq('id', applicationId)

      console.log('시험 결과 등록 성공:', result)
      return NextResponse.json({ result })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
