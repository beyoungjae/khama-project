'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
   const [step, setStep] = useState<'email' | 'success'>('email')
   const [formData, setFormData] = useState({
      email: '',
   })
   const [isLoading, setIsLoading] = useState(false)
   const [errors, setErrors] = useState<{ [key: string]: string }>({})
   const [message, setMessage] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: '' }))
      }
   }

   const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.email) {
         setErrors({ email: '이메일을 입력해주세요.' })
         return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         setErrors({ email: '올바른 이메일 형식을 입력해주세요.' })
         return
      }

      setIsLoading(true)

      try {
         const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
            redirectTo: `${window.location.origin}/reset-password`,
         })

         if (error) {
            throw error
         }

         setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인하여 비밀번호를 재설정해주세요.')
         setStep('success')
      } catch (error: unknown) {
         setErrors({ email: error.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.' })
      } finally {
         setIsLoading(false)
      }
   }

   const renderEmailStep = () => (
      <form onSubmit={handleEmailSubmit} className="space-y-6">
         <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
               이메일 주소 *
            </label>
            <input
               type="email"
               id="email"
               name="email"
               value={formData.email}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="가입 시 사용한 이메일을 입력하세요"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
         </div>

         <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
               <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  전송 중...
               </div>
            ) : (
               '재설정 링크 전송'
            )}
         </Button>
      </form>
   )

   const renderSuccessStep = () => (
      <div className="text-center space-y-6">
         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
         </div>
         <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">이메일을 확인해주세요</h3>
            <p className="text-gray-600 mb-4">
               <span className="font-medium text-blue-600">{formData.email}</span>로<br />
               비밀번호 재설정 링크를 전송했습니다.
            </p>
            <p className="text-sm text-gray-500">이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.</p>
         </div>
         <Link href="/login">
            <Button className="w-full">로그인 페이지로 돌아가기</Button>
         </Link>
      </div>
   )

   const getStepInfo = () => {
      switch (step) {
         case 'email':
            return {
               title: '비밀번호 찾기',
               description: '가입 시 사용한 이메일 주소를 입력해주세요',
               icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
               ),
            }
         case 'success':
            return {
               title: '이메일 전송 완료',
               description: '비밀번호 재설정 링크를 확인해주세요',
               icon: (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
               ),
            }
      }
   }

   const stepInfo = getStepInfo()

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">비밀번호 찾기</h1>
                  <p className="text-lg text-blue-100">잊어버린 비밀번호를 재설정하세요</p>
               </div>
            </section>

            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <Card>
                  <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">{stepInfo.icon}</div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{stepInfo.title}</h2>
                     <p className="text-gray-600">{stepInfo.description}</p>
                  </div>

                  {message && (
                     <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                           <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           <p className="text-blue-700 text-sm">{message}</p>
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

                  {step === 'email' && renderEmailStep()}
                  {step === 'success' && renderSuccessStep()}

                  <div className="mt-8 text-center">
                     <p className="text-sm text-gray-600">
                        비밀번호가 기억나셨나요?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:underline">
                           로그인
                        </Link>
                     </p>
                  </div>
               </Card>
            </div>
         </main>

         <Footer />
      </div>
   )
}
