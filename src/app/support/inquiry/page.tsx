'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { IMAGES } from '@/constants/images'

export default function ContactPage() {
   const router = useRouter()
   const { user, profile, isLoading } = useAuth()
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [userDataLoaded, setUserDataLoaded] = useState(false)
   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      category: '',
      subject: '',
      message: '',
      privacy: false,
   })

   // AuthContext에서 사용자 정보 로드
   useEffect(() => {
      // 비로그인 시, 로그인 페이지로 이동 (요청사항)
      if (!isLoading && !user) {
         router.replace('/login')
         return
      }

      if (!isLoading) {
         console.log('AuthContext 데이터:', { user: user?.id, profile: profile?.name })

         if (user) {
            // 로그인된 사용자의 정보를 폼에 자동 입력
            setFormData((prev) => ({
               ...prev,
               name: profile?.name || '',
               phone: profile?.phone || '',
               email: user.email || '',
            }))
            console.log('사용자 정보 자동 입력 완료')
         } else {
            // 비로그인 사용자
            setFormData((prev) => ({
               ...prev,
               name: '',
               phone: '',
               email: '',
            }))
            console.log('비로그인 사용자 - 빈 폼 설정')
         }
         setUserDataLoaded(true)
      }
   }, [user, profile, isLoading])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!user) {
         alert('문의를 등록하려면 로그인이 필요합니다.')
         router.push('/login')
         return
      }

      if (!formData.privacy) {
         alert('개인정보 수집 및 이용에 동의해주세요.')
         return
      }

      setIsSubmitting(true)

      try {
         // iron-session 쿠키 기반 요청
         console.log('문의 등록 요청 전송')

         const response = await fetch('/api/support/inquiry', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
            body: JSON.stringify(formData),
         })

         if (!response.ok) {
            throw new Error('문의 등록에 실패했습니다.')
         }

         alert('문의가 성공적으로 등록되었습니다. 답변은 마이페이지에서 확인하실 수 있습니다.')
         router.push('/mypage')
      } catch (error) {
         console.error('문의 등록 오류:', error)
         alert('문의 등록에 실패했습니다. 다시 시도해주세요.')
      } finally {
         setIsSubmitting(false)
      }
   }

   if (isLoading || !userDataLoaded) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-gray-600">사용자 정보를 로드하고 있습니다...</p>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.CONTACT})`, // 실제 이미지로 교체 시 사용
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">문의하기</h1>
                  <p className="text-lg text-blue-100">궁금한 사항이나 도움이 필요하시면 언제든지 문의해주세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* 문의 폼 */}
                  <div>
                     <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">1:1 문의</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                           {user ? (
                              // 로그인된 사용자: 정보 자동 입력 및 잘금
                              <>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                          이름 *
                                       </label>
                                       <input type="text" id="name" name="name" required value={formData.name} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" placeholder="이름이 자동으로 입력됩니다" />
                                    </div>
                                    <div>
                                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                          연락처 *
                                       </label>
                                       <input type="tel" id="phone" name="phone" required value={formData.phone} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" placeholder="연락처가 자동으로 입력됩니다" />
                                    </div>
                                 </div>

                                 <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                       이메일 *
                                    </label>
                                    <input type="email" id="email" name="email" required value={formData.email} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" placeholder="이메일이 자동으로 입력됩니다" />
                                 </div>

                                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-700">
                                       <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                       </svg>
                                       로그인된 사용자의 정보가 자동으로 입력되었습니다. 답변은 마이페이지에서 확인할 수 있습니다.
                                    </p>
                                 </div>
                              </>
                           ) : (
                              // 비로그인 사용자: 수동 입력
                              <>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                          이름 *
                                       </label>
                                       <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="이름을 입력해주세요" />
                                    </div>
                                    <div>
                                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                          연락처 *
                                       </label>
                                       <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="010-0000-0000" />
                                    </div>
                                 </div>

                                 <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                       이메일 *
                                    </label>
                                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="example@email.com" />
                                 </div>

                                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-700">
                                       <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                       </svg>
                                       로그인하시면 정보가 자동으로 입력되고, 답변을 마이페이지에서 확인할 수 있습니다.
                                    </p>
                                 </div>
                              </>
                           )}

                           <div>
                              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                 문의 유형 *
                              </label>
                              <select id="category" name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                 <option value="">문의 유형을 선택해주세요</option>
                                 <option value="exam">시험 관련 문의</option>
                                 <option value="education">교육 관련 문의</option>
                                 <option value="certificate">자격증 관련 문의</option>
                                 <option value="payment">결제 관련 문의</option>
                                 <option value="technical">기술적 문제</option>
                                 <option value="other">기타 문의</option>
                              </select>
                           </div>

                           <div>
                              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                 제목 *
                              </label>
                              <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="문의 제목을 입력해주세요" />
                           </div>

                           <div>
                              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                 문의 내용 *
                              </label>
                              <textarea
                                 id="message"
                                 name="message"
                                 rows={6}
                                 required
                                 value={formData.message}
                                 onChange={handleChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                 placeholder="문의하실 내용을 자세히 작성해주세요"
                              />
                           </div>

                           <div className="flex items-start">
                              <input type="checkbox" id="privacy" name="privacy" required checked={formData.privacy} onChange={handleChange} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
                                 개인정보 수집 및 이용에 동의합니다. *
                                 <a href="#" className="text-blue-600 hover:underline ml-1">
                                    (자세히 보기)
                                 </a>
                              </label>
                           </div>

                           <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                              {isSubmitting ? '문의 등록 중...' : '문의하기'}
                           </Button>
                        </form>
                     </Card>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="space-y-8">
                     {/* 연락처 */}
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">연락처 정보</h3>
                        <div className="space-y-4">
                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">전화번호</p>
                                 <p className="text-gray-600">1566-3321</p>
                              </div>
                           </div>

                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">이메일</p>
                                 <p className="text-gray-600">haan@hanallcompany.com</p>
                              </div>
                           </div>

                           <div className="flex items-start">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                 <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">주소</p>
                                 <p className="text-gray-600">인천광역시 서구 청라한내로72번길 13</p>
                              </div>
                           </div>

                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">운영시간</p>
                                 <p className="text-gray-600">평일 09:00 - 18:00</p>
                                 <p className="text-gray-500 text-sm">(토요일, 일요일, 공휴일 휴무)</p>
                              </div>
                           </div>
                        </div>
                     </Card>

                     {/* 빠른 문의 */}
                     <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">빠른 문의</h3>
                        <div className="space-y-3">
                           <Button href="tel:1566-3321" variant="outline" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                 />
                              </svg>
                              전화 문의 (1566-3321)
                           </Button>
                           <Button href="mailto:haan@hanallcompany.com" variant="outline" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              이메일 문의
                           </Button>
                        </div>
                     </Card>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
