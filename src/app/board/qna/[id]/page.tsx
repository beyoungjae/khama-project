'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface QnA {
   id: string
   title: string
   content: string
   author_name: string
   author_email: string
   author_phone: string
   category: string
   is_private: boolean
   is_answered: boolean
   view_count: number
   created_at: string
   answers: Answer[]
}

interface Answer {
   id: string
   content: string
   author_name: string
   is_admin_author: boolean
   created_at: string
}

export default function QnADetailPage() {
   const params = useParams()
   const router = useRouter()
   const [qna, setQna] = useState<QnA | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState('')

   useEffect(() => {
      const loadQnA = async () => {
         try {
            // 최초 데이터 로드 (조회수 증가 없이)
            const response = await fetch(`/api/board/qna/${params.id}`)
            if (response.ok) {
               const data = await response.json()
               // 새 API 구조에 맞게 데이터 변환
               const transformedData = {
                  ...data.question,
                  answers: data.answers || []
               }
               setQna(transformedData)
               
               // 데이터 로드 완료 후 조회수 증가 (한 번만)
               fetch(`/api/board/qna/${params.id}?increment=true`).catch(console.error)
            } else {
               setError('Q&A를 불러올 수 없습니다.')
            }
         } catch (error) {
            console.error('Q&A 로드 오류:', error)
            setError('서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      }

      if (params.id) {
         loadQnA()
      }
   }, [params.id])

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (error || !qna) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h2>
               <p className="text-gray-600 mb-6">{error || 'Q&A를 찾을 수 없습니다.'}</p>
               <Button onClick={() => router.push('/board/qna')}>목록으로 돌아가기</Button>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 헤더 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                     <Badge variant={qna.category === '자격증' ? 'primary' : qna.category === '교육' ? 'secondary' : 'default'}>{qna.category}</Badge>
                     {qna.is_private && <Badge variant="warning">비공개</Badge>}
                     <Badge variant={qna.is_answered ? 'success' : 'default'}>{qna.is_answered ? '답변완료' : '답변대기'}</Badge>
                  </div>
                  <Button variant="outline" onClick={() => router.push('/board/qna')}>
                     목록으로
                  </Button>
               </div>

               <h1 className="text-2xl font-bold text-gray-900 mb-4">{qna.title}</h1>

               <div className="flex items-center justify-between text-sm text-gray-500 border-b pb-4">
                  <div className="flex items-center space-x-4">
                     <span>작성자: {qna.author_name}</span>
                     <span>작성일: {new Date(qna.created_at).toLocaleDateString('ko-KR')}</span>
                     <span>조회수: {qna.view_count}</span>
                  </div>
               </div>
            </div>

            {/* 질문 내용 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">질문 내용</h2>
               <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: qna.content.replace(/\n/g, '<br>') }} />
               </div>
            </div>

            {/* 답변 */}
            {qna.answers && qna.answers.length > 0 && (
               <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">답변 ({qna.answers.length})</h2>
                  <div className="space-y-4">
                     {qna.answers.map((answer) => (
                        <div key={answer.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                 <span className="font-medium text-gray-900">{answer.author_name}</span>
                                 {answer.is_admin_author && (
                                    <Badge variant="primary" size="sm">
                                       관리자
                                    </Badge>
                                 )}
                              </div>
                              <span className="text-sm text-gray-500">{new Date(answer.created_at).toLocaleDateString('ko-KR')}</span>
                           </div>
                           <div className="prose max-w-none">
                              <div dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, '<br>') }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* 답변이 없는 경우 */}
            {(!qna.answers || qna.answers.length === 0) && (
               <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center py-8">
                     <p className="text-gray-500">아직 답변이 없습니다.</p>
                     <p className="text-sm text-gray-400 mt-2">관리자가 확인 후 답변을 드리겠습니다.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}
