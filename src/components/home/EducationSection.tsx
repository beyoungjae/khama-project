import Link from 'next/link'

export default function EducationSection() {
   const educationPrograms = [
      {
         title: '창업교육',
         subtitle: 'Startup Education',
         description: '예비 창업자를 위한\n체계적 교육 과정',
         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
         features: ['비즈니스 모델 설정', '시장 분석', '자금 조달', '마케팅 전략'],
         duration: '4주',
         level: '초급',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
         ),
         color: 'from-blue-500 to-blue-700',
      },
      {
         title: '전문가교육',
         subtitle: 'Professional Education',
         description: '현업 종사자를 위한\n역량 강화 과정',
         image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
         features: ['고급 기술 습득', '품질 관리', '고객 서비스', '비즈니스 확장'],
         duration: '6주',
         level: '중급',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
         ),
         color: 'from-emerald-500 to-emerald-700',
      },
      {
         title: '신아이템교육',
         subtitle: 'New Technology Education',
         description: '최신 트렌드를 반영한\n혁신 기술 과정',
         image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
         features: ['IoT 기술', 'AI 진단', '스마트 홈', '친환경 기술'],
         duration: '8주',
         level: '고급',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
         ),
         color: 'from-orange-500 to-orange-700',
      },
   ]

   return (
      <section className="relative py-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-gray-50 overflow-hidden">
         {/* 배경 장식 */}
         <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-600 rounded-full filter blur-3xl transform translate-x-1/2" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl transform -translate-x-1/2" />
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 헤더 */}
            <div className="text-center mb-20">
               <div className="mb-6">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-sm px-4 py-2 rounded-full font-semibold">
                     Education Programs
                  </span>
               </div>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  교육 프로그램
               </h2>
               <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  창업부터 전문가 양성까지<br />
                  단계별 맞춤 교육 커리큘럼을 제공합니다
               </p>
            </div>

            {/* 교육 프로그램 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
               {educationPrograms.map((program, index) => (
                  <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200 hover:transform hover:scale-105">
                     {/* 이미지 헤더 */}
                     <div className="relative h-56 overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${program.image})` }} />
                        <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                        
                        {/* 아이콘과 제목 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                           <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                              {program.icon}
                           </div>
                           <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                           <p className="text-emerald-100 font-medium">{program.subtitle}</p>
                        </div>
                        
                        {/* 배지 */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                           <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                              {program.duration}
                           </span>
                           <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                              {program.level}
                           </span>
                        </div>
                     </div>
                     
                     {/* 카드 콘텐츠 */}
                     <div className="p-8">
                        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                           {program.description}
                        </p>
                        
                        {/* 특징 목록 */}
                        <div className="space-y-3 mb-6">
                           {program.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center">
                                 <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3" />
                                 <span className="text-gray-700 font-medium">{feature}</span>
                              </div>
                           ))}
                        </div>
                        
                        {/* CTA 버튼 */}
                        <Link href="/business/education" className="block w-full bg-gray-50 hover:bg-emerald-50 text-emerald-800 font-semibold py-3 text-center rounded-lg transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                           신청하기
                        </Link>
                     </div>
                  </div>
               ))}
            </div>

            {/* 하단 CTA */}
            <div className="text-center">
               <div className="mb-6">
                  <p className="text-lg text-gray-600 mb-4">
                     당신에게 맞는 교육 과정을 찾아보세요
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/business" className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                     전체 프로그램 보기
                     <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                     </svg>
                  </Link>
                  <Link href="/support/contact" className="inline-flex items-center bg-transparent border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
                     상담 문의
                  </Link>
               </div>
            </div>
         </div>
      </section>
   )
}
