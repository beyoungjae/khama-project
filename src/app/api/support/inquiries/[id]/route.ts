import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 1:1 문의 상세 정보 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      if (!id) {
         return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
      }

      // 1:1 문의 상세 정보 조회
      const { data: inquiry, error } = await supabaseAdmin.from('posts').select('*').eq('id', id).eq('type', 'inquiry').single()

      if (error) {
         console.error('1:1 문의 상세 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if (!inquiry) {
         return NextResponse.json({ error: '1:1 문의를 찾을 수 없습니다.' }, { status: 404 })
      }

      // 조회수 증가
      await supabaseAdmin
         .from('posts')
         .update({
            view_count: (inquiry.view_count || 0) + 1,
         })
         .eq('id', id)

      return NextResponse.json({ inquiry })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// PUT: 1:1 문의 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params
      const body = await request.json()
      const { title, content, category, is_private, status } = body

      if (!id) {
         return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
      }

      // 1:1 문의 수정
      const { data: inquiry, error } = await supabaseAdmin
         .from('posts')
         .update({
            title,
            content,
            category,
            is_private,
            status,
            updated_at: new Date().toISOString(),
         })
         .eq('id', id)
         .eq('type', 'inquiry')
         .select()
         .single()

      if (error) {
         console.error('1:1 문의 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if (!inquiry) {
         return NextResponse.json({ error: '1:1 문의를 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({ inquiry, message: '1:1 문의가 성공적으로 수정되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// DELETE: 1:1 문의 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      if (!id) {
         return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
      }

      // 1:1 문의 삭제
      const { error } = await supabaseAdmin.from('posts').delete().eq('id', id).eq('type', 'inquiry')

      if (error) {
         console.error('1:1 문의 삭제 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ message: '1:1 문의가 성공적으로 삭제되었습니다.' })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
