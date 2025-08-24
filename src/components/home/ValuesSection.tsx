'use client'

import Link from 'next/link'

export default function ValuesSection() {
   const values = [
      {
         title: '전문 교육',
         subtitle: 'Professional Education',
         description: '체계적인 교육과정으로\n전문성을 키워나갑니다',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
         ),
         link: '/business/education',
         color: 'from-blue-500 to-blue-700'
      },
      {
         title: '자격 관리',
         subtitle: 'Certification Management',
         description: '투명하고 공정한\n자격 검정 시스템',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
         ),
         link: '/exam',
         color: 'from-emerald-500 to-emerald-700'
      },
      {
         title: '창업 지원',
         subtitle: 'Startup Support',
         description: '성공적인 창업을 위한\n체계적인 지원 체계',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
         ),
         link: '/business',
         color: 'from-purple-500 to-purple-700'
      },
      {
         title: '지속 성장',
         subtitle: 'Sustainable Growth',
         description: '업계 발전과 함께하는\n지속 가능한 성장',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
         ),
         link: '/about',
         color: 'from-orange-500 to-orange-700'
      }
   ]

   return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 overflow-hidden">
         {/* 배경 패턴 */}
         <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
            <div className="absolute inset-0" style={{
               backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
               backgroundSize: '50px 50px'
            }} />
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* 헤더 */}
            <div className="mb-16">
               <div className="mb-6">
                  <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium border border-white/20">
                     Professional Value Creator
                  </span>
               </div>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  KHAMA와 함께하는 성장
               </h2>
               <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  가전제품 유지관리 전문 분야에서 선도하는<br />
                  체계적이고 전문적인 서비스를 경험하세요
               </p>
            </div>

            {/* 값들 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
               {values.map((value, index) => (
                  <Link key={index} href={value.link} className="group">
                     <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105 hover:bg-white/10">
                        {/* 아이콘 */}
                        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                           {value.icon}
                        </div>
                        
                        {/* 컨텐츠 */}
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                           {value.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 font-medium">
                           {value.subtitle}
                        </p>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                           {value.description}
                        </p>

                        {/* 호버 효과 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     </div>
                  </Link>
               ))}
            </div>

            {/* 하단 CTA */}
            <div className="text-center">
               <Link href="/about" className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  더 자세히 알아보기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
               </Link>
            </div>

            {/* 스크롤 다운 인디케이터 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
               <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
               </svg>
            </div>
         </div>
      </section>
   )
}