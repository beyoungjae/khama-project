import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET: 교육 일정 목록 (관리자)
export async function GET(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20') || 20))
    const courseId = searchParams.get('courseId') || undefined
    const status = searchParams.get('status') || undefined
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin
      .from('education_schedules')
      .select(
        `*, education_courses:course_id (name, category)`,
        { count: 'exact' }
      )

    if (courseId) query = query.eq('course_id', courseId)
    if (status && status !== 'all') query = query.eq('status', status)

    const { data, error, count } = await query.order('start_date', { ascending: true }).range(from, to)
    if (error) {
      console.error('교육 일정 목록 조회 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      schedules: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('교육 일정 목록 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// POST: 교육 일정 생성 (관리자)
export async function POST(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const body = await request.json()

    const required = ['course_id', 'start_date', 'end_date', 'location', 'registration_start_date', 'registration_end_date']
    const missing = required.filter((k) => !body[k])
    if (missing.length > 0) {
      return NextResponse.json({ error: `필수 정보가 누락되었습니다: ${missing.join(', ')}` }, { status: 400 })
    }

    // 상태 자동 계산
    const now = new Date()
    const rs = new Date(body.registration_start_date)
    const re = new Date(body.registration_end_date)
    const sd = new Date(body.start_date)
    const ed = new Date(body.end_date)

    let computedStatus: string = 'scheduled'
    if (now < rs) computedStatus = 'scheduled'
    else if (now >= rs && now <= re) computedStatus = 'registration_open'
    else if (now > re && now < sd) computedStatus = 'registration_closed'
    else if (now >= sd && now <= ed) computedStatus = 'in_progress'
    else if (now > ed) computedStatus = 'completed'

    const payload = {
      course_id: body.course_id,
      start_date: body.start_date,
      end_date: body.end_date,
      registration_start_date: body.registration_start_date,
      registration_end_date: body.registration_end_date,
      location: body.location,
      address: body.address || null,
      classroom: body.classroom || null,
      max_participants: typeof body.max_participants === 'number' ? body.max_participants : parseInt(body.max_participants || '0') || 0,
      special_notes: body.special_notes || null,
      status: body.status || computedStatus,
    }

    const { data, error } = await supabaseAdmin
      .from('education_schedules')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('교육 일정 생성 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ schedule: data, message: '교육 일정이 성공적으로 생성되었습니다.' })
  } catch (error) {
    console.error('교육 일정 생성 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
