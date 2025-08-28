'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { useRouter, useParams } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface QnaPost {
   id: string
   title: string
   content: string
   category: string | null
   is_private: boolean | null
   is_answered: boolean | null
   status: string | null
   view_count: number | null
   created_at: string
   updated_at: string | null
   author_name: string
   questioner_email?: string | null
   questioner_phone?: string | null
   answered_at?: string | null
   type: string
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
}

export default function AdminQnaDetailPage() {
   const { isAdmin, isChecking } = useAdmin()
   const router = useRouter()
   const params = useParams()
   const postId = params.id as string

   const [post, setPost] = useState<QnaPost | null>(null)
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)
   const [answer, setAnswer] = useState('')
   const [existingAnswers, setExistingAnswers] = useState<Answer[]>([])

   // 기존 답변 로드
   const loadAnswers = useCallback(async () => {
      try {
         const response = await fetch(`/api/admin/qna/${postId}/answers`)

         if (response.ok) {
            const data = await response.json()
            setExistingAnswers(data.answers || [])
         }
      } catch (error) {
         console.error('답변 로드 오류:', error)
      }
   }, [postId])

   // Q&A 데이터 로드
   useEffect(() => {
      if (!isAdmin || !postId) return

      const loadPost = async () => {
         try {
            const response = await fetch(`/api/admin/qna/${postId}`)

            if (!response.ok) {
               throw new Error('Q&A를 불러올 수 없습니다.')
            }

            const data = await response.json()
            const qnaPost = data.post

            setPost(qnaPost)
            setAnswer(qnaPost.answer || '')
            
            // 기존 답변도 로드
            await loadAnswers()
         } catch (error) {
            console.error('Q&A 로드 오류:', error)
            alert('Q&A를 불러올 수 없습니다.')
            router.push('/admin/qna')
         } finally {
            setLoading(false)
         }
      }

      loadPost()
   }, [isAdmin, postId, router, loadAnswers])

   // 답변 저장
   const handleSaveAnswer = async () => {
      if (!answer.trim()) {
         alert('답변 내용을 입력해주세요.')
         return
      }

      try {
         setSaving(true)

         const headers: Record<string, string> = { 'Content-Type': 'application/json' }
         const response = await fetch(`/api/admin/qna/${postId}/answer`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ content: answer }),
         })

         if (!response.ok) {
            throw new Error('답변을 저장할 수 없습니다.')
         }

         alert('답변이 저장되었습니다.')

         // 데이터 새로고침
         if (post) {
            setPost({
               ...post,
               answer,
               is_answered: true,
               answered_at: new Date().toISOString(),
            })
         }
         
         setAnswer('')
         
         // 기존 답변 목록 다시 로드
         await loadAnswers()
      } catch (error: unknown) {
         console.error('답변 저장 오류:', error)
         alert(error instanceof Error ? error.message : '답변 저장 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // 상태 변경
   const handleStatusChange = async (newStatus: string) => {
      try {
         setSaving(true)

         const headers: Record<string, string> = { 'Content-Type': 'application/json' }
         const response = await fetch(`/api/admin/qna/${postId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: newStatus }),
         })

         if (!response.ok) {
            throw new Error('상태를 변경할 수 없습니다.')
         }

         alert('상태가 변경되었습니다.')

         if (post) {
            setPost({ ...post, status: newStatus })
         }
      } catch (error: unknown) {
         console.error('상태 변경 오류:', error)
         alert(error instanceof Error ? error.message : '상태 변경 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // Q&A 삭제
   const handleDelete = async () => {
      if (!confirm('정말로 이 Q&A를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.')) {
         return
      }

      try {
         setSaving(true)

         const response = await fetch(`/api/admin/qna/${postId}`, {
            method: 'DELETE',
         })

         if (!response.ok) {
            throw new Error('Q&A를 삭제할 수 없습니다.')
         }

         alert('Q&A가 삭제되었습니다.')
         router.push('/admin/qna')
      } catch (error: unknown) {
         console.error('Q&A 삭제 오류:', error)
         alert(error instanceof Error ? error.message : 'Q&A 삭제 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // 카테고리 뱃지 렌더링
   const renderCategoryBadge = (category: string) => {
      switch (category) {
         case 'exam':
            return <Badge variant="primary">자격시험</Badge>
         case 'education':
            return <Badge variant="secondary">교육과정</Badge>
         case 'certificate':
            return <Badge variant="success">자격증발급</Badge>
         case 'payment':
            return <Badge variant="warning">결제/환불</Badge>
         case 'technical':
            return <Badge variant="error">기술적문의</Badge>
         case 'other':
            return <Badge variant="default">기타</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   // 상태 뱃지 렌더링
   const renderStatusBadge = (post: QnaPost) => {
      if (post.status === 'closed') {
         return <Badge variant="default">종료</Badge>
      } else if (post.is_answered) {
         return <Badge variant="success">답변완료</Badge>
      } else {
         return <Badge variant="warning">답변대기</Badge>
      }
   }

   // 로딩 중이거나 권한이 없는 경우
   if (isChecking || loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   if (!post) {
      return (
         <AdminLayout>
            <div className="text-center py-8">
               <p className="text-gray-500">Q&A를 찾을 수 없습니다.</p>
               <Button onClick={() => router.push('/admin/qna')} className="mt-4">
                  목록으로 돌아가기
               </Button>
            </div>
         </AdminLayout>
      )
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Q&A 상세보기</h1>
                  <p className="text-gray-600">질문 내용을 확인하고 답변을 작성합니다.</p>
               </div>
               <div className="flex space-x-2">
                  <Button onClick={handleDelete} disabled={saving} variant="outline" className="text-red-600 hover:text-red-700">
                     삭제
                  </Button>
                  <Button onClick={() => router.push('/admin/qna')} variant="outline">
                     목록으로
                  </Button>
               </div>
            </div>

            {/* 질문 정보 */}
            <div className="border rounded-lg p-6 mb-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                     {renderCategoryBadge(post.category || 'other')}
                     {renderStatusBadge(post)}
                     {post.is_private && <Badge variant="error">🔒 비공개</Badge>}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString('ko-KR')}</div>
               </div>

               <h2 className="text-xl font-semibold text-gray-900 mb-4">{post.title}</h2>

               <div className="prose max-w-none mb-6">
                  <div className="text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
               </div>

               {/* 작성자 정보 */}
               <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">작성자 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                     <div>
                        <span className="text-gray-500">이름:</span>
                        <span className="ml-2 text-gray-900">{post.author_name || '익명'}</span>
                     </div>
                     <div>
                        <span className="text-gray-500">이메일:</span>
                        <span className="ml-2 text-gray-900">{post.questioner_email || '-'}</span>
                     </div>
                     <div>
                        <span className="text-gray-500">연락처:</span>
                        <span className="ml-2 text-gray-900">{post.questioner_phone || '-'}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* 기존 답변 표시 */}
            {existingAnswers.length > 0 && (
               <div className="border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">기존 답변</h3>
                  <div className="space-y-4">
                     {existingAnswers.map((answerPost, index) => (
                        <div key={answerPost.id} className="bg-gray-50 rounded-lg p-4">
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                 <Badge variant="success">답변 #{index + 1}</Badge>
                                 <span className="text-sm text-gray-600">관리자</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                 {new Date(answerPost.created_at).toLocaleString('ko-KR')}
                              </span>
                           </div>
                           <div className="prose max-w-none">
                              <div className="text-gray-700 whitespace-pre-wrap" 
                                   dangerouslySetInnerHTML={{ __html: answerPost.content }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* 답변 작성 */}
            <div className="border rounded-lg p-6 mb-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">답변 작성</h3>
                  <div className="flex space-x-2">
                     <Button 
                        onClick={() => handleStatusChange('pending')} 
                        disabled={saving || (!post.is_answered && post.status !== 'closed')} 
                        variant="outline" 
                        size="sm"
                     >
                        답변대기로 변경
                     </Button>
                     <Button 
                        onClick={() => handleStatusChange('closed')} 
                        disabled={saving || post.status === 'closed'} 
                        variant="outline" 
                        size="sm"
                     >
                        종료
                     </Button>
                  </div>
               </div>

               <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="답변을 입력하세요..." rows={10} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />

               <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                     현재 {answer.length}자{post.answered_at && <span className="ml-4">마지막 답변: {new Date(post.answered_at).toLocaleString('ko-KR')}</span>}
                  </p>
                  <Button onClick={handleSaveAnswer} disabled={saving || !answer.trim()}>
                     {saving ? '저장 중...' : '답변 저장'}
                  </Button>
               </div>
            </div>
         </div>
      </AdminLayout>
   )
}
