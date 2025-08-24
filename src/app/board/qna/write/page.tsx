'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function QnaWritePage() {
   const router = useRouter()
   const [formData, setFormData] = useState({
      category: '',
      title: '',
      content: '',
      isPrivate: false,
      name: '',
      email: '',
      phone: '',
   })
   const [isLoading, setIsLoading] = useState(false)
   const [errors, setErrors] = useState<{ [key: string]: string }>({})

   const categories = [
      { value: 'exam', label: '자격시험 관련' },
      { value: 'education', label: '교육과정 관련' },
      { value: 'certificate', label: '자격증 발급' },
      { value: 'payment', label: '결제/환불' },
      { value: 'technical', label: '기술적 문의' },
      { value: 'other', label: '기타' },
   ]

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

   const validateForm = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.category) {
         newErrors.category = '문의 유형을 선택해주세요.'
      }

      if (!formData.title.trim()) {
         newErrors.title = '제목을 입력해주세요.'
      } else if (formData.title.length < 5) {
         newErrors.title = '제목은 5자 이상 입력해주세요.'
      }

      if (!formData.content.trim()) {
         newErrors.content = '내용을 입력해주세요.'
      } else if (formData.content.length < 10) {
         newErrors.content = '내용은 10자 이상 입력해주세요.'
      }

      if (!formData.name.trim()) {
         newErrors.name = '이름을 입력해주세요.'
      }

      if (!formData.email.trim()) {
         newErrors.email = '이메일을 입력해주세요.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식을 입력해주세요.'
      }

      if (!formData.phone.trim()) {
         newErrors.phone = '연락처를 입력해주세요.'
      } else if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phone)) {
         newErrors.phone = '올바른 연락처 형식을 입력해주세요.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setIsLoading(true)

      try {
         // TODO: 실제 API 호출
         await new Promise((resolve) => setTimeout(resolve, 1500))

         // 성공 시 Q&A 목록으로 리다이렉트
         router.push('/board/qna?message=write-success')
      } catch {
         setErrors({ general: '문의 등록에 실패했습니다. 다시 시도해주세요.' })
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-12 bg-gradient-to-r from-emerald-900 to-emerald-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Q&A 작성</h1>
                  <p className="text-lg text-emerald-100">궁금한 사항을 문의해주세요. 빠른 시일 내에 답변드리겠습니다.</p>
               </div>
            </section>

            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <nav className="flex items-center space-x-2 text-sm text-gray-600">
                     <Link href="/" className="hover:text-blue-600" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
                        홈
                     </Link>
                     <span>/</span>
                     <Link href="/board/qna" className="hover:text-blue-600">
                        Q&A
                     </Link>
                     <span>/</span>
                     <span className="text-gray-900">질문 작성</span>
                  </nav>
               </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <Card>
                  <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">질문하기</h2>
                     <p className="text-gray-600">상세한 내용을 작성해주시면 더 정확한 답변을 드릴 수 있습니다.</p>
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* 문의 유형 */}
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                           문의 유형 *
                        </label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.category ? 'border-red-300' : 'border-gray-300'}`}>
                           <option value="">문의 유형을 선택하세요</option>
                           {categories.map((category) => (
                              <option key={category.value} value={category.value}>
                                 {category.label}
                              </option>
                           ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                     </div>

                     {/* 제목 */}
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                           제목 *
                        </label>
                        <input
                           type="text"
                           id="title"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
                           placeholder="문의 제목을 입력하세요"
                           maxLength={100}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        <p className="mt-1 text-sm text-gray-500">{formData.title.length}/100자</p>
                     </div>

                     {/* 내용 */}
                     <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                           문의 내용 *
                        </label>
                        <textarea
                           id="content"
                           name="content"
                           value={formData.content}
                           onChange={handleChange}
                           rows={8}
                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none ${errors.content ? 'border-red-300' : 'border-gray-300'}`}
                           placeholder="문의하실 내용을 자세히 작성해주세요.&#10;&#10;예시:&#10;- 어떤 상황에서 문제가 발생했나요?&#10;- 언제부터 이런 문제가 있었나요?&#10;- 어떤 결과를 기대하시나요?"
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                        <p className="mt-1 text-sm text-gray-500">{formData.content.length}자</p>
                     </div>

                     {/* 개인정보 */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              이름 *
                           </label>
                           <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                              placeholder="홍길동"
                           />
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
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                              placeholder="example@email.com"
                           />
                           {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                     </div>

                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                           연락처 *
                        </label>
                        <input
                           type="tel"
                           id="phone"
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                           placeholder="010-0000-0000"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                     </div>

                     {/* 비공개 설정 */}
                     <div className="flex items-start">
                        <input type="checkbox" id="isPrivate" name="isPrivate" checked={formData.isPrivate} onChange={handleChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1" />
                        <div className="ml-3">
                           <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                              비공개 질문으로 등록
                           </label>
                           <p className="text-xs text-gray-500 mt-1">체크하시면 작성자와 관리자만 볼 수 있습니다.</p>
                        </div>
                     </div>

                     {/* 개인정보 수집 동의 */}
                     <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-2">개인정보 수집 및 이용 동의</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                           <p>• 수집 목적: 문의 답변 및 결과 안내</p>
                           <p>• 수집 항목: 이름, 이메일, 연락처</p>
                           <p>• 보유 기간: 문의 처리 완료 후 1년</p>
                           <p>• 동의 거부 시 문의 접수가 제한될 수 있습니다.</p>
                        </div>
                     </div>

                     {/* 버튼 */}
                     <div className="flex gap-4 pt-6">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                           취소
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                           {isLoading ? (
                              <div className="flex items-center justify-center">
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 등록 중...
                              </div>
                           ) : (
                              '질문 등록'
                           )}
                        </Button>
                     </div>
                  </form>
               </Card>
            </div>
         </main>

         <Footer />
      </div>
   )
}
