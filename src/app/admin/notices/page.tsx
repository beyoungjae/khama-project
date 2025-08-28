'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Notice {
   id: string
   title: string
   content: string
   category: string | null
   is_important: boolean | null
   is_pinned: boolean | null
   is_published: boolean | null
   view_count: number | null
   created_at: string
   updated_at: string | null
   author_name?: string | null
}

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminNoticesPage() {
   const { isAdmin, isChecking } = useAdmin()

   const [notices, setNotices] = useState<Notice[]>([])
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
      { value: 'published', label: '게시됨' },
      { value: 'unpublished', label: '미게시' },
   ]

   const categoryOptions = [
      { value: 'all', label: '전체' },
      { value: 'general', label: '일반공지' },
      { value: 'exam', label: '시험공지' },
      { value: 'education', label: '교육공지' },
      { value: 'system', label: '시스템공지' },
   ]

   // 공지사항 목록 로드
   const loadNotices = useCallback(
      async (page = 1) => {
         try {
            setLoading(true)

            const params = new URLSearchParams({
               page: page.toString(),
               limit: pagination.limit.toString(),
               status: filters.status,
               category: filters.category,
               ...(filters.search && { search: filters.search }),
            })

            // 쿠키 기반 인증 사용
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }

            const response = await fetch(`/api/admin/notices?${params}`, {
               headers,
            })

            console.log('Response status:', response.status)

            if (!response.ok) {
               const errorData = await response.json()
               console.error('API Error:', errorData)
               throw new Error(errorData.error || '공지사항 목록을 불러올 수 없습니다.')
            }

            const data = await response.json()
            console.log('Notices data:', data)
            setNotices(data.notices || [])
            setPagination(data.pagination)
         } catch (error) {
            console.error('공지사항 목록 로드 오류:', error)
            alert(error instanceof Error ? error.message : '서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [pagination.limit, filters.status, filters.category, filters.search]
   )

   useEffect(() => {
      if (!isChecking) {
         loadNotices()
      }
   }, [isChecking, loadNotices])

   // 공지사항 삭제
   const handleDelete = async (noticeId: string) => {
      if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
         return
      }

      try {
         setUpdating(true)

         const headers: Record<string, string> = { 'Content-Type': 'application/json' }

         const response = await fetch(`/api/admin/notices/${noticeId}`, {
            method: 'DELETE',
            headers,
         })

         if (!response.ok) {
            throw new Error('공지사항을 삭제할 수 없습니다.')
         }

         alert('공지사항이 삭제되었습니다.')
         loadNotices(pagination.page)
      } catch (error: unknown) {
         console.error('공지사항 삭제 오류:', error)
         alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
      } finally {
         setUpdating(false)
      }
   }

   // 상태 뱃지 렌더링
   const renderStatusBadge = (isPublished: boolean) => {
      return isPublished ? <Badge variant="success">게시됨</Badge> : <Badge variant="warning">미게시</Badge>
   }

   // 카테고리 뱃지 렌더링
   const renderCategoryBadge = (category: string) => {
      switch (category) {
         case 'general':
            return <Badge variant="default">일반공지</Badge>
         case 'exam':
            return <Badge variant="primary">시험공지</Badge>
         case 'education':
            return <Badge variant="secondary">교육공지</Badge>
         case 'system':
            return <Badge variant="error">시스템공지</Badge>
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
                  <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
                  <p className="text-gray-600">공지사항을 작성하고 관리할 수 있습니다.</p>
               </div>
               <Link href="/admin/notices/write">
                  <Button>새 공지사항 작성</Button>
               </Link>
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
                  <Button onClick={() => loadNotices()} disabled={loading}>
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
                           제목
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           카테고리
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           조회수
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
                     ) : notices.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              공지사항이 없습니다.
                           </td>
                        </tr>
                     ) : (
                        notices.map((notice) => (
                           <tr key={notice.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                 <div className="flex items-center">
                                    <div>
                                       <div className="text-sm font-medium text-gray-900 flex items-center">
                                          {notice.is_important && <span className="text-red-500 mr-1">🔥</span>}
                                          {notice.is_pinned && <span className="text-blue-500 mr-1">📌</span>}
                                          {notice.title}
                                       </div>
                                       <div className="text-sm text-gray-500 truncate max-w-xs">{notice.content.replace(/<[^>]*>/g, '').substring(0, 50)}...</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderCategoryBadge(notice.category || 'general')}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(notice.is_published || false)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(notice.view_count || 0).toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(notice.created_at).toLocaleDateString('ko-KR')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                 <Link href={`/admin/notices/${notice.id}/edit`}>
                                    <Button size="sm" variant="outline">
                                       편집
                                    </Button>
                                 </Link>
                                 <Button onClick={() => handleDelete(notice.id)} disabled={updating} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
                     <Button onClick={() => loadNotices(pagination.page - 1)} disabled={pagination.page === 1} variant="outline">
                        이전
                     </Button>
                     <Button onClick={() => loadNotices(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} variant="outline">
                        다음
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
