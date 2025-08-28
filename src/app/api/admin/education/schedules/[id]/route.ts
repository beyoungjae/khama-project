import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET: 일정 상세 (관리자)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('education_schedules')
      .select(`*, education_courses:course_id (id, name, category, course_code)`) 
      .eq('id', id)
      .single()

    if (error) {
      console.error('일정 상세 조회 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) return NextResponse.json({ error: '일정을 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json({ schedule: data })
  } catch (error) {
    console.error('일정 상세 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// PATCH: 일정 수정 (관리자)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { id } = await params
    const updates = await request.json()

    const allowed = ['start_date','end_date','registration_start_date','registration_end_date','location','address','classroom','max_participants','status','special_notes']
    const body = Object.keys(updates).filter((k)=>allowed.includes(k)).reduce((o,k)=>{ o[k]=updates[k]; return o }, {} as Record<string, any>)
    body.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('education_schedules')
      .update(body)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('일정 수정 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ schedule: data, message: '일정이 수정되었습니다.' })
  } catch (error) {
    console.error('일정 수정 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// DELETE: 일정 삭제 (관리자)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { id } = await params
    const { error } = await supabaseAdmin.from('education_schedules').delete().eq('id', id)
    if (error) {
      console.error('일정 삭제 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: '일정이 삭제되었습니다.' })
  } catch (error) {
    console.error('일정 삭제 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

