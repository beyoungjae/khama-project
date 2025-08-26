'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function useAdmin() {
   const { user, profile, isLoading } = useAuth()
   const [isAdmin, setIsAdmin] = useState(false)
   const [isChecking, setIsChecking] = useState(true)
   const router = useRouter()
   const checkedRef = useRef(false)

   useEffect(() => {
      const checkAdminStatus = async () => {
         // 이미 체크했으면 다시 체크하지 않음
         if (checkedRef.current) return

         checkedRef.current = true

         // localStorage에서 관리자 토큰 확인
         const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null

         if (adminToken) {
            try {
               // 토큰 유효성 검증
               const response = await fetch('/api/admin/verify-token', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${adminToken}`,
                  },
               })

               const result = await response.json()

               if (response.ok && result.valid) {
                  // 토큰이 유효하면 관리자로 간주
                  setIsAdmin(true)
               } else {
                  // 토큰이 유효하지 않으면 로컬 스토리지에서 제거
                  localStorage.removeItem('admin-token')
                  // 로그인 페이지가 아닌 경우에만 리다이렉트
                  if (window.location.pathname !== '/admin/login') {
                     router.push('/admin/login')
                  }
               }
            } catch (error) {
               console.error('토큰 검증 오류:', error)
               localStorage.removeItem('admin-token')
               // 로그인 페이지가 아닌 경우에만 리다이렉트
               if (window.location.pathname !== '/admin/login') {
                  router.push('/admin/login')
               }
            } finally {
               setIsChecking(false)
            }
            return
         }

         // 토큰이 없으면 useAuth를 통해 확인
         if (isLoading) return

         if (!user) {
            // 로그인 페이지가 아닌 경우에만 리다이렉트
            if (window.location.pathname !== '/admin/login') {
               router.push('/admin/login')
            }
            setIsChecking(false)
            return
         }

         if (!profile) {
            setIsChecking(false)
            setIsAdmin(false)
            return
         }

         const adminRoles = ['admin', 'super_admin']
         const userIsAdmin = adminRoles.includes(profile.role || '') && profile.status === 'active'

         if (!userIsAdmin) {
            // 관리자 페이지가 아닌 경우에만 리다이렉트
            if (!window.location.pathname.startsWith('/admin/login') && !window.location.pathname.startsWith('/403')) {
               router.push('/403')
            }
            setIsChecking(false)
            return
         }

         setIsAdmin(userIsAdmin)
         setIsChecking(false)
      }

      checkAdminStatus()

      // cleanup 함수
      return () => {
         checkedRef.current = false
      }
   }, [user, profile, isLoading, router])

   return {
      isAdmin,
      isChecking,
      user,
      profile,
   }
}

export function useAdminCheck() {
   const { user, profile } = useAuth()

   const isAdmin = () => {
      // 클라이언트 사이드에서만 localStorage 확인
      if (typeof window !== 'undefined') {
         const adminToken = localStorage.getItem('admin-token')
         if (adminToken) {
            return true
         }
      }

      if (!user || !profile) return false
      const adminRoles = ['admin', 'super_admin']
      return adminRoles.includes(profile.role || '') && profile.status === 'active'
   }

   return { isAdmin: isAdmin() }
}
