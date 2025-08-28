import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { type Notice, type Updates } from '@/lib/supabase'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

// 관리자용 공지사항 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: postId } = await params

      const { data: post, error } = await supabaseAdmin
         .from('notices')
         .select(
            `
        id,
        title,
        content,
        excerpt,
        category,
        is_published,
        is_pinned,
        is_important,
        view_count,
        published_at,
        created_at,
        updated_at,
        author_name
      `
         )
         .eq('id', postId)
         .single()

      if (error) {
         console.error('공지사항 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      if (!post) {
         return NextResponse.json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({ notice: post })
   } catch (error: unknown) {
      console.error('공지사항 상세 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 공지사항 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      // 인증 확인 (헤더 또는 쿠키)
      const { valid } = await verifyAdminTokenFromRequest(request)

      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { id: postId } = await params
      const { title, content, excerpt, category, status, is_pinned, is_important, published_at } = await request.json()

      if (!title || !content) {
         return NextResponse.json({ error: '제목과 내용은 필수입니다.' }, { status: 400 })
      }

      // excerpt가 없으면 content에서 자동 생성
      const finalExcerpt = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 200)

      const updateData: Record<string, unknown> = {
         title,
         content,
         excerpt: finalExcerpt,
         category: category || 'general',
         is_published: status === 'published',
         is_pinned: is_pinned || false,
         is_important: is_important || false,
         updated_at: new Date().toISOString(),
      }

      // published_at 처리
      if (status === 'published' && !published_at) {
         updateData.published_at = new Date().toISOString()
      } else if (status === 'published' && published_at) {
         updateData.published_at = published_at
      } else if (status !== 'published') {
         updateData.published_at = null
      }

      const { data, error } = await supabaseAdmin.from('notices').update(updateData).eq('id', postId).select().single()

      if (error) {
         console.error('공지사항 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      if (!data) {
         return NextResponse.json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({
         message: '공지사항이 성공적으로 수정되었습니다.',
         notice: data,
      })
   } catch (error: unknown) {
      console.error('공지사항 수정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 관리자용 공지사항 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      // 인증 확인 (헤더 또는 쿠키)
      const { valid } = await verifyAdminTokenFromRequest(request)

      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { id: postId } = await params

      const { error } = await supabaseAdmin.from('notices').delete().eq('id', postId)

      if (error) {
         console.error('공지사항 삭제 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '공지사항이 성공적으로 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('공지사항 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
