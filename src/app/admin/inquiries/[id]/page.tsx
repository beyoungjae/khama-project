'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Inquiry {
   id: string
   name: string
   email: string
   phone: string
   category: string
   subject: string
   content: string
   status: string
   is_answered: boolean
   admin_response?: string
   created_at: string
   answered_at?: string
}

export default function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const router = useRouter()
   const [inquiry, setInquiry] = useState<Inquiry | null>(null)
   const [loading, setLoading] = useState(true)
   const [responseText, setResponseText] = useState('')
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [inquiryId, setInquiryId] = useState<string>('')

   useEffect(() => {
      const getParams = async () => {
         const resolvedParams = await params
         setInquiryId(resolvedParams.id)
      }
      getParams()
   }, [params])

   // 문의 상세 정보 조회
   const fetchInquiryDetail = async () => {
      if (!inquiryId) return
      
      try {
         setLoading(true)
         const response = await fetch(`/api/admin/inquiries`)
         
         if (!response.ok) {
            throw new Error('문의 정보를 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         const foundInquiry = data.inquiries?.find((inq: Inquiry) => inq.id === inquiryId)
         
         if (foundInquiry) {
            setInquiry(foundInquiry)
            setResponseText(foundInquiry.admin_response || '')
         } else {
            setInquiry(null)
         }
      } catch (error) {
         console.error('문의 상세 조회 오류:', error)
         setInquiry(null)
      } finally {
         setLoading(false)
      }
   }

   // 답변 제출
   const handleSubmitResponse = async () => {
      if (!inquiry || !responseText.trim()) {
         alert('답변 내용을 입력해주세요.')
         return
      }

      setIsSubmitting(true)
      try {
         console.log('관리자 답변 등록 시도')
         
         const response = await fetch(`/api/admin/inquiries/${inquiry.id}/response`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
            body: JSON.stringify({
               response: responseText.trim()
            }),
         })

         if (!response.ok) {
            throw new Error('답변 등록에 실패했습니다.')
         }

         alert('답변이 성공적으로 등록되었습니다.')
         fetchInquiryDetail() // 페이지 새로고침
      } catch (error) {
         console.error('답변 등록 오류:', error)
         alert('답변 등록에 실패했습니다. 다시 시도해주세요.')
      } finally {
         setIsSubmitting(false)
      }
   }

   // 카테고리 텍스트 변환
   const getCategoryText = (category: string) => {
      switch (category) {
         case 'exam': return '시험 관련 문의'
         case 'education': return '교육 관련 문의'
         case 'certificate': return '자격증 관련 문의'
         case 'payment': return '결제 관련 문의'
         case 'technical': return '기술적 문제'
         default: return '기타 문의'
      }
   }

   useEffect(() => {
      fetchInquiryDetail()
   }, [inquiryId])

   if (loading) {
      return (
         <AdminLayout>
            <div className="py-6">
               <div className="text-center">
                  <LoadingSpinner size="large" />
                  <p className="mt-2 text-gray-600">문의 정보를 불러오는 중입니다...</p>
               </div>
            </div>
         </AdminLayout>
      )
   }

   if (!inquiry) {
      return (
         <AdminLayout>
            <div className="py-6">
               <Card className="p-8 text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">문의를 찾을 수 없습니다</h2>
                  <p className="text-gray-600 mb-6">존재하지 않거나 삭제된 문의입니다.</p>
                  <Button onClick={() => router.push('/admin/inquiries')}>목록으로 돌아가기</Button>
               </Card>
            </div>
         </AdminLayout>
      )
   }

   return (
      <AdminLayout>
         <div className="py-6">
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl font-bold text-gray-900">1:1 문의 상세</h1>
               <Button variant="outline" onClick={() => router.push('/admin/inquiries')}>
                  목록으로
               </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* 문의 정보 */}
               <div className="lg:col-span-2">
                  <Card className="mb-6">
                     <div className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                           <h1 className="text-2xl font-bold text-gray-900">{inquiry.subject}</h1>
                           <Badge variant={inquiry.is_answered ? 'success' : 'warning'}>
                              {inquiry.is_answered ? '답변완료' : '답변대기'}
                           </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                           <div>
                              <span className="text-gray-500">문의자:</span>
                              <span className="ml-2 font-medium">{inquiry.name}</span>
                           </div>
                           <div>
                              <span className="text-gray-500">이메일:</span>
                              <span className="ml-2 font-medium">{inquiry.email}</span>
                           </div>
                           <div>
                              <span className="text-gray-500">연락처:</span>
                              <span className="ml-2 font-medium">{inquiry.phone}</span>
                           </div>
                           <div>
                              <span className="text-gray-500">문의 유형:</span>
                              <span className="ml-2 font-medium">{getCategoryText(inquiry.category)}</span>
                           </div>
                        </div>

                        <div className="prose max-w-none border-t border-gray-200 pt-6">
                           <h3 className="text-lg font-medium mb-3">문의 내용</h3>
                           <p className="whitespace-pre-wrap text-gray-700">{inquiry.content}</p>
                        </div>
                     </div>
                  </Card>

                  {/* 답변 섹션 */}
                  <Card>
                     <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                           {inquiry.is_answered ? '관리자 답변 수정' : '답변 작성'}
                        </h2>
                        
                        {inquiry.is_answered && inquiry.admin_response && (
                           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center mb-2">
                                 <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                 </svg>
                                 <span className="font-medium text-blue-900">현재 답변</span>
                                 {inquiry.answered_at && (
                                    <span className="text-sm text-blue-600 ml-2">
                                       ({new Date(inquiry.answered_at).toLocaleString('ko-KR')})
                                    </span>
                                 )}
                              </div>
                              <p className="text-blue-800 whitespace-pre-wrap">{inquiry.admin_response}</p>
                           </div>
                        )}
                        
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              답변 내용
                           </label>
                           <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              placeholder="답변 내용을 입력해주세요..."
                           />
                           
                           <div className="flex justify-end mt-4">
                              <Button
                                 onClick={handleSubmitResponse}
                                 disabled={isSubmitting || !responseText.trim()}
                                 className="min-w-24"
                              >
                                 {isSubmitting ? '등록 중...' : inquiry.is_answered ? '답변 수정' : '답변 등록'}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>

               {/* 사이드바 */}
               <div>
                  <Card className="p-6">
                     <h2 className="text-lg font-bold text-gray-900 mb-4">문의 정보</h2>
                     <div className="space-y-3 text-sm">
                        <div>
                           <span className="text-gray-500">문의 유형:</span>
                           <span className="ml-2 font-medium">{getCategoryText(inquiry.category)}</span>
                        </div>
                        <div>
                           <span className="text-gray-500">작성일:</span>
                           <span className="ml-2 font-medium">{new Date(inquiry.created_at).toLocaleString('ko-KR')}</span>
                        </div>
                        <div>
                           <span className="text-gray-500">상태:</span>
                           <span className="ml-2 font-medium">
                              {inquiry.is_answered ? '답변완료' : '답변대기'}
                           </span>
                        </div>
                        {inquiry.answered_at && (
                           <div>
                              <span className="text-gray-500">답변일:</span>
                              <span className="ml-2 font-medium">{new Date(inquiry.answered_at).toLocaleString('ko-KR')}</span>
                           </div>
                        )}
                     </div>

                     <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">문의자 연락처</h3>
                        <div className="space-y-2 text-sm">
                           <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                                 {inquiry.email}
                              </a>
                           </div>
                           <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                                 {inquiry.phone}
                              </a>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </AdminLayout>
   )
}