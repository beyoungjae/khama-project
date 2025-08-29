'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'

interface ExamSchedule {
   id: string
   certification_id: string
   exam_date: string
   registration_start_date: string
   registration_end_date: string
   exam_location: string
   exam_address: string | null
   max_applicants: number
   current_applicants: number
   status: string
   certifications: {
      id: string
      name: string
      description: string | null
      application_fee: number | null
   }
}

export default function ApplicationForm() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const { user, profile } = useAuth()
   const [loading, setLoading] = useState(true)
   const [submitting, setSubmitting] = useState(false)
   const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([])
   const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(null)

   const scheduleId = searchParams.get('schedule')

   const [formData, setFormData] = useState({
      examScheduleId: scheduleId || '',
      paymentMethod: 'transfer', // 기본값을 계좌이체로 변경
   })

   // 사용자 인증 확인
   useEffect(() => {
      if (!user) {
               router.push('/login')
               return
      }
   }, [user, router])

   // 시험 일정 목록 로드
   useEffect(() => {
      const loadExamSchedules = async () => {
         try {
            const response = await fetch('/api/exams/schedules')
            const data = await response.json()

            if (response.ok) {
               const availableSchedules = data.schedules.filter((schedule: ExamSchedule) => schedule.status === 'registration_open' && new Date(schedule.registration_end_date) > new Date() && schedule.current_applicants < schedule.max_applicants)
               setExamSchedules(availableSchedules)

               // URL에서 지정된 스케줄이 있으면 자동 선택
               if (scheduleId) {
                  const schedule = availableSchedules.find((s: ExamSchedule) => s.id === scheduleId)
                  if (schedule) {
                     setSelectedSchedule(schedule)
                     setFormData((prev) => ({ ...prev, examScheduleId: scheduleId }))
                  }
               }
            } else {
               console.error('시험 일정 로드 실패:', data.error)
            }
         } catch (error) {
            console.error('시험 일정 로드 오류:', error)
         } finally {
            setLoading(false)
         }
      }

      loadExamSchedules()
   }, [scheduleId])

   const handleScheduleSelect = (scheduleId: string) => {
      const schedule = examSchedules.find((s) => s.id === scheduleId)
      setSelectedSchedule(schedule || null)
      setFormData((prev) => ({ ...prev, examScheduleId: scheduleId }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!user) {
         alert('로그인이 필요합니다.')
         return
      }

      if (!formData.examScheduleId) {
         alert('시험 일정을 선택해주세요.')
         return
      }

      if (!profile?.name || !profile?.phone) {
         alert('마이페이지에서 개인정보를 먼저 등록해주세요.')
         router.push('/mypage')
         return
      }

      try {
         setSubmitting(true)

         // 폼 데이터 준비
         const applicationData = {
            exam_schedule_id: formData.examScheduleId,
            certification_id: selectedSchedule?.certification_id,
            applicant_name: profile.name,
            applicant_phone: profile.phone,
            applicant_email: user.email,
            applicant_birth_date: profile.birth_date,
            applicant_address: profile.address,
            payment_method: formData.paymentMethod,
            user_id: user.id, // user_id 추가
         }

         const response = await fetch('/api/exams/applications', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData),
         })

         const result = await response.json()

         if (response.ok) {
            // 신청 완료 메시지 표시
            alert(`시험 신청이 완료되었습니다!\n\n계좌이체 안내:\n국민은행 757301-00-321325\n예금주: 한국생활가전유지관리협회\n\n입금 확인 후 신청이 최종 완료됩니다.`)
            router.push('/mypage')
         } else {
            alert(result.error || '신청 중 오류가 발생했습니다.')
         }
      } catch (error) {
         console.error('신청 오류:', error)
         alert('신청 중 오류가 발생했습니다.')
      } finally {
         setSubmitting(false)
      }
   }

   if (!user) {
      return (
         <div className="text-center py-8">
            <p className="text-gray-600">로그인이 필요합니다.</p>
         </div>
      )
   }

   if (loading) {
      return (
         <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">시험 일정을 불러오는 중...</p>
         </div>
      )
   }

   if (examSchedules.length === 0) {
      return (
         <Card>
            <div className="text-center py-8">
               <p className="text-gray-600 mb-4">현재 신청 가능한 시험이 없습니다.</p>
               <Button onClick={() => router.push('/exam/schedule')}>시험 일정 보기</Button>
            </div>
         </Card>
      )
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-8">
         {/* 신청자 정보 확인 */}
         <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">신청자 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input type="text" value={profile?.name || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input type="email" value={user.email || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <input type="tel" value={profile?.phone || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                  <input type="text" value={profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('ko-KR') : ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
               </div>
            </div>

            {(!profile?.name || !profile?.phone) && (
               <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm mb-2">개인정보가 완전하지 않습니다. 시험 신청을 위해 마이페이지에서 정보를 완성해주세요.</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => router.push('/mypage')}>
                     마이페이지로 이동
                  </Button>
               </div>
            )}
         </Card>

         {/* 시험 일정 선택 */}
         <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">시험 일정 선택</h2>
            <div className="space-y-4">
               {examSchedules.map((schedule) => (
                  <div key={schedule.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.examScheduleId === schedule.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => handleScheduleSelect(schedule.id)}>
                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{schedule.certifications.name}</h3>
                              {formData.examScheduleId === schedule.id && <Badge variant="primary">선택됨</Badge>}
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                 <span className="font-medium">시험일:</span>
                                 <br />
                                 {new Date(schedule.exam_date).toLocaleDateString('ko-KR')}
                              </div>
                              <div>
                                 <span className="font-medium">장소:</span>
                                 <br />
                                 {schedule.exam_location}
                                 {schedule.exam_address && <div className="text-xs text-gray-500">{schedule.exam_address}</div>}
                              </div>
                              <div>
                                 <span className="font-medium">신청 현황:</span>
                                 <br />
                                 {schedule.current_applicants}/{schedule.max_applicants}명<div className="text-xs text-gray-500">잔여 {schedule.max_applicants - schedule.current_applicants}명</div>
                              </div>
                           </div>
                           {schedule.certifications.description && <p className="mt-2 text-sm text-gray-600">{schedule.certifications.description}</p>}
                        </div>
                        <div className="ml-4 text-right">
                           <div className="text-lg font-bold text-blue-600">{schedule.certifications.application_fee ? `${schedule.certifications.application_fee.toLocaleString()}원` : '별도문의'}</div>
                           <div className="text-xs text-gray-500">신청마감: {new Date(schedule.registration_end_date).toLocaleDateString('ko-KR')}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </Card>

         {/* 결제 방법 */}
         {selectedSchedule && selectedSchedule.certifications.application_fee && selectedSchedule.certifications.application_fee > 0 && (
            <Card>
               <h2 className="text-2xl font-bold text-gray-900 mb-6">결제 방법</h2>
               <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                     <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))} className="text-blue-600" />
                     <span>계좌이체</span>
                  </label>
               </div>

               {/* 계좌 정보 안내 */}
               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">계좌이체 안내</h3>
                  <p className="text-sm text-blue-800 mb-2">아래 계좌로 정확한 금액을 입금해주세요.</p>
                  <div className="bg-white p-3 rounded border border-blue-100">
                     <div className="font-mono text-lg font-bold text-blue-900">국민은행 757301-00-321325</div>
                     <div className="text-sm text-gray-600 mt-1">예금주: 한국생활가전유지관리협회</div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">* 입금 확인 후 신청이 최종 완료됩니다. 관리자가 입금을 확인하면 시험 신청이 확정됩니다.</p>
               </div>

               {/* 관리자 확인 절차 안내 */}
               <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-2">관리자 확인 절차 안내</h3>
                  <p className="text-sm text-yellow-800">입금 후 관리자가 입금 내역을 확인해야 신청이 최종 완료됩니다. 관리자 확인이 완료되면 마이페이지에서 신청 상태를 확인할 수 있습니다.</p>
               </div>
            </Card>
         )}

         {/* 신청 요약 및 제출 */}
         {selectedSchedule && (
            <Card>
               <h2 className="text-2xl font-bold text-gray-900 mb-6">신청 요약</h2>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                     <span className="font-medium">자격증명:</span>
                     <span>{selectedSchedule.certifications.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                     <span className="font-medium">시험일:</span>
                     <span>{new Date(selectedSchedule.exam_date).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                     <span className="font-medium">시험장소:</span>
                     <span>{selectedSchedule.exam_location}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                     <span className="font-medium">신청자명:</span>
                     <span>{profile?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                     <span className="font-medium text-lg">결제금액:</span>
                     <span className="text-lg font-bold text-blue-600">{selectedSchedule.certifications.application_fee ? `${selectedSchedule.certifications.application_fee.toLocaleString()}원` : '별도문의'}</span>
                  </div>
               </div>

               <div className="mt-8 flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                     취소
                  </Button>
                  <Button type="submit" disabled={submitting || !profile?.name || !profile?.phone} className="flex-1">
                     {submitting ? (
                        <div className="flex items-center justify-center">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           신청 중...
                        </div>
                     ) : (
                        '시험 신청하기'
                     )}
                  </Button>
               </div>
            </Card>
         )}
      </form>
   )
}
