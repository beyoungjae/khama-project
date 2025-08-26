import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 댓글 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const postId = searchParams.get('post_id')

      if (!postId) {
         return NextResponse.json({ error: '게시글 ID가 필요합니다.' }, { status: 400 })
      }

      // 댓글 조회 (계층 구조 포함)
      const { data: comments, error } = await supabase.from('comments').select('*').eq('post_id', postId).eq('status', 'published').order('created_at', { ascending: true })

      if (error) {
         console.error('댓글 조회 오류:', error)
         return NextResponse.json({ error: '댓글을 조회할 수 없습니다.' }, { status: 500 })
      }

      // 계층 구조로 정리
      const rootComments = comments.filter((comment) => !comment.parent_comment_id)
      const childComments = comments.filter((comment) => comment.parent_comment_id)

      const commentsWithChildren = rootComments.map((comment) => ({
         ...comment,
         children: childComments.filter((child) => child.parent_comment_id === comment.id),
      }))

      return NextResponse.json({
         comments: commentsWithChildren,
         count: comments.length,
      })
   } catch (error: unknown) {
      console.error('댓글 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 댓글 작성
export async function POST(request: NextRequest) {
   try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const commentData = await request.json()
      const { post_id, content, parent_comment_id } = commentData

      // 필수 필드 검증
      if (!post_id || !content) {
         return NextResponse.json({ error: '게시글 ID와 댓글 내용을 입력해주세요.' }, { status: 400 })
      }

      // 게시글 존재 확인
      const { data: post, error: postError } = await supabase.from('posts').select('id, type').eq('id', post_id).single()

      if (postError || !post) {
         return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
      }

      // 관리자 권한 확인 (Q&A 답변의 경우)
      let isAdminAuthor = false
      let authorName = '사용자'

      const { data: adminData } = await supabase.from('admins').select('id, role').eq('user_id', user.id).eq('status', 'active').single()

      if (adminData) {
         isAdminAuthor = true
         authorName = '관리자'
      } else {
         // 일반 사용자 이름 조회
         const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()

         authorName = profile?.name || user.email?.split('@')[0] || '사용자'
      }

      // 계층 깊이 계산
      let depth = 0
      if (parent_comment_id) {
         const { data: parentComment } = await supabase.from('comments').select('depth').eq('id', parent_comment_id).single()

         if (parentComment) {
            depth = parentComment.depth + 1
         }
      }

      // 댓글 생성
      const { data: comment, error } = await supabase
         .from('comments')
         .insert([
            {
               post_id,
               content,
               parent_comment_id,
               depth,
               author_type: isAdminAuthor ? 'admin' : 'user',
               author_id: user.id,
               author_name: authorName,
               is_official_answer: isAdminAuthor && post.type === 'qna',
               status: 'published',
            },
         ])
         .select()
         .single()

      if (error) {
         console.error('댓글 작성 오류:', error)
         return NextResponse.json({ error: '댓글 작성에 실패했습니다.' }, { status: 400 })
      }

      // Q&A인 경우 관리자 답변 시 답변 완료 처리
      if (isAdminAuthor && post.type === 'qna') {
         await supabase
            .from('posts')
            .update({
               is_answered: true,
               answered_at: new Date().toISOString(),
            })
            .eq('id', post_id)
      }

      return NextResponse.json({
         comment,
         message: '댓글이 등록되었습니다.',
      })
   } catch (error: unknown) {
      console.error('댓글 작성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
