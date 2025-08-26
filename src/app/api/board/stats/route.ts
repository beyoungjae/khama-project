import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// 게시판 통계 조회
export async function GET(request: NextRequest) {
   try {
      // 공지사항 통계
      const { data: noticeStats } = await supabaseAdmin.from('notices').select('category', { count: 'exact' }).eq('is_published', true)

      // 카테고리별 공지사항 개수
      const noticeCategoryCounts: Record<string, number> = {}
      if (noticeStats) {
         for (const notice of noticeStats) {
            const category = notice.category || '기타'
            noticeCategoryCounts[category] = (noticeCategoryCounts[category] || 0) + 1
         }
      }

      // Q&A 통계
      const { data: qnaStats } = await supabaseAdmin.from('posts').select('question_type, is_answered', { count: 'exact' }).eq('type', 'qna').eq('status', 'published')

      // Q&A 카테고리별 및 답변 상태별 통계
      const qnaCategoryCounts: Record<string, number> = {}
      let answeredCount = 0
      let unansweredCount = 0

      if (qnaStats) {
         for (const post of qnaStats) {
            const category = post.question_type || '기타'
            qnaCategoryCounts[category] = (qnaCategoryCounts[category] || 0) + 1

            if (post.is_answered) {
               answeredCount++
            } else {
               unansweredCount++
            }
         }
      }

      // 최근 게시글 (각 타입별 5개씩)
      const { data: recentNotices } = await supabaseAdmin.from('notices').select('id, title, created_at, view_count').eq('is_published', true).order('created_at', { ascending: false }).limit(5)

      const { data: recentQnas } = await supabaseAdmin.from('posts').select('id, title, created_at, is_answered').eq('type', 'qna').eq('status', 'published').order('created_at', { ascending: false }).limit(5)

      return NextResponse.json({
         notices: {
            total: Object.values(noticeCategoryCounts).reduce((sum, count) => sum + count, 0),
            categories: noticeCategoryCounts,
            recent: recentNotices || [],
         },
         qna: {
            total: answeredCount + unansweredCount,
            answered: answeredCount,
            unanswered: unansweredCount,
            categories: qnaCategoryCounts,
            recent: recentQnas || [],
         },
      })
   } catch (error: unknown) {
      console.error('게시판 통계 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
