import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { IMAGES } from '@/constants/images'

export default function SupportPage() {
   const supportServices = [
      {
         id: 'contact',
         title: '문의하기',
         description: '1:1 맞춤 상담을 통해 궁금한 사항을 해결하세요',
         icon: (
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
               />
            </svg>
         ),
         features: ['실시간 상담', '빠른 답변', '전문가 지원'],
         link: '/support/contact',
      },
      {
         id: 'resources',
         title: '자료실',
         description: '시험 자료, 교육 자료, 각종 양식을 다운로드하세요',
         icon: (
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
         ),
         features: ['시험 자료', '교육 자료', '신청 양식'],
         link: '/support/resources',
      },
      {
         id: 'qna',
         title: 'Q&A',
         description: '자주 묻는 질문과 답변을 확인하고 새로운 질문을 등록하세요',
         icon: (
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         ),
         features: ['FAQ 검색', '질문 등록', '전문가 답변'],
         link: '/board/qna',
      },
      {
         id: 'notice',
         title: '공지사항',
         description: '협회의 최신 소식과 중요한 공지사항을 확인하세요',
         icon: (
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
         ),
         features: ['시험 공지', '교육 안내', '협회 소식'],
         link: '/board/notice',
      },
   ]

   const contactInfo = {
      phone: '1566-3321',
      email: 'haan@hanallcompany.com',
      address: '인천광역시 서구 청라한내로72번길 13 (청라동) 203호',
      hours: {
         weekday: '09:00 - 18:00',
         lunch: '12:00 - 13:00',
         weekend: '휴무',
      },
   }

   const quickLinks = [
      { title: '시험 신청', link: '/exam/apply', color: 'bg-blue-600 hover:bg-blue-700' },
      { title: '합격자 조회', link: '/exam/results', color: 'bg-emerald-600 hover:bg-emerald-700' },
      { title: '교육 프로그램', link: '/business/education', color: 'bg-orange-600 hover:bg-orange-700' },
      { title: '마이페이지', link: '/mypage', color: 'bg-purple-600 hover:bg-purple-700' },
   ]

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-16 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.SUPPORT})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">고객 지원</h1>
                  <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                     KHAMA는 회원 여러분의 성공을 위해 다양한 지원 서비스를 제공합니다.
                     <br />
                     언제든지 편리하게 이용하세요.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button variant="secondary" size="lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                           />
                        </svg>
                        바로 문의하기
                     </Button>
                     <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-900">
                        자료실 바로가기
                     </Button>
                  </div>
               </div>
            </section>

            {/* 지원 서비스 */}
            <section className="py-16 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">지원 서비스</h2>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">필요한 도움을 빠르게 찾을 수 있도록 다양한 지원 채널을 제공합니다.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {supportServices.map((service) => (
                        <Card key={service.id} className="text-center h-full">
                           <div className="flex flex-col h-full">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">{service.icon}</div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                              <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                              <div className="mb-6">
                                 <ul className="space-y-1">
                                    {service.features.map((feature, index) => (
                                       <li key={index} className="text-sm text-gray-500 flex items-center justify-center">
                                          <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          {feature}
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              <Button href={service.link} className="mt-auto">
                                 바로가기
                              </Button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>

            {/* 연락처 정보 */}
            <section className="py-16">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">연락처 정보</h2>
                     <p className="text-lg text-gray-600">전화, 이메일, 방문 상담 등 다양한 방법으로 문의하실 수 있습니다.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">연락처</h3>
                        <div className="space-y-4">
                           <div className="flex items-center">
                              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                 />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">전화번호</p>
                                 <p className="text-gray-600">{contactInfo.phone}</p>
                              </div>
                           </div>

                           <div className="flex items-center">
                              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">이메일</p>
                                 <p className="text-gray-600">{contactInfo.email}</p>
                              </div>
                           </div>

                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">주소</p>
                                 <p className="text-gray-600">{contactInfo.address}</p>
                              </div>
                           </div>
                        </div>
                     </Card>

                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">운영시간</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between">
                              <span className="font-medium text-gray-900">평일</span>
                              <span className="text-gray-600">{contactInfo.hours.weekday}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="font-medium text-gray-900">점심시간</span>
                              <span className="text-gray-600">{contactInfo.hours.lunch}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="font-medium text-gray-900">주말/공휴일</span>
                              <span className="text-gray-600">{contactInfo.hours.weekend}</span>
                           </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                           <p className="text-sm text-blue-800">
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              긴급한 문의사항은 온라인 문의 폼을 이용해주세요.
                           </p>
                        </div>
                     </Card>
                  </div>
               </div>
            </section>

            {/* 빠른 링크 */}
            <section className="py-16 bg-gray-50">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">빠른 서비스</h2>
                  <p className="text-lg text-gray-600 mb-8">자주 이용하는 서비스에 빠르게 접근하세요.</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {quickLinks.map((link, index) => (
                        <Link key={index} href={link.link} className={`p-4 rounded-lg text-white font-medium transition-colors ${link.color}`}>
                           {link.title}
                        </Link>
                     ))}
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
