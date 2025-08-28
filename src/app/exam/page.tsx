'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { IMAGES } from '@/constants/images'

export default function ExamPage() {
   const quickLinks = [
      {
         title: '시험 일정',
         description: '월별 시험 일정을 확인하세요',
         href: '/exam/schedule',
         icon: '📅',
      },
      {
         title: '합격자 발표',
         description: '합격자 조회 및 합격증 다운로드',
         href: '/exam/results/search',
         icon: '🏆',
      },
      {
         title: '자격증 정보',
         description: '자격증 상세 정보 및 커리큘럼',
         href: '/business',
         icon: '📋',
      },
      {
         title: '문의하기',
         description: '시험 관련 문의사항',
         href: '/support/inquiry',
         icon: '💬',
      },
   ]

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.EXAM})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">자격 검정</h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">KHAMA 자격증 시험에 신청하고 생활가전 유지관리 전문가가 되세요</p>
               </div>
            </section>

            {/* 빠른 링크 */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">빠른 서비스</h2>
                     <p className="text-xl text-gray-600">자주 찾는 서비스를 빠르게 이용하세요</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {quickLinks.map((link, index) => (
                        <Card key={index} hover>
                           <div className="text-center">
                              <div className="text-4xl mb-4">{link.icon}</div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{link.title}</h3>
                              <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                              <Button href={link.href} size="sm" fullWidth>
                                 바로가기
                              </Button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>

            {/* 시험 안내 */}
            <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">시험 안내</h2>
                        <div className="space-y-6">
                           <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">시험 방법</h3>
                              <p className="text-gray-600">필기시험(객관식)과 실기시험(구술형)으로 구성되며, 각 과목당 60점 이상, 평균 60점 이상 득점 시 합격입니다.</p>
                           </div>
                           <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">응시 자격</h3>
                              <p className="text-gray-600">해당 자격증의 종합 교육을 이수한 자에 한하여 응시 가능합니다.</p>
                           </div>
                           <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">합격 발표</h3>
                              <p className="text-gray-600">시험 종료 후 7일 이내에 합격자를 발표하며, 홈페이지에서 수험번호로 조회 가능합니다.</p>
                           </div>
                        </div>
                     </div>

                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">시험 문의</h3>
                        <div className="space-y-4">
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
                                 <p className="font-medium text-gray-900">전화 문의</p>
                                 <p className="text-gray-600">1566-3321</p>
                                 <p className="text-sm text-gray-500">평일 09:00 - 18:00</p>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">이메일 문의</p>
                                 <p className="text-gray-600">haan@hanallcompany.com</p>
                              </div>
                           </div>
                        </div>
                        <div className="mt-6">
                           <Button href="/support/inquiry" fullWidth>
                              온라인 문의하기
                           </Button>
                        </div>
                     </Card>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
