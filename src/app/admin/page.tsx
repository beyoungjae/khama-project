'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface DashboardStats {
   totalMembers: number
   newMembersToday: number
   totalExamApplications: number
   pendingApplications: number
   totalCertificates: number
   recentNotices: number
}

interface RecentActivity {
   id: number
   type: 'exam' | 'member' | 'notice' | 'qna'
   title: string
   time: string
   status?: string
}

export default function AdminDashboardPage() {
   const [stats, setStats] = useState<DashboardStats>({
      totalMembers: 0,
      newMembersToday: 0,
      totalExamApplications: 0,
      pendingApplications: 0,
      totalCertificates: 0,
      recentNotices: 0,
   })
   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const fetchDashboardData = async () => {
         setIsLoading(true)

         try {
            // TODO: 실제 API 호출
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // 임시 데이터
            setStats({
               totalMembers: 1247,
               newMembersToday: 8,
               totalExamApplications: 342,
               pendingApplications: 23,
               totalCertificates: 891,
               recentNotices: 5,
            })

            setRecentActivities([
               { id: 1, type: 'exam', title: '가전제품분해청소관리사 시험 신청', time: '10분 전' },
               { id: 2, type: 'member', title: '새 회원 가입: 김**님', time: '25분 전' },
               { id: 3, type: 'qna', title: 'Q&A 새 질문: 시험 일정 문의', time: '1시간 전', status: '답변대기' },
               { id: 4, type: 'notice', title: '공지사항 게시: 2025년 1분기 시험 일정', time: '2시간 전' },
               { id: 5, type: 'exam', title: '냉난방기세척서비스관리사 합격 처리', time: '3시간 전' },
            ])
         } catch (error) {
            console.error('대시보드 데이터 로딩 실패:', error)
         } finally {
            setIsLoading(false)
         }
      }

      fetchDashboardData()
   }, [])

   const getActivityIcon = (type: string) => {
      switch (type) {
         case 'exam':
            return (
               <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            )
         case 'member':
            return (
               <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            )
         case 'notice':
            return (
               <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
               </svg>
            )
         case 'qna':
            return (
               <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            )
         default:
            return null
      }
   }

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-100">
            <div className="animate-pulse p-8">
               <div className="h-8 bg-gray-200 rounded mb-8"></div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[...Array(6)].map((_, i) => (
                     <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gray-100">
         {/* 헤더 */}
         <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-4">
                     <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                           <span className="text-white font-bold text-sm">K</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">KHAMA 관리자</span>
                     </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                     <span className="text-sm text-gray-600">관리자님, 안녕하세요!</span>
                     <Button variant="outline" size="sm">
                        로그아웃
                     </Button>
                  </div>
               </div>
            </div>
         </header>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 페이지 제목 */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
               <p className="text-gray-600 mt-2">KHAMA 관리 시스템 현황을 확인하세요</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               <Card>
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                           </svg>
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">총 회원수</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalMembers.toLocaleString()}</p>
                        <p className="text-sm text-green-600">오늘 +{stats.newMembersToday}명</p>
                     </div>
                  </div>
               </Card>

               <Card>
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                           <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                           </svg>
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">시험 신청</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalExamApplications}</p>
                        <p className="text-sm text-orange-600">대기 {stats.pendingApplications}건</p>
                     </div>
                  </div>
               </Card>

               <Card>
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                           <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                           </svg>
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">발급 자격증</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</p>
                        <p className="text-sm text-gray-500">누적 발급</p>
                     </div>
                  </div>
               </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* 최근 활동 */}
               <Card>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
                     <Button variant="outline" size="sm">
                        전체보기
                     </Button>
                  </div>
                  <div className="space-y-4">
                     {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                           {getActivityIcon(activity.type)}
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                              <p className="text-sm text-gray-500">{activity.time}</p>
                           </div>
                           {activity.status && (
                              <Badge variant="warning" size="sm">
                                 {activity.status}
                              </Badge>
                           )}
                        </div>
                     ))}
                  </div>
               </Card>

               {/* 빠른 작업 */}
               <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">빠른 작업</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <Button className="h-20 flex-col">
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        공지사항 작성
                     </Button>
                     <Button className="h-20 flex-col" variant="outline">
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        시험 관리
                     </Button>
                     <Button className="h-20 flex-col" variant="outline">
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        회원 관리
                     </Button>
                     <Button className="h-20 flex-col" variant="outline">
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Q&A 답변
                     </Button>
                  </div>
               </Card>
            </div>

            {/* 시스템 상태 */}
            <div className="mt-8">
               <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">시스템 상태</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                           <p className="text-sm font-medium text-green-800">웹사이트</p>
                           <p className="text-xs text-green-600">정상 운영</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                           <p className="text-sm font-medium text-green-800">데이터베이스</p>
                           <p className="text-xs text-green-600">정상 연결</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                           <p className="text-sm font-medium text-green-800">이메일 서비스</p>
                           <p className="text-xs text-green-600">정상 작동</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                     </div>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   )
}
