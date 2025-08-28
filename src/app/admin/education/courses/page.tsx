'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface EducationCourse {
   id: string
   name: string
   description: string
   category: string
   duration_hours: number
   max_participants: number
   course_fee: number | null
   instructor_name: string | null
   status: string | null
   created_at: string
}

export default function AdminEducationCoursesPage() {
   const { isAdmin, isChecking } = useAdmin()
   const [courses, setCourses] = useState<EducationCourse[]>([])
   const [loading, setLoading] = useState(true)

   const getStatusBadge = (status: string | null) => {
      switch (status) {
         case 'active':
            return <Badge variant="success">활성</Badge>
         case 'inactive':
            return <Badge variant="error">비활성</Badge>
         default:
            return <Badge variant="default">미정</Badge>
      }
   }

   // 교육 과정 목록 로드
   const loadCourses = async () => {
      if (!isAdmin) return

      try {
         setLoading(true)

         const response = await fetch('/api/education/courses')

         const data = await response.json()

         if (response.ok) {
            setCourses(data.courses || [])
         } else {
            console.error('교육 과정 로드 실패:', data.error)
            alert('교육 과정을 불러오는데 실패했습니다.')
         }
      } catch (error) {
         console.error('교육 과정 로드 오류:', error)
         alert('서버 오류가 발생했습니다.')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadCourses()
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
                  <h1 className="text-2xl font-bold text-gray-900">교육 과정 관리</h1>
                  <p className="text-gray-600">교육 과정을 등록하고 관리할 수 있습니다.</p>
               </div>
               <div className="flex space-x-3">
                  <Link href="/admin/education/courses/new">
                     <Button>새 과정 등록</Button>
                  </Link>
                  <Link href="/admin/education">
                     <Button variant="outline">목록으로</Button>
                  </Link>
               </div>
            </div>

            {loading ? (
               <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="mt-2 text-gray-600">교육 과정을 불러오는 중입니다...</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {courses.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-500">등록된 교육 과정이 없습니다.</p>
                        <Link href="/admin/education/courses/new">
                           <Button className="mt-4">새 과정 등록</Button>
                        </Link>
                     </div>
                  ) : (
                     courses.map((course) => (
                        <Card key={course.id} className="p-6">
                           <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                       {course.name}
                                    </h3>
                                    {getStatusBadge(course.status)}
                                 </div>
                                 <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                    {course.description}
                                 </p>
                                 <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <span>카테고리: {course.category}</span>
                                    <span>시간: {course.duration_hours}시간</span>
                                    <span>정원: {course.max_participants}명</span>
                                    <span>강사: {course.instructor_name || '미정'}</span>
                                    <span>수강료: {course.course_fee ? `${course.course_fee.toLocaleString()}원` : '무료'}</span>
                                 </div>
                              </div>
                              <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                                 <Link href={`/admin/education/courses/${course.id}`}>
                                    <Button variant="outline" size="sm">상세</Button>
                                 </Link>
                                 <Link href={`/admin/education/courses/${course.id}/edit`}>
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
