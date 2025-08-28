'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { IMAGES } from '@/constants/images'

interface ExamApplication {
   id: string
   exam_number?: string | null
   application_number: string
   application_status: string
   created_at: string
   exam_schedules: {
      id: string
      exam_date: string
      exam_location: string
      certifications: {
         id: string
         name: string
      }
   }
}

interface ExamResult {
   id: string
   written_score: number | null
   practical_score: number | null
   total_score: number
   result_status: string
   pass_status?: string
   announced_at: string
   created_at?: string
   exam_applications: {
      id: string
      application_number: string
      exam_schedules: {
         exam_date: string
         certifications: {
            name: string
         }
      }
   }
}

interface Inquiry {
   id: string
   name: string
   email: string
   phone: string
   category: string
   subject: string
   content: string
   status: string
   is_answered: boolean
   admin_response?: string
   created_at: string
   answered_at?: string
}

export default function MyPage() {
   const router = useRouter()
   const { user, profile, isLoading } = useAuth()
   const [examApplications, setExamApplications] = useState<ExamApplication[]>([])
   const [eduEnrollments, setEduEnrollments] = useState<any[]>([])
   const [examResults, setExamResults] = useState<ExamResult[]>([])
   const [inquiries, setInquiries] = useState<Inquiry[]>([])
   const [activeTab, setActiveTab] = useState<'applications' | 'education' | 'results' | 'certificates' | 'inquiries'>('applications')
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      if (!user && !isLoading) {
         router.push('/login')
         return
      }

      if (user && profile) {
         loadExamData()
      }
   }, [user, profile, isLoading])

   const loadExamData = async () => {
      try {
         setLoading(true)

         if (!user) return

         // 실제 시험 신청 데이터 로드
         try {
            const applicationsRes = await fetch(`/api/exams/applications?userId=${user.id}`)
            const applicationsData = await applicationsRes.json()

            if (applicationsRes.ok) {
               setExamApplications(applicationsData.applications || [])
            } else {
               console.error('시험 신청 데이터 로드 실패:', applicationsData.error)
               // 실패 시 빈 배열로 설정
               setExamApplications([])
            }
         } catch (error) {
            console.error('시험 신청 API 호출 오류:', error)
            setExamApplications([])
         }

         // // 실제 시험 결과 데이터 로드 추후 연동
         // try {
         //    const resultsRes = await fetch(`/api/exams/results?userId=${user.id}`)
         //    const resultsData = await resultsRes.json()

         //    if (resultsRes.ok) {
         //       setExamResults(resultsData.results || [])
         //    } else {
         //       console.error('시험 결과 데이터 로드 실패:', resultsData.error)
         //       // 실패 시 빈 배열로 설정
         //       setExamResults([])
         //    }
         // } catch (error) {
         //    console.error('시험 결과 API 호출 오류:', error)
         //    setExamResults([])
         // }

         // 교육 신청 내역 로드
         try {
            const eduRes = await fetch(`/api/education/applications?userId=${user.id}`)
            const eduData = await eduRes.json()
            if (eduRes.ok) {
               setEduEnrollments(eduData.applications || [])
            } else {
               console.error('교육 신청 내역 로드 실패:', eduData.error)
               setEduEnrollments([])
            }
         } catch (error) {
            console.error('교육 신청 API 호출 오류:', error)
            setEduEnrollments([])
         }

         // 1:1 문의 내역 로드
         try {
            const inquiriesRes = await fetch(`/api/support/inquiry?email=${user.email}`)
            const inquiriesData = await inquiriesRes.json()

            if (inquiriesRes.ok) {
               setInquiries(inquiriesData.inquiries || [])
               console.log('문의 내역 로드 성공:', inquiriesData.inquiries?.length || 0, '개')
            } else {
               console.error('문의 내역 로드 실패:', inquiriesData.error)
               setInquiries([])
            }
         } catch (error) {
            console.error('문의 내역 API 호출 오류:', error)
            setInquiries([])
         }
      } catch (error) {
         console.error('시험 데이터 로딩 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'draft':
            return <Badge variant="secondary">임시저장</Badge>
         case 'submitted':
            return <Badge variant="warning">제출됨</Badge>
         case 'payment_pending':
            return <Badge variant="warning">입금대기</Badge>
         case 'payment_completed':
            return <Badge variant="primary">입금완료</Badge>
         case 'confirmed':
            return <Badge variant="success">승인됨</Badge>
         case 'exam_taken':
            return <Badge variant="secondary">시험응시</Badge>
         case 'passed':
            return <Badge variant="success">합격</Badge>
         case 'failed':
            return <Badge variant="error">불합격</Badge>
         case 'cancelled':
            return <Badge variant="error">취소</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   // 교육 신청 상태 뱃지 (한글 라벨)
   const getEduStatusBadge = (status: string) => {
      switch (status) {
         case 'pending':
            return <Badge variant="warning">대기중</Badge>
         case 'approved':
            return <Badge variant="success">승인됨</Badge>
         case 'rejected':
            return <Badge variant="error">거절됨</Badge>
         case 'cancelled':
            return <Badge variant="error">취소됨</Badge>
         case 'completed':
            return <Badge variant="primary">수료</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!user || !profile) {
      return null
   }

   return (
      <div className="min-h-screen flex flex-col">
         <Header />
         <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 py-8 mt-15">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                     <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">마이페이지</h1>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-1">
                        <Card className="h-full" padding="lg">
                           <div className="text-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                 <span className="text-3xl font-bold text-white">{profile.name?.charAt(0) || 'U'}</span>
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name || '이름 없음'}</h2>
                              <p className="text-gray-600 mb-6">{user.email}</p>
                              <div className="flex flex-wrap gap-3 justify-center mb-6">
                                 <Badge variant={profile.role === 'admin' ? 'primary' : 'secondary'} size="md">
                                    {profile.role === 'admin' ? '관리자' : '일반회원'}
                                 </Badge>
                                 <Badge variant={profile.status === 'active' ? 'success' : 'warning'} size="md">
                                    {profile.status === 'active' ? '활성' : '비활성'}
                                 </Badge>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                 <h3 className="font-semibold text-gray-900 mb-3">회원 정보</h3>
                                 <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                       <span className="text-gray-500">회원 등급</span>
                                       <span className="font-medium">일반 회원</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-500">가입일</span>
                                       <span className="font-medium">
                                          {profile.created_at
                                             ? new Date(profile.created_at).toLocaleDateString('ko-KR', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                               })
                                             : '정보 없음'}
                                       </span>
                                    </div>
                                 </div>
                              </div>

                              <Button onClick={() => router.push('/mypage/certificates')} variant="secondary" className="w-full py-3 font-medium">
                                 자격증 관리
                              </Button>
                           </div>
                        </Card>
                     </div>

                     <div className="lg:col-span-2">
                        <Card padding="none">
                           <div className="border-b border-gray-200">
                              <nav className="flex overflow-x-auto py-2 px-2">
                                 <button
                                    onClick={() => setActiveTab('applications')}
                                    className={`px-4 py-3 font-medium text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${activeTab === 'applications' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                 >
                                    시험 신청 내역
                                 </button>
                                 <button
                                    onClick={() => setActiveTab('education')}
                                    className={`px-4 py-3 font-medium text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${activeTab === 'education' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                 >
                                    교육 신청 내역
                                 </button>
                                 <button
                                    onClick={() => setActiveTab('certificates')}
                                    className={`px-4 py-3 font-medium text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${activeTab === 'certificates' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                 >
                                    보유 자격증
                                 </button>
                                 <button
                                    onClick={() => setActiveTab('inquiries')}
                                    className={`px-4 py-3 font-medium text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${activeTab === 'inquiries' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                 >
                                    1:1 문의 내역
                                 </button>
                              </nav>
                           </div>

                           <div className="p-6">
                              {loading ? (
                                 <div className="flex justify-center py-12">
                                    <LoadingSpinner size="large" />
                                 </div>
                              ) : activeTab === 'education' ? (
                                 <div className="space-y-4">
                                    {eduEnrollments.length > 0 ? (
                                       eduEnrollments.map((enr) => (
                                          <div key={enr.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <div className="flex-1">
                                                   <h3 className="font-bold text-gray-900 text-lg mb-1">{enr.education_schedules?.education_courses?.name || '교육 과정'}</h3>
                                                   <p className="text-gray-600 text-sm mb-3">신청번호: {enr.enrollment_number}</p>

                                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                      <div className="flex items-center text-gray-600">
                                                         <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                         </svg>
                                                         <span>
                                                            {enr.education_schedules?.start_date ? new Date(enr.education_schedules.start_date).toLocaleDateString('ko-KR') : ''} ~ {enr.education_schedules?.end_date ? new Date(enr.education_schedules.end_date).toLocaleDateString('ko-KR') : ''}
                                                         </span>
                                                      </div>
                                                      <div className="flex items-center text-gray-600">
                                                         <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                         </svg>
                                                         <span>{enr.education_schedules?.location || '-'}</span>
                                                      </div>
                                                      <div className="flex items-center text-gray-600">
                                                         <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                         </svg>
                                                         <span>신청일: {enr.created_at ? new Date(enr.created_at).toLocaleDateString('ko-KR') : ''}</span>
                                                      </div>
                                                   </div>
                                                </div>
                                                <div className="flex-shrink-0">{getEduStatusBadge(enr.enrollment_status)}</div>
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <div className="text-center py-12">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                   strokeWidth={2}
                                                   d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                />
                                             </svg>
                                          </div>
                                          <h3 className="text-lg font-medium text-gray-900 mb-2">교육 신청 내역이 없습니다</h3>
                                          <p className="text-gray-500 mb-4">관심 있는 교육 과정을 신청해보세요.</p>
                                          <Button onClick={() => router.push('/business/education')}>교육 과정 보기</Button>
                                       </div>
                                    )}
                                 </div>
                              ) : activeTab === 'certificates' ? (
                                 <div className="space-y-4">
                                    <div className="text-center py-8">
                                       <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                             />
                                          </svg>
                                       </div>
                                       <h3 className="text-xl font-bold text-gray-900 mb-3">보유 자격증</h3>
                                       <p className="text-gray-600 mb-6 max-w-md mx-auto">합격한 자격증의 PDF 파일을 다운로드 받으실 수 있습니다.</p>
                                       <Button onClick={() => router.push('/mypage/certificates')} variant="secondary" size="lg" className="px-8 py-3 font-medium">
                                          자격증 관리 페이지로 이동
                                       </Button>
                                    </div>
                                 </div>
                              ) : activeTab === 'inquiries' ? (
                                 <div className="space-y-4">
                                    {inquiries.length > 0 ? (
                                       inquiries.map((inquiry) => (
                                          <div key={inquiry.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <div className="flex-1">
                                                   <h3 className="font-bold text-gray-900 text-lg mb-1">{inquiry.subject}</h3>
                                                   <div className="flex flex-wrap items-center gap-2 mb-3">
                                                      <Badge variant={inquiry.category === 'exam' ? 'primary' : inquiry.category === 'education' ? 'secondary' : inquiry.category === 'certificate' ? 'success' : inquiry.category === 'payment' ? 'warning' : 'default'}>
                                                         {inquiry.category === 'exam'
                                                            ? '시험 관련 문의'
                                                            : inquiry.category === 'education'
                                                              ? '교육 관련 문의'
                                                              : inquiry.category === 'certificate'
                                                                ? '자격증 관련 문의'
                                                                : inquiry.category === 'payment'
                                                                  ? '결제 관련 문의'
                                                                  : inquiry.category === 'technical'
                                                                    ? '기술적 문제'
                                                                    : '기타 문의'}
                                                      </Badge>
                                                      <span className="text-xs text-gray-400">{new Date(inquiry.created_at).toLocaleDateString('ko-KR')}</span>
                                                   </div>
                                                   <p className="text-gray-700 line-clamp-2 mb-4">{inquiry.content}</p>

                                                   {inquiry.is_answered && inquiry.admin_response && (
                                                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                                         <div className="flex items-center mb-2">
                                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                            <span className="font-medium text-blue-900">관리자 답변</span>
                                                            {inquiry.answered_at && <span className="text-xs text-blue-600 ml-2">({new Date(inquiry.answered_at).toLocaleDateString('ko-KR')})</span>}
                                                         </div>
                                                         <p className="text-blue-800">{inquiry.admin_response}</p>
                                                      </div>
                                                   )}
                                                </div>
                                                <div className="flex-shrink-0">
                                                   <Badge variant={inquiry.is_answered ? 'success' : 'warning'}>{inquiry.is_answered ? '답변완료' : '답변대기'}</Badge>
                                                </div>
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <div className="text-center py-12">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                             </svg>
                                          </div>
                                          <h3 className="text-lg font-medium text-gray-900 mb-2">문의 내역이 없습니다</h3>
                                          <p className="text-gray-500 mb-4">궁금한 사항이 있으시면 언제든 문의해주세요.</p>
                                          <Button onClick={() => router.push('/support/inquiry')}>1:1 문의하기</Button>
                                       </div>
                                    )}
                                 </div>
                              ) : activeTab === 'applications' ? (
                                 <div className="space-y-4">
                                    {examApplications.length > 0 ? (
                                       examApplications.map((application) => {
                                          // 데이터 구조 안전 접근
                                          const certificationName = application.exam_schedules?.certifications?.name || '리스트 불가'
                                          const examDate = application.exam_schedules?.exam_date || application.created_at
                                          const examLocation = application.exam_schedules?.exam_location || '미정'

                                          return (
                                             <div key={application.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                   <div className="flex-1">
                                                      <h3 className="font-bold text-gray-900 text-lg mb-1">{certificationName}</h3>
                                                      {application.exam_number ? (
                                                         <>
                                                            <div className="mb-3">
                                                               <p className="text-gray-600 text-sm">수험번호</p>
                                                               <div
                                                                  className="mt-1 inline-flex items-center bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold text-xl px-6 py-3 rounded-xl shadow-lg cursor-pointer hover:from-blue-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                                                                  onClick={(e) => {
                                                                     navigator.clipboard.writeText(application.exam_number || '')
                                                                     // 복사 완료 알림 (간단한 피드백)
                                                                     const target = e.currentTarget
                                                                     const originalText = target.innerText
                                                                     target.innerHTML = '복사됨!'
                                                                     setTimeout(() => {
                                                                        target.innerHTML = originalText
                                                                     }, 1000)
                                                                  }}
                                                               >
                                                                  {application.exam_number}
                                                                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                  </svg>
                                                               </div>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">신청번호: {application.application_number || application.id.slice(0, 8)}</p>
                                                         </>
                                                      ) : (
                                                         <p className="text-gray-600 text-sm mb-3">신청번호: {application.application_number || application.id.slice(0, 8)}</p>
                                                      )}

                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                         <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>장소: {examLocation}</span>
                                                         </div>
                                                         <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>시험일: {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미정'}</span>
                                                         </div>
                                                      </div>
                                                   </div>
                                                   <div className="flex-shrink-0">{getStatusBadge(application.application_status)}</div>
                                                </div>
                                             </div>
                                          )
                                       })
                                    ) : (
                                       <div className="text-center py-12">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                             </svg>
                                          </div>
                                          <h3 className="text-lg font-medium text-gray-900 mb-2">시험 신청 내역이 없습니다</h3>
                                          <p className="text-gray-500 mb-4">관심 있는 자격시험을 신청해보세요.</p>
                                          <Button onClick={() => router.push('/exam/apply')}>시험 신청하기</Button>
                                       </div>
                                    )}
                                 </div>
                              ) : (
                                 <div className="space-y-4">
                                    {examResults.length > 0 ? (
                                       examResults.map((result) => {
                                          // 데이터 구조 안전 접근
                                          const certificationName = result.exam_applications?.exam_schedules?.certifications?.name || '리스트 불가'
                                          const applicationNumber = result.exam_applications?.application_number || result.id?.slice(0, 8) || 'N/A'
                                          const examDate = result.exam_applications?.exam_schedules?.exam_date
                                          const resultStatus = result.result_status || result.pass_status

                                          return (
                                             <div key={result.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                   <div className="flex-1">
                                                      <h3 className="font-bold text-gray-900 text-lg mb-1">{certificationName}</h3>
                                                      <p className="text-gray-600 text-sm mb-3">신청번호: {applicationNumber}</p>

                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                         <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>시험일: {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미정'}</span>
                                                         </div>
                                                         <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                               />
                                                            </svg>
                                                            <span>총점: {result.total_score || 0}점</span>
                                                         </div>
                                                         <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                               />
                                                            </svg>
                                                            <span>결과발표일: {result.announced_at ? new Date(result.announced_at).toLocaleDateString('ko-KR') : '대기중'}</span>
                                                         </div>
                                                      </div>
                                                   </div>
                                                   <div className="flex-shrink-0">
                                                      <Badge variant={resultStatus === 'pass' || resultStatus === 'passed' ? 'success' : 'error'} size="md">
                                                         {resultStatus === 'pass' || resultStatus === 'passed' ? '합격' : '불합격'}
                                                      </Badge>
                                                   </div>
                                                </div>
                                             </div>
                                          )
                                       })
                                    ) : (
                                       <div className="text-center py-12">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                             </svg>
                                          </div>
                                          <h3 className="text-lg font-medium text-gray-900 mb-2">시험 결과가 없습니다</h3>
                                          <p className="text-gray-500 mb-4">시험 결과가 발표되면 여기에 표시됩니다.</p>
                                          <Button onClick={() => router.push('/exam/results/search')}>합격자 조회하기</Button>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        </Card>
                     </div>
                  </div>
               </div>
            </div>
         </main>
         <Footer />
      </div>
   )
}
