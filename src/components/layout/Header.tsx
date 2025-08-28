'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IMAGES } from '@/constants/images'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { useAuth } from '@/contexts/AuthContext'
import { useSafeAdminCheck } from '@/hooks/useSafeAdminCheck'

export default function Header() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
   const pathname = usePathname()
   const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
   const { user, signOut } = useAuth()
   const { isAdmin } = useSafeAdminCheck()

   // 메뉴 데이터 구조화 (IA에 맞게)
   const menuItems = [
      {
         name: '홈',
         path: '/',
         subItems: [],
      },
      {
         name: '협회 소개',
         path: '/about',
         subItems: [
            { name: '협회 개요', path: '/about' },
            { name: '갤러리', path: '/about/gallery' },
         ],
      },
      {
         name: '주요 사업',
         path: '/business',
         subItems: [
            { name: '자격증', path: '/business' },
            { name: '교육 프로그램', path: '/business/education' },
         ],
      },
      {
         name: '자격 검정',
         path: '/exam',
         subItems: [
            { name: '자격시험 신청', path: '/exam/apply' },
            { name: '시험 일정', path: '/exam/schedule' },
            { name: '합격자 조회', path: '/exam/results/search' },
         ],
      },
      {
         name: '공지사항',
         path: '/board/notice',
         subItems: [],
      },
      {
         name: '고객 지원',
         path: '/support',
         subItems: [
            { name: '마이페이지', path: '/mypage' },
            { name: '1:1 문의', path: '/support/inquiry' },
            { name: '자료실', path: '/support/resources' },
         ],
      },
   ]

   // 홈페이지로 이동할 때 강제 새로고침
   const handleHomeNavigation = (e: React.MouseEvent, path: string) => {
      if (path === '/') {
         e.preventDefault()
         window.location.href = '/'
      }
   }

   // 로그아웃 처리
   const handleSignOut = async () => {
      await signOut()
      window.location.href = '/'
   }

   // 메가 메뉴 열기 핸들러
   const handleMouseEnterMegaMenu = () => {
      if (window.innerWidth > 768) {
         if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current)
         }
         setIsMegaMenuOpen(true)
      }
   }

   // 메가 메뉴 닫기 핸들러 (지연 적용)
   const handleMouseLeaveMegaMenu = () => {
      if (window.innerWidth > 768) {
         leaveTimeoutRef.current = setTimeout(() => {
            setIsMegaMenuOpen(false)
         }, 200)
      }
   }

   return (
      <div className="relative">
         <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  {/* 로고 */}
                  <Link href="/" className="flex items-center flex-shrink-0" onClick={(e) => handleHomeNavigation(e, '/')}>
                     {/* 실제 로고 이미지 (599x106 비율에 맞게 조정) */}
                     <div className="h-10 flex items-center">
                        <OptimizedImage
                           src={IMAGES.LOGO.MAIN}
                           alt="KHAMA 로고"
                           width={168}
                           height={30}
                           fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='168' height='30' viewBox='0 0 168 30'%3E%3Crect width='168' height='30' fill='%23003366'/%3E%3Ctext x='84' y='20' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='16' font-weight='bold'%3EKHAMA%3C/text%3E%3C/svg%3E"
                           className="h-8 w-auto object-contain"
                           priority
                        />
                     </div>
                     {/* 데스크톱에서 추가 텍스트 정보 */}
                     {/* <div className="hidden lg:block ml-3">
                        <div className="text-xs text-gray-600">한국생활가전유지관리협회</div>
                     </div> */}
                  </Link>

                  {/* 데스크톱 네비게이션 */}
                  <nav className="hidden md:flex items-center gap-4 mx-auto whitespace-nowrap" onMouseEnter={handleMouseEnterMegaMenu} onMouseLeave={handleMouseLeaveMegaMenu}>
                     {menuItems.map((item) => (
                        <div key={item.name} className="relative px-2">
                           <Link
                              href={item.path}
                              className={`
                                 block px-4 py-2 text-sm font-medium transition-colors duration-200 text-center
                                 ${pathname === item.path ? 'text-blue-900 font-bold' : 'text-gray-700 hover:text-blue-900'}
                              `}
                              onClick={(e) => handleHomeNavigation(e, item.path)}
                           >
                              {item.name}
                           </Link>
                        </div>
                     ))}
                  </nav>

                  {/* 로그인/로그아웃 버튼 */}
                  <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                     {user ? (
                        <>
                           <Link href="/mypage" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200">
                              마이페이지
                           </Link>
                           <button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200">
                              로그아웃
                           </button>
                        </>
                     ) : (
                        <>
                           <Link href="/login" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200">
                              로그인
                           </Link>
                           <Link href="/signup" className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200">
                              회원가입
                           </Link>
                        </>
                     )}
                  </div>

                  {/* 모바일 햄버거 버튼 */}
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-2xl text-blue-900 z-50">
                     {isMobileMenuOpen ? '✖' : '☰'}
                  </button>
               </div>

               {/* 모바일 메뉴 (헤더 내부) */}
               {isMobileMenuOpen && (
                  <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                     <div className="flex flex-col space-y-2">
                        {menuItems.map((item) => (
                           <div key={item.name}>
                              <Link
                                 href={item.path}
                                 className="flex items-center justify-between text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                                 onClick={(e) => {
                                    handleHomeNavigation(e, item.path)
                                    if (!item.subItems.length) setIsMobileMenuOpen(false)
                                 }}
                              >
                                 {item.name}
                                 {item.subItems.length > 0 && (
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
                              {item.subItems.length > 0 && activeDropdown === item.name && (
                                 <div className="pl-6 space-y-1">
                                    {item.subItems.map((subItem) => (
                                       <Link key={subItem.name} href={subItem.path} className="block text-gray-600 hover:text-blue-900 px-3 py-2 text-sm transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                                          {subItem.name}
                                       </Link>
                                    ))}
                                 </div>
                              )}
                           </div>
                        ))}
                        <div className="border-t border-gray-100 pt-2 mt-2">
                           {user ? (
                              <>
                                 <Link href="/mypage" className="block text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                                    마이페이지
                                 </Link>
                                 <button
                                    onClick={() => {
                                       handleSignOut()
                                       setIsMobileMenuOpen(false)
                                    }}
                                    className="block w-full text-left bg-red-600 text-white px-3 py-2 mx-3 mt-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                                 >
                                    로그아웃
                                 </button>
                              </>
                           ) : (
                              <>
                                 <Link href="/login" className="block text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                                    로그인
                                 </Link>
                                 <Link href="/signup" className="block bg-blue-900 text-white px-3 py-2 mx-3 mt-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200 text-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    회원가입
                                 </Link>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {isMegaMenuOpen && (
               <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200 z-40 py-8 animate-fade-in" onMouseEnter={handleMouseEnterMegaMenu} onMouseLeave={handleMouseLeaveMegaMenu}>
                  {/* 헤더와 같은 컨테이너 폭을 그대로 사용 */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     {/* 이중 센터링 제거: max-w-6xl mx-auto 삭제 */}
                     <div className="grid grid-cols-4 gap-4">
                        {menuItems
                           .filter((item) => item.subItems && item.subItems.length > 0)
                           .map((item) => (
                              <div key={item.name} className="space-y-4">
                                 <h4 className="text-sm font-bold text-blue-900 mb-4 pb-2 border-b border-gray-200">{item.name}</h4>
                                 <ul className="space-y-2">
                                    {item.subItems.map((subItem) => (
                                       <li key={subItem.name}>
                                          <Link href={subItem.path} className="block py-1 text-sm text-gray-600 hover:text-blue-900 transition-colors duration-200">
                                             {subItem.name}
                                          </Link>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           ))}
                     </div>
                  </div>
               </div>
            )}
         </header>
      </div>
   )
}
