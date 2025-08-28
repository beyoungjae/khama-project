'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminProvider } from '@/contexts/AdminContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// 쿠키에서 값 읽기 함수
function getCookie(name: string): string | null {
   if (typeof document === 'undefined') return null

   const value = `; ${document.cookie}`
   const parts = value.split(`; ${name}=`)
   if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
   }
   return null
}

// iron-session 기반 유효성 체크
async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/verify-token', { method: 'GET', cache: 'no-store' })
    if (!res.ok) return false
    const data = await res.json()
    return !!data.valid
  } catch {
    return false
  }
}

function AdminGuard({ children }: { children: React.ReactNode }) {
   const [isChecking, setIsChecking] = useState(true)
   const [hasValidToken, setHasValidToken] = useState(false)
   const [hasRedirected, setHasRedirected] = useState(false)
   const router = useRouter()
   const pathname = usePathname()

   useEffect(() => {
      const run = async () => {
        const isValid = await checkAdminSession()
        setHasValidToken(isValid)
        setIsChecking(false)

        if (isValid && pathname === '/admin/login' && !hasRedirected) {
          setHasRedirected(true)
          router.replace('/admin')
        } else if (!isValid && pathname !== '/admin/login' && !hasRedirected) {
          setHasRedirected(true)
          router.replace('/admin/login')
        }
      }
      run()
   }, [])

   // 로딩 중
   if (isChecking) {
      return (
         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   // 로그인 페이지
   if (pathname === '/admin/login') {
      // 유효한 토큰이 있으면 리다이렉트 중 표시
      if (hasValidToken) {
         return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
               <div className="text-center">
                  <LoadingSpinner size="large" />
                  <p className="mt-4 text-gray-600">관리자 대시보드로 이동 중...</p>
               </div>
            </div>
         )
      }
      // 토큰이 없으면 로그인 페이지 표시
      return <div className="min-h-screen bg-gray-100">{children}</div>
   }

   // 관리자 페이지들
   if (hasValidToken) {
      return <div className="min-h-screen bg-gray-100">{children}</div>
   }

   // 토큰이 없으면 리다이렉트 중 표시
   return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
         <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">로그인 페이지로 이동 중...</p>
         </div>
      </div>
   )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return (
      <AdminProvider>
         <AdminGuard>{children}</AdminGuard>
      </AdminProvider>
   )
}
