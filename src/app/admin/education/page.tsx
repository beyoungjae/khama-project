'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'

interface EducationCourse {
   id: string
   title: string
   category: string
   duration_hours: number
   course_fee: number
   max_participants: number
   current_students: number
   status: string
   created_at: string
}

export default function AdminEducationPage() {
   const router = useRouter()
   const [courses, setCourses] = useState<EducationCourse[]>([])
   const [loading, setLoading] = useState(true)
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const [searchTerm, setSearchTerm] = useState('')

   // 카테고리 목록
   const categories = [
      { value: 'all', label: '전체' },
      { value: 'basic', label: '기초과정' },
      { value: 'advanced', label: '심화과정' },
      { value: 'special', label: '전문과정' },
   ]

   const [selectedCategory, setSelectedCategory] = useState('all')

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

   // 교육 과정 목록 조회
   const fetchCourses = async () => {
      try {
         setLoading(true)
         
         const response = await fetch(`/api/education/courses?page=${currentPage}&limit=10&category=${selectedCategory}&search=${searchTerm}`)

         if (!response.ok) {
            throw new Error('교육 과정 목록을 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setCourses(data.courses || [])
         setTotalPages(data.pagination?.totalPages || 1)
      } catch (error) {
         console.error('교육 과정 목록 조회 오류:', error)
         setCourses([])
      } finally {
         setLoading(false)
      }
   }

   // 페이지 변경 시 데이터 다시 로드
   useEffect(() => {
      fetchCourses()
   }, [currentPage, selectedCategory, searchTerm])

   // 검색 처리
   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      setCurrentPage(1)
   }

   return (
      <AdminLayout>
         <div className="py-6">
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl font-bold text-gray-900">교육 프로그램 관리</h1>
               <Button onClick={() => router.push('/admin/education/courses/new')}>새 교육 과정 등록</Button>
            </div>

            <Card className="p-6">
               {/* 검색 및 필터 */}
               <div className="mb-6">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                     <select
                        value={selectedCategory}
                        onChange={(e) => {
                           setSelectedCategory(e.target.value)
                           setCurrentPage(1)
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                        {categories.map((category) => (
                           <option key={category.value} value={category.value}>
                              {category.label}
                           </option>
                        ))}
                     </select>

                     <input type="text" placeholder="과정명으로 검색" className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                     <Button type="submit">검색</Button>
                  </form>
               </div>

               {/* 교육 과정 목록 */}
               {loading ? (
                  <div className="text-center py-8">
                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                     <p className="mt-2 text-gray-600">교육 과정 목록을 불러오는 중입니다...</p>
                  </div>
               ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-gray-500">등록된 교육 과정이 없습니다.</p>
                     <Button className="mt-4" onClick={() => router.push('/admin/education/courses/new')}>
                        새 교육 과정 등록
                     </Button>
                  </div>
               ) : (
                  <>
                     <div className="space-y-4">
                        {courses.map((course) => (
                           <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                 <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">{course.title}</h3>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                       <span>{course.category}</span>
                                       <span className="mx-2">•</span>
                                       <span>{course.duration_hours}시간</span>
                                       <span className="mx-2">•</span>
                                       <span>{course.course_fee ? `${course.course_fee.toLocaleString()}원` : '무료'}</span>
                                       <span className="mx-2">•</span>
                                       <span>
                                          정원: {course.current_students}/{course.max_participants}명
                                       </span>
                                    </div>
                                 </div>
                                 <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                                    {getStatusBadge(course.status)}
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/education/courses/${course.id}/edit`)}>
                                       수정
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* 페이지네이션 */}
                     {totalPages > 1 && (
                        <div className="mt-8">
                           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                     )}
                  </>
               )}
            </Card>

            {/* 하위 메뉴 */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="p-6 text-center hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">교육 과정 관리</h3>
                  <p className="text-gray-600 text-sm mb-4">교육 과정 등록 및 수정</p>
                  <Button variant="outline" onClick={() => router.push('/admin/education/courses')} className="w-full">
                     관리하기
                  </Button>
               </Card>

               <Card className="p-6 text-center hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">교육 일정 관리</h3>
                  <p className="text-gray-600 text-sm mb-4">교육 일정 등록 및 수정</p>
                  <Button variant="outline" onClick={() => router.push('/admin/education/schedules')} className="w-full">
                     관리하기
                  </Button>
               </Card>

               <Card className="p-6 text-center hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">수강 신청 관리</h3>
                  <p className="text-gray-600 text-sm mb-4">수강 신청 내역 확인 및 관리</p>
                  <Button variant="outline" onClick={() => router.push('/admin/education/enrollments')} className="w-full">
                     관리하기
                  </Button>
               </Card>
            </div>
         </div>
      </AdminLayout>
   )
}
