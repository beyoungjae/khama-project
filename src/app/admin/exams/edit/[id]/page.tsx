'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminHeader from '@/components/layout/AdminHeader'
import { useAdmin } from '@/hooks/useAdmin'

interface Certification {
   id: string
   name: string
   registration_number: string
   application_fee: number | null
   certificate_fee: number | null
}

interface ExamSchedule {
   id: string
   certification_id: string
   exam_date: string
   registration_start_date: string
   registration_end_date: string
   result_announcement_date: string | null
   exam_location: string
   exam_address: string | null
   max_applicants: number
   current_applicants: number
   exam_instructions: string | null
   required_items: unknown
   status: string
   created_at: string
   updated_at: string
   certifications: Certification
}

export default function AdminExamEditPage() {
   const { isAdmin, isChecking } = useAdmin()
   const params = useParams()
   const router = useRouter()
   const [schedule, setSchedule] = useState<ExamSchedule | null>(null)
   const [certifications, setCertifications] = useState<Certification[]>([])
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)

   const [formData, setFormData] = useState({
      certification_id: '',
      exam_date: '',
      registration_start_date: '',
      registration_end_date: '',
      result_announcement_date: '',
      exam_location: '',
      exam_address: '',
      max_applicants: 100,
      exam_instructions: '',
      required_items: '',
      status: 'scheduled',
   })

   const statusOptions = [
      { value: 'scheduled', label: '예정' },
      { value: 'registration_open', label: '접수중' },
      { value: 'registration_closed', label: '접수마감' },
      { value: 'exam_completed', label: '시험완료' },
      { value: 'results_announced', label: '결과발표' },
      { value: 'cancelled', label: '취소' },
   ]

   useEffect(() => {
      if (!isAdmin || isChecking) return

      const loadData = async () => {
         try {
            setLoading(true)

            // 자격증 목록 로드
            const certResponse = await fetch('/api/exams/certifications')
            const certData = await certResponse.json()
            if (certResponse.ok) {
               setCertifications(certData.certifications || [])
            }

            // 시험 일정 상세 정보 로드 (쿠키 기반)
            const scheduleResponse = await fetch(`/api/admin/exams/${params.id}`)
            const scheduleData = await scheduleResponse.json()

            if (scheduleResponse.ok) {
               const examSchedule = scheduleData.schedule
               setSchedule(examSchedule)

               // 폼 데이터 설정
               setFormData({
                  certification_id: examSchedule.certification_id,
                  exam_date: examSchedule.exam_date.split('T')[0], // 날짜만 추출
                  registration_start_date: examSchedule.registration_start_date.split('T')[0],
                  registration_end_date: examSchedule.registration_end_date.split('T')[0],
                  result_announcement_date: examSchedule.result_announcement_date ? examSchedule.result_announcement_date.split('T')[0] : '',
                  exam_location: examSchedule.exam_location || '',
                  exam_address: examSchedule.exam_address || '',
                  max_applicants: examSchedule.max_applicants || 100,
                  exam_instructions: examSchedule.exam_instructions || '',
                  required_items: Array.isArray(examSchedule.required_items) ? examSchedule.required_items.join('\n') : (examSchedule.required_items as string) || '',
                  status: examSchedule.status || 'scheduled',
               })
            } else {
               console.error('시험 일정 조회 실패:', scheduleData.error)
               alert('시험 일정을 불러오는데 실패했습니다.')
               router.push('/admin/exams')
            }
         } catch (error) {
            console.error('데이터 로드 오류:', error)
            alert('서버 오류가 발생했습니다.')
            router.push('/admin/exams')
         } finally {
            setLoading(false)
         }
      }

      loadData()
   }, [isAdmin, isChecking, params.id, router])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!schedule) return

      try {
         setSaving(true)

         // 필수 필드 검증
         if (!formData.certification_id || !formData.exam_date || !formData.registration_start_date || !formData.registration_end_date || !formData.exam_location) {
            alert('필수 정보를 모두 입력해주세요.')
            return
         }

         // 날짜 검증
         const regStart = new Date(formData.registration_start_date)
         const regEnd = new Date(formData.registration_end_date)
         const examDate = new Date(formData.exam_date)
         const resultDate = formData.result_announcement_date ? new Date(formData.result_announcement_date) : null

         if (regStart >= regEnd) {
            alert('접수 시작일은 접수 마감일보다 빨라야 합니다.')
            return
         }

         if (regEnd >= examDate) {
            alert('접수 마감일은 시험일보다 빨라야 합니다.')
            return
         }

         if (resultDate && resultDate <= examDate) {
            alert('결과 발표일은 시험일보다 늦어야 합니다.')
            return
         }

         // required_items 처리
         const requiredItemsArray = formData.required_items
            .split('\n')
            .map((item) => item.trim())
            .filter((item) => item.length > 0)

         const updateData = {
            ...formData,
            required_items: requiredItemsArray,
         }

         const response = await fetch(`/api/admin/exams/${schedule.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
         })

         const result = await response.json()

         if (response.ok) {
            alert('시험 일정이 성공적으로 수정되었습니다.')
            router.push('/admin/exams')
         } else {
            throw new Error(result.error || '수정 실패')
         }
      } catch (error: unknown) {
         console.error('수정 오류:', error)
         alert(error instanceof Error ? error.message : '수정 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   const handleDelete = async () => {
      if (!schedule) return

      if (!confirm(`'${schedule.certifications?.name}' 시험 일정을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
         return
      }

      try {
         const response = await fetch(`/api/admin/exams/${schedule.id}`, {
            method: 'DELETE',
         })

         const result = await response.json()

         if (response.ok) {
            alert('시험 일정이 성공적으로 삭제되었습니다.')
            router.push('/admin/exams')
         } else {
            throw new Error(result.error || '삭제 실패')
         }
      } catch (error: unknown) {
         console.error('삭제 오류:', error)
         alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
      }
   }

   if (isChecking || loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null
   }

   if (!schedule) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-xl font-semibold text-gray-900">시험 일정을 찾을 수 없습니다</h2>
               <Link href="/admin/exams" className="mt-4 text-blue-600 hover:text-blue-800">
                  목록으로 돌아가기
               </Link>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <AdminHeader />
         <div className="max-w-4xl mx-auto px-4 py-8 pt-16">
            {/* 헤더 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
               <div className="flex justify-between items-center">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900">시험 일정 편집</h1>
                     <p className="text-gray-600">{schedule.certifications?.name} 시험 일정을 수정합니다</p>
                  </div>
                  <div className="space-x-4">
                     <Link href="/admin/exams">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">목록으로</button>
                     </Link>
                     <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        삭제
                     </button>
                  </div>
               </div>
            </div>

            {/* 편집 폼 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 기본 정보 */}
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">자격증 *</label>
                           <select
                              value={formData.certification_id}
                              onChange={(e) => setFormData((prev) => ({ ...prev, certification_id: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                           >
                              <option value="">자격증을 선택하세요</option>
                              {certifications.map((cert) => (
                                 <option key={cert.id} value={cert.id}>
                                    {cert.name} ({cert.registration_number})
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">상태 *</label>
                           <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                              {statusOptions.map((option) => (
                                 <option key={option.value} value={option.value}>
                                    {option.label}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* 일정 정보 */}
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">일정 정보</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">시험일 *</label>
                           <input
                              type="date"
                              value={formData.exam_date}
                              onChange={(e) => setFormData((prev) => ({ ...prev, exam_date: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">접수 시작일 *</label>
                           <input
                              type="date"
                              value={formData.registration_start_date}
                              onChange={(e) => setFormData((prev) => ({ ...prev, registration_start_date: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">접수 마감일 *</label>
                           <input
                              type="date"
                              value={formData.registration_end_date}
                              onChange={(e) => setFormData((prev) => ({ ...prev, registration_end_date: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">결과 발표일</label>
                           <input
                              type="date"
                              value={formData.result_announcement_date}
                              onChange={(e) => setFormData((prev) => ({ ...prev, result_announcement_date: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           />
                        </div>
                     </div>
                  </div>

                  {/* 장소 정보 */}
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">장소 정보</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">시험장소 *</label>
                           <input
                              type="text"
                              value={formData.exam_location}
                              onChange={(e) => setFormData((prev) => ({ ...prev, exam_location: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="예: 서울시청 대강당"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">최대 신청자 수 *</label>
                           <input
                              type="number"
                              value={formData.max_applicants}
                              onChange={(e) => setFormData((prev) => ({ ...prev, max_applicants: parseInt(e.target.value) || 0 }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                              max="1000"
                              required
                           />
                        </div>
                     </div>

                     <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">상세 주소</label>
                        <input
                           type="text"
                           value={formData.exam_address}
                           onChange={(e) => setFormData((prev) => ({ ...prev, exam_address: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="예: 서울시 중구 세종대로 110"
                        />
                     </div>
                  </div>

                  {/* 상세 정보 */}
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h2>
                     <div className="space-y-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">시험 안내사항</label>
                           <textarea
                              value={formData.exam_instructions}
                              onChange={(e) => setFormData((prev) => ({ ...prev, exam_instructions: e.target.value }))}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="시험 진행 관련 안내사항을 입력하세요"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">준비물 (한 줄에 하나씩)</label>
                           <textarea
                              value={formData.required_items}
                              onChange={(e) => setFormData((prev) => ({ ...prev, required_items: e.target.value }))}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="신분증&#10;필기구&#10;계산기"
                           />
                        </div>
                     </div>
                  </div>

                  {/* 현재 신청 현황 */}
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">신청 현황</h2>
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-gray-600">현재 신청자 수</span>
                           <span className="text-lg font-semibold text-gray-900">
                              {schedule.current_applicants}명 / {formData.max_applicants}명
                           </span>
                        </div>
                        <div className="mt-2">
                           <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                 className="bg-blue-600 h-2 rounded-full"
                                 style={{
                                    width: `${Math.min((schedule.current_applicants / formData.max_applicants) * 100, 100)}%`,
                                 }}
                              ></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                     <Link href="/admin/exams">
                        <button type="button" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                           취소
                        </button>
                     </Link>
                     <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving ? '저장 중...' : '수정 완료'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}
