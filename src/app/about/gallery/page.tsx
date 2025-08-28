'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Image from 'next/image'

interface GalleryImage {
   id: string
   file_name: string
   file_path: string
   file_url: string
   title: string
   description: string | null
   category: string
   display_order: number
   is_active: boolean
   created_at: string
   updated_at: string
}

export default function GalleryPage() {
   const [currentIndex, setCurrentIndex] = useState(0)
   const [selectedCategory, setSelectedCategory] = useState('전체')
   const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
   const [loading, setLoading] = useState(true)

   // 갤러리 이미지 로드
   useEffect(() => {
      loadGalleryImages()
   }, [])

   const loadGalleryImages = async () => {
      try {
         setLoading(true)
         const response = await fetch('/api/gallery')

         if (response.ok) {
            const data = await response.json()
            setGalleryImages(data.images || [])
         } else {
            console.error('갤러리 이미지 로드 실패')
         }
      } catch (error) {
         console.error('갤러리 이미지 로드 오류:', error)
      } finally {
         setLoading(false)
      }
   }

   // 카테고리 매핑
   const categoryMap: Record<string, string> = {
      education: '교육 현장',
      exam: '시험',
      practice: '실습',
      graduation: '수료식',
      association: '협회 활동',
      seminar: '세미나',
      facilities: '시설',
      general: '기타',
   }

   // 카테고리별 이미지 개수 계산
   const getCategoryCount = (category: string) => {
      if (category === '전체') return galleryImages.length
      return galleryImages.filter((img) => {
         const mappedCategory = categoryMap[img.category] || img.category
         return mappedCategory === category
      }).length
   }

   // 데이터베이스에서 가져온 이미지들의 카테고리를 기반으로 동적 생성
   const availableCategories = Array.from(new Set(galleryImages.map((img) => categoryMap[img.category] || img.category).filter((category) => getCategoryCount(category) > 0))).sort()
   const categories = ['전체', ...availableCategories]

   // 실제 DB 이미지와 폴백 이미지 결합
   const displayImages = galleryImages.length > 0 ? galleryImages : []

   const filteredImages =
      selectedCategory === '전체'
         ? displayImages
         : displayImages.filter((img) => {
              const mappedCategory = categoryMap[img.category] || img.category
              return mappedCategory === selectedCategory
           })

   const itemsPerPage = 9
   const totalPages = Math.ceil(filteredImages.length / itemsPerPage)
   const startIndex = currentIndex * itemsPerPage
   const currentImages = filteredImages.slice(startIndex, startIndex + itemsPerPage)

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-16 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <nav className="flex items-center justify-center space-x-2 text-blue-100 mb-6">
                     <a href="/about" className="hover:text-white transition-colors">
                        협회 소개
                     </a>
                     <span>/</span>
                     <span className="text-white font-medium">갤러리</span>
                  </nav>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">KHAMA 갤러리</h1>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">협회의 다양한 활동과 교육 현장을 생생하게 만나보세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* 카테고리 필터 */}
               <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {categories.map((category) => (
                     <button
                        key={category}
                        onClick={() => {
                           setSelectedCategory(category)
                           setCurrentIndex(0)
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                     >
                        {category}
                        <span className="ml-2 text-xs opacity-75">({getCategoryCount(category)})</span>
                     </button>
                  ))}
               </div>

               {/* 갤러리 그리드 */}
               {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                     {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg bg-white animate-pulse">
                           <div className="h-64 bg-gray-200"></div>
                           <div className="p-6">
                              <div className="h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                     {currentImages.map((image, index) => {
                        const mappedCategory = categoryMap[image.category] || image.category

                        return (
                           <div key={image.id} className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white" style={{ animationDelay: `${index * 0.1}s` }}>
                              {/* 이미지 */}
                              <div className="relative h-64 overflow-hidden">
                                 <Image src={image.file_url} alt={image.title} layout="fill" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                 {/* 카테고리 배지 */}
                                 <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-blue-600/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">{mappedCategory}</span>
                                 </div>
                              </div>

                              {/* 컨텐츠 */}
                              <div className="p-6">
                                 <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{image.title}</h3>
                                 <p className="text-gray-600 text-sm leading-relaxed">{image.description || ''}</p>
                              </div>

                              {/* 호버 오버레이 */}
                              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                           </div>
                        )
                     })}
                  </div>
               )}

               {/* 페이지네이션 */}
               {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                     <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                     </button>

                     <div className="flex space-x-1">
                        {Array.from({ length: totalPages }).map((_, index) => (
                           <button key={index} onClick={() => setCurrentIndex(index)} className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${index === currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                              {index + 1}
                           </button>
                        ))}
                     </div>

                     <button onClick={() => setCurrentIndex(Math.min(totalPages - 1, currentIndex + 1))} disabled={currentIndex === totalPages - 1} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </button>
                  </div>
               )}

               {/* 빈 상태 */}
               {currentImages.length === 0 && (
                  <div className="text-center py-16">
                     <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                     </div>
                     <h3 className="text-lg font-medium text-gray-900 mb-2">이미지가 없습니다</h3>
                     <p className="text-gray-500">선택한 카테고리에 해당하는 이미지가 없습니다.</p>
                  </div>
               )}
            </div>
         </main>
      </div>
   )
}
