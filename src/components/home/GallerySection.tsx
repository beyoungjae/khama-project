'use client'

import { useState } from 'react'

export default function GallerySection() {
   const [currentIndex, setCurrentIndex] = useState(0)

   const galleryImages = [
      {
         id: 1,
         title: '교육 현장',
         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
         description: '실무 중심의 교육 프로그램',
      },
      {
         id: 2,
         title: '자격증 시험',
         image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
         description: '공정한 자격 검정 시스템',
      },
      {
         id: 3,
         title: '실습 교육',
         image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
         description: '가전제품 분해 청소 실습',
      },
      {
         id: 4,
         title: '수료식',
         image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
         description: '전문가 양성 과정 수료',
      },
      {
         id: 5,
         title: '협회 활동',
         image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
         description: '업계 발전을 위한 협력',
      },
      {
         id: 6,
         title: '기술 세미나',
         image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
         description: '최신 기술 동향 공유',
      },
   ]

   const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(galleryImages.length / 3))
   }

   const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + Math.ceil(galleryImages.length / 3)) % Math.ceil(galleryImages.length / 3))
   }

   const getVisibleImages = () => {
      const startIndex = currentIndex * 3
      return galleryImages.slice(startIndex, startIndex + 3)
   }

   return (
      <section className="py-20 bg-gray-900 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">KHAMA 갤러리</h2>
               <p className="text-lg sm:text-xl text-gray-300">협회의 다양한 활동과 교육 현장을 만나보세요</p>
            </div>

            <div className="relative">
               {/* 이미지 그리드 */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {getVisibleImages().map((image) => (
                     <div key={image.id} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: `url(${image.image})` }} />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                           <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                           <p className="text-sm text-gray-200">{image.description}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* 네비게이션 버튼 */}
               <div className="flex justify-center items-center space-x-4">
                  <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                  </button>

                  {/* 인디케이터 */}
                  <div className="flex space-x-2">
                     {Array.from({ length: Math.ceil(galleryImages.length / 3) }).map((_, index) => (
                        <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`} />
                     ))}
                  </div>

                  <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </section>
   )
}
