'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import { useAdmin } from '@/hooks/useAdmin'

interface DashboardStats {
   totalMembers: number
   newMembersToday: number
   totalExamApplications: number
   pendingApplications: number
   totalNotices: number
   pendingQnaQuestions: number
   totalCertifications: number
   activeCertifications: number
}

interface RecentActivity {
   id: string
   type: 'exam' | 'member' | 'notice' | 'qna' | 'certification'
   title: string
   time: string
   status?: string
}

export default function AdminDashboardPage() {
   const { isAdmin, isChecking } = useAdmin()
   const [stats, setStats] = useState<DashboardStats>({
      totalMembers: 0,
      newMembersToday: 0,
      totalExamApplications: 0,
      pendingApplications: 0,
      totalNotices: 0,
      pendingQnaQuestions: 0,
      totalCertifications: 0,
      activeCertifications: 0,
   })
   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      if (!isAdmin || isChecking) return

      const fetchDashboardData = async () => {
         setIsLoading(true)

         try {
            // 인증 헤더 준비
            const token = localStorage.getItem('admin-token')
            const headers: Record<string, string> = {
               'Content-Type': 'application/json',
            }
            if (token) {
               headers['Authorization'] = `Bearer ${token}`
            }

            // 통계 데이터 로드
            const [membersRes, examsRes, noticesRes, qnaRes, certificationsRes] = await Promise.all([
               fetch('/api/admin/stats/members', { headers }),
               fetch('/api/admin/stats/exams', { headers }),
               fetch('/api/admin/stats/notices', { headers }),
               fetch('/api/admin/stats/qna', { headers }),
               fetch('/api/admin/stats/certifications', { headers }),
            ])

            const [membersData, examsData, noticesData, qnaData, certificationsData] = await Promise.all([
               membersRes.ok ? membersRes.json() : { total: 0, today: 0 },
               examsRes.ok ? examsRes.json() : { total: 0, pending: 0 },
               noticesRes.ok ? noticesRes.json() : { total: 0 },
               qnaRes.ok ? qnaRes.json() : { pending: 0 },
               certificationsRes.ok ? certificationsRes.json() : { total: 0, active: 0 },
            ])

            setStats({
               totalMembers: membersData.total || 0,
               newMembersToday: membersData.today || 0,
               totalExamApplications: examsData.total || 0,
               pendingApplications: examsData.pending || 0,
               totalNotices: noticesData.total || 0,
               pendingQnaQuestions: qnaData.pending || 0,
               totalCertifications: certificationsData.total || 0,
               activeCertifications: certificationsData.active || 0,
            })

            // 최근 활동 로드
            const activitiesRes = await fetch('/api/admin/activities', { headers })
            if (activitiesRes.ok) {
               const activitiesData = await activitiesRes.json()
               setRecentActivities(activitiesData.activities || [])
            }
         } catch (error) {
            console.error('대시보드 데이터 로딩 실패:', error)
         } finally {
            setIsLoading(false)
         }
      }

      fetchDashboardData()
   }, [isAdmin, isChecking])

   const handleLogout = () => {
      // localStorage에서 관리자 토큰 제거
      localStorage.removeItem('admin-token')
      // 페이지 새로고침하여 인증 상태 업데이트
      window.location.href = '/admin/login'
   }

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
         case 'certification':
            return (
               <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
            )
         default:
            return null
      }
   }

   const formatTimeAgo = (dateString: string): string => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return '방금 전'
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
      return `${Math.floor(diffInMinutes / 1440)}일 전`
   }

   if (isChecking) {
      return (
         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null // useAdmin 훅에서 리다이렉트 처리
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
      <AdminLayout>
         {/* 페이지 제목 */}
         <div className="mb-8 flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
               <p className="text-gray-600 mt-2">KHAMA 관리 시스템 현황을 확인하세요</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
               로그아웃
            </Button>
         </div>

         {/* 통계 카드 */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                     <p className="text-sm font-medium text-gray-600">전체 회원</p>
                     <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                     <p className="text-xs text-gray-500 mt-1">오늘 신규: {stats.newMembersToday}명</p>
                  </div>
               </div>
            </Card>

            <Card>
               <div className="flex items-center">
                  <div className="flex-shrink-0">
                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                     </div>
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">시험 신청</p>
                     <p className="text-2xl font-bold text-gray-900">{stats.totalExamApplications}</p>
                     <p className="text-xs text-gray-500 mt-1">대기중: {stats.pendingApplications}건</p>
                  </div>
               </div>
            </Card>

            <Card>
               <div className="flex items-center">
                  <div className="flex-shrink-0">
                     <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                     </div>
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">공지사항</p>
                     <p className="text-2xl font-bold text-gray-900">{stats.totalNotices}</p>
                     <p className="text-xs text-gray-500 mt-1">전체 게시물 수</p>
                  </div>
               </div>
            </Card>

            <Card>
               <div className="flex items-center">
                  <div className="flex-shrink-0">
                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">Q&A</p>
                     <p className="text-2xl font-bold text-gray-900">{stats.pendingQnaQuestions}</p>
                     <p className="text-xs text-gray-500 mt-1">답변 대기 중</p>
                  </div>
               </div>
            </Card>

            <Card>
               <div className="flex items-center">
                  <div className="flex-shrink-0">
                     <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                     </div>
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">자격증</p>
                     <p className="text-2xl font-bold text-gray-900">{stats.totalCertifications}</p>
                     <p className="text-xs text-gray-500 mt-1">활성: {stats.activeCertifications}개</p>
                  </div>
               </div>
            </Card>
         </div>

         {/* 최근 활동 */}
         <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
            {recentActivities.length > 0 ? (
               <div className="space-y-4">
                  {recentActivities.map((activity) => (
                     <div key={activity.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                        <div className="ml-4 flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                              <span className="text-xs text-gray-500 ml-2">{formatTimeAgo(activity.time)}</span>
                           </div>
                           <div className="flex items-center mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">{activity.type}</span>
                              {activity.status && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{activity.status}</span>}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-8">
                  <p className="text-gray-500">최근 활동이 없습니다.</p>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
