'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'

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

export default function AdminInquiriesPage() {
   const router = useRouter()
   const [inquiries, setInquiries] = useState<Inquiry[]>([])
   const [loading, setLoading] = useState(true)
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const [searchTerm, setSearchTerm] = useState('')

   // 카테고리 목록
   const categories = [
      { value: 'all', label: '전체' },
      { value: 'exam', label: '시험 관련 문의' },
      { value: 'education', label: '교육 관련 문의' },
      { value: 'certificate', label: '자격증 관련 문의' },
      { value: 'payment', label: '결제 관련 문의' },
      { value: 'technical', label: '기술적 문제' },
      { value: 'other', label: '기타 문의' },
   ]

   const [selectedCategory, setSelectedCategory] = useState('all')

   // 상태별 뱃지 컴포넌트
   const getStatusBadge = (status: string, isAnswered: boolean) => {
      if (isAnswered) {
         return <Badge variant="success">답변완료</Badge>
      }

      switch (status) {
         case 'pending':
            return <Badge variant="warning">접수됨</Badge>
         case 'processing':
            return <Badge variant="error">처리중</Badge>
         default:
            return <Badge variant="default">기타</Badge>
      }
   }

   // 1:1 문의 목록 조회
   const fetchInquiries = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/admin/inquiries?page=${currentPage}&limit=20&category=${selectedCategory}&search=${searchTerm}`)

         if (!response.ok) {
            throw new Error('문의 목록을 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setInquiries(data.inquiries || [])
         setTotalPages(data.pagination?.totalPages || 1)
      } catch (error) {
         console.error('문의 목록 조회 오류:', error)
         setInquiries([])
      } finally {
         setLoading(false)
      }
   }

   // 페이지 변경 시 데이터 다시 로드
   useEffect(() => {
      fetchInquiries()
   }, [currentPage, selectedCategory, searchTerm])

   // 검색 처리
   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      setCurrentPage(1)
   }

   return (
      <AdminLayout>
         <div className="py-6">
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl font-bold text-gray-900">1:1 문의 관리</h1>
            </div>

            <Card className="p-6">
               {/* 검색 및 필터 */}
               <div className="mb-6">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                     <select
                        value={selectedCategory}
                        onChange={(e) => {
                           setSelectedCategory(e.target.value)
                           setCurrentPage(1)
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                        {categories.map((category) => (
                           <option key={category.value} value={category.value}>
                              {category.label}
                           </option>
                        ))}
                     </select>

                     <input type="text" placeholder="제목 또는 내용으로 검색" className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                     <Button type="submit">검색</Button>
                  </form>
               </div>

               {/* 문의 목록 */}
               {loading ? (
                  <div className="text-center py-8">
                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                     <p className="mt-2 text-gray-600">문의 목록을 불러오는 중입니다...</p>
                  </div>
               ) : inquiries.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-gray-500">등록된 1:1 문의가 없습니다.</p>
                  </div>
               ) : (
                  <>
                     <div className="space-y-4">
                        {inquiries.map((inquiry) => (
                           <Link key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`} className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                 <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">{inquiry.subject}</h3>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                       <span>
                                          {inquiry.name} ({inquiry.email})
                                       </span>
                                       <span className="mx-2">•</span>
                                       <span>{categories.find((c) => c.value === inquiry.category)?.label || inquiry.category}</span>
                                       <span className="mx-2">•</span>
                                       <span>{new Date(inquiry.created_at).toLocaleDateString('ko-KR')}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{inquiry.content}</p>
                                 </div>
                                 <div className="ml-4 flex-shrink-0">{getStatusBadge(inquiry.status, inquiry.is_answered)}</div>
                              </div>
                           </Link>
                        ))}
                     </div>

                     {/* 페이지네이션 */}
                     {totalPages > 1 && (
                        <div className="mt-8">
                           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                     )}
                  </>
               )}
            </Card>
         </div>
      </AdminLayout>
   )
}
