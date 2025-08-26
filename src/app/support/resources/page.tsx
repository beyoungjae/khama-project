'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { IMAGES } from '@/constants/images'

interface Resource {
   id: number | string
   title: string
   description: string | null
   category: string
   file_type?: string
   file_size?: number
   file_url?: string
   download_count?: number
   is_active: boolean
   created_at: string
   updated_at: string
}

export default function ResourcesPage() {
   const [resources, setResources] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
   const [selectedCategory, setSelectedCategory] = useState('전체')
   const [searchQuery, setSearchQuery] = useState('')
   const [totalCount, setTotalCount] = useState(0)

   // 폴백 데이터
   const fallbackResources = [
      {
         id: 1,
         title: '가전제품분해청소관리사 시험 가이드북',
         description: '시험 준비를 위한 완벽한 가이드북입니다.',
         category: '시험자료',
         fileType: 'PDF',
         fileSize: '2.5MB',
         downloadCount: 1250,
         uploadDate: '2025-01-10',
         isNew: true,
      },
      {
         id: 2,
         title: '냉난방기 세척 실무 매뉴얼',
         description: '냉난방기 세척 작업의 실무 매뉴얼입니다.',
         category: '교육자료',
         fileType: 'PDF',
         fileSize: '4.2MB',
         downloadCount: 890,
         uploadDate: '2025-01-08',
         isNew: true,
      },
      {
         id: 3,
         title: '에어컨 설치 안전 수칙',
         description: '에어컨 설치 시 반드시 지켜야 할 안전 수칙입니다.',
         category: '안전자료',
         fileType: 'PDF',
         fileSize: '1.8MB',
         downloadCount: 650,
         uploadDate: '2025-01-05',
         isNew: false,
      },
      {
         id: 4,
         title: '자격증 신청서 양식',
         description: '자격증 신청 시 사용하는 표준 양식입니다.',
         category: '양식',
         fileType: 'DOC',
         fileSize: '0.5MB',
         downloadCount: 2100,
         uploadDate: '2024-12-28',
         isNew: false,
      },
      {
         id: 5,
         title: '교육 과정 커리큘럼',
         description: '각 자격증별 교육 과정의 상세 커리큘럼입니다.',
         category: '교육자료',
         fileType: 'PDF',
         fileSize: '3.1MB',
         downloadCount: 780,
         uploadDate: '2024-12-20',
         isNew: false,
      },
      {
         id: 6,
         title: '협회 소개 브로슈어',
         description: '한국생활가전유지관리협회 소개 브로슈어입니다.',
         category: '홍보자료',
         fileType: 'PDF',
         fileSize: '5.8MB',
         downloadCount: 320,
         uploadDate: '2024-12-15',
         isNew: false,
      },
   ]

   // 자료 데이터 로드
   useEffect(() => {
      loadResources()
   }, [selectedCategory, searchQuery])

   const loadResources = async () => {
      try {
         setLoading(true)
         const params = new URLSearchParams()
         
         if (selectedCategory !== '전체') {
            params.append('category', selectedCategory)
         }
         
         if (searchQuery) {
            params.append('search', searchQuery)
         }
         
         const response = await fetch(`/api/resources?${params.toString()}`)
         const data = await response.json()
         
         if (response.ok && data.resources) {
            // API 데이터를 UI 형태로 변환
            const transformedData = data.resources.map((resource: Resource) => ({
               id: resource.id,
               title: resource.title,
               description: resource.description || '설명이 없습니다.',
               category: resource.category,
               fileType: resource.file_type?.toUpperCase() || 'PDF',
               fileSize: resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(1)}MB` : '1.0MB',
               downloadCount: resource.download_count || 0,
               uploadDate: new Date(resource.created_at).toLocaleDateString('ko-KR'),
               isNew: new Date(resource.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }))
            
            setResources(transformedData)
            setTotalCount(data.total)
         } else {
            console.error('자료실 로드 실패:', data.error)
            setResources(fallbackResources)
            setTotalCount(fallbackResources.length)
         }
      } catch (error) {
         console.error('자료실 로드 오류:', error)
         setResources(fallbackResources)
         setTotalCount(fallbackResources.length)
      } finally {
         setLoading(false)
      }
   }

   const handleSearch = () => {
      loadResources()
   }

   const categories = ['전체', '시험자료', '교육자료', '안전자료', '양식', '홍보자료']

   const getCategoryBadge = (category: string) => {
      switch (category) {
         case '시험자료':
            return <Badge variant="primary">{category}</Badge>
         case '교육자료':
            return <Badge variant="secondary">{category}</Badge>
         case '안전자료':
            return <Badge variant="warning">{category}</Badge>
         case '양식':
            return <Badge variant="success">{category}</Badge>
         case '홍보자료':
            return <Badge variant="default">{category}</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   const getFileIcon = (fileType: string) => {
      switch (fileType) {
         case 'PDF':
            return (
               <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
               </svg>
            )
         case 'DOC':
            return (
               <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
               </svg>
            )
         default:
            return (
               <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
               </svg>
            )
      }
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.RESOURCES})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">자료실</h1>
                  <p className="text-lg text-blue-100">학습에 도움이 되는 다양한 자료를 다운로드하세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* 검색 및 필터 */}
               <Card className="mb-8">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                           <Button 
                              key={category} 
                              variant={category === selectedCategory ? 'primary' : 'outline'} 
                              size="sm"
                              onClick={() => setSelectedCategory(category)}
                           >
                              {category}
                           </Button>
                        ))}
                     </div>
                     <div className="flex gap-2 w-full md:w-auto">
                        <input 
                           type="text" 
                           placeholder="파일명으로 검색..." 
                           className="flex-1 md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch}>검색</Button>
                     </div>
                  </div>
               </Card>

               {/* 자료 목록 */}
               {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="h-full animate-pulse">
                           <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                 <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                 <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                 </div>
                              </div>
                              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-16 bg-gray-200 rounded"></div>
                              <div className="h-8 bg-gray-200 rounded"></div>
                           </div>
                        </Card>
                     ))}
                  </div>
               ) : resources.length === 0 ? (
                  <Card>
                     <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                           <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">자료가 없습니다</h3>
                        <p className="text-gray-500">등록된 자료가 없습니다.</p>
                     </div>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {resources.map((resource) => (
                     <Card key={resource.id} hover className="h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center">
                              {getFileIcon(resource.fileType)}
                              <div className="ml-3">
                                 <div className="flex items-center gap-2">
                                    {getCategoryBadge(resource.category)}
                                    {resource.isNew && (
                                       <Badge variant="error" size="sm">
                                          NEW
                                       </Badge>
                                    )}
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">
                                    {resource.fileType} • {resource.fileSize}
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="flex-grow">
                           <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                           <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                           <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <span>업로드: {resource.uploadDate}</span>
                              <span>다운로드: {resource.downloadCount.toLocaleString()}회</span>
                           </div>
                           <Button className="w-full" size="sm">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              다운로드
                           </Button>
                        </div>
                     </Card>
                     ))}
                  </div>
               )}

               {/* 페이지네이션 */}
               <Card className="mt-8">
                  <div className="flex items-center justify-between px-4 py-3">
                     <div className="flex flex-1 justify-between sm:hidden">
                        <Button variant="outline" size="sm">
                           이전
                        </Button>
                        <Button variant="outline" size="sm">
                           다음
                        </Button>
                     </div>
                     <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                           <p className="text-sm text-gray-700">
                              총 <span className="font-medium">{totalCount}</span>개의 자료
                           </p>
                        </div>
                        <div>
                           <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                              <Button variant="outline" size="sm" className="rounded-l-md">
                                 이전
                              </Button>
                              <Button variant="primary" size="sm" className="rounded-none">
                                 1
                              </Button>
                              <Button variant="outline" size="sm" className="rounded-r-md">
                                 다음
                              </Button>
                           </nav>
                        </div>
                     </div>
                  </div>
               </Card>

               {/* 업로드 안내 */}
               <Card className="mt-8 bg-blue-50 border-blue-200">
                  <div className="flex items-start">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <div>
                        <h4 className="font-bold text-blue-900 mb-2">자료 업로드 안내</h4>
                        <p className="text-blue-800 text-sm mb-3">회원님들께 도움이 되는 자료가 있으시면 협회로 제출해주세요.</p>
                        <div className="text-sm text-blue-700 space-y-1">
                           <p>• 교육 관련 자료, 시험 준비 자료, 실무 매뉴얼 등</p>
                           <p>• 검토 후 승인된 자료만 게시됩니다</p>
                           <p>• 문의: 1566-3321 또는 haan@hanallcompany.com</p>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>
         </main>

         <Footer />
      </div>
   )
}
