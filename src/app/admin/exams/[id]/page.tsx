'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminHeader from '@/components/layout/AdminHeader'
import { useAdmin } from '@/hooks/useAdmin'

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
   required_items: string[] | null
   status: string
   created_at: string
   updated_at: string
   certifications: Certification
}

interface ExamApplication {
   id: string
   applicant_name: string
   applicant_email: string
   applicant_phone: string
   application_status: string
   payment_status: string
   payment_amount: number | null
   payment_method: string | null
   paid_at: string | null
   created_at: string
   exam_number: string | null
   pass_status: boolean | null
}

export default function AdminExamDetailPage() {
   const { isAdmin, isChecking } = useAdmin()
   const params = useParams()
   const router = useRouter()
   const [schedule, setSchedule] = useState<ExamSchedule | null>(null)
   const [applications, setApplications] = useState<ExamApplication[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      if (!isAdmin || isChecking) return

      const loadData = async () => {
         try {
            setLoading(true)

            // 인증 헤더 추가
            const token = localStorage.getItem('admin-token')
            const headers: Record<string, string> = {
               'Content-Type': 'application/json',
            }

            if (token) {
               headers['Authorization'] = `Bearer ${token}`
            }

            // 시험 일정 상세 정보 및 신청자 목록 로드
            const response = await fetch(`/api/admin/exams/${params.id}`, {
               headers,
            })
            const data = await response.json()

            if (response.ok) {
               setSchedule(data.schedule)
               setApplications(data.applications || [])
            } else {
               console.error('시험 일정 조회 실패:', data.error)
               alert('시험 일정을 불러오는데 실패했습니다.')
               router.push('/admin/exams')
            }
         } catch (error) {
            console.error('데이터 로드 오류:', error)
            alert('서버 오류가 발생했습니다.')
            router.push('/admin/exams')
         } finally {
            setLoading(false)
         }
      }

      loadData()
   }, [isAdmin, isChecking, params.id, router])

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'draft':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">임시저장</span>
         case 'submitted':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">제출됨</span>
         case 'payment_pending':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">결제대기</span>
         case 'payment_completed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">결제완료</span>
         case 'confirmed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">확정됨</span>
         case 'exam_taken':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">시험응시</span>
         case 'passed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">합격</span>
         case 'failed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">불합격</span>
         case 'cancelled':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">취소됨</span>
         default:
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
      }
   }

   const getPaymentStatusBadge = (status: string) => {
      switch (status) {
         case 'pending':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">대기중</span>
         case 'completed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">완료</span>
         case 'failed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">실패</span>
         case 'cancelled':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">취소됨</span>
         default:
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
      }
   }

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

   if (!schedule) {
      return (
         <div className="min-h-screen">
            <AdminHeader />
            <div className="pt-20 px-4 sm:px-6 lg:px-8">
               <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                     <h1 className="text-xl font-semibold text-gray-900 mb-4">시험 일정을 찾을 수 없습니다</h1>
                     <button onClick={() => router.push('/admin/exams')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        목록으로 돌아가기
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen">
         <AdminHeader />

         <div className="pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
               {/* 헤더 */}
               <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h1 className="text-2xl font-bold text-gray-900">시험 일정 상세</h1>
                        <p className="text-gray-600 mt-1">{schedule.certifications?.name}</p>
                     </div>
                     <div className="flex space-x-3">
                        <button onClick={() => router.push(`/admin/exams/edit/${schedule.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                           수정하기
                        </button>
                        <button onClick={() => router.push('/admin/exams')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                           목록으로
                        </button>
                     </div>
                  </div>

                  {/* 시험 정보 카드 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
                        <div className="space-y-3">
                           <div>
                              <p className="text-sm text-gray-500">자격증</p>
                              <p className="font-medium">{schedule.certifications?.name}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-500">등록번호</p>
                              <p className="font-medium">{schedule.certifications?.registration_number}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-500">상태</p>
                              <p className="font-medium">{statusOptions.find((opt) => opt.value === schedule.status)?.label || schedule.status}</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">일정 정보</h3>
                        <div className="space-y-3">
                           <div>
                              <p className="text-sm text-gray-500">시험일</p>
                              <p className="font-medium">{new Date(schedule.exam_date).toLocaleDateString('ko-KR')}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-500">접수기간</p>
                              <p className="font-medium">
                                 {new Date(schedule.registration_start_date).toLocaleDateString('ko-KR')} ~ {new Date(schedule.registration_end_date).toLocaleDateString('ko-KR')}
                              </p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-500">신청현황</p>
                              <p className="font-medium">
                                 {schedule.current_applicants} / {schedule.max_applicants}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">장소 정보</h3>
                        <div className="space-y-3">
                           <div>
                              <p className="text-sm text-gray-500">시험장소</p>
                              <p className="font-medium">{schedule.exam_location}</p>
                           </div>
                           {schedule.exam_address && (
                              <div>
                                 <p className="text-sm text-gray-500">상세주소</p>
                                 <p className="font-medium">{schedule.exam_address}</p>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">비용 정보</h3>
                        <div className="space-y-3">
                           <div>
                              <p className="text-sm text-gray-500">응시료</p>
                              <p className="font-medium">{schedule.certifications?.application_fee?.toLocaleString() || 0}원</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-500">자격증 발급비</p>
                              <p className="font-medium">{schedule.certifications?.certificate_fee?.toLocaleString() || 0}원</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 신청자 목록 */}
               <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold">신청자 목록</h2>
                     <Link href="/admin/exam-applications" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium">
                        입금 확인이 필요한 경우 여기를 클릭하세요
                     </Link>
                  </div>
                  {applications.length === 0 ? (
                     <p className="text-gray-500 text-center py-8">신청자가 없습니다.</p>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    신청자
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    연락처
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    신청일시
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    신청상태
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    결제상태
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    결제금액
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    합격여부
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                              {applications.length > 0 ? (
                                 applications.map((application) => (
                                    <tr key={application.id} className="hover:bg-gray-50">
                                       <td className="px-6 py-4">
                                          <div className="text-sm font-medium text-gray-900">{application.applicant_name}</div>
                                          <div className="text-sm text-gray-500">{application.applicant_email}</div>
                                       </td>
                                       <td className="px-6 py-4 text-sm text-gray-900">{application.applicant_phone}</td>
                                       <td className="px-6 py-4 text-sm text-gray-500">{new Date(application.created_at).toLocaleDateString('ko-KR')}</td>
                                       <td className="px-6 py-4">{getStatusBadge(application.application_status)}</td>
                                       <td className="px-6 py-4">{getPaymentStatusBadge(application.payment_status)}</td>
                                       <td className="px-6 py-4 text-sm text-gray-900">{application.payment_amount ? `${application.payment_amount.toLocaleString()}원` : '-'}</td>
                                       <td className="px-6 py-4">
                                          {application.pass_status === true ? (
                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">합격</span>
                                          ) : application.pass_status === false ? (
                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">불합격</span>
                                          ) : (
                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">미정</span>
                                          )}
                                       </td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                       신청자가 없습니다.
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

const statusOptions = [
   { value: 'scheduled', label: '예정' },
   { value: 'registration_open', label: '접수중' },
   { value: 'registration_closed', label: '접수마감' },
   { value: 'exam_completed', label: '시험완료' },
   { value: 'results_announced', label: '결과발표' },
   { value: 'cancelled', label: '취소' },
]
