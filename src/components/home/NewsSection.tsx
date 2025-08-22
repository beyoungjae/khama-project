'use client'

import Link from 'next/link'

export default function NewsSection() {
   const news = [
      {
         id: 1,
         category: '공지사항',
         title: '2024년 하반기 자격시험 일정 안내',
         excerpt: '가전제품분해청소관리사 등 4개 자격증 시험 일정이 확정되었습니다.',
         date: '2024.08.15',
         image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
         isNew: true,
      },
      {
         id: 2,
         category: '교육소식',
         title: '창업교육 프로그램 수강생 모집',
         excerpt: '생활가전 유지관리 분야 창업을 꿈꾸는 분들을 위한 특별 교육과정을 개설합니다.',
         date: '2024.08.10',
         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
         isNew: true,
      },
      {
         id: 3,
         category: '협회소식',
         title: 'KHAMA 협회 창립 5주년 기념행사',
         excerpt: '협회 창립 5주년을 맞아 기념행사 및 우수 회원 시상식을 개최합니다.',
         date: '2024.08.05',
         image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
         isNew: false,
      },
      {
         id: 4,
         category: '자격소식',
         title: '환기청정시스템관리사 신규 자격 등록',
         excerpt: '새로운 자격증 과정이 민간자격으로 정식 등록되어 시험 접수를 시작합니다.',
         date: '2024.07.28',
         image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=250&fit=crop',
         isNew: false,
      },
   ]

   return (
      <section className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* 뉴스 섹션 */}
               <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-3xl font-bold text-gray-900">최신 소식</h2>
                     <Link href="/board/notice" className="text-blue-900 hover:text-blue-700 font-medium flex items-center">
                        전체보기
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </Link>
                  </div>

                  <div className="space-y-6">
                     {news.map((item, index) => (
                        <article key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                           <div className="flex flex-col md:flex-row">
                              {/* 이미지 */}
                              <div className="md:w-1/3">
                                 <div className="h-48 md:h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                              </div>

                              {/* 콘텐츠 */}
                              <div className="md:w-2/3 p-6">
                                 <div className="flex items-center mb-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{item.category}</span>
                                    {item.isNew && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>}
                                    <span className="ml-auto text-gray-500 text-sm">{item.date}</span>
                                 </div>
                                 <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                                 <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.excerpt}</p>
                                 <Link href={`/board/notice/${item.id}`} className="text-blue-900 hover:text-blue-700 text-sm font-medium">
                                    자세히 보기 →
                                 </Link>
                              </div>
                           </div>
                        </article>
                     ))}
                  </div>
               </div>

               {/* 문의하기 */}
               <div className="lg:col-span-1">
                  <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 text-white">
                     <h3 className="text-xl font-bold mb-2">궁금한 점이 있으신가요?</h3>
                     <p className="text-blue-100 mb-4">전문 상담원이 친절하게 안내해드립니다.</p>
                     <div className="space-y-2 text-sm mb-4">
                        <p>📞 02-1234-5678</p>
                        <p>📧 info@khama.or.kr</p>
                        <p>🕐 평일 09:00 - 18:00</p>
                     </div>
                     <Link href="/support/contact" className="block w-full bg-white text-blue-900 text-center py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                        온라인 문의하기
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
