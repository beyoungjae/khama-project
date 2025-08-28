'use client'

import { useState, useEffect } from 'react'

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

// JWT 토큰 디코딩 (간단한 페이로드 추출)
function decodeJWT(token: string): unknown {
   try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
         atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
      )
      return JSON.parse(jsonPayload)
   } catch {
      return null
   }
}

export function useSafeAdminCheck() {
   const [isAdmin, setIsAdmin] = useState(false)
   const [isChecking, setIsChecking] = useState(true)

   useEffect(() => {
      const checkAdmin = () => {
         try {
            // 쿠키에서 admin-token 확인
            const adminToken = getCookie('admin-token')

            if (!adminToken) {
               setIsAdmin(false)
               setIsChecking(false)
               return
            }

            // JWT 토큰 디코딩해서 유효성 확인
            const payload = decodeJWT(adminToken)

            if (!payload || !payload.role || payload.role !== 'admin') {
               setIsAdmin(false)
               setIsChecking(false)
               return
            }

            // 토큰 만료 확인
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp && payload.exp < now) {
               setIsAdmin(false)
               setIsChecking(false)
               return
            }

            // 유효한 토큰
            setIsAdmin(true)
            setIsChecking(false)
         } catch {
            // 에러가 발생해도 조용히 처리 (일반 사용자일 가능성)
            setIsAdmin(false)
            setIsChecking(false)
         }
      }

      checkAdmin()
   }, [])

   return { isAdmin, isChecking }
}
