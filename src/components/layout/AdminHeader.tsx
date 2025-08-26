'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/hooks/useAdmin'

export default function AdminHeader() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   const pathname = usePathname()
   const router = useRouter()
   const { user, signOut } = useAuth()
   const { profile } = useAdmin()

   // 관리자 메뉴 구조
   const adminMenuItems = [
      { name: '대시보드', href: '/admin' },
      { name: '자격증 관리', href: '/admin/certifications' },
      { name: '시험 일정 관리', href: '/admin/exams' },
      { name: '시험 신청 관리', href: '/admin/exam-applications' },
      { name: '게시판 관리', href: '/admin/posts' },
      { name: '갤러리 관리', href: '/admin/galleries' },
      { name: '사용자 관리', href: '/admin/users' },
      { name: '사이트 설정', href: '/admin/settings' },
   ]

   // 로그아웃 처리
   const handleSignOut = async () => {
      try {
         await signOut()
         router.push('/admin/login')
      } catch (error) {
         console.error('로그아웃 실패:', error)
         router.push('/admin/login')
      }
   }

   // 홈페이지로 이동
   const handleGoToHome = () => {
      window.location.href = '/'
   }

   // 현재 경로와 메뉴 매칭 확인
   const isActiveMenu = (menuPath: string) => {
      if (menuPath === '/admin') {
         return pathname === '/admin'
      }
      return pathname.startsWith(menuPath)
   }

   return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               {/* 데스크톱 네비게이션 */}
               <nav className="hidden md:flex items-center space-x-1">
                  {adminMenuItems.map((item) => (
                     <Link
                        key={item.name}
                        href={item.href}
                        className={`
                           flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                           ${isActiveMenu(item.href) ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                        `}
                     >
                        <span>{item.name}</span>
                     </Link>
                  ))}
               </nav>

               {/* 우측 사용자 정보 및 액션 */}
               <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                     <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                     </div>
                     <span className="font-medium">{profile?.name || user?.email}</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button onClick={handleGoToHome} className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                     </svg>
                     <span>사이트로</span>
                  </button>
                  <button onClick={handleSignOut} className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                     </svg>
                     <span>로그아웃</span>
                  </button>
               </div>

               {/* 모바일 햄버거 버튼 */}
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md" aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={isMobileMenuOpen}>
                  {isMobileMenuOpen ? (
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  ) : (
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                     </svg>
                  )}
               </button>
            </div>

            {/* 모바일 메뉴 */}
            {isMobileMenuOpen && (
               <div className="md:hidden py-4 border-t border-gray-200 absolute top-full left-0 right-0 bg-white shadow-lg z-50" style={{ maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
                  <div className="space-y-2 pb-4">
                     {adminMenuItems.map((item) => (
                        <Link
                           key={item.name}
                           href={item.href}
                           className={`
                              flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200
                              ${isActiveMenu(item.href) ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                           `}
                           onClick={() => setIsMobileMenuOpen(false)}
                        >
                           <span>{item.name}</span>
                        </Link>
                     ))}

                     <div className="border-t border-gray-200 pt-4 mt-4 px-4">
                        <div className="px-3 py-2 text-sm text-gray-700 font-medium bg-gray-50 rounded-md mb-3">{profile?.name || user?.email}</div>
                        <button
                           onClick={() => {
                              handleGoToHome()
                              setIsMobileMenuOpen(false)
                           }}
                           className="flex items-center space-x-3 w-full px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                           </svg>
                           <span>사이트로 이동</span>
                        </button>
                        <button
                           onClick={() => {
                              handleSignOut()
                              setIsMobileMenuOpen(false)
                           }}
                           className="flex items-center space-x-3 w-full px-4 py-3 bg-red-600 text-white rounded-md text-base font-medium hover:bg-red-700 transition-colors duration-200 mt-2"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                           </svg>
                           <span>로그아웃</span>
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </header>
   )
}
