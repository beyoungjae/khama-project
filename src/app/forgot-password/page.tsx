'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ForgotPasswordPage() {
   const [step, setStep] = useState<'email' | 'verification' | 'reset'>('email')
   const [formData, setFormData] = useState({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
   })
   const [isLoading, setIsLoading] = useState(false)
   const [errors, setErrors] = useState<{ [key: string]: string }>({})
   const [message, setMessage] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // 에러 메시지 클리어
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
         // TODO: 실제 이메일 전송 API 호출
         await new Promise((resolve) => setTimeout(resolve, 1500))

         setMessage('인증번호가 이메일로 전송되었습니다.')
         setStep('verification')
      } catch {
         setErrors({ email: '이메일 전송에 실패했습니다. 다시 시도해주세요.' })
      } finally {
         setIsLoading(false)
      }
   }

   const handleVerificationSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.verificationCode) {
         setErrors({ verificationCode: '인증번호를 입력해주세요.' })
         return
      }

      setIsLoading(true)

      try {
         // TODO: 실제 인증번호 확인 API 호출
         await new Promise((resolve) => setTimeout(resolve, 1000))

         setMessage('인증이 완료되었습니다. 새 비밀번호를 설정해주세요.')
         setStep('reset')
      } catch {
         setErrors({ verificationCode: '인증번호가 올바르지 않습니다.' })
      } finally {
         setIsLoading(false)
      }
   }

   const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault()

      const newErrors: { [key: string]: string } = {}

      if (!formData.newPassword) {
         newErrors.newPassword = '새 비밀번호를 입력해주세요.'
      } else if (formData.newPassword.length < 8) {
         newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
         newErrors.newPassword = '비밀번호는 대소문자와 숫자를 포함해야 합니다.'
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
      } else if (formData.newPassword !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors)
         return
      }

      setIsLoading(true)

      try {
         // TODO: 실제 비밀번호 재설정 API 호출
         await new Promise((resolve) => setTimeout(resolve, 1500))

         // 성공 시 로그인 페이지로 리다이렉트
         window.location.href = '/login?message=password-reset-success'
      } catch {
         setErrors({ general: '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.' })
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
               '인증번호 전송'
            )}
         </Button>
      </form>
   )

   const renderVerificationStep = () => (
      <form onSubmit={handleVerificationSubmit} className="space-y-6">
         <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
               <span className="font-medium text-blue-600">{formData.email}</span>로<br />
               인증번호를 전송했습니다.
            </p>
         </div>

         <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
               인증번호 *
            </label>
            <input
               type="text"
               id="verificationCode"
               name="verificationCode"
               value={formData.verificationCode}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest ${errors.verificationCode ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="6자리 인증번호"
               maxLength={6}
            />
            {errors.verificationCode && <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>}
         </div>

         <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep('email')} className="flex-1">
               이메일 변경
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
               {isLoading ? '확인 중...' : '인증 확인'}
            </Button>
         </div>

         <div className="text-center">
            <button type="button" onClick={handleEmailSubmit} className="text-sm text-blue-600 hover:underline">
               인증번호 재전송
            </button>
         </div>
      </form>
   )

   const renderResetStep = () => (
      <form onSubmit={handlePasswordReset} className="space-y-6">
         <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
               새 비밀번호 *
            </label>
            <input
               type="password"
               id="newPassword"
               name="newPassword"
               value={formData.newPassword}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.newPassword ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="8자 이상, 대소문자+숫자 포함"
            />
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
         </div>

         <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
               새 비밀번호 확인 *
            </label>
            <input
               type="password"
               id="confirmPassword"
               name="confirmPassword"
               value={formData.confirmPassword}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="새 비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
         </div>

         <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
               <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  재설정 중...
               </div>
            ) : (
               '비밀번호 재설정'
            )}
         </Button>
      </form>
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
         case 'verification':
            return {
               title: '인증번호 확인',
               description: '이메일로 전송된 인증번호를 입력해주세요',
               icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               ),
            }
         case 'reset':
            return {
               title: '새 비밀번호 설정',
               description: '새로운 비밀번호를 설정해주세요',
               icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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
                  {step === 'verification' && renderVerificationStep()}
                  {step === 'reset' && renderResetStep()}

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
