'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

   const navigation = [
      { name: '협회 소개', href: '/about' },
      {
         name: '주요 사업',
         href: '/business',
         dropdown: [
            { name: '자격증 과정', href: '/business' },
            { name: '교육 프로그램', href: '/business#education' },
         ],
      },
      {
         name: '자격 검정',
         href: '/exam',
         dropdown: [
            { name: '시험 신청', href: '/exam' },
            { name: '시험 일정', href: '/exam/schedule' },
            { name: '합격자 발표', href: '/exam/results' },
         ],
      },
      {
         name: '온라인 서비스',
         href: '/services',
         dropdown: [
            { name: '마이페이지', href: '/mypage' },
            { name: '공지사항', href: '/board/notice' },
            { name: 'Q&A', href: '/board/qna' },
         ],
      },
      {
         name: '고객 지원',
         href: '/support',
         dropdown: [
            { name: '문의하기', href: '/support/contact' },
            { name: '자료실', href: '/support/resources' },
         ],
      },
   ]

   return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               {/* 로고 */}
               <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                     <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <div className="hidden sm:block">
                     <div className="text-xl font-bold text-gray-900">KHAMA</div>
                     <div className="text-xs text-gray-600">한국생활가전유지관리협회</div>
                  </div>
               </Link>

               {/* 데스크톱 네비게이션 */}
               <nav className="hidden md:flex space-x-8">
                  {navigation.map((item) => (
                     <div key={item.name} className="relative" onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)} onMouseLeave={() => setActiveDropdown(null)}>
                        <Link href={item.href} className="flex items-center text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200">
                           {item.name}
                           {item.dropdown && (
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                           )}
                        </Link>

                        {/* 드롭다운 메뉴 */}
                        {item.dropdown && activeDropdown === item.name && (
                           <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {item.dropdown.map((dropdownItem) => (
                                 <Link key={dropdownItem.name} href={dropdownItem.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-900 transition-colors duration-200">
                                    {dropdownItem.name}
                                 </Link>
                              ))}
                           </div>
                        )}
                     </div>
                  ))}
               </nav>

               {/* 로그인 버튼 */}
               <div className="hidden md:flex items-center space-x-4">
                  <Link href="/login" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200">
                     로그인
                  </Link>
                  <Link href="/signup" className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200">
                     회원가입
                  </Link>
               </div>

               {/* 모바일 메뉴 버튼 */}
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-gray-100 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                  </svg>
               </button>
            </div>

            {/* 모바일 메뉴 */}
            {isMenuOpen && (
               <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                  <div className="flex flex-col space-y-2">
                     {navigation.map((item) => (
                        <div key={item.name}>
                           <Link href={item.href} className="flex items-center justify-between text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200" onClick={() => !item.dropdown && setIsMenuOpen(false)}>
                              {item.name}
                              {item.dropdown && (
                                 <button
                                    onClick={(e) => {
                                       e.preventDefault()
                                       setActiveDropdown(activeDropdown === item.name ? null : item.name)
                                    }}
                                 >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                 </button>
                              )}
                           </Link>
                           {/* 모바일 드롭다운 */}
                           {item.dropdown && activeDropdown === item.name && (
                              <div className="pl-6 space-y-1">
                                 {item.dropdown.map((dropdownItem) => (
                                    <Link key={dropdownItem.name} href={dropdownItem.href} className="block text-gray-600 hover:text-blue-900 px-3 py-2 text-sm transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                       {dropdownItem.name}
                                    </Link>
                                 ))}
                              </div>
                           )}
                        </div>
                     ))}
                     <div className="border-t border-gray-100 pt-2 mt-2">
                        <Link href="/login" className="block text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                           로그인
                        </Link>
                        <Link href="/signup" className="block bg-blue-900 text-white px-3 py-2 mx-3 mt-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200 text-center" onClick={() => setIsMenuOpen(false)}>
                           회원가입
                        </Link>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </header>
   )
}
