'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Resource {
   id: string
   title: string
   description: string
   category: string
   file_name: string
   file_size: number
   view_count: number
   download_count: number
   created_at: string
}

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
   const router = useRouter()
   const [resource, setResource] = useState<Resource | null>(null)
   const [loading, setLoading] = useState(true)

   // 파일 크기 포맷팅
   const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
   }

   // 자료실 상세 정보 조회
   const fetchResourceDetail = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/resources/${params.id}`)

         if (!response.ok) {
            throw new Error('자료 정보를 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setResource(data.resource)
      } catch (error) {
         console.error('자료 상세 조회 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   // 파일 다운로드
   const handleDownload = async () => {
      if (!resource) return

      try {
         const response = await fetch(`/api/files/download/${resource.id}`)

         if (!response.ok) {
            throw new Error('파일 다운로드 URL을 가져오는데 실패했습니다.')
         }

         const data = await response.json()

         // 브라우저에서 다운로드 시작
         const link = document.createElement('a')
         link.href = data.url
         link.download = data.file_name
         document.body.appendChild(link)
         link.click()
         document.body.removeChild(link)

         // 다운로드 횟수 업데이트를 위해 목록 다시 로드
         fetchResourceDetail()
      } catch (error) {
         console.error('파일 다운로드 오류:', error)
         alert('파일 다운로드 중 오류가 발생했습니다.')
      }
   }

   useEffect(() => {
      if (params.id) {
         fetchResourceDetail()
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
                     <p className="mt-2 text-gray-600">자료 정보를 불러오는 중입니다...</p>
                  </div>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   if (!resource) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <Card className="p-8 text-center">
                     <h2 className="text-xl font-bold text-gray-900 mb-2">자료를 찾을 수 없습니다</h2>
                     <p className="text-gray-600 mb-6">존재하지 않거나 삭제된 자료입니다.</p>
                     <Button onClick={() => router.push('/support/resources')}>목록으로 돌아가기</Button>
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
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">자료실</h1>
                     <Button variant="outline" onClick={() => router.push('/support/resources')}>
                        목록으로
                     </Button>
                  </div>
               </div>
            </section>

            <section className="py-8">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* 자료 정보 카드 */}
                  <Card className="mb-6">
                     <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{resource.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                           <span>{resource.category}</span>
                           <span>•</span>
                           <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                           <span>•</span>
                           <span>{formatFileSize(resource.file_size)}</span>
                           <span>•</span>
                           <span>조회 {resource.view_count}</span>
                           <span>•</span>
                           <span>다운로드 {resource.download_count}</span>
                        </div>

                        <div className="prose max-w-none border-t border-gray-200 pt-6">
                           <p className="whitespace-pre-wrap text-gray-600">{resource.description}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                 </svg>
                                 <span>{resource.file_name}</span>
                              </div>
                              <Button onClick={handleDownload}>다운로드</Button>
                           </div>
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
