import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import { IMAGES } from '@/constants/images'

export default function SitemapPage() {
   const siteStructure = [
      {
         title: '홈',
         path: '/',
         children: [],
      },
      {
         title: '협회 소개',
         path: '/about',
         children: [],
      },
      {
         title: '주요 사업',
         path: '/business',
         children: [{ title: '교육 프로그램', path: '/business/education' }],
      },
      {
         title: '자격 검정',
         path: '/exam',
         children: [
            { title: '시험 신청', path: '/exam/apply' },
            { title: '시험 일정', path: '/exam/schedule' },
            { title: '합격자 발표', path: '/exam/results/search' },
         ],
      },
      {
         title: '온라인 서비스',
         path: '/services',
         children: [
            { title: '마이페이지', path: '/mypage' },
            { title: '공지사항', path: '/board/notice' },
            { title: 'Q&A', path: '/board/qna' },
         ],
      },
      {
         title: '고객 지원',
         path: '/support',
         children: [
            { title: '문의하기', path: '/support/inquiry' },
            { title: '자료실', path: '/support/resources' },
         ],
      },
      {
         title: '회원 서비스',
         path: '',
         children: [
            { title: '로그인', path: '/login' },
            { title: '회원가입', path: '/signup' },
            { title: '비밀번호 찾기', path: '/forgot-password' },
         ],
      },
      {
         title: '약관 및 정책',
         path: '',
         children: [
            { title: '이용약관', path: '/terms' },
            { title: '개인정보 처리방침', path: '/privacy' },
         ],
      },
   ]

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-12 bg-gradient-to-r from-gray-900 to-gray-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.SITEMAP})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">사이트맵</h1>
                  <p className="text-lg text-gray-100">KHAMA 웹사이트의 전체 구조를 한눈에 확인하세요</p>
               </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {siteStructure.map((section, index) => (
                     <Card key={index}>
                        <div className="mb-4">
                           {section.path ? (
                              <Link href={section.path} className="text-xl font-bold text-blue-600 hover:text-blue-800">
                                 {section.title}
                              </Link>
                           ) : (
                              <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                           )}
                        </div>

                        {section.children.length > 0 && (
                           <ul className="space-y-2">
                              {section.children.map((child, childIndex) => (
                                 <li key={childIndex}>
                                    <Link href={child.path} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                       </svg>
                                       {child.title}
                                    </Link>
                                 </li>
                              ))}
                           </ul>
                        )}
                     </Card>
                  ))}
               </div>

               {/* 추가 정보 */}
               <Card className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">웹사이트 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                     <div>
                        <h4 className="font-semibold text-gray-900 mb-2">연락처</h4>
                        <p>전화: 1566-3321</p>
                        <p>이메일: haan@hanallcompany.com</p>
                        <p>주소: 인천광역시 서구 청라한내로72번길 13 (청라동) 203호</p>
                     </div>
                     <div>
                        <h4 className="font-semibold text-gray-900 mb-2">운영시간</h4>
                        <p>평일: 09:00 - 18:00</p>
                        <p>점심시간: 12:00 - 13:00</p>
                        <p>주말 및 공휴일: 휴무</p>
                     </div>
                  </div>
               </Card>

               {/* 빠른 링크 */}
               <div className="mt-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 이동</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                     <Link href="/exam/apply" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        시험 신청
                     </Link>
                     <Link href="/board/notice" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        공지사항
                     </Link>
                     <Link href="/support/inquiry" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        문의하기
                     </Link>
                     <Link href="/mypage" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        마이페이지
                     </Link>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
