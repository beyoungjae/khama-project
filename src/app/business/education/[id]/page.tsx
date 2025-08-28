'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface EducationCourse {
   id: string
   title: string
   description: string
   category: string
   duration_hours: number
   instructor_name: string
   instructor_bio: string
   curriculum: Array<{
      week: number
      topic: string
      content: string
   }>
   requirements: string[]
   benefits: string[]
   course_fee: number
   max_participants: number
   current_students: number
   status: string
   created_at: string
   updated_at: string
}

export default function EducationCourseDetailPage() {
   const router = useRouter()
   const params = useParams()
   const [course, setCourse] = useState<EducationCourse | null>(null)
   const [loading, setLoading] = useState(true)
   const [schedules, setSchedules] = useState<any[]>([])

   // 상태별 뱃지 컴포넌트
   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'open':
            return <Badge variant="success">접수중</Badge>
         case 'closed':
            return <Badge variant="error">마감</Badge>
         case 'upcoming':
            return <Badge variant="warning">접수예정</Badge>
         default:
            return <Badge variant="default">미정</Badge>
      }
   }

   // 다음 일정 기준으로 사용자 표시 상태 계산
   const computeDisplayStatus = (): 'open' | 'closed' | 'upcoming' => {
      if (!schedules || schedules.length === 0) return 'upcoming'
      const next = [...schedules].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
      const now = new Date()
      const rs = new Date(next.registration_start_date)
      const re = new Date(next.registration_end_date)
      if (now < rs) return 'upcoming'
      if (now >= rs && now <= re) return 'open'
      return 'closed'
   }

   // 교육 과정 상세 정보 조회
   const fetchCourseDetail = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/education/courses/${params.id}`)

         if (!response.ok) {
            throw new Error('교육 과정 정보를 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setCourse(data.course)

         // 교육 일정 정보도 설정
         if (data.course.education_schedules) {
            setSchedules(data.course.education_schedules)
         }
      } catch (error) {
         console.error('교육 과정 상세 조회 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (params.id) {
         fetchCourseDetail()
      }
   }, [params.id])

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
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">교육 프로그램</h1>
                     <Button variant="outline" onClick={() => router.push('/business/education')}>
                        목록으로
                     </Button>
                  </div>
               </div>
            </section>

            <section className="py-8">
               <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* 메인 콘텐츠 */}
                     <div className="lg:col-span-2">
                        {/* 교육 과정 정보 */}
                        <Card className="mb-6">
                           <div className="p-6">
                              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                 <h1 className="text-2xl font-bold text-gray-900">{(course as any).name || course.title}</h1>
                                 {getStatusBadge(computeDisplayStatus())}
                              </div>

                              <p className="text-gray-600 mb-6">{course.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-600">교육 시간: {course.duration_hours}시간</span>
                                 </div>
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                       />
                                    </svg>
                                    <span className="text-gray-600">
                                       정원: {schedules[0]?.current_participants ?? 0}/{schedules[0]?.max_participants ?? course.max_participants}명
                                    </span>
                                 </div>
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-600">교육비: {course.course_fee ? `${course.course_fee.toLocaleString()}원` : '무료'}</span>
                                 </div>
                              </div>
                           </div>
                        </Card>

                        {/* 수강 요건 및 혜택 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card>
                              <div className="p-6">
                                 <h2 className="text-xl font-bold text-gray-900 mb-4">수강 요건</h2>
                                 {course.requirements && course.requirements.length > 0 ? (
                                    <ul className="space-y-2">
                                       {course.requirements.map((req, index) => (
                                          <li key={index} className="flex items-center text-gray-600">
                                             <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                             </svg>
                                             {req}
                                          </li>
                                       ))}
                                    </ul>
                                 ) : (
                                    <p className="text-gray-500">등록된 수강 요건이 없습니다.</p>
                                 )}
                              </div>
                           </Card>
                        </div>
                     </div>

                     {/* 사이드바 */}
                     <div>
                        {/* 수강 신청 */}
                        <Card className="mb-6">
                           <div className="p-6">
                              <h2 className="text-xl font-bold text-gray-900 mb-4">수강 신청</h2>
                              <div className="space-y-4">
                                 <Button className="w-full" disabled={computeDisplayStatus() !== 'open'} onClick={() => router.push(`/business/education/apply?courseId=${course.id}`)}>
                                    {computeDisplayStatus() === 'open' ? '수강 신청하기' : computeDisplayStatus() === 'closed' ? '신청 마감' : '신청 예정'}
                                 </Button>

                                 <div className="text-center text-sm text-gray-500">
                                    <p>다음 개강일 정보</p>
                                    <p className="font-medium">{schedules.length > 0 ? new Date(schedules[0].start_date).toLocaleDateString() : '개강일 미정'}</p>
                                 </div>
                              </div>
                           </div>
                        </Card>

                        {/* 교육 일정 */}
                        <Card>
                           <div className="p-6">
                              <h2 className="text-xl font-bold text-gray-900 mb-4">교육 일정</h2>
                              {schedules.length > 0 ? (
                                 <div className="space-y-3">
                                    {schedules.map((schedule) => (
                                       <div key={schedule.id} className="border border-gray-200 rounded-lg p-3">
                                          <div className="text-sm font-medium text-gray-900">
                                             {new Date(schedule.start_date).toLocaleDateString()} - {new Date(schedule.end_date).toLocaleDateString()}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">{schedule.location}</div>
                                          <div className="text-xs text-gray-500">
                                             정원: {schedule.current_participants}/{schedule.max_participants}명
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="text-gray-500 text-center py-4">등록된 교육 일정이 없습니다.</p>
                              )}
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
