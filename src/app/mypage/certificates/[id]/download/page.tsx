'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Certificate {
   id: string
   certificate_number: string
   applicant_name: string
   certification_name: string
   exam_date: string
   issued_date: string
   template_url: string
   pdf_url: string | null
}

export default function CertificateDownloadPage({ params }: { params: { id: string } }) {
   const router = useRouter()
   const [certificate, setCertificate] = useState<Certificate | null>(null)
   const [loading, setLoading] = useState(true)
   const [generating, setGenerating] = useState(false)

   // 자격증 정보 조회
   const fetchCertificateInfo = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/certificates/generate/${params.id}`)

         if (!response.ok) {
            throw new Error('자격증 정보를 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setCertificate(data.certificate)
      } catch (error) {
         console.error('자격증 정보 조회 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   // PDF 생성 및 다운로드
   const handleGenerateAndDownload = async () => {
      try {
         setGenerating(true)

         // TODO: 실제 PDF 생성 로직 구현
         // 현재는 테스트용 응답을 반환하므로 실제 구현이 필요함

         alert('자격증 PDF 생성이 요청되었습니다. 실제 구현이 필요합니다.')

         // 실제 구현 시에는 다음과 같은 로직이 필요함:
         // 1. PDF 생성 API 호출
         // 2. 생성된 PDF URL 받아오기
         // 3. 브라우저에서 다운로드 시작
      } catch (error) {
         console.error('PDF 생성 오류:', error)
         alert('자격증 생성 중 오류가 발생했습니다.')
      } finally {
         setGenerating(false)
      }
   }

   useEffect(() => {
      if (params.id) {
         fetchCertificateInfo()
      }
   }, [params.id])

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="text-center">
                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                     <p className="mt-2 text-gray-600">자격증 정보를 불러오는 중입니다...</p>
                  </div>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   if (!certificate) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <Card className="p-8 text-center">
                     <h2 className="text-xl font-bold text-gray-900 mb-2">자격증 정보를 찾을 수 없습니다</h2>
                     <p className="text-gray-600 mb-6">존재하지 않거나 잘못된 요청입니다.</p>
                     <Button onClick={() => router.push('/mypage/certificates')}>목록으로 돌아가기</Button>
                  </Card>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   return (
      <div className="min-h-screen flex flex-col">
         <Header />

         <main className="flex-grow pt-16">
            {/* 히어로 섹션 */}
            <section className="bg-gray-50 py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">자격증 다운로드</h1>
                     <Button variant="outline" onClick={() => router.push('/mypage/certificates')}>
                        목록으로
                     </Button>
                  </div>
               </div>
            </section>

            <section className="py-8">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="p-6">
                     <h2 className="text-xl font-bold text-gray-900 mb-6">자격증 정보</h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 자격증 정보 */}
                        <div>
                           <div className="space-y-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-500 mb-1">자격증명</label>
                                 <p className="text-lg font-medium text-gray-900">{certificate.certification_name}</p>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-500 mb-1">수험번호</label>
                                 <p className="text-lg font-medium text-gray-900">{certificate.certificate_number}</p>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-500 mb-1">응시자명</label>
                                 <p className="text-lg font-medium text-gray-900">{certificate.applicant_name}</p>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-500 mb-1">시험일</label>
                                 <p className="text-lg font-medium text-gray-900">{certificate.exam_date ? new Date(certificate.exam_date).toLocaleDateString() : '미정'}</p>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-500 mb-1">발급일</label>
                                 <p className="text-lg font-medium text-gray-900">{certificate.issued_date ? new Date(certificate.issued_date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                              </div>
                           </div>
                        </div>

                        {/* 자격증 미리보기 */}
                        <div>
                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center bg-gray-50">
                              {certificate.template_url ? (
                                 <div className="text-center">
                                    <p className="text-gray-500 mb-2">자격증 템플릿 미리보기</p>
                                    <p className="text-sm text-gray-400">실제 PDF에는 사용자 정보가 포함됩니다</p>
                                 </div>
                              ) : (
                                 <p className="text-gray-500">템플릿 이미지가 없습니다</p>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* 다운로드 버튼 */}
                     <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                           <Button onClick={handleGenerateAndDownload} disabled={generating} className="px-8">
                              {generating ? '생성 중...' : 'PDF 다운로드'}
                           </Button>
                           <Button variant="outline" onClick={() => window.print()} className="px-8">
                              인쇄하기
                           </Button>
                        </div>

                        <div className="mt-4 text-center text-sm text-gray-500">
                           <p>자격증은 PDF 형식으로 다운로드됩니다.</p>
                           <p className="mt-1">인쇄 시 고-quality 프린터 사용을 권장합니다.</p>
                        </div>
                     </div>
                  </Card>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
