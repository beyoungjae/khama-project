'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/layout/AdminHeader'

interface Certification {
   id: string
   name: string
   registration_number: string
}

export default function CreateExamPage() {
   const { isAdmin, isChecking } = useAdmin()
   const router = useRouter()

   const [certifications, setCertifications] = useState<Certification[]>([])
   const [saving, setSaving] = useState(false)

   const [form, setForm] = useState({
      certification_id: '',
      exam_date: '',
      registration_start_date: '',
      registration_end_date: '',
      result_announcement_date: '',
      exam_location: '',
      exam_address: '',
      max_applicants: 100,
      exam_instructions: '',
      status: 'scheduled',
   })

   // 자격증 목록 로드
   useEffect(() => {
      const loadCertifications = async () => {
         try {
            const response = await fetch('/api/exams/certifications')
            const data = await response.json()
            if (response.ok) {
               setCertifications(data.certifications || [])
            }
         } catch (error) {
            console.error('자격증 로드 오류:', error)
         }
      }

      if (isAdmin && !isChecking) {
         loadCertifications()
      }
   }, [isAdmin, isChecking])

   // 폼 저장
   const handleSave = async () => {
      if (!form.certification_id || !form.exam_date || !form.registration_start_date || !form.registration_end_date || !form.exam_location) {
         alert('필수 필드를 모두 입력해주세요.')
         return
      }

      try {
         setSaving(true)

         const response = await fetch('/api/admin/exams', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
         })

         const result = await response.json()

         if (response.ok) {
            alert('시험 일정이 성공적으로 등록되었습니다.')
            router.push('/admin/exams')
         } else {
            throw new Error(result.error || '등록 실패')
         }
      } catch (error: unknown) {
         console.error('등록 오류:', error)
         alert(error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // 로딩 중이거나 권한이 없는 경우
   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
         </div>
      )
   }

   if (!isAdmin) {
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <AdminHeader />
         <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
            {/* 헤더 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
               <div className="flex justify-between items-center">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900">새 시험 일정 등록</h1>
                     <p className="text-gray-600">시험 일정을 등록하고 신청을 받을 수 있습니다.</p>
                  </div>
                  <button onClick={() => router.back()} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                     취소
                  </button>
               </div>
            </div>

            {/* 등록 폼 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
               <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">자격증 *</label>
                        <select value={form.certification_id} onChange={(e) => setForm((prev) => ({ ...prev, certification_id: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                           <option value="">자격증을 선택하세요</option>
                           {certifications.map((cert) => (
                              <option key={cert.id} value={cert.id}>
                                 {cert.name}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">최대 신청자 수</label>
                        <input
                           type="number"
                           value={form.max_applicants}
                           onChange={(e) => setForm((prev) => ({ ...prev, max_applicants: parseInt(e.target.value) || 100 }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           min="1"
                           max="1000"
                        />
                     </div>
                  </div>

                  {/* 날짜 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">접수 시작일 *</label>
                        <input
                           type="date"
                           value={form.registration_start_date}
                           onChange={(e) => setForm((prev) => ({ ...prev, registration_start_date: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">접수 마감일 *</label>
                        <input
                           type="date"
                           value={form.registration_end_date}
                           onChange={(e) => setForm((prev) => ({ ...prev, registration_end_date: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">시험일 *</label>
                        <input type="date" value={form.exam_date} onChange={(e) => setForm((prev) => ({ ...prev, exam_date: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">결과 발표일</label>
                        <input
                           type="date"
                           value={form.result_announcement_date}
                           onChange={(e) => setForm((prev) => ({ ...prev, result_announcement_date: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                     </div>
                  </div>

                  {/* 시험장 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">시험장소 *</label>
                        <input
                           type="text"
                           value={form.exam_location}
                           onChange={(e) => setForm((prev) => ({ ...prev, exam_location: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="시험장소를 입력하세요"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">시험 주소</label>
                        <input
                           type="text"
                           value={form.exam_address}
                           onChange={(e) => setForm((prev) => ({ ...prev, exam_address: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="시험 주소를 입력하세요 (선택사항)"
                        />
                     </div>
                  </div>

                  {/* 시험 안내 */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">시험 안내사항</label>
                     <textarea
                        value={form.exam_instructions}
                        onChange={(e) => setForm((prev) => ({ ...prev, exam_instructions: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="시험에 대한 안내사항을 입력하세요 (선택사항)"
                     />
                  </div>

                  {/* 상태 */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                     <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="scheduled">예정됨</option>
                        <option value="registration_open">접수중</option>
                        <option value="registration_closed">접수마감</option>
                        <option value="exam_completed">시험완료</option>
                        <option value="results_announced">결과발표</option>
                        <option value="cancelled">취소됨</option>
                     </select>
                  </div>
               </div>

               {/* 액션 버튼 */}
               <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button onClick={() => router.back()} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                     취소
                  </button>
                  <button onClick={() => handleSave()} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                     {saving ? '저장 중...' : '시험 일정 등록'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}
