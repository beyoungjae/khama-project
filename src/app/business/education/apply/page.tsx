'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'

interface EducationCourse {
   id: string
   title: string
   course_fee: number
   education_schedules: Array<{
      id: string
      start_date: string
      end_date: string
      location: string
      max_participants: number
      current_participants: number
      registration_start_date?: string
      registration_end_date?: string
      status?: string
   }>
}

function EducationApplyContent() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const courseId = searchParams.get('courseId')
   const { user, profile } = useAuth()

   const [course, setCourse] = useState<EducationCourse | null>(null)
   const [loading, setLoading] = useState(true)
   const [submitting, setSubmitting] = useState(false)
   const [selectedSchedule, setSelectedSchedule] = useState('')
   const [applicantInfo, setApplicantInfo] = useState({
      name: '',
      phone: '',
      email: '',
   })

   // 교육 과정 정보 조회
   const fetchCourseDetail = async () => {
      if (!courseId) {
         router.push('/business/education')
         return
      }

      try {
         setLoading(true)
         const response = await fetch(`/api/education/courses/${courseId}`)

         if (!response.ok) {
            throw new Error('교육 과정 정보를 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setCourse(data.course)
      } catch (error) {
         console.error('교육 과정 조회 오류:', error)
         router.push('/business/education')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchCourseDetail()
   }, [courseId])

   // 기본 선택: 접수 중인 첫 일정
   useEffect(() => {
      if (course?.education_schedules?.length) {
         const now = new Date()
         const open = course.education_schedules.find(s => {
            const rs = s.registration_start_date ? new Date(s.registration_start_date) : null
            const re = s.registration_end_date ? new Date(s.registration_end_date) : null
            return rs && re ? now >= rs && now <= re : s.status === 'registration_open'
         })
         if (open) setSelectedSchedule(open.id)
      }
   }, [course])

   // 로그인 사용자의 기본 정보 자동 입력
   useEffect(() => {
      if (user) {
         setApplicantInfo((prev) => ({
            ...prev,
            name: profile?.name || prev.name,
            phone: profile?.phone || prev.phone,
            email: user.email || prev.email,
         }))
      }
   }, [user, profile])

   // 수강 신청 처리
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!courseId || !selectedSchedule) {
         alert('교육 일정을 선택해주세요.')
         return
      }

      if (!user) {
         alert('로그인이 필요합니다.')
         const redirectTo = `/business/education/apply?courseId=${courseId}`
         router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)
         return
      }

      // 필수 정보 검증
      if (!applicantInfo.name || !applicantInfo.phone) {
         alert('이름과 연락처를 입력해주세요.')
         return
      }

      try {
         setSubmitting(true)

         const applicationData = {
            userId: user.id,
            courseId,
            applicationData: {
               ...applicantInfo,
               schedule_id: selectedSchedule,
            },
         }

         const response = await fetch('/api/education/courses', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData),
         })

         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || '수강 신청에 실패했습니다.')
         }

         const data = await response.json()
         alert('수강 신청이 성공적으로 완료되었습니다.')
         router.push('/mypage') // 마이페이지로 이동
      } catch (error: any) {
         console.error('수강 신청 오류:', error)
         alert(error.message || '수강 신청 중 오류가 발생했습니다.')
      } finally {
         setSubmitting(false)
      }
   }

   // 입력값 변경 처리
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setApplicantInfo((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="text-center">
                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                     <p className="mt-2 text-gray-600">교육 과정 정보를 불러오는 중입니다...</p>
                  </div>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   if (!course) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <Card className="p-8 text-center">
                     <h2 className="text-xl font-bold text-gray-900 mb-2">교육 과정을 찾을 수 없습니다</h2>
                     <p className="text-gray-600 mb-6">존재하지 않거나 삭제된 교육 과정입니다.</p>
                     <Button onClick={() => router.push('/business/education')}>목록으로 돌아가기</Button>
                  </Card>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   return (
      <div className="min-h-screen flex flex-col">
         <Header />

         <main className="flex-grow pt-16">
            {/* 히어로 섹션 */}
            <section className="bg-gray-50 py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">수강 신청</h1>
                     <Button variant="outline" onClick={() => router.push('/business/education')}>
                        목록으로
                     </Button>
                  </div>
               </div>
            </section>

            <section className="py-8">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* 신청 폼 */}
                     <div className="lg:col-span-2">
                        <Card className="p-6">
                           <h2 className="text-xl font-bold text-gray-900 mb-6">신청 정보 입력</h2>

                           <form onSubmit={handleSubmit} className="space-y-6">
                              {/* 교육 과정 정보 */}
                              <div className="border border-gray-200 rounded-lg p-4">
                                 <h3 className="font-medium text-gray-900 mb-2">{(course as any).name || course.title}</h3>
                                 <p className="text-sm text-gray-500">교육비: {course.course_fee ? `${course.course_fee.toLocaleString()}원` : '무료'}</p>
                              </div>

                              {/* 교육 일정 선택 */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">교육 일정 선택 *</label>
                                 {course.education_schedules && course.education_schedules.length > 0 ? (
                                    <div className="space-y-2">
                                      {course.education_schedules
                                        .slice()
                                        .sort((a,b)=> new Date(a.start_date).getTime()-new Date(b.start_date).getTime())
                                        .map((schedule) => {
                                          const now = new Date()
                                          const rs = schedule.registration_start_date ? new Date(schedule.registration_start_date) : null
                                          const re = schedule.registration_end_date ? new Date(schedule.registration_end_date) : null
                                          const open = rs && re ? now >= rs && now <= re : (schedule.status === 'registration_open')
                                          const full = (schedule.current_participants || 0) >= (schedule.max_participants || 0)
                                          const disabled = !open || full
                                          return (
                                            <label key={schedule.id} className={`flex items-center p-3 border rounded-lg ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50 cursor-pointer'}`}>
                                              <input
                                                type="radio"
                                                name="schedule"
                                                value={schedule.id}
                                                checked={selectedSchedule === schedule.id}
                                                onChange={(e) => setSelectedSchedule(e.target.value)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                disabled={disabled}
                                                required
                                              />
                                              <div className="ml-3">
                                                <div className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
                                                  {new Date(schedule.start_date).toLocaleDateString()} - {new Date(schedule.end_date).toLocaleDateString()}
                                                </div>
                                                <div className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                                  {schedule.location} | 정원: {schedule.current_participants}/{schedule.max_participants}명 {full ? '(마감)' : open ? '(모집중)' : '(접수기간 아님)'}
                                                </div>
                                              </div>
                                            </label>
                                          )
                                        })}
                                    </div>
                                 ) : (
                                    <p className="text-gray-500">등록된 교육 일정이 없습니다.</p>
                                 )}
                              </div>

                              {/* 신청자 정보 */}
                              <div className="space-y-4">
                                 <h3 className="font-medium text-gray-900">신청자 정보</h3>

                                 <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                       이름 *
                                    </label>
                                    <Input id="name" name="name" value={applicantInfo.name} onChange={handleInputChange} placeholder="이름을 입력해주세요" required />
                                 </div>

                                 <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                       연락처 *
                                    </label>
                                    <Input id="phone" name="phone" value={applicantInfo.phone} onChange={handleInputChange} placeholder="연락처를 입력해주세요" required />
                                 </div>

                                 <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                       이메일
                                    </label>
                                    <Input id="email" name="email" type="email" value={applicantInfo.email} onChange={handleInputChange} placeholder="이메일을 입력해주세요" />
                                 </div>
                              </div>

                              {/* 제출 버튼 */}
                              <div className="flex justify-end pt-4">
                                 <Button type="submit" disabled={submitting} className="px-8">
                                    {submitting ? '신청 중...' : '수강 신청하기'}
                                 </Button>
                              </div>
                           </form>
                        </Card>
                     </div>

                     {/* 안내사항 */}
                     <div>
                        <Card className="p-6">
                           <h2 className="text-xl font-bold text-gray-900 mb-4">신청 안내</h2>
                           <div className="space-y-4 text-sm text-gray-600">
                              <div>
                                 <h3 className="font-medium text-gray-900 mb-1">신청 절차</h3>
                                 <ul className="list-disc list-inside space-y-1">
                                    <li>교육 일정 선택</li>
                                    <li>신청자 정보 입력</li>
                                    <li>수강 신청 완료</li>
                                    <li>신청 확인 이메일 발송</li>
                                 </ul>
                              </div>

                              <div>
                                 <h3 className="font-medium text-gray-900 mb-1">취소 및 환불</h3>
                                 <ul className="list-disc list-inside space-y-1">
                                    <li>개강 7일 전까지: 전액 환불</li>
                                    <li>개강 3일 전까지: 50% 환불</li>
                                    <li>개강 이후: 환불 불가</li>
                                 </ul>
                              </div>
                           </div>
                        </Card>
                     </div>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}

export default function EducationApplyPage() {
   return (
      <Suspense
         fallback={
            <div className="min-h-screen flex flex-col">
               <Header />
               <main className="flex-grow pt-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                     <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">페이지를 불러오는 중입니다...</p>
                     </div>
                  </div>
               </main>
               <Footer />
            </div>
         }
      >
         <EducationApplyContent />
      </Suspense>
   )
}
