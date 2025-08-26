import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: QNA 질문 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const category = searchParams.get('category')
      const search = searchParams.get('search')
      const userId = searchParams.get('userId')
      const status = searchParams.get('status')

      const offset = (page - 1) * limit

      // 기본 쿼리 (공개 질문만 또는 사용자 본인의 질문)
      let query = supabaseAdmin.from('qna_questions').select(
         `
            *,
            qna_answers (
               id,
               content,
               author_name,
               is_official,
               created_at
            )
         `,
         { count: 'exact' }
      )

      // 사용자 본인 질문이면 모두 조회, 아니면 공개 질문만
      if (userId) {
         query = query.or(`author_id.eq.${userId},is_private.eq.false`)
      } else {
         query = query.eq('is_private', false)
      }

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      // 상태 필터
      if (status && status !== 'all') {
         if (status === 'answered') {
            query = query.eq('is_answered', true)
         } else if (status === 'pending') {
            query = query.eq('is_answered', false)
         } else {
            query = query.eq('status', status)
         }
      }

      // 검색 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // 정렬 및 페이지네이션
      const { data: questions, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      if (error) {
         console.error('QNA 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // 페이지네이션 정보
      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         questions: questions || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
         },
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// POST: 새로운 질문 작성
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { userId, title, content, category, isPrivate, authorName, authorEmail } = body

      if (!userId || !title || !content) {
         return NextResponse.json({ error: 'User ID, title, and content are required' }, { status: 400 })
      }

      // 사용자 정보 확인
      const { data: profile } = await supabaseAdmin.from('profiles').select('name').eq('id', userId).single()

      // 질문 생성
      const { data: question, error } = await supabaseAdmin
         .from('qna_questions')
         .insert({
            author_id: userId,
            title: title.trim(),
            content: content.trim(),
            category: category || 'general',
            is_private: isPrivate || false,
            author_name: authorName || profile?.name || '익명',
            author_email: authorEmail,
            status: 'pending',
         })
         .select()
         .single()

      if (error) {
         console.error('질문 생성 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('질문 생성 성공:', question)
      return NextResponse.json({ question })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// PUT: 조회수 증가 또는 질문 수정
export async function PUT(request: NextRequest) {
   try {
      const body = await request.json()
      const { questionId, action, userId, updateData } = body

      if (!questionId) {
         return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
      }

      // 조회수 증가
      if (action === 'increment_view') {
         await supabaseAdmin
            .from('qna_questions')
            .update({
               view_count: supabaseAdmin.rpc('increment', { x: 1 }),
            })
            .eq('id', questionId)

         return NextResponse.json({ success: true })
      }

      // 질문 수정 (작성자만 가능)
      if (action === 'update' && userId && updateData) {
         // 권한 확인
         const { data: question } = await supabaseAdmin.from('qna_questions').select('author_id, is_answered').eq('id', questionId).single()

         if (!question || question.author_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
         }

         if (question.is_answered) {
            return NextResponse.json({ error: '답변된 질문은 수정할 수 없습니다.' }, { status: 400 })
         }

         // 질문 업데이트
         const { data: updatedQuestion, error } = await supabaseAdmin
            .from('qna_questions')
            .update({
               ...updateData,
               updated_at: new Date().toISOString(),
            })
            .eq('id', questionId)
            .select()
            .single()

         if (error) {
            console.error('질문 수정 오류:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
         }

         return NextResponse.json({ question: updatedQuestion })
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
