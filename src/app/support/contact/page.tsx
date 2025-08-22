import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ContactPage() {
   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">문의하기</h1>
                  <p className="text-lg text-blue-100">궁금한 사항이나 도움이 필요하시면 언제든지 문의해주세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* 문의 폼 */}
                  <div>
                     <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">1:1 문의</h2>
                        <form className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    이름 *
                                 </label>
                                 <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="이름을 입력해주세요" />
                              </div>
                              <div>
                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    연락처 *
                                 </label>
                                 <input type="tel" id="phone" name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="010-0000-0000" />
                              </div>
                           </div>

                           <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                 이메일 *
                              </label>
                              <input type="email" id="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="example@email.com" />
                           </div>

                           <div>
                              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                 문의 유형 *
                              </label>
                              <select id="category" name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                 <option value="">문의 유형을 선택해주세요</option>
                                 <option value="exam">시험 관련 문의</option>
                                 <option value="education">교육 관련 문의</option>
                                 <option value="certificate">자격증 관련 문의</option>
                                 <option value="payment">결제 관련 문의</option>
                                 <option value="technical">기술적 문제</option>
                                 <option value="other">기타 문의</option>
                              </select>
                           </div>

                           <div>
                              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                 제목 *
                              </label>
                              <input type="text" id="subject" name="subject" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="문의 제목을 입력해주세요" />
                           </div>

                           <div>
                              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                 문의 내용 *
                              </label>
                              <textarea id="message" name="message" rows={6} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="문의하실 내용을 자세히 작성해주세요" />
                           </div>

                           <div>
                              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                 첨부파일 (선택사항)
                              </label>
                              <input type="file" id="file" name="file" multiple className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                              <p className="text-xs text-gray-500 mt-1">최대 5MB, jpg, png, pdf, doc, docx 파일만 업로드 가능합니다.</p>
                           </div>

                           <div className="flex items-start">
                              <input type="checkbox" id="privacy" name="privacy" required className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
                                 개인정보 수집 및 이용에 동의합니다. *
                                 <a href="#" className="text-blue-600 hover:underline ml-1">
                                    (자세히 보기)
                                 </a>
                              </label>
                           </div>

                           <Button type="submit" size="lg" className="w-full">
                              문의하기
                           </Button>
                        </form>
                     </Card>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="space-y-8">
                     {/* 연락처 */}
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">연락처 정보</h3>
                        <div className="space-y-4">
                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">전화번호</p>
                                 <p className="text-gray-600">1566-3321</p>
                              </div>
                           </div>

                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">이메일</p>
                                 <p className="text-gray-600">haan@hanallcompany.com</p>
                              </div>
                           </div>

                           <div className="flex items-start">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                 <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">주소</p>
                                 <p className="text-gray-600">인천광역시 서구 청라한내로72번길 13</p>
                              </div>
                           </div>

                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">운영시간</p>
                                 <p className="text-gray-600">평일 09:00 - 18:00</p>
                                 <p className="text-gray-500 text-sm">(토요일, 일요일, 공휴일 휴무)</p>
                              </div>
                           </div>
                        </div>
                     </Card>

                     {/* 빠른 문의 */}
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">빠른 문의</h3>
                        <div className="space-y-3">
                           <Button href="tel:1566-3321" variant="outline" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                 />
                              </svg>
                              전화 문의 (1566-3321)
                           </Button>
                           <Button href="mailto:haan@hanallcompany.com" variant="outline" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              이메일 문의
                           </Button>
                           <Button href="/board/qna" variant="outline" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Q&A 게시판
                           </Button>
                        </div>
                     </Card>

                     {/* 자주 묻는 질문 */}
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문</h3>
                        <div className="space-y-4">
                           <details className="group">
                              <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                 <span className="font-medium text-gray-900">시험 일정은 언제 확인할 수 있나요?</span>
                                 <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                 </svg>
                              </summary>
                              <div className="mt-3 p-3 text-gray-600 text-sm">시험 일정은 홈페이지의 &apos;자격 검정 &gt; 시험 일정&apos; 메뉴에서 확인하실 수 있습니다. 분기별로 업데이트되며, 변경사항이 있을 경우 공지사항을 통해 안내드립니다.</div>
                           </details>

                           <details className="group">
                              <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                 <span className="font-medium text-gray-900">교육 과정은 어떻게 신청하나요?</span>
                                 <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                 </svg>
                              </summary>
                              <div className="mt-3 p-3 text-gray-600 text-sm">교육 과정 신청은 &apos;주요 사업 &gt; 교육 프로그램&apos; 메뉴에서 하실 수 있습니다. 온라인 신청 후 교육비 결제를 완료하시면 신청이 완료됩니다.</div>
                           </details>

                           <details className="group">
                              <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                 <span className="font-medium text-gray-900">자격증 재발급은 어떻게 하나요?</span>
                                 <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                 </svg>
                              </summary>
                              <div className="mt-3 p-3 text-gray-600 text-sm">자격증 재발급은 마이페이지에서 신청하실 수 있습니다. 재발급 수수료는 별도로 안내드리며, 신청 후 7-10일 내에 발급됩니다.</div>
                           </details>
                        </div>
                     </Card>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
