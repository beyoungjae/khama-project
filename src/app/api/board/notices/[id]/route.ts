import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { type Notice } from '@/lib/supabase'

// 공지사항 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      // URL 처리에서 조회수 증가 여부 확인
      const { searchParams } = new URL(request.url)
      const incrementView = searchParams.get('increment') === 'true'

      // 공지사항 조회 (notices 테이블 사용)
      const { data: notice, error } = await supabaseAdmin.from('notices').select('*').eq('id', id).eq('is_published', true).single()

      if (error || !notice) {
         console.error('공지사항 조회 오류:', error)
         return NextResponse.json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 })
      }

      let updatedNotice = notice

      // 조회수 증가 (명시적으로 요청한 경우만)
      if (incrementView) {
         const { data: updated } = await supabaseAdmin
            .from('notices')
            .update({ view_count: (notice.view_count || 0) + 1 })
            .eq('id', id)
            .select()
            .single()

         updatedNotice = updated || { ...notice, view_count: (notice.view_count || 0) + 1 }
      }

      return NextResponse.json({
         notice: updatedNotice,
      })
   } catch (error: unknown) {
      console.error('공지사항 상세 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 공지사항 수정 (관리자 전용)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params
      const updateData = await request.json()

      const { title, content, excerpt, category, is_pinned, is_important } = updateData

      // 필수 필드 검증
      if (!title || !content) {
         return NextResponse.json({ error: '제목과 내용을 입력해주세요.' }, { status: 400 })
      }

      // 공지사항 수정
      const { data: post, error } = await supabaseAdmin
         .from('notices')
         .update({
            title,
            content,
            excerpt: excerpt || content.substring(0, 200) + '...',
            category,
            is_pinned,
            is_important,
         })
         .eq('id', id)
         .eq('type', 'notice')
         .select()
         .single()

      if (error) {
         console.error('공지사항 수정 오류:', error)
         return NextResponse.json({ error: '공지사항 수정에 실패했습니다.' }, { status: 400 })
      }

      if (!post) {
         return NextResponse.json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({
         post,
         message: '공지사항이 수정되었습니다.',
      })
   } catch (error: unknown) {
      console.error('공지사항 수정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 공지사항 삭제 (관리자 전용)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      // 공지사항 삭제 (실제로는 게시 상태를 false로 변경)
      const { error } = await supabaseAdmin.from('notices').update({ is_published: false }).eq('id', id)

      if (error) {
         console.error('공지사항 삭제 오류:', error)
         return NextResponse.json({ error: '공지사항 삭제에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         message: '공지사항이 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('공지사항 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
