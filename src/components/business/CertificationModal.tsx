'use client'

import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Certification {
   id: number
   title: string
   subtitle: string
   description: string
   registrationNumber: string
   features: string[]
   curriculum: string[]
   practicalCurriculum: string[]
   examInfo: {
      written: string
      practical: string
      passingScore: string
   }
   cost: {
      application: string
      certificate: string
      total: string
   }
   image: string
}

interface CertificationModalProps {
   isOpen: boolean
   onClose: () => void
   certification: Certification | null
}

export default function CertificationModal({ isOpen, onClose, certification }: CertificationModalProps) {
   if (!certification) return null

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
               <div className="relative h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${certification.image})` }} />
                  <div className="absolute inset-0 bg-blue-900/60" />
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4 sm:p-6">
                     <div>
                        <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{certification.title}</h2>
                        <p className="text-sm sm:text-xl opacity-90">{certification.subtitle}</p>
                     </div>
                  </div>
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                     <Badge variant="default" size="sm">
                        등록번호: {certification.registrationNumber}
                     </Badge>
                  </div>
               </div>
               <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{certification.description}</p>
            </div>

            {/* 자격 기본 정보 */}
            <div>
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  자격 기본 정보
               </h3>
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 text-sm sm:text-base">
                     <div>
                        <span className="font-medium text-blue-900">자격 종류:</span>
                        <span className="ml-2 text-gray-700">등록민간자격</span>
                     </div>
                     <div>
                        <span className="font-medium text-blue-900">등급:</span>
                        <span className="ml-2 text-gray-700">단일등급</span>
                     </div>
                     <div>
                        <span className="font-medium text-blue-900">응시자격:</span>
                        <span className="ml-2 text-gray-700">교육 이수자</span>
                     </div>
                     <div>
                        <span className="font-medium text-blue-900">유효기간:</span>
                        <span className="ml-2 text-gray-700">평생유효</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* 검정 과목 및 방법 */}
            <div>
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  검정 과목 및 방법
               </h3>

               {/* 모바일용 카드 형태 */}
               <div className="block sm:hidden space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                           <span className="text-white text-sm font-bold">필</span>
                        </div>
                        <h4 className="font-bold text-blue-900">필기시험</h4>
                     </div>
                     <div className="space-y-2 text-sm">
                        <div>
                           <span className="font-medium">과목:</span> 가전제품 작동원리, 세탁기/에어컨 분해세척 이론, 기타 가전제품 케어, 마케팅 실무
                        </div>
                        <div>
                           <span className="font-medium">문항수:</span> 25문항
                        </div>
                        <div>
                           <span className="font-medium">시간:</span> 120분(2시간)
                        </div>
                     </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                     <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                           <span className="text-white text-sm font-bold">실</span>
                        </div>
                        <h4 className="font-bold text-emerald-900">실기시험</h4>
                     </div>
                     <div className="space-y-2 text-sm">
                        <div>
                           <span className="font-medium">과목:</span> 세탁기/에어컨 분해세척 실기, 기타 가전제품 케어 실기, 마케팅 실무 실기
                        </div>
                        <div>
                           <span className="font-medium">문항수:</span> 25문항
                        </div>
                        <div>
                           <span className="font-medium">시간:</span> -
                        </div>
                     </div>
                  </div>
               </div>

               {/* 데스크톱용 테이블 */}
               <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                           <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">구분</th>
                           <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">과목명</th>
                           <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">문항수</th>
                           <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">시험시간</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                           <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-blue-50">필기</td>
                           <td className="px-6 py-4 text-sm text-gray-700">
                              가전제품 작동원리
                              <br />
                              세탁기/에어컨 분해세척 이론
                              <br />
                              기타 가전제품 케어
                              <br />
                              마케팅 실무
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-700">25문항</td>
                           <td className="px-6 py-4 text-sm text-gray-700">120분(2시간)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                           <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-emerald-50">실기</td>
                           <td className="px-6 py-4 text-sm text-gray-700">
                              세탁기/에어컨 분해세척 실기
                              <br />
                              기타 가전제품 케어 실기
                              <br />
                              마케팅 실무 실기
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-700">25문항</td>
                           <td className="px-6 py-4 text-sm text-gray-700">-</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 합격 기준 */}
            <div>
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  합격 기준
               </h3>
               <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                     <div className="flex items-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-3 sm:mr-4"></div>
                        <div>
                           <span className="font-medium text-orange-900">필기시험:</span>
                           <span className="ml-2 text-gray-700">과목당 60점 이상, 평균 60점 이상</span>
                        </div>
                     </div>
                     <div className="flex items-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full mr-3 sm:mr-4"></div>
                        <div>
                           <span className="font-medium text-emerald-900">실기시험:</span>
                           <span className="ml-2 text-gray-700">100점 만점 기준 60점 이상</span>
                        </div>
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-orange-200">
                     <p className="text-sm sm:text-base text-orange-800 font-medium">✓ 필기시험과 실기시험 모두 합격 시 최종 합격</p>
                  </div>
               </div>
            </div>

            {/* 시험 면제 혜택 */}
            <div>
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  시험 면제 혜택
               </h3>
               <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                     <div className="flex items-start">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full mt-2 mr-3 sm:mr-4 flex-shrink-0"></div>
                        <div>
                           <span className="font-medium text-purple-900">부분 합격자:</span>
                           <span className="ml-2 text-gray-700">필기 또는 실기 중 1개 합격 시 연속 2회 면제</span>
                        </div>
                     </div>
                     <div className="flex items-start">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full mt-2 mr-3 sm:mr-4 flex-shrink-0"></div>
                        <div>
                           <span className="font-medium text-purple-900">과목별 면제:</span>
                           <span className="ml-2 text-gray-700">필기 과목별 60점 이상 득점 시 연속 2회 면제</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 비용 정보 */}
            <div>
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  비용 정보
               </h3>
               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                     <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                        <div className="font-medium text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">응시료</div>
                        <div className="text-xl sm:text-3xl font-bold text-green-700">{certification.cost.application}</div>
                     </div>
                     <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                        <div className="font-medium text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">자격발급비</div>
                        <div className="text-xl sm:text-3xl font-bold text-green-700">{certification.cost.certificate}</div>
                     </div>
                     <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                        <div className="font-medium text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">총 비용</div>
                        <div className="text-xl sm:text-3xl font-bold text-green-700">{certification.cost.total}</div>
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200 text-center">
                     <p className="text-sm sm:text-base text-green-800">
                        📞 상세 비용 문의: <span className="font-semibold">1566-3321</span>
                     </p>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
               <Button href="/exam" className="flex-1" size="lg">
                  시험 신청하기
               </Button>
               <Button href="/exam/schedule" variant="secondary" className="flex-1" size="lg">
                  시험 일정 보기
               </Button>
            </div>
         </div>
      </Modal>
   )
}
