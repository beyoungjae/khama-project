import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// 관리자용 자격증 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: certificationId } = await params

      const { data: certification, error } = await supabaseAdmin.from('certifications').select('*').eq('id', certificationId).single()

      if (error) {
         console.error('자격증 상세 조회 오류:', error)
         return NextResponse.json({ error: '자격증을 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({ certification })
   } catch (error: unknown) {
      console.error('자격증 상세 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 자격증 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: certificationId } = await params
      const { name, registration_number, description, application_fee, certificate_fee, exam_subjects, exam_methods, passing_criteria, exemption_benefits, status, image_url, qualification_type, grade, eligibility, validity_period } = await request.json()

      // 필수 필드 검증
      if (!name || !registration_number) {
         return NextResponse.json({ error: '자격증명과 등록번호는 필수입니다.' }, { status: 400 })
      }

      // 중복 등록번호 확인 (다른 자격증과 중복되는지)
      const { data: existing } = await supabaseAdmin.from('certifications').select('id').eq('registration_number', registration_number).neq('id', certificationId).single()

      if (existing) {
         return NextResponse.json({ error: '이미 사용 중인 등록번호입니다.' }, { status: 400 })
      }

      // 자격증 수정
      const { data, error } = await supabaseAdmin
         .from('certifications')
         .update({
            name,
            registration_number,
            description,
            application_fee: application_fee || 0,
            certificate_fee: certificate_fee || 0,
            exam_subjects,
            exam_methods,
            passing_criteria,
            exemption_benefits,
            image_url,
            qualification_type,
            grade,
            eligibility,
            validity_period,
            status: status || 'active',
            updated_at: new Date().toISOString(),
         })
         .eq('id', certificationId)
         .select()
         .single()

      if (error) {
         console.error('자격증 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '자격증이 성공적으로 수정되었습니다.',
         certification: data,
      })
   } catch (error: unknown) {
      console.error('자격증 수정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 자격증 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: certificationId } = await params

      // 연결된 시험 일정이 있는지 확인
      const { count: schedulesCount } = await supabaseAdmin.from('exam_schedules').select('id', { count: 'exact', head: true }).eq('certification_id', certificationId)

      if (schedulesCount && schedulesCount > 0) {
         return NextResponse.json({ error: `이 자격증과 연결된 ${schedulesCount}개의 시험 일정이 있어 삭제할 수 없습니다. 먼저 관련 시험 일정을 삭제해주세요.` }, { status: 400 })
      }

      // 자격증 삭제
      const { error } = await supabaseAdmin.from('certifications').delete().eq('id', certificationId)

      if (error) {
         console.error('자격증 삭제 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '자격증이 성공적으로 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('자격증 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
