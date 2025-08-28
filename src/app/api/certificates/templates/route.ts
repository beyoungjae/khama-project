import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 자격증 템플릿 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const certificationId = searchParams.get('certificationId')
      const isActive = searchParams.get('isActive') || 'true'

      let query = supabaseAdmin.from('certificate_templates').select('*')

      // 특정 자격증의 템플릿만 조회
      if (certificationId) {
         query = query.eq('certification_id', certificationId)
      }

      // 활성 상태 필터
      if (isActive === 'true') {
         query = query.eq('is_active', true)
      }

      // 정렬
      query = query.order('created_at', { ascending: false })

      const { data: templates, error } = await query

      if (error) {
         console.error('자격증 템플릿 목록 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ templates: templates || [] })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// POST: 자격증 템플릿 생성 (관리자용)
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { certification_id, name, description, template_image_url, is_active = true } = body

      // 필수 필드 검증
      if (!certification_id || !name || !template_image_url) {
         return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
      }

      // 자격증 템플릿 생성
      const { data: template, error } = await supabaseAdmin
         .from('certificate_templates')
         .insert({
            certification_id,
            name,
            description,
            template_image_url,
            is_active,
         })
         .select()
         .single()

      if (error) {
         console.error('자격증 템플릿 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ template, message: '자격증 템플릿이 성공적으로 생성되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
