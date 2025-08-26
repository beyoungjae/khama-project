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

export default function MyPage() {
   const router = useRouter()
   const { user, profile, isLoading } = useAuth()
   const [examApplications, setExamApplications] = useState<ExamApplication[]>([])
   const [examResults, setExamResults] = useState<ExamResult[]>([])
   const [activeTab, setActiveTab] = useState<'applications' | 'results'>('applications')
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

         console.log('시험 데이터 로딩 시작 - 사용자 ID:', user.id)

         // 실제 시험 신청 데이터 로드
         try {
            const applicationsRes = await fetch(`/api/exams/applications?userId=${user.id}`)
            const applicationsData = await applicationsRes.json()
            
            if (applicationsRes.ok) {
               setExamApplications(applicationsData.applications || [])
               console.log('시험 신청 데이터 로드 성공:', applicationsData.applications?.length || 0, '개')
            } else {
               console.error('시험 신청 데이터 로드 실패:', applicationsData.error)
               // 실패 시 빈 배열로 설정
               setExamApplications([])
            }
         } catch (error) {
            console.error('시험 신청 API 호출 오류:', error)
            setExamApplications([])
         }

         // 실제 시험 결과 데이터 로드
         try {
            const resultsRes = await fetch(`/api/exams/results?userId=${user.id}`)
            const resultsData = await resultsRes.json()
            
            if (resultsRes.ok) {
               setExamResults(resultsData.results || [])
               console.log('시험 결과 데이터 로드 성공:', resultsData.results?.length || 0, '개')
            } else {
               console.error('시험 결과 데이터 로드 실패:', resultsData.error)
               // 실패 시 빈 배열로 설정
               setExamResults([])
            }
         } catch (error) {
            console.error('시험 결과 API 호출 오류:', error)
            setExamResults([])
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
                                 <button onClick={() => setActiveTab('results')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'results' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    시험 결과
                                 </button>
                              </nav>
                           </div>

                           <div className="mt-6">
                              {loading ? (
                                 <div className="flex justify-center py-8">
                                    <LoadingSpinner />
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
                                                      <p className="text-sm text-gray-500">신청번호: {application.application_number || application.id.slice(0, 8)}</p>
                                                   </div>
                                                   {getStatusBadge(application.application_status)}
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600">
                                                   <p>시험일: {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미정'}</p>
                                                   <p>장소: {examLocation}</p>
                                                   <p>신청일: {new Date(application.created_at).toLocaleDateString('ko-KR')}</p>
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
                                                   <Badge variant={resultStatus === 'pass' || resultStatus === 'passed' ? 'success' : 'error'}>
                                                      {resultStatus === 'pass' || resultStatus === 'passed' ? '합격' : '불합격'}
                                                   </Badge>
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
