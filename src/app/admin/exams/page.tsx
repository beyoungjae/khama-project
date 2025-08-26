'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'

interface Certification {
   id: string
   name: string
   registration_number: string
   application_fee: number | null
   certificate_fee: number | null
}

interface ExamSchedule {
   id: string
   certification_id: string
   exam_date: string
   registration_start_date: string
   registration_end_date: string
   result_announcement_date: string | null
   exam_location: string
   exam_address: string | null
   max_applicants: number
   current_applicants: number
   exam_instructions: string | null
   required_items: unknown
   status: string
   created_at: string
   updated_at: string
   certifications: Certification
}

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminExamsPage() {
   const { isAdmin, isChecking } = useAdmin()

   const [schedules, setSchedules] = useState<ExamSchedule[]>([])
   const [certifications, setCertifications] = useState<Certification[]>([])
   const [loading, setLoading] = useState(true)

   const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
   })

   // 필터 상태
   const [filters, setFilters] = useState({
      status: 'all',
      certification_id: '',
      search: '',
   })

   const statusOptions = [
      { value: 'all', label: '전체' },
      { value: 'scheduled', label: '예정' },
      { value: 'registration_open', label: '접수중' },
      { value: 'registration_closed', label: '접수마감' },
      { value: 'exam_completed', label: '시험완료' },
      { value: 'results_announced', label: '결과발표' },
      { value: 'cancelled', label: '취소' },
   ]

   // 권한 체크는 useAdmin 훅에서 처리됨

   // 자격증 목록 로드
   const loadCertifications = async () => {
      try {
         const response = await fetch('/api/exams/certifications')
         const data = await response.json()
         if (response.ok) {
            setCertifications(data.certifications || [])
         }
      } catch (error) {
         console.error('자격증 로드 오류:', error)
      }
   }

   // 시험 일정 목록 로드
   const loadSchedules = useCallback(
      async (page = 1) => {
         if (!isAdmin) return

         try {
            setLoading(true)

            const params = new URLSearchParams({
               page: page.toString(),
               limit: pagination.limit.toString(),
               status: filters.status,
               ...(filters.certification_id && { certification_id: filters.certification_id }),
               ...(filters.search && { search: filters.search }),
            })

            const response = await fetch(`/api/admin/exams?${params}`)
            const data = await response.json()

            if (response.ok) {
               setSchedules(data.schedules || [])
               setPagination(data.pagination)
            } else {
               console.error('시험 일정 로드 실패:', data.error)
               alert('시험 일정을 불러오는데 실패했습니다.')
            }
         } catch (error) {
            console.error('시험 일정 로드 오류:', error)
            alert('서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [isAdmin, pagination.limit, filters.status, filters.certification_id, filters.search]
   )

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadCertifications()
         loadSchedules()
      }
   }, [isAdmin, isChecking, loadSchedules])

   // 시험 일정 삭제
   const handleDelete = async (scheduleId: string, scheduleName: string) => {
      if (!confirm(`'${scheduleName}' 시험 일정을 정말 삭제하시겠습니까?`)) {
         return
      }

      try {
         const response = await fetch(`/api/admin/exams/${scheduleId}`, {
            method: 'DELETE',
         })

         const result = await response.json()

         if (response.ok) {
            alert('시험 일정이 성공적으로 삭제되었습니다.')
            loadSchedules(pagination.page)
         } else {
            throw new Error(result.error || '삭제 실패')
         }
      } catch (error: unknown) {
         console.error('삭제 오류:', error)
         alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
      }
   }

   // 상태 뱃지 렌더링
   const renderStatusBadge = (status: string) => {
      const statusConfig: Record<string, { label: string; className: string }> = {
         scheduled: { label: '예정', className: 'bg-blue-100 text-blue-800' },
         registration_open: { label: '접수중', className: 'bg-green-100 text-green-800' },
         registration_closed: { label: '접수마감', className: 'bg-yellow-100 text-yellow-800' },
         exam_completed: { label: '시험완료', className: 'bg-purple-100 text-purple-800' },
         results_announced: { label: '결과발표', className: 'bg-indigo-100 text-indigo-800' },
         cancelled: { label: '취소', className: 'bg-red-100 text-red-800' },
      }

      const config = statusConfig[status] || statusConfig.scheduled

      return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>
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
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">시험 일정 관리</h1>
                  <p className="text-gray-600">시험 일정을 등록, 수정, 삭제할 수 있습니다.</p>
               </div>
               <Link href="/admin/exams/create">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">새 시험 일정 등록</button>
               </Link>
            </div>

            {/* 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                     <option value="all">전체 상태</option>
                     {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <select value={filters.certification_id} onChange={(e) => setFilters((prev) => ({ ...prev, certification_id: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                     <option value="">전체 자격증</option>
                     {certifications.map((cert) => (
                        <option key={cert.id} value={cert.id}>
                           {cert.name}
                        </option>
                     ))}
                  </select>
               </div>

               <div className="md:col-span-2">
                  <div className="flex gap-2">
                     <input
                        type="text"
                        placeholder="시험 장소 또는 자격증명으로 검색..."
                        value={filters.search}
                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                     <button onClick={() => loadSchedules(1)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        검색
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* 시험 일정 목록 */}
         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           자격증
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           시험일
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           접수기간
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           장소
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           신청현황
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                           액션
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              </div>
                           </td>
                        </tr>
                     ) : schedules.length > 0 ? (
                        schedules.map((schedule) => (
                           <tr key={schedule.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                 <div className="text-sm font-medium text-gray-900">{schedule.certifications?.name}</div>
                                 <div className="text-sm text-gray-500">{schedule.certifications?.registration_number}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{new Date(schedule.exam_date).toLocaleDateString('ko-KR')}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                 {new Date(schedule.registration_start_date).toLocaleDateString('ko-KR')} ~ {new Date(schedule.registration_end_date).toLocaleDateString('ko-KR')}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{schedule.exam_location}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                 {schedule.current_applicants} / {schedule.max_applicants}
                              </td>
                              <td className="px-6 py-4">{renderStatusBadge(schedule.status)}</td>
                              <td className="px-6 py-4 text-right text-sm font-medium">
                                 <div className="flex justify-end space-x-2">
                                    <Link href={`/admin/exams/${schedule.id}`}>
                                       <button className="text-purple-600 hover:text-purple-900">신청자</button>
                                    </Link>
                                    <Link href={`/admin/exams/edit/${schedule.id}`}>
                                       <button className="text-blue-600 hover:text-blue-900">편집</button>
                                    </Link>
                                    <button onClick={() => handleDelete(schedule.id, schedule.certifications?.name || '시험')} className="text-red-600 hover:text-red-900">
                                       삭제
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                              등록된 시험 일정이 없습니다.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
               <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                     <button onClick={() => loadSchedules(pagination.page - 1)} disabled={pagination.page <= 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        이전
                     </button>
                     <button
                        onClick={() => loadSchedules(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                     >
                        다음
                     </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                     <div>
                        <p className="text-sm text-gray-700">
                           총 <span className="font-medium">{pagination.total}</span>개 중 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> 표시
                        </p>
                     </div>
                     <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                           <button onClick={() => loadSchedules(pagination.page - 1)} disabled={pagination.page <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                              <span className="sr-only">이전</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                 <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                           </button>
                           {[...Array(pagination.totalPages)].map((_, i) => {
                              const pageNum = i + 1
                              return (
                                 <button
                                    key={pageNum}
                                    onClick={() => loadSchedules(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === pageNum ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                 >
                                    {pageNum}
                                 </button>
                              )
                           })}
                           <button
                              onClick={() => loadSchedules(pagination.page + 1)}
                              disabled={pagination.page >= pagination.totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                           >
                              <span className="sr-only">다음</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                 <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                           </button>
                        </nav>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
