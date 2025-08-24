import Link from 'next/link'

export default function CertificationSection() {
   const certifications = [
      {
         title: '가전제품분해청소관리사',
         description: '가전제품의 전문적인 분해 청소 기술을 인증하는 자격증',
         features: ['분해 청소 기법', '안전 관리', '고객 서비스', '품질 보증'],
         icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
         )
      },
      {
         title: '환기청정시스템관리사',
         description: '실내 공기질 관리를 위한 환기 청정 시스템 전문 자격증',
         features: ['시스템 관리', '공기질 측정', '필터 교체', '유지보수'],
         icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
            </svg>
         )
      },
      {
         title: '생활가전관리사',
         description: '일반 생활가전의 종합적인 관리와 유지보수 전문 자격증',
         features: ['종합 관리', '고장 진단', '예방 보수', '사용자 교육'],
         icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
         )
      }
   ]

   return (
      <section className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
         {/* 배경 장식 */}
         <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 헤더 */}
            <div className="text-center mb-20">
               <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-semibold">
                     Professional Certification
                  </span>
               </div>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  전문 자격증 과정
               </h2>
               <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  체계적인 교육과 실무 중심의 커리큘럼으로<br />
                  생활가전 유지관리 전문가가 되세요
               </p>
            </div>

            {/* 자격증 카드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
               {certifications.map((cert, index) => (
                  <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:transform hover:scale-105">
                     {/* 카드 헤더 */}
                     <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                           {cert.icon}
                        </div>
                        <h3 className="text-xl font-bold">{cert.title}</h3>
                     </div>
                     
                     {/* 카드 콘텐츠 */}
                     <div className="p-8">
                        <p className="text-gray-600 leading-relaxed mb-6">
                           {cert.description}
                        </p>
                        
                        {/* 특징 목록 */}
                        <div className="space-y-3 mb-6">
                           {cert.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center">
                                 <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                                 <span className="text-gray-700 font-medium">{feature}</span>
                              </div>
                           ))}
                        </div>
                        
                        {/* CTA 버튼 */}
                        <Link href="/business" className="block w-full bg-gray-50 hover:bg-blue-50 text-blue-800 font-semibold py-3 text-center rounded-lg transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                           자세히 보기
                        </Link>
                     </div>
                  </div>
               ))}
            </div>

            {/* 하단 CTA */}
            <div className="text-center">
               <div className="mb-6">
                  <p className="text-lg text-gray-600 mb-4">
                     지금 시작하여 전문가의 길을 걸어보세요
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/business" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                     자격증 과정 보기
                     <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                     </svg>
                  </Link>
                  <Link href="/exam" className="inline-flex items-center bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
                     시험 일정 확인
                  </Link>
               </div>
            </div>
         </div>
      </section>
   )
}
