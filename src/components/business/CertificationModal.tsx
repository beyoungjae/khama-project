'use client'

import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Certification {
   id: string
   name: string
   registration_number: string
   description: string | null
   category: string
   application_fee: number | null
   certificate_fee: number | null
   status: string
   display_order: number
   requirements?: string | null
   exam_subjects?: Array<{ name: string; description: string }> | null
   exam_methods?: Array<{ type: string; questions: string; time: string; subjects: string[] }> | null
   passing_criteria?: string | null
   exemption_benefits?: string | null
   created_at: string
   updated_at: string
   cost?: {
      application: string
      certificate: string
      total: string
   }
   title?: string
   subtitle?: string
   features?: string[]
   curriculum?: string[]
   practicalCurriculum?: string[]
   examInfo?: {
      written: string
      practical: string
      passingScore: string
   }
   image?: string
   image_url?: string
   qualification_type?: string
   grade?: string
   eligibility?: string
   validity_period?: string
}

interface CertificationModalProps {
   isOpen: boolean
   onClose: () => void
   certification: Certification | null
}

export default function CertificationModal({ isOpen, onClose, certification }: CertificationModalProps) {
   // certification이 없거나 필요한 필드가 없는 경우 null 반환
   if (!certification) return null

   // 필요한 데이터 변환
   const title = certification.name || certification.title || '자격증 정보'
   const subtitle = certification.subtitle || ''
   const description = certification.description || '자격증 설명이 없습니다.'
   const registrationNumber = certification.registration_number || certification.registrationNumber || ''
   const image = certification.image_url || certification.image

   // 시험 과목 및 방법 정보 파싱
   let examSubjects = null
   let examMethods = null

   try {
      if (typeof certification.exam_subjects === 'string') {
         examSubjects = JSON.parse(certification.exam_subjects)
      } else {
         examSubjects = certification.exam_subjects
      }
   } catch (e) {
      examSubjects = null
   }

   try {
      if (typeof certification.exam_methods === 'string') {
         examMethods = JSON.parse(certification.exam_methods)
      } else {
         examMethods = certification.exam_methods
      }

      // 시험 방법에 포함된 과목 인덱스를 실제 과목명으로 변환
      if (examMethods && examSubjects) {
         examMethods = examMethods.map((method: any) => {
            if (method.subjects && Array.isArray(method.subjects)) {
               return {
                  ...method,
                  subjectNames: method.subjects.map((index: number) => examSubjects[index]?.name).filter(Boolean),
               }
            }
            return method
         })
      }
   } catch (e) {
      examMethods = null
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
               <div className="relative h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                  {image ? (
                     <>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                        <div className="absolute inset-0 bg-blue-900/60" />
                     </>
                  ) : (
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                     </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4 sm:p-6">
                     <div>
                        <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{title}</h2>
                        <p className="text-sm sm:text-xl opacity-90">{subtitle}</p>
                     </div>
                  </div>
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                     <Badge variant="default" size="sm">
                        등록번호: {registrationNumber}
                     </Badge>
                  </div>
               </div>
               <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{description}</p>
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
                        <span className="ml-2 text-gray-700">{certification.qualification_type || '등록민간자격'}</span>
                     </div>
                     <div>
                        <span className="font-medium text-blue-900">등급:</span>
                        <span className="ml-2 text-gray-700">{certification.grade || '단일등급'}</span>
                     </div>
                     <div>
                        <span className="font-medium text-blue-900">응시자격:</span>
                        <span className="ml-2 text-gray-700">{certification.eligibility || '교육 이수자'}</span>
                     </div>
                     <div>
                        <span className="font-medium text-blue-900">유효기간:</span>
                        <span className="ml-2 text-gray-700">{certification.validity_period || '평생유효'}</span>
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

               {/* 동적으로 생성된 시험 과목 및 방법 정보 */}
               {examSubjects && examMethods ? (
                  <div className="block sm:hidden space-y-4">
                     {examMethods.map((method: any, methodIndex: number) => (
                        <div key={methodIndex} className={`border rounded-lg p-4 ${method.type === '필기' ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200'}`}>
                           <div className="flex items-center mb-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${method.type === '필기' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                                 <span className="text-white text-sm font-bold">{method.type === '필기' ? '필' : '실'}</span>
                              </div>
                              <h4 className={`font-bold ${method.type === '필기' ? 'text-blue-900' : 'text-emerald-900'}`}>{method.type}시험</h4>
                           </div>
                           <div className="space-y-2 text-sm">
                              <div>
                                 <span className="font-medium">과목:</span>
                                 {method.subjectNames && method.subjectNames.length > 0
                                    ? method.subjectNames.map((name: string, idx: number) => (
                                         <span key={idx}>
                                            {name}
                                            {idx < method.subjectNames.length - 1 && <br />}
                                         </span>
                                      ))
                                    : method.subjects && method.subjects.length > 0
                                      ? method.subjects
                                           .map((subjectIndex: number) => examSubjects[subjectIndex]?.name)
                                           .filter(Boolean)
                                           .map((name: string, idx: number, arr: string[]) => (
                                              <span key={idx}>
                                                 {name}
                                                 {idx < arr.length - 1 && <br />}
                                              </span>
                                           ))
                                      : examSubjects.map((subject: any, idx: number, arr: any[]) => (
                                           <span key={idx}>
                                              {subject.name}
                                              {idx < arr.length - 1 && <br />}
                                           </span>
                                        ))}
                              </div>
                              <div>
                                 <span className="font-medium">문항수:</span> {method.questions || '25문항'}
                              </div>
                              <div>
                                 <span className="font-medium">시간:</span> {method.time || '120분(2시간)'}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  // 기존 하드코딩된 정보
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
               )}

               {/* 데스크톱용 테이블 */}
               {examSubjects && examMethods ? (
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
                           {examMethods.map((method: any, methodIndex: number) => (
                              <tr key={methodIndex} className="hover:bg-gray-50">
                                 <td className={`px-6 py-4 text-sm font-medium text-gray-900 ${method.type === '필기' ? 'bg-blue-50' : 'bg-emerald-50'}`}>{method.type}</td>
                                 <td className="px-6 py-4 text-sm text-gray-700">
                                    {method.subjectNames && method.subjectNames.length > 0
                                       ? method.subjectNames.map((name: string, idx: number) => (
                                            <span key={idx}>
                                               {name}
                                               {idx < method.subjectNames.length - 1 && <br />}
                                            </span>
                                         ))
                                       : method.subjects && method.subjects.length > 0
                                         ? method.subjects
                                              .map((subjectIndex: number) => examSubjects[subjectIndex]?.name)
                                              .filter(Boolean)
                                              .map((name: string, idx: number, arr: string[]) => (
                                                 <span key={idx}>
                                                    {name}
                                                    {idx < arr.length - 1 && <br />}
                                                 </span>
                                              ))
                                         : examSubjects.map((subject: any) => subject.name).join(', ')}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-700">{method.questions || '25문항'}</td>
                                 <td className="px-6 py-4 text-sm text-gray-700">{method.time || '120분(2시간)'}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
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
               )}
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
                  {certification.passing_criteria ? (
                     <div className="text-sm sm:text-base text-gray-700">
                        {/* 하드코딩된 텍스트 대신 구조화된 합격 기준 표시 */}
                        {(() => {
                           try {
                              // 1. JSON 형식으로 저장된 경우
                              if (certification.passing_criteria.startsWith('{')) {
                                 const criteria = JSON.parse(certification.passing_criteria)
                                 if (criteria.items && Array.isArray(criteria.items)) {
                                    return (
                                       <div className="space-y-4">
                                          {criteria.items.map((item: any, index: number) => (
                                             <div key={index} className="bg-white rounded-md p-3 border border-orange-100 shadow-sm">
                                                <div className="font-medium text-orange-900 mb-2">{item.category}:</div>
                                                <ul className="space-y-1 pl-1">
                                                   {item.details.map((detail: string, i: number) => (
                                                      <li key={i} className="flex items-start">
                                                         <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mt-1 mr-3 sm:mr-4 flex-shrink-0"></div>
                                                         <span className="text-gray-700">{detail}</span>
                                                      </li>
                                                   ))}
                                                </ul>
                                             </div>
                                          ))}
                                       </div>
                                    )
                                 }
                              }

                              // 2. 기존 텍스트 형식(필기시험: xxx\n실기시험: xxx)으로 저장된 경우
                              const lines = certification.passing_criteria.split('\n')
                              const criteriaItems = []

                              // 필기시험, 실기시험 구분
                              for (const line of lines) {
                                 if (line.startsWith('필기시험:')) {
                                    criteriaItems.push({
                                       category: '필기시험',
                                       details: [line.substring('필기시험:'.length).trim()],
                                    })
                                 } else if (line.startsWith('실기시험:')) {
                                    criteriaItems.push({
                                       category: '실기시험',
                                       details: [line.substring('실기시험:'.length).trim()],
                                    })
                                 } else if (line.trim()) {
                                    // 기타 정보는 마지막 항목으로
                                    if (criteriaItems.length > 0 && criteriaItems[criteriaItems.length - 1].category === '기타') {
                                       criteriaItems[criteriaItems.length - 1].details.push(line.trim())
                                    } else {
                                       criteriaItems.push({
                                          category: '기타',
                                          details: [line.trim()],
                                       })
                                    }
                                 }
                              }

                              if (criteriaItems.length > 0) {
                                 return (
                                    <div className="space-y-4">
                                       {criteriaItems.map((item: any, index: number) => (
                                          <div key={index} className="bg-white rounded-md p-3 border border-orange-100 shadow-sm">
                                             <div className="font-medium text-orange-900 mb-2">{item.category}:</div>
                                             <ul className="space-y-1 pl-1">
                                                {item.details.map((detail: string, i: number) => (
                                                   <li key={i} className="flex items-start">
                                                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mt-1 mr-3 sm:mr-4 flex-shrink-0"></div>
                                                      <span className="text-gray-700">{detail}</span>
                                                   </li>
                                                ))}
                                             </ul>
                                          </div>
                                       ))}
                                    </div>
                                 )
                              }

                              // 3. 그 외 경우, 텍스트 그대로 표시
                              return <div className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{certification.passing_criteria}</div>
                           } catch (e) {
                              // 파싱 오류 시 텍스트 그대로 표시
                              return <div className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{certification.passing_criteria}</div>
                           }
                        })()}
                     </div>
                  ) : (
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
                  )}
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
                  {certification.exemption_benefits ? (
                     <div className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{certification.exemption_benefits}</div>
                  ) : (
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
                  )}
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
                        <div className="text-xl sm:text-3xl font-bold text-green-700">{certification?.cost?.application || certification?.application_fee ? (certification.application_fee > 0 ? `${certification.application_fee?.toLocaleString()}원` : '별도 문의') : '별도 문의'}</div>
                     </div>
                     <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                        <div className="font-medium text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">자격발급비</div>
                        <div className="text-xl sm:text-3xl font-bold text-green-700">{certification?.cost?.certificate || certification?.certificate_fee ? (certification.certificate_fee > 0 ? `${certification.certificate_fee?.toLocaleString()}원` : '별도 문의') : '별도 문의'}</div>
                     </div>
                     <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                        <div className="font-medium text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">총 비용</div>
                        <div className="text-xl sm:text-3xl font-bold text-green-700">
                           {certification?.cost?.total || (certification?.application_fee && certification?.certificate_fee)
                              ? (certification.application_fee || 0) + (certification.certificate_fee || 0) > 0
                                 ? `${((certification.application_fee || 0) + (certification.certificate_fee || 0)).toLocaleString()}원`
                                 : '별도 문의'
                              : '별도 문의'}
                        </div>
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
