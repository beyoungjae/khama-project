import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Map from '@/components/ui/Map'
import { IMAGES } from '@/constants/images'

export default function AboutPage() {
   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.ABOUT})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">협회 소개</h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">생활가전 유지관리 분야의 표준화와 전문가 양성을 위해 설립된 KHAMA를 소개합니다</p>
               </div>
            </section>

            {/* 인사말 */}
            <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                     <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">협회장 인사말</h2>
                        <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
                           <p>존경하는 회원 여러분, 그리고 우리 협회를 찾아주신 모든 분들께 감사의 인사를 드립니다.</p>
                           <p>
                              우리의 삶에 있어 냉난방기, 세탁기, 에어컨 등 각종 생활가전은 쾌적한 실내환경과 생활의 편리함을 제공하는 필수 요소가 되었습니다. 생활수준의 향상과 더불어 가전제품의 보급률은 지속적으로 증가하고 있으며, 이에 따라 가전제품의 안전한 유지관리와 위생 관리의 중요성 또한 날로
                              커지고 있습니다.
                           </p>
                           <p>그러나 여전히 많은 가정과 사업장에서 가전제품의 위생·에너지 효율 관리 수준은 낮은 상황입니다. 잘못된 관리로 인한 전기요금 상승, 위생 문제, 심지어 화재 위험까지 발생할 수 있기에 올바른 유지보수는 선택이 아닌 필수입니다.</p>
                           <p>
                              이에 한국가전유지관리협회는 산업통상자원부에 정식으로 등록된 민간자격증 발급기관으로서, 가전제품 유지보수 전문인력 양성을 위해 다양한 교육 프로그램을 운영하고 있습니다. 협회 산하 한올평생교육원에서는 실무 중심의 커리큘럼을 제공하며, 교육 이수 후에는 협회 인증 자격증을
                              취득할 수 있습니다.
                           </p>
                           <p>
                              또한 협회는 단순히 교육에 그치지 않고, 회원사 및 인증 전문가가 지속적인 역량 개발을 이어갈 수 있도록 매년 정기적인 재교육과 기술세미나를 개최하고 있습니다. 이를 통해 우리 협회는 ▲에너지 낭비 방지 ▲화재 예방 ▲생활환경 위생 향상에 앞장서고 있으며, 나아가 국민의 건강과
                              안전에 기여하고자 합니다.
                           </p>
                           <p>앞으로도 한국가전유지관리협회는 가전산업 현장에서 꼭 필요한 전문 인력 양성의 허브가 되고, 협회 회원사가 안정적인 사업을 영위할 수 있도록 적극적인 지원을 이어가겠습니다.</p>
                           <p>여러분의 지속적인 관심과 성원을 부탁드리며, 협회의 문은 언제나 열려 있습니다. 함께 성장하며, 우리 사회에 꼭 필요한 전문 인력으로 자리매김할 수 있도록 최선을 다하겠습니다.</p>
                           <p>감사합니다.</p>
                           <div className="mt-6">
                              <p className="font-semibold text-gray-900">사단법인 한국가전유지관리협회장</p>
                              <p className="text-blue-900 font-bold text-xl">김윤채</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div className="h-200 bg-cover bg-center rounded-xl shadow-lg" style={{ backgroundImage: `url(${IMAGES.EXECUTIVES.PRESIDENT})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
                     </div>
                  </div>
               </div>
            </section>

            {/* 협회 개요 */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">협회 개요</h2>
                     <p className="text-xl text-gray-600">KHAMA가 추구하는 가치와 목표입니다</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">표준화 확립</h3>
                        <p className="text-gray-600">생활가전 유지관리 분야의 표준화를 확립하고 업계 전반의 서비스 품질 향상을 도모합니다.</p>
                     </Card>

                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                           </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">전문가 양성</h3>
                        <p className="text-gray-600">체계적인 교육과 자격증 과정을 통해 전문가를 양성하고 창업을 지원합니다.</p>
                     </Card>

                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                           </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">네트워크 구축</h3>
                        <p className="text-gray-600">업계 네트워크를 구축하여 상호 성장 기회를 제공하고 정보를 공유합니다.</p>
                     </Card>
                  </div>
               </div>
            </section>

            {/* 오시는 길 */}
            <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">오시는 길</h2>
                     <p className="text-xl text-gray-600">KHAMA 협회 사무실 위치 및 연락처 정보입니다</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">연락처 정보</h3>
                        <div className="space-y-4">
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">주소</p>
                                 <p className="text-gray-600">인천광역시 서구 청라한내로72번길 13 (청라동) 203호</p>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                 />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">대표번호</p>
                                 <p className="text-gray-600">1566-3321</p>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">대표자명</p>
                                 <p className="text-gray-600">김윤채</p>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">사업자등록번호</p>
                                 <p className="text-gray-600">714-88-00785</p>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">이메일</p>
                                 <p className="text-gray-600">haan@hanallcompany.com</p>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">운영시간</p>
                                 <p className="text-gray-600">평일 09:00 - 18:00 (점심시간 12:00-13:00)</p>
                              </div>
                           </div>
                        </div>
                     </Card>

                     <Card padding="none">
                        <Map className="h-80" />
                     </Card>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
