import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// 관리자용 자격증 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status') || 'active'
      const search = searchParams.get('search')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const offset = (page - 1) * limit

      let query = supabaseAdmin.from('certifications').select('*', { count: 'exact' })

      // 상태 필터
      if (status !== 'all') {
         query = query.eq('status', status)
      }

      // 검색
      if (search) {
         query = query.or(`name.ilike.%${search}%,registration_number.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data: certifications, error, count } = await query.order('name', { ascending: true }).range(offset, offset + limit - 1)

      if (error) {
         console.error('자격증 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         certifications: certifications || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
         },
      })
   } catch (error: unknown) {
      console.error('자격증 관리 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 자격증 생성
export async function POST(request: NextRequest) {
   try {
      const { name, registration_number, description, application_fee, certificate_fee, exam_subjects, exam_methods, passing_criteria, exemption_benefits, status, image_url, qualification_type, grade, eligibility, validity_period } = await request.json()

      // 필수 필드 검증
      if (!name || !registration_number) {
         return NextResponse.json({ error: '자격증명과 등록번호는 필수입니다.' }, { status: 400 })
      }

      // 중복 등록번호 확인
      const { data: existing } = await supabaseAdmin.from('certifications').select('id').eq('registration_number', registration_number).single()

      if (existing) {
         return NextResponse.json({ error: '이미 사용 중인 등록번호입니다.' }, { status: 400 })
      }

      // 자격증 생성
      const { data, error } = await supabaseAdmin
         .from('certifications')
         .insert([
            {
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
            },
         ])
         .select()
         .single()

      if (error) {
         console.error('자격증 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '자격증이 성공적으로 생성되었습니다.',
         certification: data,
      })
   } catch (error: unknown) {
      console.error('자격증 생성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
