'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { IMAGES } from '@/constants/images'
import Modal from '@/components/ui/Modal'

interface EducationCourse {
   id: string
   name: string
   description: string
   category: string
   course_code: string
   duration_hours: number
   max_participants: number
   course_fee: number | null
   prerequisites: string | null
   instructor_name: string | null
   instructor_bio: string | null
   materials_included: string | null
   curriculum:
      | {
           week: number
           topic: string
           content: string
        }[]
      | null
   status: string | null
   created_at: string
}

interface EducationSchedule {
   id: string
   course_id: string
   location: string
   address: string | null
   classroom: string | null
   start_date: string
   end_date: string
   registration_start_date: string
   registration_end_date: string
   max_participants: number
   current_participants: number | null
   status: string | null
   special_notes: string | null
}

export default function EducationPage() {
   const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
   const [isDetailOpen, setIsDetailOpen] = useState(false)
   const [courses, setCourses] = useState<EducationCourse[]>([])
   const [schedules, setSchedules] = useState<EducationSchedule[]>([])
   const [loading, setLoading] = useState(true)

   // 교육 과정 및 일정 조회
   const fetchEducationData = async () => {
      try {
         setLoading(true)

         // 교육 과정 목록 조회
         const coursesResponse = await fetch('/api/education/courses')
         const coursesData = await coursesResponse.json()
         setCourses(coursesData.courses || [])

         // 교육 일정 목록 조회
         const schedulesResponse = await fetch('/api/education/schedules')
         const schedulesData = await schedulesResponse.json()
         setSchedules(schedulesData.schedules || [])
      } catch (error) {
         console.error('교육 데이터 조회 오류:', error)
         setCourses([])
         setSchedules([])
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchEducationData()
   }, [])

   // 교육 과정과 일정 매핑
   const getEducationPrograms = () => {
      if (courses.length === 0) return []

      return courses.map((course) => {
         const courseSchedules = schedules.filter((schedule) => schedule.course_id === course.id)
         const nextSchedule = courseSchedules.find((s) => new Date(s.start_date) > new Date()) || courseSchedules[0]

         return {
            id: course.id,
            title: course.name,
            subtitle: course.category,
            description: course.description || '교육 과정에 대한 자세한 설명입니다.',
            duration: `${course.duration_hours}시간`,
            schedule: nextSchedule?.location || '교육장소 미정',
            location: nextSchedule?.location || '교육장소 미정',
            capacity: course.max_participants,
            currentEnrollment: nextSchedule?.current_participants || 0,
            features: course.materials_included ? course.materials_included.split(',').map((item: string) => item.trim()) : ['실무 중심 교육', '수료증 발급'],
            curriculum: course.curriculum || [],
            requirements: course.prerequisites ? course.prerequisites.split(',').map((item: string) => item.trim()) : ['교육 의지가 있는 분'],
            benefits: ['수료증 발급', '전문 교육 이수', '기술 습득'],
            instructor: {
               name: course.instructor_name || '전문 강사',
               career: course.instructor_bio || '해당 분야 전문가',
               image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            },
            status: course.status === 'active' ? 'open' : course.status === 'closed' ? 'closed' : 'upcoming',
            nextStartDate: nextSchedule?.start_date ? new Date(nextSchedule.start_date).toLocaleDateString() : '미정',
         }
      })
   }

   const programs = getEducationPrograms()

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

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-16 bg-gradient-to-r from-emerald-900 to-emerald-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.EDUCATION})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">교육 프로그램</h1>
                  <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                     체계적인 교육과정을 통해 가전 청소 전문가로 성장하세요.
                     <br />
                     창업부터 전문성 향상까지, 단계별 맞춤 교육을 제공합니다.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link href="/business/education/apply" className="bg-blue-900 hover:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-4xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                        교육 신청하기
                     </Link>
                     <Link href="/support/inquiry" className="inline-flex items-center bg-emerald-600 text-white px-8 py-4 rounded-4xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        교육 문의
                     </Link>
                  </div>
               </div>
            </section>

            {/* 교육 과정 소개 */}
            <section className="py-16 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">교육 과정 안내</h2>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">수준별, 목적별로 구성된 다양한 교육과정을 통해 여러분의 목표를 달성하세요.</p>
                  </div>

                  {loading ? (
                     <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                        <p className="mt-2 text-gray-600">교육 과정을 불러오는 중입니다...</p>
                     </div>
                  ) : programs.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">현재 진행 중인 교육 과정이 없습니다.</p>
                        <Link href="/support/inquiry">
                           <Button>교육 문의하기</Button>
                        </Link>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {programs.map((program) => (
                           <Card key={program.id} className="h-full">
                              <div className="flex flex-col h-full">
                                 {/* 헤더 */}
                                 <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                       <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                                       {getStatusBadge(program.status)}
                                    </div>
                                    <p className="text-emerald-600 font-medium mb-2">{program.subtitle}</p>
                                    <p className="text-gray-600 text-sm">{program.description}</p>
                                 </div>

                                 {/* 기본 정보 */}
                                 <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm">
                                       <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                       </svg>
                                       <span className="text-gray-600">기간: {program.duration}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                       <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                                       </svg>
                                       <span className="text-gray-600">일정: {program.schedule}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                       <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                       </svg>
                                       <span className="text-gray-600">장소: {program.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                       <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                       </svg>
                                       <span className="text-gray-600">
                                          정원: {program.currentEnrollment}/{program.capacity}명
                                       </span>
                                    </div>
                                 </div>

                                 {/* 특징 */}
                                 <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">주요 특징</h4>
                                    <ul className="space-y-1">
                                       {program.features.map((feature, index) => (
                                          <li key={index} className="flex items-center text-sm text-gray-600">
                                             <svg className="w-3 h-3 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                             </svg>
                                             {feature}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>

                                 {/* 버튼 */}
                                 <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                       <div>
                                          <p className="text-sm text-gray-500">다음 개강: {program.nextStartDate}</p>
                                       </div>
                                    </div>

                                    <div className="space-y-2">
                                       {program.status === 'open' ? (
                                          <Link href={`/business/education/${program.id}`}>
                                             <Button className="w-full">신청하기</Button>
                                          </Link>
                                       ) : (
                                          <Button className="w-full" disabled>
                                             {program.status === 'closed' ? '마감' : '사전신청'}
                                          </Button>
                                       )}
                                       <Button
                                          variant="outline"
                                          className="w-full"
                                          onClick={() => {
                                             setSelectedProgram(program.id)
                                             setIsDetailOpen(true)
                                          }}
                                       >
                                          자세히 보기
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </Card>
                        ))}
                     </div>
                  )}
               </div>
            </section>

            {/* 상세 정보 모달: 수강 요건/수료 혜택만 표시 */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="상세 정보" size="md">
               {selectedProgram &&
                  programs
                     .filter((p) => p.id === selectedProgram)
                     .map((program) => (
                        <div key={program.id} className="space-y-6">
                           <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">수강 요건</h3>
                              <ul className="space-y-2">
                                 {program.requirements.map((req, index) => (
                                    <li key={index} className="flex items-center text-gray-700">
                                       <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                       </svg>
                                       {req}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           <div className="pt-2">
                              <Button className="w-full" onClick={() => setIsDetailOpen(false)}>
                                 닫기
                              </Button>
                           </div>
                        </div>
                     ))}
            </Modal>

            {/* 교육 신청 안내 */}
            <section className="py-16 bg-emerald-50">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">교육 신청 안내</h2>
                  <p className="text-lg text-gray-600 mb-8">교육 신청은 온라인으로 간편하게 하실 수 있습니다.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                     <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-white font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">과정 선택</h3>
                        <p className="text-gray-600">원하는 교육과정을 선택하고 상세 정보를 확인하세요.</p>
                     </div>
                     <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">온라인 신청</h3>
                        <p className="text-gray-600">신청서를 작성하고 교육비를 결제합니다.</p>
                     </div>
                     <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-white font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">교육 참여</h3>
                        <p className="text-gray-600">개강일에 교육장에 오셔서 교육을 받으세요.</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link href="/support/inquiry">
                        <Button size="lg">교육 문의하기</Button>
                     </Link>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
