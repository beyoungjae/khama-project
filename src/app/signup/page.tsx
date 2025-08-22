'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SignupPage() {
   const [currentStep, setCurrentStep] = useState(1)
   const [formData, setFormData] = useState({
      // 기본 정보
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      birthDate: '',
      gender: '',

      // 주소 정보
      zipcode: '',
      address: '',
      detailAddress: '',

      // 약관 동의
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
   })
   const [isLoading, setIsLoading] = useState(false)
   const [errors, setErrors] = useState<{ [key: string]: string }>({})

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const checked = (e.target as HTMLInputElement).checked

      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }))

      // 에러 메시지 클리어
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: '' }))
      }
   }

   const validateStep1 = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.name) {
         newErrors.name = '이름을 입력해주세요.'
      }

      if (!formData.email) {
         newErrors.email = '이메일을 입력해주세요.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식을 입력해주세요.'
      }

      if (!formData.password) {
         newErrors.password = '비밀번호를 입력해주세요.'
      } else if (formData.password.length < 8) {
         newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
         newErrors.password = '비밀번호는 대소문자와 숫자를 포함해야 합니다.'
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
      } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }

      if (!formData.phone) {
         newErrors.phone = '전화번호를 입력해주세요.'
      } else if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phone)) {
         newErrors.phone = '올바른 전화번호 형식을 입력해주세요.'
      }

      if (!formData.birthDate) {
         newErrors.birthDate = '생년월일을 입력해주세요.'
      }

      if (!formData.gender) {
         newErrors.gender = '성별을 선택해주세요.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const validateStep2 = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.zipcode) {
         newErrors.zipcode = '우편번호를 입력해주세요.'
      }

      if (!formData.address) {
         newErrors.address = '주소를 입력해주세요.'
      }

      if (!formData.detailAddress) {
         newErrors.detailAddress = '상세주소를 입력해주세요.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const validateStep3 = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.agreeTerms) {
         newErrors.agreeTerms = '이용약관에 동의해주세요.'
      }

      if (!formData.agreePrivacy) {
         newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleNext = () => {
      let isValid = false

      switch (currentStep) {
         case 1:
            isValid = validateStep1()
            break
         case 2:
            isValid = validateStep2()
            break
         case 3:
            isValid = validateStep3()
            break
      }

      if (isValid && currentStep < 3) {
         setCurrentStep(currentStep + 1)
      } else if (isValid && currentStep === 3) {
         handleSubmit()
      }
   }

   const handleSubmit = async () => {
      setIsLoading(true)

      try {
         // TODO: 실제 회원가입 API 호출
         await new Promise((resolve) => setTimeout(resolve, 2000)) // 임시 지연

         // 회원가입 성공 시 로그인 페이지로 리다이렉트
         window.location.href = '/login?message=signup-success'
      } catch (error) {
         setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' })
      } finally {
         setIsLoading(false)
      }
   }

   const renderStep1 = () => (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
               </label>
               <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="홍길동" />
               {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="8자 이상, 대소문자+숫자 포함"
               />
               {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인 *
               </label>
               <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="비밀번호를 다시 입력하세요"
               />
               {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 *
               </label>
               <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`} placeholder="010-0000-0000" />
               {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
               <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일 *
               </label>
               <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.birthDate ? 'border-red-300' : 'border-gray-300'}`} />
               {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
            </div>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">성별 *</label>
            <div className="flex gap-4">
               <label className="flex items-center">
                  <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">남성</span>
               </label>
               <label className="flex items-center">
                  <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">여성</span>
               </label>
            </div>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
         </div>
      </div>
   )
   const renderStep2 = () => (
      <div className="space-y-6">
         <div className="flex gap-3">
            <div className="flex-1">
               <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                  우편번호 *
               </label>
               <input type="text" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.zipcode ? 'border-red-300' : 'border-gray-300'}`} placeholder="12345" />
               {errors.zipcode && <p className="mt-1 text-sm text-red-600">{errors.zipcode}</p>}
            </div>
            <div className="flex items-end">
               <Button type="button" variant="outline">
                  주소 검색
               </Button>
            </div>
         </div>

         <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
               주소 *
            </label>
            <input
               type="text"
               id="address"
               name="address"
               value={formData.address}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="서울시 강남구 테헤란로 123"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
         </div>

         <div>
            <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700 mb-2">
               상세주소 *
            </label>
            <input
               type="text"
               id="detailAddress"
               name="detailAddress"
               value={formData.detailAddress}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.detailAddress ? 'border-red-300' : 'border-gray-300'}`}
               placeholder="101동 1001호"
            />
            {errors.detailAddress && <p className="mt-1 text-sm text-red-600">{errors.detailAddress}</p>}
         </div>
      </div>
   )

   const renderStep3 = () => (
      <div className="space-y-6">
         <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
               <div className="flex items-start">
                  <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                  <div className="ml-3 flex-1">
                     <label htmlFor="agreeTerms" className="text-sm font-medium text-gray-900">
                        이용약관 동의 (필수) *
                     </label>
                     <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 max-h-32 overflow-y-auto">
                        제1조 (목적) 본 약관은 대한생활가전유지관리협회(이하 "협회")가 제공하는 서비스의 이용조건 및 절차, 회원과 협회의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다. 제2조 (정의) "서비스"란 협회가 제공하는 자격증 시험, 교육, 온라인 서비스 등 일체의 서비스를
                        의미합니다. 제3조 (약관의 효력 및 변경) 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
                     </div>
                     <Link href="/terms" className="text-xs text-blue-600 hover:underline">
                        전체 약관 보기
                     </Link>
                  </div>
               </div>
               {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
               <div className="flex items-start">
                  <input type="checkbox" id="agreePrivacy" name="agreePrivacy" checked={formData.agreePrivacy} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                  <div className="ml-3 flex-1">
                     <label htmlFor="agreePrivacy" className="text-sm font-medium text-gray-900">
                        개인정보 처리방침 동의 (필수) *
                     </label>
                     <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 max-h-32 overflow-y-auto">
                        1. 개인정보의 처리목적: 회원가입, 서비스 제공, 고객상담, 시험 관리 2. 처리하는 개인정보 항목: 이름, 이메일, 전화번호, 주소, 생년월일 3. 개인정보의 보유 및 이용기간: 회원탈퇴 시까지 (단, 관련 법령에 따라 보존 필요시 해당 기간) 4. 개인정보 제3자 제공: 원칙적으로 제공하지 않음
                        (법령에 의한 경우 제외)
                     </div>
                     <Link href="/privacy" className="text-xs text-blue-600 hover:underline">
                        전체 개인정보 처리방침 보기
                     </Link>
                  </div>
               </div>
               {errors.agreePrivacy && <p className="mt-1 text-sm text-red-600">{errors.agreePrivacy}</p>}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
               <div className="flex items-start">
                  <input type="checkbox" id="agreeMarketing" name="agreeMarketing" checked={formData.agreeMarketing} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                  <div className="ml-3 flex-1">
                     <label htmlFor="agreeMarketing" className="text-sm font-medium text-gray-900">
                        마케팅 정보 수신 동의 (선택)
                     </label>
                     <p className="mt-1 text-xs text-gray-600">시험 일정, 교육 과정, 이벤트 등의 정보를 이메일과 SMS로 받아보실 수 있습니다. 언제든지 수신 거부하실 수 있습니다.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )

   const steps = [
      { number: 1, title: '기본정보', description: '개인정보 입력' },
      { number: 2, title: '주소정보', description: '거주지 정보' },
      { number: 3, title: '약관동의', description: '이용약관 동의' },
   ]

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            {/* TODO: 실제 이미지로 교체 - IMAGES.PAGES.SIGNUP 사용 */}
            <section
               className="relative py-12 bg-gradient-to-r from-emerald-900 to-emerald-700"
               style={
                  {
                     // backgroundImage: `url(${IMAGES.PAGES.SIGNUP})`, // 실제 이미지로 교체 시 사용
                     // backgroundSize: 'cover',
                     // backgroundPosition: 'center',
                     // backgroundRepeat: 'no-repeat'
                  }
               }
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">회원가입</h1>
                  <p className="text-lg text-emerald-100">KHAMA와 함께 전문가의 길을 시작하세요</p>
               </div>
            </section>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* Progress Steps */}
               <div className="mb-8">
                  <div className="flex items-center justify-between">
                     {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                           <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 text-gray-500'}`}>
                              {currentStep > step.number ? (
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                 </svg>
                              ) : (
                                 step.number
                              )}
                           </div>
                           <div className="ml-3">
                              <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-emerald-600' : 'text-gray-500'}`}>{step.title}</p>
                              <p className="text-xs text-gray-500">{step.description}</p>
                           </div>
                           {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-emerald-600' : 'bg-gray-300'}`} />}
                        </div>
                     ))}
                  </div>
               </div>

               <Card>
                  <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep - 1].title}</h2>
                     <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                  </div>

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

                  <form onSubmit={(e) => e.preventDefault()}>
                     {currentStep === 1 && renderStep1()}
                     {currentStep === 2 && renderStep2()}
                     {currentStep === 3 && renderStep3()}

                     <div className="mt-8 flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
                           이전
                        </Button>

                        <Button type="button" onClick={handleNext} disabled={isLoading} className="min-w-[120px]">
                           {isLoading ? (
                              <div className="flex items-center justify-center">
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 가입 중...
                              </div>
                           ) : currentStep === 3 ? (
                              '회원가입 완료'
                           ) : (
                              '다음'
                           )}
                        </Button>
                     </div>
                  </form>

                  <div className="mt-8 text-center">
                     <p className="text-sm text-gray-600">
                        이미 회원이신가요?{' '}
                        <Link href="/login" className="font-medium text-emerald-600 hover:underline">
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
