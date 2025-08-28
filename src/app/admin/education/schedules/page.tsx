'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

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
   education_courses: {
      name: string
      category: string
   }
}

export default function AdminEducationSchedulesPage() {
   const { isAdmin, isChecking } = useAdmin()
   const [schedules, setSchedules] = useState<EducationSchedule[]>([])
   const [loading, setLoading] = useState(true)

   const getStatusBadge = (status: string | null) => {
      switch (status) {
         case 'registration_open':
            return <Badge variant="success">모집중</Badge>
         case 'registration_closed':
            return <Badge variant="error">마감</Badge>
         case 'scheduled':
            return <Badge variant="warning">예정</Badge>
         case 'in_progress':
            return <Badge variant="info">진행중</Badge>
         case 'completed':
            return <Badge variant="default">완료</Badge>
         case 'cancelled':
            return <Badge variant="error">취소</Badge>
         default:
            return <Badge variant="default">미정</Badge>
      }
   }

   // 교육 일정 목록 로드
   const loadSchedules = async () => {
      if (!isAdmin) return

      try {
         setLoading(true)

         const response = await fetch('/api/education/schedules')

         const data = await response.json()

         if (response.ok) {
            setSchedules(data.schedules || [])
         } else {
            console.error('교육 일정 로드 실패:', data.error)
            alert('교육 일정을 불러오는데 실패했습니다.')
         }
      } catch (error) {
         console.error('교육 일정 로드 오류:', error)
         alert('서버 오류가 발생했습니다.')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadSchedules()
      }
   }, [isAdmin, isChecking])

   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">교육 일정 관리</h1>
                  <p className="text-gray-600">교육 일정을 관리할 수 있습니다.</p>
               </div>
               <div className="flex space-x-3">
                  <Link href="/admin/education/schedules/new">
                     <Button>새 일정 등록</Button>
                  </Link>
                  <Link href="/admin/education">
                     <Button variant="outline">목록으로</Button>
                  </Link>
               </div>
            </div>

            {loading ? (
               <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="mt-2 text-gray-600">교육 일정을 불러오는 중입니다...</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {schedules.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-500">등록된 교육 일정이 없습니다.</p>
                        <Link href="/admin/education/schedules/new">
                           <Button className="mt-4">새 일정 등록</Button>
                        </Link>
                     </div>
                  ) : (
                     schedules.map((schedule) => (
                        <Card key={schedule.id} className="p-6">
                           <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                       {schedule.education_courses.name}
                                    </h3>
                                    {getStatusBadge(schedule.status)}
                                    <Badge variant="secondary">{schedule.education_courses.category}</Badge>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                       <p><strong>교육 기간:</strong> {new Date(schedule.start_date).toLocaleDateString('ko-KR')} ~ {new Date(schedule.end_date).toLocaleDateString('ko-KR')}</p>
                                       <p><strong>접수 기간:</strong> {new Date(schedule.registration_start_date).toLocaleDateString('ko-KR')} ~ {new Date(schedule.registration_end_date).toLocaleDateString('ko-KR')}</p>
                                    </div>
                                    <div>
                                       <p><strong>장소:</strong> {schedule.location} {schedule.classroom && `(${schedule.classroom})`}</p>
                                       <p><strong>신청 현황:</strong> {schedule.current_participants || 0}/{schedule.max_participants}명</p>
                                    </div>
                                 </div>
                                 {schedule.special_notes && (
                                    <p className="text-sm text-gray-500 mt-2">
                                       <strong>특이사항:</strong> {schedule.special_notes}
                                    </p>
                                 )}
                              </div>
                              <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                                 <Link href={`/admin/education/schedules/${schedule.id}`}>
                                    <Button variant="outline" size="sm">상세</Button>
                                 </Link>
                                 <Link href={`/admin/education/schedules/${schedule.id}/edit`}>
                                    <Button variant="outline" size="sm">수정</Button>
                                 </Link>
                              </div>
                           </div>
                        </Card>
                     ))
                  )}
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
