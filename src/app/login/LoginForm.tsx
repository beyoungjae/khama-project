'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { IMAGES } from '@/constants/images'

export default function LoginForm() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const redirectTo = searchParams.get('redirectTo') || '/mypage'
   const message = searchParams.get('message')
   const { signIn } = useAuth()

   const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: false,
   })
   const [isLoading, setIsLoading] = useState(false)
   const [errors, setErrors] = useState<{ [key: string]: string }>({})

   // 메시지 처리
   const getMessageContent = () => {
      switch (message) {
         case 'signup-success':
            return {
               type: 'success',
               text: '회원가입이 완료되었습니다. 로그인해주세요.',
            }
         case 'logout':
            return {
               type: 'info',
               text: '로그아웃되었습니다.',
            }
         case 'session-expired':
            return {
               type: 'warning',
               text: '세션이 만료되었습니다. 다시 로그인해주세요.',
            }
         default:
            return null
      }
   }

   const messageContent = getMessageContent()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }))
      // 에러 메시지 클리어
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: '' }))
      }
   }

   const validateForm = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.email) {
         newErrors.email = '이메일을 입력해주세요.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식을 입력해주세요.'
      }

      if (!formData.password) {
         newErrors.password = '비밀번호를 입력해주세요.'
      } else if (formData.password.length < 6) {
         newErrors.password = '비밀번호는 6자 이상이어야 합니다.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setIsLoading(true)
      setErrors({})

      try {
         const result = await signIn(formData.email, formData.password)

         if (result.error) {
            setErrors({ general: result.error })
         } else {
            // 로그인 성공 시 리다이렉트
            router.push(redirectTo)
         }
      } catch (error) {
         console.error('로그인 오류:', error)
         setErrors({ general: '로그인 중 오류가 발생했습니다.' })
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <main className="pt-16">
         {/* Hero Section */}
         <section
            className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700"
            style={{
               backgroundImage: `url(${IMAGES.PAGES.LOGIN})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
            }}
         >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">로그인</h1>
               <p className="text-lg text-blue-100">KHAMA 회원 서비스를 이용하시려면 로그인해주세요</p>
            </div>
         </section>

         <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card>
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">회원 로그인</h2>
                  <p className="text-gray-600">계정 정보를 입력해주세요</p>
               </div>

               {messageContent && (
                  <div className={`mb-6 p-4 rounded-lg border ${messageContent.type === 'success' ? 'bg-green-50 border-green-200' : messageContent.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                     <div className="flex items-center">
                        <svg className={`w-5 h-5 mr-2 ${messageContent.type === 'success' ? 'text-green-500' : messageContent.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={`text-sm ${messageContent.type === 'success' ? 'text-green-700' : messageContent.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'}`}>{messageContent.text}</p>
                     </div>
                  </div>
               )}

               {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                     <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 text-sm">{errors.general}</p>
                     </div>
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        이메일 *
                     </label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="example@email.com"
                     />
                     {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호 *
                     </label>
                     <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="비밀번호를 입력하세요"
                     />
                     {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                           로그인 상태 유지
                        </label>
                     </div>

                     <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                        비밀번호를 잊으셨나요?
                     </Link>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                     {isLoading ? (
                        <div className="flex items-center justify-center">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           로그인 중...
                        </div>
                     ) : (
                        '로그인'
                     )}
                  </Button>
               </form>

               <div className="mt-6 text-center">
                  <p className="text-gray-600">
                     아직 회원이 아니신가요?{' '}
                     <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                        회원가입
                     </Link>
                  </p>
               </div>
            </Card>
         </div>
      </main>
   )
}
