'use client'

import Link from 'next/link'

export default function NewsSection() {
   const news = [
      {
         id: 1,
         category: '공지사항',
         title: '2025년 하반기 자격시험 일정 안내',
         excerpt: '가전제품분해청소관리사 등 4개 자격증 시험 일정이 확정되었습니다. 신청 마감일에 맞춰 준비해주세요.',
         date: '2025.08.15',
         image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop',
         isNew: true,
         readTime: '3분',
         author: 'KHAMA 사무국',
      },
      {
         id: 2,
         category: '교육소식',
         title: '창업교육 프로그램 수강생 모집',
         excerpt: '생활가전 유지관리 분야 창업을 꿈꾸는 분들을 위한 특별 교육과정을 개설합니다. 실무 중심의 커리큘럼으로 준비했습니다.',
         date: '2025.08.10',
         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop',
         isNew: true,
         readTime: '5분',
         author: '교육사업부',
      },
      {
         id: 3,
         category: '협회소식',
         title: 'KHAMA 협회 창립 5주년 기념행사',
         excerpt: '협회 창립 5주년을 맞아 기념행사 및 우수 회원 시상식을 개최합니다. 많은 참여와 관심 부탁드립니다.',
         date: '2025.08.05',
         image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=300&fit=crop',
         isNew: false,
         readTime: '4분',
         author: '홍보팀',
      },
      {
         id: 4,
         category: '자격소식',
         title: '환기청정시스템관리사 신규 자격 등록',
         excerpt: '새로운 자격증 과정이 민간자격으로 정식 등록되어 시험 접수를 시작합니다. 환기 청정 전문가로 성장하세요.',
         date: '2025.07.28',
         image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=300&fit=crop',
         isNew: false,
         readTime: '3분',
         author: '자격관리팀',
      },
   ]

   return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* 뉴스 섹션 */}
               <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <div className="mb-4">
                           <span className="inline-block bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-semibold">
                              Latest News
                           </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">최신 소식</h2>
                     </div>
                     <Link href="/board/notice" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center transition-colors duration-200">
                        전체보기
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </Link>
                  </div>

                  <div className="space-y-8">
                     {news.map((item, index) => (
                        <article key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:transform hover:scale-[1.02]" style={{ animationDelay: `${index * 0.1}s` }}>
                           <div className="flex flex-col md:flex-row">
                              {/* 이미지 */}
                              <div className="md:w-1/3">
                                 <div className="relative h-64 md:h-full overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${item.image})` }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    
                                    {/* 배지 */}
                                    <div className="absolute top-4 left-4 flex space-x-2">
                                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          item.category === '공지사항' ? 'bg-blue-500 text-white' :
                                          item.category === '교육소식' ? 'bg-emerald-500 text-white' :
                                          item.category === '협회소식' ? 'bg-purple-500 text-white' :
                                          'bg-orange-500 text-white'
                                       }`}>
                                          {item.category}
                                       </span>
                                       {item.isNew && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>}
                                    </div>
                                 </div>
                              </div>

                              {/* 콘텐츠 */}
                              <div className="md:w-2/3 p-8">
                                 <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-500 text-sm font-medium">{item.date}</span>
                                    <div className="flex items-center text-gray-400 text-sm space-x-4">
                                       <span className="flex items-center">
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          {item.readTime}
                                       </span>
                                       <span className="flex items-center">
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                          </svg>
                                          {item.author}
                                       </span>
                                    </div>
                                 </div>
                                 
                                 <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.title}
                                 </h3>
                                 
                                 <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                                    {item.excerpt}
                                 </p>
                                 
                                 <Link href={`/board/notice/${item.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                                    자세히 보기
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                 </Link>
                              </div>
                           </div>
                        </article>
                     ))}
                  </div>
               </div>

               {/* 문의하기 카드 */}
               <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
                     <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                           </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">궁금한 점이 있으신가요?</h3>
                        <p className="text-blue-100 mb-6">전문 상담원이 친절하게 안내해드립니다.</p>
                     </div>
                     
                     <div className="space-y-4 text-sm mb-8">
                        <div className="flex items-center">
                           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                           </div>
                           <span>1566-3321</span>
                        </div>
                        <div className="flex items-center">
                           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                           </div>
                           <span>haan@hanallcompany.com</span>
                        </div>
                        <div className="flex items-center">
                           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                           </div>
                           <span>평일 09:00 - 18:00</span>
                        </div>
                     </div>
                     
                     <Link href="/support/contact" className="block w-full bg-white text-blue-600 text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        온라인 문의하기
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
