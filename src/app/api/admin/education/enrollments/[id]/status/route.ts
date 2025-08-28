import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { id } = await params
    let { status } = await request.json()
    // UI에서 들어오는 값 보정
    if (status === 'confirmed') status = 'approved'
    const allowed = ['pending','approved','rejected','cancelled','completed']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: '허용되지 않는 상태 값입니다.' }, { status: 400 })
    }
    if (!status) return NextResponse.json({ error: 'status는 필수입니다.' }, { status: 400 })

    // 기존 레코드 조회 (상태 변경에 따른 정원 보정 대비)
    const { data: before, error: fetchError } = await supabaseAdmin
      .from('user_education_enrollments')
      .select('id, enrollment_status, education_schedule_id')
      .eq('id', id)
      .single()
    if (fetchError || !before) {
      return NextResponse.json({ error: '대상을 찾을 수 없습니다.' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('user_education_enrollments')
      .update({ enrollment_status: status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('수강 상태 변경 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 취소로 전환된 경우 현재 인원 감소 (중복 감소 방지)
    if (before.enrollment_status !== 'cancelled' && status === 'cancelled' && before.education_schedule_id) {
      await supabaseAdmin.rpc('decrement_schedule_participants', { schedule_id_input: before.education_schedule_id }).catch(async () => {
        // RPC가 없으면 직접 업데이트 (낙관적으로 1 감소)
        const { data: sch } = await supabaseAdmin
          .from('education_schedules')
          .select('current_participants')
          .eq('id', before.education_schedule_id)
          .single()
        const next = Math.max(0, (sch?.current_participants || 1) - 1)
        await supabaseAdmin
          .from('education_schedules')
          .update({ current_participants: next })
          .eq('id', before.education_schedule_id)
      })
    }

    return NextResponse.json({ message: '상태 변경 성공' })
  } catch (error) {
    console.error('수강 상태 변경 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
