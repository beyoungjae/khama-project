import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Q&A 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const search = searchParams.get('search')
      const answered = searchParams.get('answered') // 'true', 'false', null

      const offset = (page - 1) * limit

      // QnA 조회 쿼리 구성 (qna_questions 테이블 사용)
      let query = supabaseAdmin.from('qna_questions').select('*', { count: 'exact' })

      // 카테고리 필터
      if (category && category !== '전체') {
         // 카테고리 매핑
         const categoryMap: Record<string, string> = {
            '시험문의': 'exam',
            '교육문의': 'education', 
            '자격증문의': 'certificate',
            '기타문의': 'general'
         }
         const mappedCategory = categoryMap[category] || category
         query = query.eq('category', mappedCategory)
      }

      // 답변 상태 필터
      if (answered === 'true') {
         query = query.eq('is_answered', true)
      } else if (answered === 'false') {
         query = query.eq('is_answered', false)
      }

      // 검색
      if (search) {
         query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // 정렬 (최신순)
      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      const { data: questions, error, count } = await query

      if (error) {
         console.error('Q&A 조회 오류:', error)
         return NextResponse.json({ error: 'Q&A를 조회할 수 없습니다.' }, { status: 500 })
      }

      // 카테고리를 한글로 변환
      const categoryReverseMap: Record<string, string> = {
         exam: '시험문의',
         education: '교육문의',
         certificate: '자격증문의',
         general: '기타문의'
      }

      const transformedQuestions = (questions || []).map(q => ({
         ...q,
         category: categoryReverseMap[q.category] || q.category
      }))

      return NextResponse.json({
         posts: transformedQuestions,
         pagination: {
            current_page: page,
            total_pages: Math.ceil((count || 0) / limit),
            total_count: count || 0,
            per_page: limit,
         },
      })
   } catch (error: unknown) {
      console.error('Q&A 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// Q&A 작성
export async function POST(request: NextRequest) {
   try {
      const qnaData = await request.json()
      const { title, content, category, is_private = false, author_name = '익명', author_email, author_phone } = qnaData

      // 필수 필드 검증
      if (!title || !content || !category) {
         return NextResponse.json({ error: '제목, 내용, 카테고리를 모두 입력해주세요.' }, { status: 400 })
      }

      // 카테고리 매핑
      const categoryMap: Record<string, string> = {
         '시험문의': 'exam',
         '교육문의': 'education', 
         '자격증문의': 'certificate',
         '기타문의': 'general'
      }
      const mappedCategory = categoryMap[category] || 'general'

      // 더미 author_id 생성 (실제 인증 시스템 없으므로)
      const dummyAuthorId = '47ff3237-383e-4c6c-888c-d3a8fc71938e'

      // Q&A 작성 (qna_questions 테이블에)
      const { data: question, error } = await supabaseAdmin
         .from('qna_questions')
         .insert([
            {
               title,
               content,
               category: mappedCategory,
               author_id: dummyAuthorId,
               author_name,
               author_email: author_email || null,
               // author_phone 컴럼이 없으므로 author_email에 전화번호 정보 함께 저장
               // 또는 분리된 필드로 처리 가능
               is_private,
               is_answered: false,
               status: 'pending',
               view_count: 0,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            },
         ])
         .select()
         .single()

      if (error) {
         console.error('Q&A 작성 오류:', error)
         return NextResponse.json({ error: 'Q&A 작성에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         question,
         message: '질문이 등록되었습니다.',
      })
   } catch (error: unknown) {
      console.error('Q&A 작성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
