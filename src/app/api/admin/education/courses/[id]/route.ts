import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { id } = await params
    const updates = await request.json()

    const allowed = ['name','description','category','course_code','duration_hours','max_participants','course_fee','prerequisites','instructor_name','instructor_bio','materials_included','status']
    const body = Object.keys(updates).filter(k=>allowed.includes(k)).reduce((o,k)=>{ o[k]=updates[k]; return o }, {} as Record<string, any>)
    // status 값 유효성 검사 (DB 체크 제약과 일치)
    if (typeof body.status !== 'undefined') {
      const courseStatusAllowed = ['active', 'inactive', 'draft']
      if (!courseStatusAllowed.includes(body.status)) {
        delete body.status
      }
    }
    body.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('education_courses')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('교육 과정 수정 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ course: data, message: '교육 과정이 수정되었습니다.' })
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
