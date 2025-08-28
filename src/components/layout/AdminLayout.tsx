'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'

interface AdminLayoutProps {
   children: ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
   const pathname = usePathname()
   const { logout } = useAdmin()

   const handleLogout = () => {
      logout()
   }
   // { name: '자격증 관리', href: '/admin/certifications' },
   const menuItems = [
      { href: '/admin', label: '대시보드', icon: '📊' },
      { href: '/admin/notices', label: '공지사항 관리', icon: '📢' },
      { href: '/admin/inquiries', label: '1:1 문의 관리', icon: '💬' },
      { href: '/admin/certifications', label: '자격증 관리', icon: '📜' },
      { href: '/admin/education', label: '교육 프로그램 관리', icon: '📚' },
      { href: '/admin/exams', label: '시험 일정 관리', icon: '🗓️' },
      { href: '/admin/exam-applications', label: '시험 신청 관리', icon: '📝' },
      { href: '/admin/members', label: '회원 관리', icon: '👥' },
      { href: '/admin/resources', label: '자료실 관리', icon: '📁' },
      { href: '/admin/gallery', label: '갤러리 관리', icon: '🖼️' },
   ]

   return (
      <div className="min-h-screen bg-gray-100">
         {/* 상단 네비게이션 */}
         <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between h-16">
                  <div className="flex items-center">
                     <Link href="/admin" className="text-xl font-bold text-gray-900">
                        KHAMA 관리자
                     </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                     <Link href="/" className="text-gray-600 hover:text-gray-900" target="_blank">
                        사이트 보기
                     </Link>
                     <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                        로그아웃
                     </button>
                  </div>
               </div>
            </div>
         </nav>

         <div className="flex">
            {/* 사이드바 */}
            <aside className="w-64 bg-white shadow-sm min-h-screen">
               <nav className="mt-8">
                  <div className="px-4">
                     <ul className="space-y-2">
                        {menuItems.map((item) => (
                           <li key={item.href}>
                              <Link href={item.href} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${pathname === item.href ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                 <span className="mr-3">{item.icon}</span>
                                 {item.label}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               </nav>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 p-8">{children}</main>
         </div>
      </div>
   )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
   return <AdminLayoutContent>{children}</AdminLayoutContent>
}
