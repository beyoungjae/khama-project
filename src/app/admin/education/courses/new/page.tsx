'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function NewEducationCoursePage() {
   const { isAdmin, isChecking } = useAdmin()
   const router = useRouter()
   const [submitting, setSubmitting] = useState(false)

   const [formData, setFormData] = useState({
      name: '',
      description: '',
      category: 'basic',
      course_code: '',
      duration_hours: '',
      max_participants: '',
      course_fee: '',
      prerequisites: '',
      materials_included: '',
   })

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!formData.name.trim()) {
         alert('과정명을 입력해주세요.')
         return
      }

      try {
         setSubmitting(true)

         const headers: Record<string, string> = { 'Content-Type': 'application/json' }

         const payload = {
            ...formData,
            duration_hours: parseInt(formData.duration_hours) || 0,
            max_participants: parseInt(formData.max_participants) || 0,
            course_fee: formData.course_fee ? parseInt(formData.course_fee) : null,
         }

         const response = await fetch('/api/admin/education/courses', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(payload),
         })

         const result = await response.json()

         if (response.ok) {
            alert('교육 과정이 성공적으로 등록되었습니다.')
            router.push('/admin/education/courses')
         } else {
            throw new Error(result.error || '교육 과정 등록 실패')
         }
      } catch (error: unknown) {
         console.error('교육 과정 등록 오류:', error)
         alert(error instanceof Error ? error.message : '교육 과정 등록 중 오류가 발생했습니다.')
      } finally {
         setSubmitting(false)
      }
   }

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
         <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900">새 교육 과정 등록</h1>
                     <p className="text-gray-600">새로운 교육 과정을 등록합니다.</p>
                  </div>
                  <Button 
                     variant="outline"
                     onClick={() => router.push('/admin/education/courses')}
                  >
                     목록으로
                  </Button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           과정명 *
                        </label>
                        <input
                           type="text"
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="교육 과정명을 입력하세요"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           과정 코드
                        </label>
                        <input
                           type="text"
                           value={formData.course_code}
                           onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="예: EDU-001"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           카테고리
                        </label>
                        <select
                           value={formData.category}
                           onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                           <option value="basic">기초과정</option>
                           <option value="intermediate">중급과정</option>
                           <option value="advanced">고급과정</option>
                           <option value="special">특별과정</option>
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           교육 시간
                        </label>
                        <input
                           type="number"
                           min="1"
                           value={formData.duration_hours}
                           onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="시간"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           최대 수강생 수
                        </label>
                        <input
                           type="number"
                           min="1"
                           value={formData.max_participants}
                           onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="명"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           수강료 (원)
                        </label>
                        <input
                           type="number"
                           min="0"
                           value={formData.course_fee}
                           onChange={(e) => setFormData({ ...formData, course_fee: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="0 (무료인 경우 빈칸)"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        과정 설명
                     </label>
                     <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="교육 과정에 대한 자세한 설명을 입력하세요"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* 강사명 입력 제거 */}

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           수강 요건
                        </label>
                        <input
                           type="text"
                           value={formData.prerequisites}
                           onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="수강을 위한 조건"
                        />
                     </div>
                  </div>

                  {/* 강사 소개 에디터 제거 */}

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        제공 자료
                     </label>
                     <input
                        type="text"
                        value={formData.materials_included}
                        onChange={(e) => setFormData({ ...formData, materials_included: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="교육 자료, 수료증 등 (쉼표로 구분)"
                     />
                  </div>

                  <div className="flex justify-end space-x-3">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/education/courses')}
                     >
                        취소
                     </Button>
                     <Button type="submit" disabled={submitting}>
                        {submitting ? '등록 중...' : '등록하기'}
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      </AdminLayout>
   )
}
