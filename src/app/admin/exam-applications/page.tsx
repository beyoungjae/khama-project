'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface User {
   name: string
   email: string
   phone: string
}

interface Certification {
   name: string
}

interface ExamSchedule {
   exam_date: string
   exam_location: string
   certifications: Certification
}

interface ExamApplication {
   id: string
   exam_number: string
   application_status: string
   payment_amount: number
   created_at: string
   user_id: string
   exam_schedule_id: string
   applicant_name?: string
   applicant_email?: string
   applicant_phone?: string
   profiles: User
   exam_schedules: ExamSchedule
}

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminExamApplicationsPage() {
   const { isAdmin, isChecking } = useAdmin()

   const [applications, setApplications] = useState<ExamApplication[]>([])
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
      search: '',
   })

   const statusOptions = [
      { value: 'all', label: '전체' },
      { value: 'payment_pending', label: '입금대기' },
      { value: 'confirmed', label: '입금확인' },
      { value: 'cancelled', label: '취소' },
   ]

   // 시험 신청 목록 로드
   const loadApplications = useCallback(
      async (page = 1) => {
         if (!isAdmin) return

         try {
            setLoading(true)

            const params = new URLSearchParams({
               page: page.toString(),
               limit: pagination.limit.toString(),
               status: filters.status,
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

            const response = await fetch(`/api/admin/exam-applications?${params}`, {
               headers,
            })

            // 응답이 JSON인지 확인
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
               const text = await response.text()
               console.error('서버로부터 받은 응답:', text)
               throw new Error('서버로부터 잘못된 응답을 받았습니다. 응답이 JSON 형식이 아닙니다.')
            }

            const data = await response.json()

            if (response.ok) {
               setApplications(data.applications || [])
               setPagination(data.pagination)
            } else {
               console.error('시험 신청 목록 로드 실패:', data.error)
               alert('시험 신청 목록을 불러오는데 실패했습니다.')
            }
         } catch (error) {
            console.error('시험 신청 목록 로드 오류:', error)
            alert(error instanceof Error ? error.message : '서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [isAdmin, pagination.limit, filters.status, filters.search]
   )

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadApplications()
      }
   }, [isAdmin, isChecking, loadApplications])

   // 입금 확인 처리
   const handlePaymentConfirm = async (applicationId: string) => {
      if (!confirm('입금을 확인하셨습니까?')) {
         return
      }

      try {
         setUpdating(true)

         // 인증 헤더 추가
         const token = localStorage.getItem('admin-token')
         const headers: Record<string, string> = {
            'Content-Type': 'application/json',
         }

         if (token) {
            headers['Authorization'] = `Bearer ${token}`
         }

         const response = await fetch(`/api/admin/exam-applications/${applicationId}/confirm-payment`, {
            method: 'POST',
            headers,
         })

         // 응답이 JSON인지 확인
         const contentType = response.headers.get('content-type')
         if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text()
            console.error('서버로부터 받은 응답:', text)
            throw new Error('서버로부터 잘못된 응답을 받았습니다. 응답이 JSON 형식이 아닙니다.')
         }

         const result = await response.json()

         if (response.ok) {
            alert('입금이 확인되었습니다.')
            loadApplications(pagination.page)
         } else {
            throw new Error(result.error || '입금 확인 실패')
         }
      } catch (error: unknown) {
         console.error('입금 확인 오류:', error)
         alert(error instanceof Error ? error.message : '입금 확인 중 오류가 발생했습니다.')
      } finally {
         setUpdating(false)
      }
   }

   // 상태 뱃지 렌더링
   const renderStatusBadge = (status: string) => {
      switch (status) {
         case 'payment_pending':
            return <Badge variant="warning">입금대기</Badge>
         case 'confirmed':
            return <Badge variant="success">입금확인</Badge>
         case 'cancelled':
            return <Badge variant="error">취소</Badge>
         default:
            return <Badge variant="default">알 수 없음</Badge>
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
                  <h1 className="text-2xl font-bold text-gray-900">시험 신청 관리</h1>
                  <p className="text-gray-600">시험 신청 내역을 확인하고 입금을 확인할 수 있습니다.</p>
               </div>
            </div>

            {/* 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
                  <input
                     type="text"
                     value={filters.search}
                     onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                     placeholder="신청자명, 이메일, 신청번호로 검색"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
               </div>

               <div className="flex items-end">
                  <Button onClick={() => loadApplications()} disabled={loading}>
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
                           신청 정보
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           시험 정보
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           신청자
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           금액
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           신청일
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           작업
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-4 text-center">
                              <LoadingSpinner />
                           </td>
                        </tr>
                     ) : applications.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                              신청 내역이 없습니다.
                           </td>
                        </tr>
                     ) : (
                        applications.map((application) => (
                           <tr key={application.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm font-medium text-gray-900">{application.exam_number}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{application.exam_schedules?.certifications?.name || '자격증 정보 없음'}</div>
                                 <div className="text-sm text-gray-500">
                                    {application.exam_schedules?.exam_date ? new Date(application.exam_schedules.exam_date).toLocaleDateString('ko-KR') : '날짜 없음'} • {application.exam_schedules?.exam_location || '장소 없음'}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{application.profiles?.email || application.applicant_email || '이메일 없음'}</div>
                                 <div className="text-sm text-gray-500">{application.profiles?.name || application.applicant_name || '이름 없음'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(application.application_status)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.payment_amount?.toLocaleString() || 0}원</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(application.created_at).toLocaleDateString('ko-KR')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                 {application.application_status === 'payment_pending' && (
                                    <Button onClick={() => handlePaymentConfirm(application.id)} disabled={updating} size="sm">
                                       {updating ? '처리 중...' : '입금확인'}
                                    </Button>
                                 )}
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
                     <Button onClick={() => loadApplications(pagination.page - 1)} disabled={pagination.page === 1} variant="outline">
                        이전
                     </Button>
                     <Button onClick={() => loadApplications(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} variant="outline">
                        다음
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
