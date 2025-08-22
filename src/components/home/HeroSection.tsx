'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IMAGES } from '@/constants/images'

export default function HeroSection() {
   const [currentSlide, setCurrentSlide] = useState(0)

   // TODO: 실제 이미지 파일로 교체 - src/constants/images.ts의 IMAGES.HERO 참조
   const slides = [
      {
         title: '생활가전 유지관리 전문가',
         subtitle: '체계적인 교육과 자격증으로 새로운 미래를 시작하세요',
         image: IMAGES.HERO.SLIDE1, // 실제 이미지로 교체 시 사용
         // image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
         cta: '자격증 알아보기',
         link: '/business',
      },
      {
         title: '창업부터 전문가 교육까지',
         subtitle: '실무 중심 교육으로 성공적인 창업을 지원합니다',
         image: IMAGES.HERO.SLIDE2, // 실제 이미지로 교체 시 사용
         // image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=600&fit=crop',
         cta: '교육 프로그램 보기',
         link: '/business',
      },
      {
         title: '신뢰할 수 있는 자격 관리',
         subtitle: '투명하고 공정한 자격 검정으로 업계 표준을 선도합니다',
         image: IMAGES.HERO.SLIDE3, // 실제 이미지로 교체 시 사용
         // image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop',
         cta: '시험 신청하기',
         link: '/exam',
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
            <div className="animate-fade-in-up max-w-5xl mx-auto">
               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{slides[currentSlide].title}</h1>
               <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200 leading-relaxed max-w-4xl mx-auto">{slides[currentSlide].subtitle}</p>
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                  <Link href={slides[currentSlide].link} className="bg-blue-900 hover:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                     {slides[currentSlide].cta}
                  </Link>
                  <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">
                     협회 소개
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
