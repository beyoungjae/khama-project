'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'

interface Resource {
   id: string
   title: string
   description: string
   category: string
   file_name: string
   file_path: string
   file_size: number
   view_count: number
   download_count: number
   created_at: string
}

export default function ResourcesPage() {
   const router = useRouter()
   const [resources, setResources] = useState<Resource[]>([])
   const [loading, setLoading] = useState(true)
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const [searchTerm, setSearchTerm] = useState('')

   // 카테고리 목록
   const categories = [
      { value: 'all', label: '전체' },
      { value: 'exam', label: '시험자료' },
      { value: 'education', label: '교육자료' },
      { value: 'certificate', label: '자격증자료' },
      { value: 'general', label: '일반자료' },
   ]

   const [selectedCategory, setSelectedCategory] = useState('all')

   // 파일 크기 포맷팅
   const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
   }

   // 자료실 목록 조회
   const fetchResources = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/resources?category=${selectedCategory}&search=${searchTerm}&limit=10&offset=${(currentPage - 1) * 10}`)

         if (!response.ok) {
            throw new Error('자료 목록을 불러오는데 실패했습니다.')
         }

         const data = await response.json()
         setResources(data.resources || [])
         setTotalPages(Math.ceil(data.total / 10))
      } catch (error) {
         console.error('자료 목록 조회 오류:', error)
         setResources([])
      } finally {
         setLoading(false)
      }
   }

   // 페이지 변경 시 데이터 다시 로드
   useEffect(() => {
      fetchResources()
   }, [currentPage, selectedCategory, searchTerm])

   // 검색 처리
   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      setCurrentPage(1)
   }

   // 파일 다운로드
   const handleDownload = async (resourceId: string) => {
      try {
         const response = await fetch(`/api/files/download/${resourceId}`)

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
         fetchResources()
      } catch (error) {
         console.error('파일 다운로드 오류:', error)
         alert('파일 다운로드 중 오류가 발생했습니다.')
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
                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">자료실</h1>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">다양한 자료를 다운로드 받아 활용해보세요.</p>
                  </div>
               </div>
            </section>

            <section className="py-12">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                     {/* 사이드바 */}
                     <div className="lg:w-1/4">
                        <Card className="p-6">
                           <h2 className="text-xl font-bold text-gray-900 mb-4">자료 검색</h2>

                           <h3 className="font-semibold text-gray-900 mb-3">카테고리</h3>
                           <ul className="space-y-2">
                              {categories.map((category) => (
                                 <li key={category.value}>
                                    <button
                                       className={`text-left w-full px-3 py-2 rounded-md text-sm ${selectedCategory === category.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                       onClick={() => {
                                          setSelectedCategory(category.value)
                                          setCurrentPage(1)
                                       }}
                                    >
                                       {category.label}
                                    </button>
                                 </li>
                              ))}
                           </ul>
                        </Card>
                     </div>

                     {/* 메인 콘텐츠 */}
                     <div className="lg:w-3/4">
                        <Card className="p-6">
                           {/* 검색 및 필터 */}
                           <div className="mb-6">
                              <form onSubmit={handleSearch} className="flex gap-2">
                                 <input type="text" placeholder="제목 또는 내용으로 검색" className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                 <Button type="submit">검색</Button>
                              </form>
                           </div>

                           {/* 자료 목록 */}
                           {loading ? (
                              <div className="text-center py-8">
                                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                 <p className="mt-2 text-gray-600">자료 목록을 불러오는 중입니다...</p>
                              </div>
                           ) : resources.length === 0 ? (
                              <div className="text-center py-12">
                                 <p className="text-gray-500">등록된 자료가 없습니다.</p>
                              </div>
                           ) : (
                              <>
                                 <div className="space-y-4">
                                    {resources.map((resource) => {
                                       const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(resource.file_path)
                                       const base = process.env.NEXT_PUBLIC_SUPABASE_URL
                                       const publicUrl = isImage && base ? `${base}/storage/v1/object/public/resources/${resource.file_path}` : ''
                                       return (
                                          <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                             <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                                   {isImage ? (
                                                      <img src={publicUrl} alt={resource.title} className="w-16 h-16 object-cover rounded" />
                                                   ) : (
                                                      <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs">{resource.file_name?.split('.').pop()?.toUpperCase() || 'FILE'}</div>
                                                   )}
                                                   <div className="flex-1 min-w-0">
                                                      <h3 className="text-lg font-medium text-gray-900 truncate">{resource.title}</h3>
                                                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{resource.description}</p>
                                                      <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 gap-2">
                                                         <span className="inline-flex items-center mr-2">{resource.category}</span>
                                                         <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                                                         <span>· {formatFileSize(resource.file_size)}</span>
                                                         <span>· 조회 {resource.view_count}</span>
                                                      </div>
                                                   </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                   <Button size="sm" onClick={() => handleDownload(resource.id)}>
                                                      다운로드
                                                   </Button>
                                                </div>
                                             </div>
                                          </div>
                                       )
                                    })}
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
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
