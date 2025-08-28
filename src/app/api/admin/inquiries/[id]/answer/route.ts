import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// POST: 관리자 1:1 문의 답변
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params
      const body = await request.json()
      const { answer_content, admin_id, admin_name } = body

      if (!id) {
         return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
      }

      if (!answer_content || !admin_id || !admin_name) {
         return NextResponse.json({ error: '답변 내용과 관리자 정보가 필요합니다.' }, { status: 400 })
      }

      // 관리자 권한 확인 (헤더 또는 쿠키)
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 1:1 문의 답변 생성
      const { data: answer, error } = await supabaseAdmin
         .from('inquiry_answers')
         .insert({
            inquiry_id: id,
            content: answer_content,
            admin_id,
            admin_name,
         })
         .select()
         .single()

      if (error) {
         console.error('1:1 문의 답변 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 원본 1:1 문의의 상태를 'answered'로 업데이트
      await supabaseAdmin
         .from('posts')
         .update({
            is_answered: true,
            status: 'answered',
            answered_at: new Date().toISOString(),
         })
         .eq('id', id)
         .eq('type', 'inquiry')

      return NextResponse.json({ answer, message: '답변이 성공적으로 등록되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
