'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

function ResetPasswordForm() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const [formData, setFormData] = useState({
      password: '',
      confirmPassword: '',
   })
   const [errors, setErrors] = useState<{ [key: string]: string }>({})
   const [isLoading, setIsLoading] = useState(false)
   const [message, setMessage] = useState('')

   useEffect(() => {
      // URL에서 토큰 확인
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')

      if (accessToken && refreshToken) {
         // 세션 설정
         supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
         })
      }
   }, [searchParams])

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: '' }))
      }
   }

   const validateForm = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.password) {
         newErrors.password = '새 비밀번호를 입력해주세요.'
      } else if (formData.password.length < 8) {
         newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
      } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setIsLoading(true)

      try {
         const { error } = await supabase.auth.updateUser({
            password: formData.password,
         })

         if (error) {
            throw error
         }

         setMessage('비밀번호가 성공적으로 변경되었습니다.')
         setTimeout(() => {
            router.push('/login')
         }, 2000)
      } catch (error: unknown) {
         const errorMessage = error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.'
         setErrors({ password: errorMessage })
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <Header />
         <main className="pt-16">
            <section className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20"></div>
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">비밀번호 재설정</h1>
                  <p className="text-xl text-blue-100">새로운 비밀번호를 설정해주세요</p>
               </div>
            </section>

            <section className="py-16">
               <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="p-8">
                     {message ? (
                        <div className="text-center">
                           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                           </div>
                           <p className="text-green-600 mb-4">{message}</p>
                           <p className="text-gray-600">잠시 후 로그인 페이지로 이동합니다...</p>
                        </div>
                     ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                           <div>
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                 새 비밀번호
                              </label>
                              <input
                                 type="password"
                                 id="password"
                                 name="password"
                                 value={formData.password}
                                 onChange={handleInputChange}
                                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                 placeholder="새 비밀번호를 입력하세요"
                              />
                              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                           </div>

                           <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                 비밀번호 확인
                              </label>
                              <input
                                 type="password"
                                 id="confirmPassword"
                                 name="confirmPassword"
                                 value={formData.confirmPassword}
                                 onChange={handleInputChange}
                                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                 placeholder="비밀번호를 다시 입력하세요"
                              />
                              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                           </div>

                           <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? '변경 중...' : '비밀번호 변경'}
                           </Button>
                        </form>
                     )}
                  </Card>
               </div>
            </section>
         </main>
         <Footer />
      </div>
   )
}

export default function ResetPasswordPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <ResetPasswordForm />
      </Suspense>
   )
}
