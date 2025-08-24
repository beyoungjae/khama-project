'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IMAGES } from '@/constants/images'

export default function HeroSection() {
   const [currentSlide, setCurrentSlide] = useState(0)

   // TODO: 실제 이미지 파일로 교체 - src/constants/images.ts의 IMAGES.HERO 참조
   const slides = [
      {
         title: '가전제품 유지관리 전문가',
         subtitle: '체계적인 교육과 자격증으로\n새로운 미래를 시작하세요',
         tagline: 'Professional Value Creator',
         image: IMAGES.HERO.SLIDE1, // 실제 이미지로 교체 시 사용
         // image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
         cta: '자격증 과정 보기',
         link: '/business',
         features: ['전문 자격 교육', '실무 중심 커리큘럼', '창업 지원', '전문가 양성']
      },
      {
         title: '창업부터 전문가까지',
         subtitle: '실무 중심 교육으로\n성공적인 미래를 만들어가세요',
         tagline: 'Education & Growth Partner',
         image: IMAGES.HERO.SLIDE2, // 실제 이미지로 교체 시 사용
         // image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop',
         cta: '교육 프로그램 보기',
         link: '/business/education',
         features: ['창업 교육', '전문가 교육', '신아이템 교육', '맞춤형 과정']
      },
      {
         title: '신뢰할 수 있는 자격 검정',
         subtitle: '투명하고 공정한 자격 관리로\n업계 표준을 선도합니다',
         tagline: 'Trust & Quality Assurance',
         image: IMAGES.HERO.SLIDE3, // 실제 이미지로 교체 시 사용
         // image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop',
         cta: '시험 신청하기',
         link: '/exam',
         features: ['공정한 검정', '체계적 관리', '전문성 인증', '지속적 관리']
      },
   ]

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
   }, [slides.length])

   return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* 배경 슬라이드 */}
         {slides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
               <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${slide.image})` }} />
               <div className="absolute inset-0 bg-black/40" />
            </div>
         ))}

         {/* 콘텐츠 */}
         <div className="relative z-10 text-center text-white w-full px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in-up max-w-6xl mx-auto">
               {/* 태그라인 */}
               <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base px-4 py-2 rounded-full font-medium border border-white/20">
                     {slides[currentSlide].tagline}
                  </span>
               </div>
               
               {/* 메인 타이틀 */}
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                  {slides[currentSlide].title}
               </h1>
               
               {/* 서브타이틀 */}
               <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 text-gray-100 leading-relaxed max-w-4xl mx-auto whitespace-pre-line">
                  {slides[currentSlide].subtitle}
               </p>
               
               {/* 특징 아이콘 */}
               <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 max-w-4xl mx-auto">
                  {slides[currentSlide].features.map((feature, index) => (
                     <div key={index} className="flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                           <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                           </svg>
                        </div>
                        <span className="text-sm sm:text-base text-gray-200 font-medium">{feature}</span>
                     </div>
                  ))}
               </div>
               
               {/* CTA 버튼 */}
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
                  <Link href={slides[currentSlide].link} className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-blue-600 hover:border-blue-700">
                     {slides[currentSlide].cta}
                  </Link>
                  <Link href="/about" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 hover:scale-105">
                     KHAMA 소개
                  </Link>
               </div>
            </div>
         </div>

         {/* 슬라이드 인디케이터 */}
         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
               <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`} />
            ))}
         </div>

         {/* 스크롤 다운 화살표 */}
         <div className="absolute bottom-8 right-8 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
         </div>
      </section>
   )
}
