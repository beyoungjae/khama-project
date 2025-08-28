'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface Inquiry {
   id: string
   title: string
   content: string
   category: string
   created_at: string
   status: string
   is_answered: boolean
   view_count: number
   author_name: string
}

interface Answer {
   id: string
   content: string
   admin_name: string
   created_at: string
}

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
   const router = useRouter()
   const [inquiry, setInquiry] = useState<Inquiry | null>(null)
   const [answer, setAnswer] = useState<Answer | null>(null)
   const [loading, setLoading] = useState(true)

   // 상태별 뱃지 컴포넌트
   const getStatusBadge = (status: string, isAnswered: boolean) => {
      if (isAnswered) {
         return <Badge variant="success">답변완료</Badge>
      }

      switch (status) {
         case 'pending':
            return <Badge variant="warning">접수됨</Badge>
         case 'processing':
            return <Badge variant="info">처리중</Badge>
         default:
            return <Badge variant="default">기타</Badge>
      }
   }

   // 1:1 문의 상세 정보 조회
   const fetchInquiryDetail = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/support/inquiries/${params.id}`)

         if (!response.ok) {
            throw new Error('문의 정보를 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setInquiry(data.inquiry)

         // TODO: 답변 정보도 함께 조회해야 함
         // 답변이 있는 경우 답변 정보도 설정
      } catch (error) {
         console.error('문의 상세 조회 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (params.id) {
         fetchInquiryDetail()
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
                     <p className="mt-2 text-gray-600">문의 정보를 불러오는 중입니다...</p>
                  </div>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   if (!inquiry) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <Card className="p-8 text-center">
                     <h2 className="text-xl font-bold text-gray-900 mb-2">문의를 찾을 수 없습니다</h2>
                     <p className="text-gray-600 mb-6">존재하지 않거나 삭제된 문의입니다.</p>
                     <Button onClick={() => router.push('/support/inquiry')}>목록으로 돌아가기</Button>
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
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">1:1 문의</h1>
                     <Button variant="outline" onClick={() => router.push('/support/inquiry')}>
                        목록으로
                     </Button>
                  </div>
               </div>
            </section>

            <section className="py-8">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* 문의 정보 카드 */}
                  <Card className="mb-6">
                     <div className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                           <h1 className="text-2xl font-bold text-gray-900">{inquiry.title}</h1>
                           {getStatusBadge(inquiry.status, inquiry.is_answered)}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                           <span>{inquiry.author_name}</span>
                           <span>•</span>
                           <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                           <span>•</span>
                           <span>조회 {inquiry.view_count}</span>
                           <span>•</span>
                           <span>{inquiry.category}</span>
                        </div>

                        <div className="prose max-w-none border-t border-gray-200 pt-6">
                           <p className="whitespace-pre-wrap">{inquiry.content}</p>
                        </div>
                     </div>
                  </Card>

                  {/* 답변 섹션 */}
                  {inquiry.is_answered ? (
                     <Card>
                        <div className="p-6">
                           <h2 className="text-xl font-bold text-gray-900 mb-4">관리자 답변</h2>
                           {answer ? (
                              <div className="border-t border-gray-200 pt-6">
                                 <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500">관리자 {answer.admin_name}</span>
                                    <span className="text-sm text-gray-500">{new Date(answer.created_at).toLocaleString()}</span>
                                 </div>
                                 <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap">{answer.content}</p>
                                 </div>
                              </div>
                           ) : (
                              <p className="text-gray-500">답변이 준비 중입니다.</p>
                           )}
                        </div>
                     </Card>
                  ) : (
                     <Card>
                        <div className="p-6 text-center">
                           <h2 className="text-lg font-medium text-gray-900 mb-2">답변 대기 중</h2>
                           <p className="text-gray-500">관리자가 답변을 준비 중입니다. 조금만 기다려주세요.</p>
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
