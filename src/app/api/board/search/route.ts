import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 통합 검색 API
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const query = searchParams.get('q')
      const type = searchParams.get('type') // 'notice', 'qna', 'all'
      const limit = parseInt(searchParams.get('limit') || '20')

      if (!query || query.trim().length < 2) {
         return NextResponse.json({ error: '검색어는 2자 이상 입력해주세요.' }, { status: 400 })
      }

      const searchQuery = query.trim()
      const results: {
         notices: Array<Record<string, unknown>>
         qna: Array<Record<string, unknown>>
         all?: Array<Record<string, unknown>>
         total: number
      } = {
         notices: [],
         qna: [],
         total: 0,
      }

      // 공지사항 검색
      if (!type || type === 'all' || type === 'notice') {
         const { data: notices, error: noticeError } = await supabase
            .from('posts')
            .select('id, title, content, excerpt, category, created_at, view_count')
            .eq('type', 'notice')
            .eq('status', 'published')
            .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
            .order('created_at', { ascending: false })
            .limit(type === 'notice' ? limit : Math.floor(limit / 2))

         if (!noticeError && notices) {
            results.notices = notices.map((post) => ({
               ...post,
               type: 'notice',
               highlight: highlightSearchTerm(post.title, searchQuery),
            }))
         }
      }

      // Q&A 검색
      if (!type || type === 'all' || type === 'qna') {
         const { data: qnas, error: qnaError } = await supabase
            .from('posts')
            .select('id, title, content, excerpt, question_type, is_answered, created_at')
            .eq('type', 'qna')
            .eq('status', 'published')
            .eq('is_private', false) // 공개 Q&A만 검색
            .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
            .order('created_at', { ascending: false })
            .limit(type === 'qna' ? limit : Math.floor(limit / 2))

         if (!qnaError && qnas) {
            results.qna = qnas.map((post) => ({
               ...post,
               type: 'qna',
               highlight: highlightSearchTerm(post.title, searchQuery),
            }))
         }
      }

      results.total = results.notices.length + results.qna.length

      // 통합 결과 정렬 (관련도순 - 제목에 검색어가 포함된 것 우선)
      if (type === 'all') {
         const allResults = [...results.notices, ...results.qna]
         allResults.sort((a, b) => {
            const aTitle = String(a.title || '')
            const bTitle = String(b.title || '')
            const aCreatedAt = String(a.created_at || '')
            const bCreatedAt = String(b.created_at || '')

            const aInTitle = aTitle.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0
            const bInTitle = bTitle.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0

            if (aInTitle !== bInTitle) {
               return bInTitle - aInTitle // 제목에 포함된 것 우선
            }

            return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime() // 최신순
         })

         results.all = allResults.slice(0, limit)
      }

      return NextResponse.json({
         query: searchQuery,
         results,
         searched_at: new Date().toISOString(),
      })
   } catch (error: unknown) {
      console.error('통합 검색 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 검색어 하이라이트 함수
function highlightSearchTerm(text: string, searchTerm: string): string {
   if (!text || !searchTerm) return text

   const regex = new RegExp(`(${searchTerm})`, 'gi')
   return text.replace(regex, '<mark>$1</mark>')
}
