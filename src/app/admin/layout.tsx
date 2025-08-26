'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   const [isLoading, setIsLoading] = useState(true)
   const router = useRouter()

   useEffect(() => {
      // 클라이언트 사이드에서만 실행
      if (typeof window !== 'undefined') {
         const checkAuth = async () => {
            const adminToken = localStorage.getItem('admin-token')

            if (!adminToken) {
               // 로그인 페이지가 아닌 경우에만 리다이렉트
               if (window.location.pathname !== '/admin/login') {
                  router.push('/admin/login')
               }
            }

            setIsLoading(false)
         }

         checkAuth()
      }
   }, [router])

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   return <div className="min-h-screen bg-gray-100">{children}</div>
}
