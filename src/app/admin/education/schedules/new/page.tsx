'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface EducationCourse {
   id: string
   name: string
   course_code: string
   category: string
   duration_hours: number
   max_participants: number
   course_fee: number
}

export default function NewEducationSchedulePage() {
   const router = useRouter()
   const [courses, setCourses] = useState<EducationCourse[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [formData, setFormData] = useState({
      course_id: '',
      location: '',
      address: '',
      classroom: '',
      start_date: '',
      end_date: '',
      registration_start_date: '',
      registration_end_date: '',
      max_participants: 0,
      special_notes: '',
   })

   useEffect(() => {
      loadCourses()
   }, [])

   const loadCourses = async () => {
      try {
         const response = await fetch('/api/admin/education/courses', { credentials: 'include' })
         if (response.ok) {
            const data = await response.json()
            setCourses(data.courses || [])
         }
      } catch (error) {
         console.error('교육 과정 로딩 오류:', error)
      } finally {
         setIsLoading(false)
      }
   }

   const handleCourseSelect = (courseId: string) => {
      const selectedCourse = courses.find(course => course.id === courseId)
      if (selectedCourse) {
         setFormData(prev => ({
            ...prev,
            course_id: courseId,
            max_participants: selectedCourse.max_participants || 0
         }))
      }
   }

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      
      if (name === 'course_id') {
         handleCourseSelect(value)
      } else if (name === 'max_participants') {
         setFormData(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
         }))
      } else {
         setFormData(prev => ({
            ...prev,
            [name]: value
         }))
      }
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!formData.course_id || !formData.location || !formData.start_date || !formData.end_date) {
         alert('필수 항목을 모두 입력해주세요.')
         return
      }

      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
         alert('종료일은 시작일보다 이후여야 합니다.')
         return
      }

      if (new Date(formData.registration_start_date) >= new Date(formData.registration_end_date)) {
         alert('등록 종료일은 등록 시작일보다 이후여야 합니다.')
         return
      }

      setIsSubmitting(true)
      try {
         const response = await fetch('/api/admin/education/schedules', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
         })

         if (response.ok) {
            alert('교육 일정이 성공적으로 등록되었습니다.')
            router.push('/admin/education/schedules')
         } else {
            const errorData = await response.json()
            throw new Error(errorData.error || '교육 일정 등록에 실패했습니다.')
         }
      } catch (error) {
         console.error('교육 일정 등록 오류:', error)
         alert('교육 일정 등록에 실패했습니다. 다시 시도해주세요.')
      } finally {
         setIsSubmitting(false)
      }
   }

   if (isLoading) {
      return (
         <AdminLayout>
            <div className="py-6">
               <div className="text-center">
                  <LoadingSpinner size="large" />
                  <p className="mt-2 text-gray-600">교육 과정 정보를 불러오는 중...</p>
               </div>
            </div>
         </AdminLayout>
      )
   }

   return (
      <AdminLayout>
         <div className="py-6">
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl font-bold text-gray-900">교육 일정 등록</h1>
               <Button variant="outline" onClick={() => router.push('/admin/education/schedules')}>
                  목록으로
               </Button>
            </div>

            <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                     <Card className="mb-6">
                        <div className="p-6">
                           <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
                           
                           <div className="space-y-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    교육 과정 *
                                 </label>
                                 <select 
                                    name="course_id" 
                                    value={formData.course_id} 
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 >
                                    <option value="">교육 과정을 선택해주세요</option>
                                    {courses.map(course => (
                                       <option key={course.id} value={course.id}>
                                          [{course.course_code}] {course.name}
                                       </option>
                                    ))}
                                 </select>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       교육 장소 *
                                    </label>
                                    <input
                                       type="text"
                                       name="location"
                                       value={formData.location}
                                       onChange={handleChange}
                                       required
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                       placeholder="예: 한국관리협회 교육센터"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       강의실
                                    </label>
                                    <input
                                       type="text"
                                       name="classroom"
                                       value={formData.classroom}
                                       onChange={handleChange}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                       placeholder="예: 제1강의실"
                                    />
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    상세 주소
                                 </label>
                                 <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="교육 장소의 상세 주소를 입력해주세요"
                                 />
                              </div>
                           </div>
                        </div>
                     </Card>

                     <Card>
                        <div className="p-6">
                           <h2 className="text-lg font-semibold text-gray-900 mb-4">일정 및 등록 정보</h2>
                           
                           <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       교육 시작일 *
                                    </label>
                                    <input
                                       type="date"
                                       name="start_date"
                                       value={formData.start_date}
                                       onChange={handleChange}
                                       required
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       교육 종료일 *
                                    </label>
                                    <input
                                       type="date"
                                       name="end_date"
                                       value={formData.end_date}
                                       onChange={handleChange}
                                       required
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       등록 시작일 *
                                    </label>
                                    <input
                                       type="date"
                                       name="registration_start_date"
                                       value={formData.registration_start_date}
                                       onChange={handleChange}
                                       required
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       등록 종료일 *
                                    </label>
                                    <input
                                       type="date"
                                       name="registration_end_date"
                                       value={formData.registration_end_date}
                                       onChange={handleChange}
                                       required
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    최대 참가자 수
                                 </label>
                                 <input
                                    type="number"
                                    name="max_participants"
                                    value={formData.max_participants}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="예: 30"
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    특별 안내사항
                                 </label>
                                 <textarea
                                    name="special_notes"
                                    value={formData.special_notes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="교육 관련 특별 안내사항이나 준비물 등을 입력해주세요"
                                 />
                              </div>
                           </div>
                        </div>
                     </Card>
                  </div>

                  <div>
                     <Card className="sticky top-6">
                        <div className="p-6">
                           <h2 className="text-lg font-semibold text-gray-900 mb-4">선택된 과정 정보</h2>
                           
                           {formData.course_id ? (
                              (() => {
                                 const selectedCourse = courses.find(course => course.id === formData.course_id)
                                 return selectedCourse ? (
                                    <div className="space-y-3 text-sm">
                                       <div>
                                          <span className="text-gray-500">과정명:</span>
                                          <div className="font-medium mt-1">{selectedCourse.name}</div>
                                       </div>
                                       <div>
                                          <span className="text-gray-500">과정 코드:</span>
                                          <div className="font-medium mt-1">{selectedCourse.course_code}</div>
                                       </div>
                                       <div>
                                          <span className="text-gray-500">분야:</span>
                                          <div className="font-medium mt-1">{selectedCourse.category}</div>
                                       </div>
                                       <div>
                                          <span className="text-gray-500">교육 시간:</span>
                                          <div className="font-medium mt-1">{selectedCourse.duration_hours}시간</div>
                                       </div>
                                       <div>
                                          <span className="text-gray-500">교육비:</span>
                                          <div className="font-medium mt-1">{selectedCourse.course_fee?.toLocaleString() || 0}원</div>
                                       </div>
                                    </div>
                                 ) : null
                              })()
                           ) : (
                              <p className="text-gray-500 text-sm">교육 과정을 선택해주세요.</p>
                           )}

                           <div className="mt-6 pt-6 border-t border-gray-200">
                              <div className="space-y-3">
                                 <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                 >
                                    {isSubmitting ? '등록 중...' : '교육 일정 등록'}
                                 </Button>
                                 <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push('/admin/education/schedules')}
                                 >
                                    취소
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </Card>
                  </div>
               </div>
            </form>
         </div>
      </AdminLayout>
   )
}
