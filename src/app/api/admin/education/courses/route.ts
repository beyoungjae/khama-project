import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// POST: 교육 과정 생성 (admin)
export async function POST(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const body = await request.json()
    const {
      name,
      description,
      category,
      course_code,
      duration_hours = 0,
      max_participants = 0,
      course_fee = 0,
      prerequisites,
      instructor_name,
      instructor_bio,
      materials_included,
    } = body

    if (!name || !category || !course_code) {
      return NextResponse.json({ error: 'name, category, course_code는 필수입니다.' }, { status: 400 })
    }

    // 중복 코드 체크
    const { data: existing } = await supabaseAdmin
      .from('education_courses')
      .select('id')
      .eq('course_code', course_code)
      .single()

    if (existing) {
      return NextResponse.json({ error: '이미 존재하는 course_code 입니다.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('education_courses')
      .insert([
        {
          name,
          description,
          category,
          course_code,
          duration_hours,
          max_participants,
          course_fee,
          prerequisites,
          instructor_name,
          instructor_bio,
          materials_included,
          status: 'active',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('교육 과정 생성 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '교육 과정 생성 성공', course: data })
  } catch (error) {
    console.error('교육 과정 생성 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// GET: 교육 과정 목록 조회 (admin)
export async function GET(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || undefined // admin은 상태 필터 미지정 시 전체
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin.from('education_courses').select('*', { count: 'exact' })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)

    if (error) {
      console.error('교육 과정 목록 조회 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      courses: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.max(1, Math.ceil((count || 0) / limit)),
      },
    })
  } catch (error) {
    console.error('교육 과정 목록 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
