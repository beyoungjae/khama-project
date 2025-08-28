'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ExamResult {
   id: string
   exam_number: string
   pass_status: boolean
   written_score: number | null
   practical_score: number | null
   total_score: number | null
   exam_taken_at: string
   certifications: {
      name: string
      registration_number: string
   }
   exam_schedules: {
      exam_date: string
      exam_location: string
   }
}

export default function ExamResultSearchPage() {
   const router = useRouter()
   const [examNumber, setExamNumber] = useState('')
   const [result, setResult] = useState<ExamResult | null>(null)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   // 합격 결과 조회
   const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!examNumber.trim()) {
         setError('수험번호를 입력해주세요.')
         return
      }

      try {
         setLoading(true)
         setError(null)

         const response = await fetch(`/api/exam/results?examNumber=${encodeURIComponent(examNumber)}`)

         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || '조회에 실패했습니다.')
         }

         const data = await response.json()
         setResult(data.application)
      } catch (error: unknown) {
         console.error('합격 결과 조회 오류:', error)
         setError(error instanceof Error ? error.message : '합격 결과 조회 중 오류가 발생했습니다.')
         setResult(null)
      } finally {
         setLoading(false)
      }
   }

   // 새 검색
   const handleNewSearch = () => {
      setExamNumber('')
      setResult(null)
      setError(null)
   }

   // 자격증 다운로드
   const handleCertificateDownload = async (certificateId: string) => {
      try {
         const response = await fetch(`/api/certificates/generate/${certificateId}`)
         
         if (!response.ok) {
            throw new Error('자격증 생성에 실패했습니다.')
         }

         const data = await response.json()
         
         if (data.download_url) {
            const link = document.createElement('a')
            link.href = data.download_url
            link.download = data.certificate.file_name || `certificate_${certificateId}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
         } else {
            alert('자격증 다운로드 URL을 생성할 수 없습니다.')
         }
      } catch (error) {
         console.error('자격증 다운로드 오류:', error)
         alert('자격증 다운로드 중 오류가 발생했습니다.')
      }
   }

   return (
      <div className="min-h-screen flex flex-col">
         <Header />

         <main className="flex-grow pt-16">
            {/* 히어로 섹션 */}
            <section className="bg-gray-50 py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">합격자 조회</h1>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">수험번호를 입력하여 시험 결과를 확인하세요.</p>
                  </div>
               </div>
            </section>

            <section className="py-12">
               <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                  {!result ? (
                     <Card className="p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">수험번호 입력</h2>

                        <form onSubmit={handleSearch} className="space-y-6">
                           <div>
                              <label htmlFor="examNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                 수험번호
                              </label>
                              <Input id="examNumber" type="text" value={examNumber} onChange={(e) => setExamNumber(e.target.value)} placeholder="수험번호를 입력해주세요" className="text-center text-lg" required />
                              <p className="mt-2 text-sm text-gray-500">예: 2025-0001-0001</p>
                           </div>

                           {error && <div className="text-red-600 text-center py-2">{error}</div>}

                           <Button type="submit" className="w-full py-3" disabled={loading}>
                              {loading ? '조회 중...' : '조회하기'}
                           </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                           <h3 className="text-lg font-medium text-gray-900 mb-3">조회 안내</h3>
                           <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                              <li>수험번호는 시험 응시 시 받으신 안내문에 기재되어 있습니다.</li>
                              <li>결과 발표일 이후에 조회가 가능합니다.</li>
                              <li>결과가 확인되지 않을 경우 고객센터로 문의해주세요.</li>
                           </ul>
                        </div>
                     </Card>
                  ) : (
                     <Card className="p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">시험 결과</h2>

                        <div className="text-center mb-6">
                           {result.pass_status ? (
                              <div className="inline-flex flex-col items-center">
                                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                 </div>
                                 <h3 className="text-xl font-bold text-green-600">합격 축하합니다!</h3>
                              </div>
                           ) : (
                              <div className="inline-flex flex-col items-center">
                                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                 </div>
                                 <h3 className="text-xl font-bold text-red-600">불합격</h3>
                              </div>
                           )}
                        </div>

                        <div className="space-y-4 mb-8">
                           <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">자격증명</span>
                              <span className="font-medium">{result.certifications?.name}</span>
                           </div>

                           <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">수험번호</span>
                              <span className="font-medium">{result.exam_number}</span>
                           </div>

                           <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">시험일</span>
                              <span className="font-medium">{result.exam_schedules?.exam_date ? new Date(result.exam_schedules.exam_date).toLocaleDateString() : '미정'}</span>
                           </div>

                           <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">응시일</span>
                              <span className="font-medium">{result.exam_taken_at ? new Date(result.exam_taken_at).toLocaleDateString() : '미정'}</span>
                           </div>

                           {result.pass_status && (
                              <>
                                 <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">필기 점수</span>
                                    <span className="font-medium">{result.written_score !== null ? `${result.written_score}점` : '미입력'}</span>
                                 </div>

                                 <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">실기 점수</span>
                                    <span className="font-medium">{result.practical_score !== null ? `${result.practical_score}점` : '미입력'}</span>
                                 </div>

                                 <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">총점</span>
                                    <span className="font-medium">{result.total_score !== null ? `${result.total_score}점` : '미입력'}</span>
                                 </div>
                              </>
                           )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                           <Button onClick={handleNewSearch} className="flex-1">
                              새 검색
                           </Button>
                           {result.pass_status && (
                              <Button variant="outline" onClick={() => handleCertificateDownload(result.id)} className="flex-1">
                                 자격증 다운로드
                              </Button>
                           )}
                        </div>
                     </Card>
                  )}
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
