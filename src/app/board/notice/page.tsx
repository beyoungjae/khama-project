'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { IMAGES } from '@/constants/images'

interface Notice {
   id: string
   title: string
   content: string
   excerpt: string
   category: string
   author_name: string
   created_at: string
   updated_at: string
   published_at: string
   view_count: number
   is_important: boolean
   is_pinned: boolean
   is_published: boolean
}

export default function NoticePage() {
   const router = useRouter()
   const [notices, setNotices] = useState<Notice[]>([])
   const [loading, setLoading] = useState(true)
   const [selectedCategory, setSelectedCategory] = useState('전체')
   const [searchQuery, setSearchQuery] = useState('')
   const [currentPage, setCurrentPage] = useState(1)
   const [totalCount, setTotalCount] = useState(0)

   // 공지사항 데이터 로드
   const loadNotices = useCallback(async () => {
      try {
         setLoading(true)
         const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: '10',
            ...(selectedCategory !== '전체' && { category: selectedCategory }),
            ...(searchQuery && { search: searchQuery }),
         })

         const response = await fetch(`/api/board/notices?${params}`)
         if (response.ok) {
            const data = await response.json()
            setNotices(data.notices || [])
            setTotalCount(data.total || 0)
         } else {
            console.error('공지사항 로드 실패')
         }
      } catch (error) {
         console.error('공지사항 로드 오류:', error)
      } finally {
         setLoading(false)
      }
   }, [currentPage, selectedCategory, searchQuery])

   useEffect(() => {
      loadNotices()
   }, [loadNotices])

   const handleCategoryChange = (category: string) => {
      setSelectedCategory(category)
      setCurrentPage(1)
   }

   const handleSearch = () => {
      setCurrentPage(1)
      loadNotices()
   }

   const formatDate = (dateString: string) => {
      return new Date(dateString)
         .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
         })
         .replace(/\. /g, '.')
         .replace('.', '')
   }

   const isNew = (notice: Notice) => {
      const postDate = new Date(notice.published_at || notice.created_at)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - postDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 // 7일 이내면 NEW
   }

   const getCategoryBadge = (category: string) => {
      // 데이터베이스 카테고리를 UI 카테고리로 매핑
      const categoryMap: { [key: string]: { name: string; variant: 'primary' | 'secondary' | 'default' } } = {
         exam: { name: '시험공지', variant: 'primary' },
         education: { name: '교육공지', variant: 'secondary' },
         general: { name: '일반공지', variant: 'default' },
         시험공지: { name: '시험공지', variant: 'primary' },
         교육공지: { name: '교육공지', variant: 'secondary' },
         일반공지: { name: '일반공지', variant: 'default' },
      }

      const mapped = categoryMap[category] || { name: category, variant: 'default' as const }
      return <Badge variant={mapped.variant}>{mapped.name}</Badge>
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.NOTICE})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">공지사항</h1>
                  <p className="text-lg text-blue-100">협회의 중요한 소식과 공지사항을 확인하세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* 카테고리 필터 */}
               <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                     {[
                        { db: '전체', display: '전체' },
                        { db: 'exam', display: '시험공지' },
                        { db: 'education', display: '교육공지' },
                        { db: 'general', display: '일반공지' },
                     ].map((category) => (
                        <Button key={category.db} variant={selectedCategory === category.db ? 'primary' : 'outline'} size="sm" onClick={() => handleCategoryChange(category.db)}>
                           {category.display}
                        </Button>
                     ))}
                  </div>
               </div>

               {/* 검색 */}
               <div className="mb-8">
                  <div className="flex gap-2">
                     <input
                        type="text"
                        placeholder="공지사항을 검색하세요..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                     />
                     <Button onClick={handleSearch}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                     </Button>
                  </div>
               </div>

               {/* 공지사항 목록 */}
               <Card>
                  {/* 데스크톱 테이블 뷰 */}
                  <div className="hidden lg:block overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분류</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {loading ? (
                              <tr>
                                 <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-500">로딩 중...</p>
                                 </td>
                              </tr>
                           ) : notices.length === 0 ? (
                              <tr>
                                 <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    등록된 공지사항이 없습니다.
                                 </td>
                              </tr>
                           ) : (
                              notices.map((notice) => (
                                 <tr key={notice.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => router.push(`/board/notice/${notice.id}`)}>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center">
                                          {notice.is_important && (
                                             <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                             </svg>
                                          )}
                                          <div>
                                             <div className="flex items-center gap-2">
                                                <span className={`text-sm font-medium ${notice.is_important ? 'text-red-600' : 'text-gray-900'}`}>{notice.title}</span>
                                                {isNew(notice) && (
                                                   <Badge variant="success" size="sm">
                                                      NEW
                                                   </Badge>
                                                )}
                                             </div>
                                             <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notice.excerpt || notice.content}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(notice.category)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.author_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(notice.published_at || notice.created_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.view_count.toLocaleString()}</td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>

                  {/* 모바일/태블릿 카드 뷰 */}
                  <div className="lg:hidden space-y-4">
                     {loading ? (
                        <div className="py-12 text-center">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                           <p className="mt-2 text-gray-500">로딩 중...</p>
                        </div>
                     ) : notices.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">등록된 공지사항이 없습니다.</div>
                     ) : (
                        notices.map((notice) => (
                           <Link key={notice.id} href={`/board/notice/${notice.id}`}>
                              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                 <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                       {getCategoryBadge(notice.category)}
                                       {notice.is_important && (
                                          <Badge variant="error" size="sm">
                                             중요
                                          </Badge>
                                       )}
                                       {isNew(notice) && (
                                          <Badge variant="success" size="sm">
                                             NEW
                                          </Badge>
                                       )}
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                 </div>

                                 <h3 className={`font-medium mb-2 text-base leading-tight ${notice.is_important ? 'text-red-600' : 'text-gray-900'}`}>
                                    {notice.is_important && (
                                       <svg className="w-4 h-4 text-red-500 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                       </svg>
                                    )}
                                    {notice.title}
                                 </h3>

                                 <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{notice.excerpt || notice.content}</p>

                                 <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-3">
                                       <span>{notice.author_name}</span>
                                       <span>조회 {notice.view_count.toLocaleString()}</span>
                                    </div>
                                    <span>{formatDate(notice.published_at || notice.created_at)}</span>
                                 </div>
                              </div>
                           </Link>
                        ))
                     )}
                  </div>

                  {/* 페이지네이션 */}
                  {!loading && notices.length > 0 && (
                     <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
                        <nav className="flex items-center space-x-2">
                           <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                              이전
                           </Button>

                           {/* 페이지 번호들 */}
                           {Array.from({ length: Math.min(5, Math.ceil(totalCount / 10)) }, (_, i) => {
                              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                              const maxPage = Math.ceil(totalCount / 10)
                              if (pageNum > maxPage) return null

                              return (
                                 <Button key={pageNum} variant={currentPage === pageNum ? 'primary' : 'outline'} size="sm" onClick={() => setCurrentPage(pageNum)}>
                                    {pageNum}
                                 </Button>
                              )
                           })}

                           <Button variant="outline" size="sm" disabled={currentPage >= Math.ceil(totalCount / 10)} onClick={() => setCurrentPage((prev) => prev + 1)}>
                              다음
                           </Button>
                        </nav>
                     </div>
                  )}
               </Card>
            </div>
         </main>

         <Footer />
      </div>
   )
}
