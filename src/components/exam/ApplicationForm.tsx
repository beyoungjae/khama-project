'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ApplicationForm() {
   const searchParams = useSearchParams()
   const certId = searchParams.get('cert')

   const [formData, setFormData] = useState({
      // 개인정보
      name: '',
      birthDate: '',
      phone: '',
      email: '',
      address: '',
      detailAddress: '',

      // 시험 정보
      certificationId: certId || '',
      examDate: '',
      examLocation: '',

      // 교육 이수 정보
      educationCompleted: false,
      educationCertificate: null as File | null,

      // 약관 동의
      termsAgreed: false,
      privacyAgreed: false,
      marketingAgreed: false,
   })

   const certifications = [
      { id: '1', name: '가전제품분해청소관리사' },
      { id: '2', name: '냉난방기세척서비스관리사' },
      { id: '3', name: '에어컨설치관리사' },
      { id: '4', name: '환기청정시스템관리사' },
   ]

   const examDates = [
      { id: '1', date: '2025년 9월 15일 (일)', locations: ['인천'] },
      { id: '2', date: '2025년 9월 22일 (일)', locations: ['인천'] },
      { id: '3', date: '2025년 10월 13일 (일)', locations: ['인천'] },
      { id: '4', date: '2025년 10월 20일 (일)', locations: ['인천'] },
   ]

   const selectedCert = certifications.find((cert) => cert.id === formData.certificationId)
   const selectedExamDate = examDates.find((exam) => exam.id === formData.certificationId)

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      if (type === 'checkbox') {
         const checked = (e.target as HTMLInputElement).checked
         setFormData((prev) => ({ ...prev, [name]: checked }))
      } else {
         setFormData((prev) => ({ ...prev, [name]: value }))
      }
   }

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      setFormData((prev) => ({ ...prev, educationCertificate: file }))
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      // 필수 항목 검증
      if (!formData.name || !formData.phone || !formData.email || !formData.certificationId) {
         alert('필수 항목을 모두 입력해주세요.')
         return
      }

      if (!formData.termsAgreed || !formData.privacyAgreed) {
         alert('필수 약관에 동의해주세요.')
         return
      }

      if (!formData.educationCompleted) {
         alert('해당 자격증의 교육 과정을 먼저 이수해주세요.')
         return
      }

      // 임시 처리 (실제로는 API 호출)
      alert('시험 신청이 완료되었습니다. 결제 페이지로 이동합니다.')
      console.log('신청 데이터:', formData)
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-8">
         {/* 자격증 선택 */}
         <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">자격증 선택</h2>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     신청할 자격증 <span className="text-red-500">*</span>
                  </label>
                  <select name="certificationId" value={formData.certificationId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                     <option value="">자격증을 선택해주세요</option>
                     {certifications.map((cert) => (
                        <option key={cert.id} value={cert.id}>
                           {cert.name}
                        </option>
                     ))}
                  </select>
               </div>

               {selectedCert && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="font-semibold text-blue-900">{selectedCert.name}</h3>
                        </div>
                        <Badge variant="primary">선택됨</Badge>
                     </div>
                  </div>
               )}
            </div>
         </Card>

         {/* 시험 일정 선택 */}
         {selectedExamDate && (
            <Card>
               <h2 className="text-2xl font-bold text-gray-900 mb-6">시험 일정 및 장소</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">시험 일자</label>
                     <input type="text" value={selectedExamDate.date} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        시험 지역 <span className="text-red-500">*</span>
                     </label>
                     <select name="examLocation" value={formData.examLocation} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">시험 지역을 선택해주세요</option>
                        {selectedExamDate.locations.map((location) => (
                           <option key={location} value={location}>
                              {location}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </Card>
         )}

         {/* 개인정보 입력 */}
         <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">개인정보 입력</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     성명 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="홍길동" required />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     생년월일 <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     휴대폰 번호 <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="010-1234-5678" required />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     이메일 <span className="text-red-500">*</span>
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="example@email.com" required />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     주소 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2" placeholder="주소를 입력해주세요" required />
                  <input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="상세주소 (선택사항)" />
               </div>
            </div>
         </Card>

         {/* 교육 이수 확인 */}
         <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">교육 이수 확인</h2>
            <div className="space-y-4">
               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                     <strong>중요:</strong> 해당 자격증의 종합 교육을 이수한 자에 한하여 시험 응시가 가능합니다.
                  </p>
               </div>

               <div className="flex items-center">
                  <input type="checkbox" name="educationCompleted" checked={formData.educationCompleted} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                  <label className="ml-2 text-sm text-gray-700">
                     해당 자격증의 교육 과정을 이수하였습니다. <span className="text-red-500">*</span>
                  </label>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육 이수증 첨부 (선택사항)</label>
                  <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG 파일만 업로드 가능 (최대 5MB)</p>
               </div>
            </div>
         </Card>

         {/* 약관 동의 */}
         <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">약관 동의</h2>
            <div className="space-y-4">
               <div className="flex items-center">
                  <input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                  <label className="ml-2 text-sm text-gray-700">
                     시험 응시 약관에 동의합니다. <span className="text-red-500">*</span>
                     <a href="#" className="text-blue-600 hover:underline ml-1">
                        [보기]
                     </a>
                  </label>
               </div>

               <div className="flex items-center">
                  <input type="checkbox" name="privacyAgreed" checked={formData.privacyAgreed} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                  <label className="ml-2 text-sm text-gray-700">
                     개인정보 수집 및 이용에 동의합니다. <span className="text-red-500">*</span>
                     <a href="#" className="text-blue-600 hover:underline ml-1">
                        [보기]
                     </a>
                  </label>
               </div>

               <div className="flex items-center">
                  <input type="checkbox" name="marketingAgreed" checked={formData.marketingAgreed} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label className="ml-2 text-sm text-gray-700">
                     마케팅 정보 수신에 동의합니다. (선택사항)
                     <a href="#" className="text-blue-600 hover:underline ml-1">
                        [보기]
                     </a>
                  </label>
               </div>
            </div>
         </Card>

         {/* 제출 버튼 */}
         <div className="flex flex-col sm:flex-row gap-4">
            <Button type="button" variant="outline" className="flex-1" href="/exam">
               취소
            </Button>
            <Button type="submit" className="flex-1">
               신청하기
            </Button>
         </div>
      </form>
   )
}
