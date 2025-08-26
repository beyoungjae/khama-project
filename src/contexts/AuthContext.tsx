'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
   user: User | null
   profile: UserProfile | null
   loading: boolean
   isLoading: boolean
   signUp: (email: string, password: string, userData: SignUpData) => Promise<{ error?: string }>
   signIn: (email: string, password: string) => Promise<{ error?: string }>
   signOut: () => Promise<void>
   updateProfile: (data: Partial<UserProfile>) => Promise<{ error?: string }>
   refreshProfile: () => Promise<void>
}

interface UserProfile {
   id: string
   name: string | null
   phone: string | null
   birth_date: string | null
   gender: 'male' | 'female' | 'other' | null
   postal_code: string | null
   address: string | null
   detail_address: string | null
   status: 'active' | 'inactive' | 'suspended'
   role: 'user' | 'admin' | 'super_admin'
   marketing_agreed: boolean
   marketing_agreed_at: string | null
   created_at: string
   updated_at: string
   last_login_at: string | null
}

interface SignUpData {
   name: string
   phone: string
   birth_date: string
   gender: 'male' | 'female' | 'other'
   postal_code: string
   address: string
   detail_address: string
   marketing_agreed: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null)
   const [profile, setProfile] = useState<UserProfile | null>(null)
   const [loading, setLoading] = useState(true)

   // 프로필 조회 함수 (API를 통해 RLS 우회)
   const fetchProfile = async (userId: string) => {
      try {
         const response = await fetch(`/api/profile?userId=${userId}`)
         const result = await response.json()

         if (!response.ok) {
            console.error('프로필 조회 API 오류:', result.error)
            return null
         }

         return result.profile as UserProfile
      } catch (error) {
         console.error('프로필 조회 오류:', error)
         return null
      }
   }

   // 프로필 새로고침
   const refreshProfile = async () => {
      if (user) {
         const profileData = await fetchProfile(user.id)
         setProfile(profileData)
      }
   }

   // 초기 세션 확인
   useEffect(() => {
      const getSession = async () => {
         try {
            const {
               data: { session },
            } = await supabase.auth.getSession()
            setUser(session?.user ?? null)

            if (session?.user) {
               const profileData = await fetchProfile(session.user.id)
               setProfile(profileData)
               console.log('기존 세션 확인:', session.user.email)
            }
         } catch (error) {
            console.error('세션 확인 오류:', error)
         } finally {
            setLoading(false)
         }
      }

      getSession()

      // 인증 상태 변경 리스너
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
         setUser(session?.user ?? null)

         if (session?.user) {
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
            console.log('로그인 성공:', session.user.email)

            // 로그인 시간 업데이트
            if (event === 'SIGNED_IN') {
               try {
                  const response = await fetch('/api/profile', {
                     method: 'PUT',
                     headers: {
                        'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                        userId: session.user.id,
                        profileData: {
                           last_login_at: new Date().toISOString(),
                        },
                     }),
                  })

                  if (!response.ok) {
                     console.warn('로그인 시간 업데이트 실패:', await response.text())
                  }
               } catch (error) {
                  console.warn('로그인 시간 업데이트 오류:', error)
               }
            }
         } else {
            setProfile(null)
         }

         setLoading(false)
      })

      return () => subscription.unsubscribe()
   }, [])

   // 회원가입
   const signUp = async (email: string, password: string, userData: SignUpData) => {
      try {
         const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
               data: {
                  name: userData.name,
               },
            },
         })

         if (error) {
            return { error: error.message }
         }

         // 프로필 정보 추가 (API를 통해 RLS 우회)
         if (data.user) {
            console.log('회원가입 성공, 프로필 생성 시작:', {
               userId: data.user.id,
               userData,
            })

            try {
               const response = await fetch('/api/profile', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                     userId: data.user.id,
                     profileData: {
                        name: userData.name,
                        phone: userData.phone,
                        birth_date: userData.birth_date,
                        gender: userData.gender,
                        postal_code: userData.postal_code,
                        address: userData.address,
                        detail_address: userData.detail_address,
                        marketing_agreed: userData.marketing_agreed,
                        marketing_agreed_at: userData.marketing_agreed ? new Date().toISOString() : null,
                        role: 'user',
                        status: 'active',
                     },
                  }),
               })

               const result = await response.json()
               if (!response.ok) {
                  console.error('프로필 생성 API 오류:', result.error)
               } else {
                  console.log('프로필 생성 성공:', result.profile)
               }
            } catch (error) {
               console.error('프로필 생성 요청 오류:', error)
            }
         }

         return {}
      } catch (error: unknown) {
         return { error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.' }
      }
   }

   // 로그인
   const signIn = async (email: string, password: string) => {
      try {
         const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
         })

         if (error) {
            return { error: error.message }
         }

         return {}
      } catch (error: unknown) {
         return { error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.' }
      }
   }

   // 로그아웃
   const signOut = async () => {
      try {
         await supabase.auth.signOut()
      } catch (error) {
         console.error('로그아웃 오류:', error)
      }
   }

   // 프로필 업데이트
   const updateProfile = async (data: Partial<UserProfile>) => {
      try {
         if (!user) {
            return { error: '로그인이 필요합니다.' }
         }

         const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               userId: user.id,
               profileData: data,
            }),
         })

         const result = await response.json()

         if (!response.ok) {
            return { error: result.error || '프로필 업데이트에 실패했습니다.' }
         }

         // 프로필 새로고침
         await refreshProfile()
         return {}
      } catch (error: unknown) {
         return { error: error instanceof Error ? error.message : '프로필 업데이트 중 오류가 발생했습니다.' }
      }
   }

   const value = {
      user,
      profile,
      loading,
      isLoading: loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}

export type { UserProfile, SignUpData }
