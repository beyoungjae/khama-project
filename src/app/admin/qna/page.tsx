'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

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

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminQnaPage() {
   const { isAdmin, isChecking } = useAdmin()

   const [qnaPosts, setQnaPosts] = useState<QnaPost[]>([])
   const [loading, setLoading] = useState(true)
   const [updating, setUpdating] = useState(false)

   const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
   })

   // 필터 상태
   const [filters, setFilters] = useState({
      status: 'all',
      category: 'all',
      search: '',
   })

   const statusOptions = [
      { value: 'all', label: '전체' },
      { value: 'pending', label: '답변대기' },
      { value: 'answered', label: '답변완료' },
      { value: 'closed', label: '종료' },
   ]

   const categoryOptions = [
      { value: 'all', label: '전체' },
      { value: 'exam', label: '자격시험' },
      { value: 'education', label: '교육과정' },
      { value: 'certificate', label: '자격증발급' },
      { value: 'payment', label: '결제/환불' },
      { value: 'technical', label: '기술적문의' },
      { value: 'other', label: '기타' },
   ]

   // Q&A 목록 로드
   const loadQnaPosts = useCallback(
      async (page = 1) => {
         if (!isAdmin) return

         try {
            setLoading(true)

            const params = new URLSearchParams({
               page: page.toString(),
               limit: pagination.limit.toString(),
               status: filters.status,
               category: filters.category,
               ...(filters.search && { search: filters.search }),
            })

            // 인증 헤더 추가
            const token = localStorage.getItem('admin-token')
            const headers: Record<string, string> = {
               'Content-Type': 'application/json',
            }

            if (token) {
               headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`/api/admin/qna?${params}`, {
               headers,
            })

            if (!response.ok) {
               throw new Error('Q&A 목록을 불러올 수 없습니다.')
            }

            const data = await response.json()
            setQnaPosts(data.posts || [])
            setPagination(data.pagination)
         } catch (error) {
            console.error('Q&A 목록 로드 오류:', error)
            alert(error instanceof Error ? error.message : '서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [isAdmin, pagination.limit, filters.status, filters.category, filters.search]
   )

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadQnaPosts()
      }
   }, [isAdmin, isChecking, loadQnaPosts])

   // Q&A 답변 처리
   const handleAnswer = async (postId: string, answer: string) => {
      if (!answer.trim()) {
         alert('답변 내용을 입력해주세요.')
         return
      }

      try {
         setUpdating(true)

         const token = localStorage.getItem('admin-token')
         const headers: Record<string, string> = {
            'Content-Type': 'application/json',
         }

         if (token) {
            headers['Authorization'] = `Bearer ${token}`
         }

         const response = await fetch(`/api/admin/qna/${postId}/answer`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ content: answer }),
         })

         if (!response.ok) {
            throw new Error('답변을 등록할 수 없습니다.')
         }

         alert('답변이 등록되었습니다.')
         loadQnaPosts(pagination.page)
      } catch (error: unknown) {
         console.error('답변 등록 오류:', error)
         alert(error instanceof Error ? error.message : '답변 등록 중 오류가 발생했습니다.')
      } finally {
         setUpdating(false)
      }
   }

   // Q&A 삭제
   const handleDelete = async (postId: string) => {
      if (!confirm('정말로 이 Q&A를 삭제하시겠습니까?')) {
         return
      }

      try {
         setUpdating(true)

         const token = localStorage.getItem('admin-token')
         const headers: Record<string, string> = {
            'Content-Type': 'application/json',
         }

         if (token) {
            headers['Authorization'] = `Bearer ${token}`
         }

         const response = await fetch(`/api/admin/qna/${postId}`, {
            method: 'DELETE',
            headers,
         })

         if (!response.ok) {
            throw new Error('Q&A를 삭제할 수 없습니다.')
         }

         alert('Q&A가 삭제되었습니다.')
         loadQnaPosts(pagination.page)
      } catch (error: unknown) {
         console.error('Q&A 삭제 오류:', error)
         alert(error instanceof Error ? error.message : 'Q&A 삭제 중 오류가 발생했습니다.')
      } finally {
         setUpdating(false)
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

   // 로딩 중이거나 권한이 없는 경우
   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Q&A 관리</h1>
                  <p className="text-gray-600">사용자 질문에 답변하고 관리할 수 있습니다.</p>
               </div>
            </div>

            {/* 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                     {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                     {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
                  <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="제목, 내용으로 검색" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
               </div>

               <div className="flex items-end">
                  <Button onClick={() => loadQnaPosts()} disabled={loading}>
                     {loading ? '로딩 중...' : '검색'}
                  </Button>
               </div>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           질문
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           카테고리
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           작성자
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           작성일
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           작업
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-4 text-center">
                              <LoadingSpinner />
                           </td>
                        </tr>
                     ) : qnaPosts.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              Q&A가 없습니다.
                           </td>
                        </tr>
                     ) : (
                        qnaPosts.map((post) => (
                           <tr key={post.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                 <div className="flex items-center">
                                    <div>
                                       <div className="text-sm font-medium text-gray-900 flex items-center">
                                          {post.is_private && <span className="text-red-500 mr-1">🔒</span>}
                                          {post.title}
                                       </div>
                                       <div className="text-sm text-gray-500 truncate max-w-xs">{post.content.replace(/<[^>]*>/g, '').substring(0, 50)}...</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderCategoryBadge(post.category || 'other')}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(post)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{post.author_name || '익명'}</div>
                                 <div className="text-sm text-gray-500">{post.questioner_email || ''}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('ko-KR')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                 <Link href={`/admin/qna/${post.id}`}>
                                    <Button size="sm" variant="outline">
                                       상세보기
                                    </Button>
                                 </Link>
                                 {!post.is_answered && post.status !== 'closed' && (
                                    <Button
                                       onClick={() => {
                                          const answer = prompt('답변을 입력하세요:')
                                          if (answer) {
                                             handleAnswer(post.id, answer)
                                          }
                                       }}
                                       disabled={updating}
                                       size="sm"
                                    >
                                       답변하기
                                    </Button>
                                 )}
                                 <Button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={updating}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                 >
                                    삭제
                                 </Button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
               <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                     총 {pagination.total}개 중 {pagination.page * pagination.limit - pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}개 표시
                  </div>
                  <div className="flex space-x-2">
                     <Button onClick={() => loadQnaPosts(pagination.page - 1)} disabled={pagination.page === 1} variant="outline">
                        이전
                     </Button>
                     <Button onClick={() => loadQnaPosts(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} variant="outline">
                        다음
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
