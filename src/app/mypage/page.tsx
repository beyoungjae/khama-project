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

   const handleLogout = async () => {
      try {
         await fetch('/api/auth/logout', { method: 'POST' })
         router.push('/')
         router.refresh()
      } catch (error) {
         console.error('로그아웃 오류:', error)
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
         <main className="flex-grow bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                     <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
                     <Button onClick={handleLogout} variant="outline">
                        로그아웃
                     </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-1">
                        <Card>
                           <div className="text-center">
                              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                 <span className="text-2xl font-bold text-gray-600">{profile.name?.charAt(0) || 'U'}</span>
                              </div>
                              <h2 className="text-xl font-semibold text-gray-900">{profile.name || '이름 없음'}</h2>
                              <p className="text-gray-600">{user.email}</p>
                              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                 <Badge variant="secondary">{profile.role === 'admin' ? '관리자' : '일반회원'}</Badge>
                                 <Badge variant={profile.status === 'active' ? 'success' : 'warning'}>{profile.status === 'active' ? '활성' : '비활성'}</Badge>
                              </div>
                           </div>
                        </Card>
                     </div>

                     <div className="md:col-span-2">
                        <Card>
                           <div className="border-b border-gray-200">
                              <nav className="-mb-px flex space-x-8">
                                 <button onClick={() => setActiveTab('applications')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    시험 신청 내역
                                 </button>
                                 <button onClick={() => setActiveTab('education')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'education' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    교육 신청 내역
                                 </button>
                                 <button onClick={() => setActiveTab('certificates')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'certificates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    보유 자격증
                                 </button>
                                 <button onClick={() => setActiveTab('inquiries')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inquiries' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    1:1 문의 내역
                                 </button>
                              </nav>
                           </div>

                           <div className="mt-6">
                              {loading ? (
                                 <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                 </div>
                              ) : activeTab === 'education' ? (
                                 <div className="space-y-4">
                                    {eduEnrollments.length > 0 ? (
                                       eduEnrollments.map((enr) => (
                                          <div key={enr.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                             <div className="flex justify-between items-start">
                                                <div>
                                                   <h3 className="font-medium text-gray-900">{enr.education_schedules?.education_courses?.name || '교육 과정'}</h3>
                                                   <p className="text-sm text-gray-500">신청번호: {enr.enrollment_number}</p>
                                                </div>
                                                {getEduStatusBadge(enr.enrollment_status)}
                                             </div>
                                             <div className="mt-2 text-sm text-gray-600">
                                                <p>교육 기간: {enr.education_schedules?.start_date ? new Date(enr.education_schedules.start_date).toLocaleDateString('ko-KR') : ''} ~ {enr.education_schedules?.end_date ? new Date(enr.education_schedules.end_date).toLocaleDateString('ko-KR') : ''}</p>
                                                <p>장소: {enr.education_schedules?.location || '-'}</p>
                                                <p>신청일: {enr.created_at ? new Date(enr.created_at).toLocaleDateString('ko-KR') : ''}</p>
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <p className="text-gray-500 text-center py-4">교육 신청 내역이 없습니다.</p>
                                    )}
                                 </div>
                              ) : activeTab === 'certificates' ? (
                                 <div className="space-y-4">
                                    <div className="text-center py-8">
                                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                             />
                                          </svg>
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 mb-2">보유 자격증</h3>
                                       <p className="text-gray-500 mb-4">합격한 자격증의 PDF 파일을 다운로드 받으실 수 있습니다.</p>
                                       <Button onClick={() => router.push('/mypage/certificates')}>자격증 관리 페이지로 이동</Button>
                                    </div>
                                 </div>
                              ) : activeTab === 'inquiries' ? (
                                 <div className="space-y-4">
                                    {inquiries.length > 0 ? (
                                       inquiries.map((inquiry) => (
                                          <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                             <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                   <h3 className="font-medium text-gray-900">{inquiry.subject}</h3>
                                                   <p className="text-sm text-gray-500 mt-1">
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
                                                   </p>
                                                   <p className="text-sm text-gray-400 mt-1">문의일: {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}</p>
                                                </div>
                                                <div className="ml-4">
                                                   <Badge variant={inquiry.is_answered ? 'success' : 'warning'}>{inquiry.is_answered ? '답변완료' : '답변대기'}</Badge>
                                                </div>
                                             </div>

                                             <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-600 line-clamp-2">{inquiry.content}</p>

                                                {inquiry.is_answered && inquiry.admin_response && (
                                                   <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                                                      <div className="flex items-center mb-2">
                                                         <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                         </svg>
                                                         <span className="text-sm font-medium text-blue-900">관리자 답변</span>
                                                         {inquiry.answered_at && <span className="text-xs text-blue-600 ml-2">({new Date(inquiry.answered_at).toLocaleDateString('ko-KR')})</span>}
                                                      </div>
                                                      <p className="text-sm text-blue-800">{inquiry.admin_response}</p>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <div className="text-center py-8">
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
                                             <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                   <div>
                                                      <h3 className="font-medium text-gray-900">{certificationName}</h3>
                                                      {application.exam_number ? (
                                                         <>
                                                            <p className="text-sm text-gray-700">
                                                               수험번호: <span className="font-medium">{application.exam_number}</span>
                                                            </p>
                                                            <p className="text-xs text-gray-500">신청번호: {application.application_number || application.id.slice(0, 8)}</p>
                                                         </>
                                                      ) : (
                                                         <p className="text-sm text-gray-500">신청번호: {application.application_number || application.id.slice(0, 8)}</p>
                                                      )}
                                                   </div>
                                                   {getStatusBadge(application.application_status)}
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600">
                                                   <p>장소: {examLocation}</p>
                                                   <br />
                                                   <p>시험일: {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미정'}</p>
                                                </div>
                                             </div>
                                          )
                                       })
                                    ) : (
                                       <p className="text-gray-500 text-center py-4">신청 내역이 없습니다.</p>
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
                                             <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                   <div>
                                                      <h3 className="font-medium text-gray-900">{certificationName}</h3>
                                                      <p className="text-sm text-gray-500">신청번호: {applicationNumber}</p>
                                                   </div>
                                                   <Badge variant={resultStatus === 'pass' || resultStatus === 'passed' ? 'success' : 'error'}>{resultStatus === 'pass' || resultStatus === 'passed' ? '합격' : '불합격'}</Badge>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600">
                                                   <p>시험일: {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미정'}</p>
                                                   <p>총점: {result.total_score || 0}점</p>
                                                   <p>결과발표일: {result.announced_at ? new Date(result.announced_at).toLocaleDateString('ko-KR') : '대기중'}</p>
                                                </div>
                                             </div>
                                          )
                                       })
                                    ) : (
                                       <p className="text-gray-500 text-center py-4">시험 결과가 없습니다.</p>
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
