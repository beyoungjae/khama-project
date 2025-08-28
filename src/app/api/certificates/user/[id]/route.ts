import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 사용자의 자격증 목록 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: userId } = await params

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      // 사용자의 자격증 목록 조회 (exam_applications 테이블에서 합격한 내역)
      const { data: certificates, error } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
            id,
            exam_number,
            pass_status,
            exam_taken_at,
            certifications (
              name,
              registration_number
            ),
            exam_schedules (
              exam_date,
              exam_location
            )
          `
         )
         .eq('user_id', userId)
         .eq('pass_status', true)
         .order('exam_taken_at', { ascending: false })

      if (error) {
         console.error('사용자 자격증 목록 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ certificates: certificates || [] })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
