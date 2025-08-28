'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import TextArea from '@/components/ui/TextArea'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { useAuth } from '@/contexts/AuthContext'

export default function InquiryWritePage() {
   const router = useRouter()
   const { user, profile, loading: authLoading } = useAuth()
   const [loading, setLoading] = useState(false)
   const [formData, setFormData] = useState({
      title: '',
      category: 'general',
      content: '',
      is_private: false,
   })

   // 카테고리 목록
   const categories = [
      { value: 'exam', label: '시험문의' },
      { value: 'education', label: '교육문의' },
      { value: 'certificate', label: '자격증문의' },
      { value: 'general', label: '기타문의' },
   ]

   // 폼 데이터 변경 처리
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }))
   }

   // 로그인 유도: 미로그인 시 /login 로 이동
   useEffect(() => {
      if (!authLoading && !user) {
         const redirect = encodeURIComponent('/support/inquiry/write')
         window.location.href = `/login?redirectTo=${redirect}`
      }
   }, [authLoading, user])

   // 1:1 문의 제출
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      // 필수 필드 검증
      if (!formData.title || !formData.content) {
         alert('제목과 내용을 입력해주세요.')
         return
      }

      try {
         setLoading(true)

         const payload = {
            name: profile?.name || user?.email?.split('@')[0] || '사용자',
            phone: profile?.phone || '',
            email: user?.email || '',
            category: formData.category,
            subject: formData.title,
            message: formData.content,
            is_private: formData.is_private,
         }

         const response = await fetch('/api/support/inquiry', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
         })

         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || '문의 등록에 실패했습니다.')
         }

         const data = await response.json()
         alert('문의가 성공적으로 등록되었습니다.')
         router.push('/support/inquiry')
      } catch (error) {
         console.error('문의 등록 오류:', error)
         alert(`문의 등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="min-h-screen flex flex-col">
         <Header />

         <main className="flex-grow pt-16">
            {/* 히어로 섹션 */}
            <section className="bg-gray-50 py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">1:1 문의 작성</h1>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">궁금한 점을 자세히 작성해주세요. 빠르고 정확하게 답변해드리겠습니다.</p>
                  </div>
               </div>
            </section>

            <section className="py-12">
               <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="p-6">
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                           <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                              문의 유형
                           </label>
                           <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                              {categories.map((category) => (
                                 <option key={category.value} value={category.value}>
                                    {category.label}
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                              제목
                           </label>
                           <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="문의 제목을 입력해주세요" required />
                        </div>

                        <div>
                           <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                              내용
                           </label>
                           <RichTextEditor value={formData.content} onChange={(html)=>setFormData(prev=>({...prev, content: html}))} placeholder="문의 내용을 자세히 입력해주세요" height={300} />
                        </div>

                        <div className="flex items-center">
                           <input id="is_private" name="is_private" type="checkbox" checked={formData.is_private} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                           <label htmlFor="is_private" className="ml-2 block text-sm text-gray-700">
                              비공개 문의 (관리자만 확인 가능)
                           </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                           <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                              취소
                           </Button>
                           <Button type="submit" disabled={loading}>
                              {loading ? '등록 중...' : '문의 등록'}
                           </Button>
                        </div>
                     </form>
                  </Card>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
