import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../../login/route'

// GET: 특정 회원 상세 정보 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      // profiles와 exam_applications 테이블을 명시적으로 조인하여 조회
      const { data: member, error } = await supabaseAdmin
         .from('profiles')
         .select(
            `
            *,
            exam_applications:user_id (
               id,
               application_number,
               application_status,
               created_at,
               exam_schedule_id,
               certification_id
            ),
            qna_questions:author_id (
               id,
               title,
               created_at,
               is_answered
            )
         `
         )
         .eq('id', id)
         .single()

      // exam_applications에 대한 추가 정보 조회
      if (member && member.exam_applications && Array.isArray(member.exam_applications) && member.exam_applications.length > 0) {
         const examScheduleIds = member.exam_applications.map((app: any) => app.exam_schedule_id).filter(Boolean)
         const certificationIds = member.exam_applications.map((app: any) => app.certification_id).filter(Boolean)

         if (examScheduleIds.length > 0) {
            const { data: examSchedules, error: scheduleError } = await supabaseAdmin
               .from('exam_schedules')
               .select(
                  `
                  id,
                  exam_date,
                  exam_location,
                  certification_id,
                  certifications (
                     name
                  )
               `
               )
               .in('id', examScheduleIds)

            if (!scheduleError && examSchedules) {
               // exam_applications에 exam_schedules 정보 매핑
               member.exam_applications = member.exam_applications.map((app: any) => {
                  const schedule = examSchedules.find((s: any) => s.id === app.exam_schedule_id)
                  return {
                     ...app,
                     exam_schedules: schedule || null,
                  }
               })
            }
         }
      }

      if (error) {
         if (error.code === 'PGRST116') {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
         }
         console.error('회원 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ member })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// PATCH: 회원 정보 수정
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params
      const body = await request.json()

      const allowedFields = ['status', 'role', 'name', 'phone', 'address']
      const updates = Object.keys(body)
         .filter((key) => allowedFields.includes(key))
         .reduce(
            (obj, key) => {
               obj[key] = body[key]
               return obj
            },
            {} as Record<string, string | number | boolean>
         )

      if (Object.keys(updates).length === 0) {
         return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
      }

      updates.updated_at = new Date().toISOString()

      const { data: updatedMember, error } = await supabaseAdmin.from('profiles').update(updates).eq('id', id).select().single()

      if (error) {
         console.error('회원 정보 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ member: updatedMember })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// DELETE: 회원 삭제 (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      // 회원을 완전히 삭제하지 않고 비활성화
      const { data: deletedMember, error } = await supabaseAdmin
         .from('profiles')
         .update({
            status: 'deleted',
            updated_at: new Date().toISOString(),
         })
         .eq('id', id)
         .select()
         .single()

      if (error) {
         console.error('회원 삭제 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
         message: 'Member deleted successfully',
         member: deletedMember,
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
