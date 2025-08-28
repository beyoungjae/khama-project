'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AdminUser {
   id: string
   email: string
   name: string
   role: string
}

interface AdminContextType {
   isAdmin: boolean
   isChecking: boolean
   adminProfile: AdminUser | null
   login: (profile?: AdminUser) => void
   logout: () => void
   checkAuth: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
   const [isAdmin, setIsAdmin] = useState(false)
   const [isChecking, setIsChecking] = useState(true)
   const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null)

   const checkAuth = async () => {
      try {
         setIsChecking(true)
         const res = await fetch('/api/admin/verify-token', { credentials: 'include' })
         const data = await res.json()
         if (res.ok && data.valid) {
            setIsAdmin(true)
            setAdminProfile(data.user)
         } else {
            setIsAdmin(false)
            setAdminProfile(null)
         }
      } catch (e) {
         setIsAdmin(false)
         setAdminProfile(null)
      } finally {
         setIsChecking(false)
      }
   }

   const login = (profile?: AdminUser) => {
      // 서버에서 iron-session 설정이 완료된 상태라면, 상태만 동기화
      setIsAdmin(!!profile)
      setAdminProfile(profile || null)
      setIsChecking(false)
   }

   const logout = async () => {
      try {
         await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
      } catch (error) {
         console.error('로그아웃 오류:', error)
      } finally {
         setIsAdmin(false)
         setAdminProfile(null)
         window.location.href = '/admin/login'
      }
   }

   // 초기 인증 확인 - 한 번만 실행
   useEffect(() => {
      checkAuth()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <AdminContext.Provider
         value={{
            isAdmin,
            isChecking,
            adminProfile,
            login,
            logout,
            checkAuth,
         }}
      >
         {children}
      </AdminContext.Provider>
   )
}

export function useAdmin() {
   const context = useContext(AdminContext)
   if (context === undefined) {
      throw new Error('useAdmin must be used within an AdminProvider')
   }
   return context
}

export function useAdminCheck() {
   const context = useContext(AdminContext)
   if (context === undefined) {
      return { isAdmin: false }
   }
   return { isAdmin: context.isAdmin }
}
