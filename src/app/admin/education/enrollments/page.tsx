'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface EducationEnrollment {
   id: string
   student_name: string
   student_email: string
   student_phone: string | null
   enrollment_status: string
   payment_status: string
   enrolled_at: string
   education_schedules: {
      id: string
      start_date: string
      end_date: string
      location: string
      education_courses: {
         name: string
         category: string
      }
   }
}

export default function AdminEducationEnrollmentsPage() {
   const { isAdmin, isChecking } = useAdmin()
   const [enrollments, setEnrollments] = useState<EducationEnrollment[]>([])
   const [loading, setLoading] = useState(true)
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'pending':
            return <Badge variant="warning">대기중</Badge>
         case 'approved':
            return <Badge variant="success">승인됨</Badge>
         case 'cancelled':
            return <Badge variant="error">취소됨</Badge>
         case 'completed':
            return <Badge variant="primary">수료</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   const getPaymentBadge = (status: string) => {
      switch (status) {
         case 'pending':
            return <Badge variant="warning">결제대기</Badge>
         case 'completed':
            return <Badge variant="success">결제완료</Badge>
         case 'failed':
            return <Badge variant="error">결제실패</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   // 수강 신청 목록 로드
   const loadEnrollments = async (page = 1) => {
      if (!isAdmin) return

      try {
         setLoading(true)

         const response = await fetch(`/api/admin/education/enrollments?page=${page}&limit=20`)

         const data = await response.json()

         if (response.ok) {
            setEnrollments(data.enrollments || [])
            setTotalPages(data.pagination?.totalPages || 1)
            setCurrentPage(page)
         } else {
            console.error('수강 신청 목록 로드 실패:', data.error)
            alert('수강 신청 목록을 불러오는데 실패했습니다.')
         }
      } catch (error) {
         console.error('수강 신청 목록 로드 오류:', error)
         alert('서버 오류가 발생했습니다.')
      } finally {
         setLoading(false)
      }
   }

   // 신청 상태 변경
   const handleStatusUpdate = async (enrollmentId: string, newStatus: string) => {
      if (!confirm(`신청 상태를 '${newStatus}'로 변경하시겠습니까?`)) {
         return
      }

      try {
         const headers: Record<string, string> = { 'Content-Type': 'application/json' }
         const response = await fetch(`/api/admin/education/enrollments/${enrollmentId}/status`, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({ status: newStatus }),
         })

         const result = await response.json()

         if (response.ok) {
            alert('상태가 성공적으로 변경되었습니다.')
            loadEnrollments(currentPage)
         } else {
            throw new Error(result.error || '상태 변경 실패')
         }
      } catch (error: unknown) {
         console.error('상태 변경 오류:', error)
         alert(error instanceof Error ? error.message : '상태 변경 중 오류가 발생했습니다.')
      }
   }

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadEnrollments()
      }
   }, [isAdmin, isChecking])

   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">수강 신청 관리</h1>
                  <p className="text-gray-600">수강 신청 내역을 확인하고 관리할 수 있습니다.</p>
               </div>
               <Link href="/admin/education">
                  <Button variant="outline">목록으로</Button>
               </Link>
            </div>

            {loading ? (
               <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="mt-2 text-gray-600">수강 신청 목록을 불러오는 중입니다...</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {enrollments.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-500">수강 신청 내역이 없습니다.</p>
                     </div>
                  ) : (
                     enrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="p-6">
                           <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                       {enrollment.education_schedules.education_courses.name}
                                    </h3>
                                    {getStatusBadge(enrollment.enrollment_status)}
                                    {getPaymentBadge(enrollment.payment_status)}
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                       <p><strong>신청자:</strong> {enrollment.student_name || '-'}</p>
                                       <p><strong>연락처:</strong> {enrollment.student_phone || '-'}</p>
                                       {enrollment.student_phone && (
                                          <></>
                                       )}
                                    </div>
                                    <div>
                                       <p><strong>교육 기간:</strong> {new Date(enrollment.education_schedules.start_date).toLocaleDateString('ko-KR')} ~ {new Date(enrollment.education_schedules.end_date).toLocaleDateString('ko-KR')}</p>
                                       <p><strong>교육 장소:</strong> {enrollment.education_schedules.location}</p>
                                       <p><strong>신청일:</strong> {new Date(enrollment.enrolled_at).toLocaleDateString('ko-KR')}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                 {enrollment.enrollment_status === 'pending' && (
                                    <div className="flex flex-col space-y-2">
                                       <Button
                                          size="sm"
                                          onClick={() => handleStatusUpdate(enrollment.id, 'approved')}
                                       >
                                          승인
                                       </Button>
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleStatusUpdate(enrollment.id, 'cancelled')}
                                       >
                                          거절
                                       </Button>
                                    </div>
                                 )}
                                 {enrollment.enrollment_status === 'approved' && (
                                    <Button
                                       size="sm"
                                       onClick={() => handleStatusUpdate(enrollment.id, 'completed')}
                                    >
                                       수료처리
                                    </Button>
                                 )}
                              </div>
                           </div>
                        </Card>
                     ))
                  )}
               </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
               <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                     페이지 {currentPage} / {totalPages}
                  </div>
                  <div className="flex space-x-2">
                     <Button 
                        onClick={() => loadEnrollments(currentPage - 1)} 
                        disabled={currentPage === 1} 
                        variant="outline"
                     >
                        이전
                     </Button>
                     <Button 
                        onClick={() => loadEnrollments(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                        variant="outline"
                     >
                        다음
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
