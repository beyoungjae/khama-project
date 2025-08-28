import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getIronSession } from 'iron-session'
import { adminSessionOptions, type SessionData } from '@/lib/session'

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id } = await params
      
      console.log('문의 답변 API 호출')
      
      // iron-session에서 관리자 세션 확인
      const session = await getIronSession<SessionData>(request, NextResponse.next(), adminSessionOptions)
      
      console.log('관리자 세션 상태:', { hasAdmin: !!session.admin, adminId: session.admin?.id })
      
      if (!session.admin) {
         console.log('관리자 세션 없음 - 로그인 필요')
         return NextResponse.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 })
      }
      
      const admin = session.admin
      console.log('인증된 관리자:', { adminId: admin.id, email: admin.email })
      
      const body = await request.json()
      const { response } = body

      if (!response || !response.trim()) {
         return NextResponse.json(
            { error: '답변 내용이 필요합니다.' },
            { status: 400 }
         )
      }

      // 문의에 대한 답변 업데이트 (inquiries 테이블 사용)
      // answered_by 필드는 UUID 타입이므로 null로 처리하거나 실제 UUID를 사용해야 함
      const { data, error } = await supabaseAdmin
         .from('inquiries')
         .update({
            admin_response: response.trim(),
            answered_by: null, // 임시로 null 처리 (UUID 타입 오류 방지)
            answered_at: new Date().toISOString(),
            is_answered: true,
            status: 'completed'
         })
         .eq('id', id)
         .select()
         .single()

      if (error) {
         console.error('답변 등록 오류:', error)
         return NextResponse.json(
            { error: '답변 등록에 실패했습니다.' },
            { status: 500 }
         )
      }

      return NextResponse.json({
         message: '답변이 성공적으로 등록되었습니다.',
         inquiry: data
      })

   } catch (error) {
      console.error('답변 등록 API 오류:', error)
      return NextResponse.json(
         { error: '서버 오류가 발생했습니다.' },
         { status: 500 }
      )
   }
}