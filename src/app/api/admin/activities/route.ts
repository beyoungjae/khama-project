import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface ExamApplication {
   id: string
   created_at: string
   application_status: string
   exam_schedules: {
      certifications: {
         name: string
      } | null
   } | null
}

interface Activity {
   id: string
   type: 'exam' | 'member' | 'notice' | 'qna'
   title: string
   time: string
   status?: string
}

export async function GET() {
   try {
      const activities: Activity[] = []

      // 최근 시험 신청
      const { data: recentExams } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
            id,
            created_at,
            application_status,
            exam_schedules (
               certifications (
                  name
               )
            )
         `
         )
         .order('created_at', { ascending: false })
         .limit(3)

      if (recentExams) {
         recentExams.forEach((exam) => {
            const typedExam = exam as ExamApplication
            const certificationName = typedExam.exam_schedules?.certifications?.name || '시험'
            activities.push({
               id: typedExam.id,
               type: 'exam',
               title: `${certificationName} 신청`,
               time: typedExam.created_at || new Date().toISOString(),
               status: typedExam.application_status || 'pending',
            })
         })
      }

      // 최근 회원 가입
      const { data: recentMembers } = await supabaseAdmin.from('profiles').select('id, created_at, name').order('created_at', { ascending: false }).limit(3)

      if (recentMembers) {
         recentMembers.forEach((member) => {
            activities.push({
               id: member.id,
               type: 'member',
               title: `새 회원 가입: ${member.name ? member.name.substring(0, 1) + '**님' : '익명'}`,
               time: member.created_at || new Date().toISOString(),
            })
         })
      }

      // 최근 공지사항
      const { data: recentNotices } = await supabaseAdmin.from('notices').select('id, created_at, title').eq('is_published', true).order('created_at', { ascending: false }).limit(2)

      if (recentNotices) {
         recentNotices.forEach((notice) => {
            activities.push({
               id: notice.id,
               type: 'notice',
               title: `공지사항 게시: ${notice.title}`,
               time: notice.created_at || new Date().toISOString(),
            })
         })
      }

      // 최근 QNA 질문
      const { data: recentQuestions } = await supabaseAdmin.from('qna_questions').select('id, created_at, title, is_answered').order('created_at', { ascending: false }).limit(2)

      if (recentQuestions) {
         recentQuestions.forEach((question) => {
            activities.push({
               id: question.id,
               type: 'qna',
               title: `Q&A 새 질문: ${question.title}`,
               time: question.created_at || new Date().toISOString(),
               status: question.is_answered ? '답변완료' : '답변대기',
            })
         })
      }

      // 시간순 정렬
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

      return NextResponse.json({
         activities: activities.slice(0, 10),
      })
   } catch (error) {
      console.error('최근 활동 조회 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
