'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface Certificate {
   id: string
   exam_number: string
   pass_status: boolean
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

export default function MyCertificatesPage() {
   const router = useRouter()
   const [certificates, setCertificates] = useState<Certificate[]>([])
   const [loading, setLoading] = useState(true)

   // 합격 상태 뱃지
   const getPassStatusBadge = (passStatus: boolean) => {
      return passStatus ? <Badge variant="success">합격</Badge> : <Badge variant="error">불합격</Badge>
   }

   // 사용자의 자격증 목록 조회
   const fetchCertificates = async () => {
      try {
         setLoading(true)

         // TODO: 실제 사용자 ID로 대체해야 함
         const userId = 'user-id-placeholder' // 실제 사용자 ID

         const response = await fetch(`/api/certificates/user/${userId}`)

         if (!response.ok) {
            throw new Error('자격증 목록을 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setCertificates(data.certificates || [])
      } catch (error) {
         console.error('자격증 목록 조회 오류:', error)
         setCertificates([])
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchCertificates()
   }, [])

   // 자격증 다운로드 처리
   const handleCertificateDownload = async (certificateId: string) => {
      try {
         const response = await fetch(`/api/certificates/generate/${certificateId}`)
         
         if (!response.ok) {
            throw new Error('자격증 생성에 실패했습니다.')
         }

         const data = await response.json()
         
         if (data.download_url) {
            // Signed URL로 다운로드
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
            <section className="bg-gray-50 py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">내 자격증</h1>
                     <Button variant="outline" onClick={() => router.push('/mypage')}>
                        마이페이지로
                     </Button>
                  </div>
               </div>
            </section>

            <section className="py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="p-6">
                     <h2 className="text-xl font-bold text-gray-900 mb-6">보유 자격증</h2>

                     {loading ? (
                        <div className="text-center py-8">
                           <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                           <p className="mt-2 text-gray-600">자격증 목록을 불러오는 중입니다...</p>
                        </div>
                     ) : certificates.length === 0 ? (
                        <div className="text-center py-12">
                           <p className="text-gray-500 mb-4">보유한 자격증이 없습니다.</p>
                           <Button onClick={() => router.push('/exam')}>시험 신청하러 가기</Button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {certificates.map((certificate) => (
                              <Card key={certificate.id} className="hover:shadow-md transition-shadow">
                                 <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                       <h3 className="font-bold text-gray-900">{certificate.certifications?.name}</h3>
                                       {getPassStatusBadge(certificate.pass_status)}
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                       <div className="flex justify-between">
                                          <span>자격증 번호:</span>
                                          <span className="font-medium">{certificate.certifications?.registration_number}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span>수험번호:</span>
                                          <span className="font-medium">{certificate.exam_number}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span>시험일:</span>
                                          <span className="font-medium">{certificate.exam_schedules?.exam_date ? new Date(certificate.exam_schedules.exam_date).toLocaleDateString() : '미정'}</span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span>합격일:</span>
                                          <span className="font-medium">{certificate.exam_taken_at ? new Date(certificate.exam_taken_at).toLocaleDateString() : '미정'}</span>
                                       </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                       <Button 
                                          className="w-full" 
                                          onClick={() => handleCertificateDownload(certificate.id)} 
                                          disabled={!certificate.pass_status}
                                       >
                                          {certificate.pass_status ? '자격증 다운로드' : '다운로드 불가'}
                                       </Button>
                                    </div>
                                 </div>
                              </Card>
                           ))}
                        </div>
                     )}
                  </Card>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
