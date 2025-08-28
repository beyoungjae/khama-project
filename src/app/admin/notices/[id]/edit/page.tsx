'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { useRouter, useParams } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'

interface NoticeForm {
   title: string
   content: string
   category: string
   is_important: boolean
   is_pinned: boolean
   status: 'draft' | 'published'
}

export default function AdminNoticeEditPage() {
   const { isAdmin, isChecking } = useAdmin()
   const router = useRouter()
   const params = useParams()
   const noticeId = params.id as string

   const [form, setForm] = useState<NoticeForm>({
      title: '',
      content: '',
      category: 'general',
      is_important: false,
      is_pinned: false,
      status: 'draft',
   })

   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)
   const [errors, setErrors] = useState<Record<string, string>>({})

   const categoryOptions = [
      { value: 'general', label: '일반공지' },
      { value: 'exam', label: '시험공지' },
      { value: 'education', label: '교육공지' },
      { value: 'system', label: '시스템공지' },
   ]

   // 공지사항 데이터 로드
   useEffect(() => {
      if (!isAdmin || !noticeId) return

      const loadNotice = async () => {
         try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }

            const response = await fetch(`/api/admin/notices/${noticeId}`, {
               headers,
            })

            if (!response.ok) {
               throw new Error('공지사항을 불러올 수 없습니다.')
            }

            const data = await response.json()
            const notice = data.notice

            setForm({
               title: notice.title || '',
               content: notice.content || '',
               category: notice.category || 'general',
               is_important: notice.is_important || false,
               is_pinned: notice.is_pinned || false,
               status: notice.status || 'draft',
            })
         } catch (error) {
            console.error('공지사항 로드 오류:', error)
            alert('공지사항을 불러올 수 없습니다.')
            router.push('/admin/notices')
         } finally {
            setLoading(false)
         }
      }

      loadNotice()
   }, [isAdmin, noticeId, router])

   // 폼 유효성 검증
   const validateForm = () => {
      const newErrors: Record<string, string> = {}

      if (!form.title.trim()) {
         newErrors.title = '제목을 입력해주세요.'
      } else if (form.title.length < 5) {
         newErrors.title = '제목은 5자 이상 입력해주세요.'
      }

      if (!form.content.trim()) {
         newErrors.content = '내용을 입력해주세요.'
      } else if (form.content.length < 10) {
         newErrors.content = '내용은 10자 이상 입력해주세요.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   // 공지사항 수정
   const handleSubmit = async (status: 'draft' | 'published') => {
      if (!validateForm()) return

      try {
         setSaving(true)

         const headers: Record<string, string> = { 'Content-Type': 'application/json' }

         const response = await fetch(`/api/admin/notices/${noticeId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
               ...form,
               status,
            }),
         })

         if (!response.ok) {
            throw new Error('공지사항을 수정할 수 없습니다.')
         }

         if (status === 'published') {
            alert('공지사항이 수정되어 게시되었습니다.')
         } else {
            alert('공지사항이 임시저장되었습니다.')
         }

         router.push('/admin/notices')
      } catch (error: unknown) {
         console.error('공지사항 수정 오류:', error)
         alert(error instanceof Error ? error.message : '수정 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // 로딩 중이거나 권한이 없는 경우
   if (isChecking || loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">공지사항 편집</h1>
                  <p className="text-gray-600">공지사항을 수정합니다.</p>
               </div>
               <Button onClick={() => router.back()} variant="outline">
                  취소
               </Button>
            </div>

            <form className="space-y-6">
               {/* 제목 */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     value={form.title}
                     onChange={(e) => setForm({ ...form, title: e.target.value })}
                     placeholder="공지사항 제목을 입력하세요"
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
               </div>

               {/* 카테고리 및 옵션 */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                     <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        {categoryOptions.map((option) => (
                           <option key={option.value} value={option.value}>
                              {option.label}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-3">
                     <label className="block text-sm font-medium text-gray-700">옵션</label>
                     <div className="space-y-2">
                        <label className="flex items-center">
                           <input type="checkbox" checked={form.is_important} onChange={(e) => setForm({ ...form, is_important: e.target.checked })} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                           <span className="ml-2 text-sm text-gray-700">중요 공지사항</span>
                        </label>
                        <label className="flex items-center">
                           <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                           <span className="ml-2 text-sm text-gray-700">상단 고정</span>
                        </label>
                     </div>
                  </div>
               </div>

               {/* 내용 */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                     value={form.content}
                     onChange={(e) => setForm({ ...form, content: e.target.value })}
                     placeholder="공지사항 내용을 입력하세요"
                     rows={15}
                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.content ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                  <p className="mt-1 text-sm text-gray-500">현재 {form.content.length}자 (최소 10자 이상)</p>
               </div>

               {/* 저장 버튼 */}
               <div className="flex justify-end space-x-3">
                  <Button type="button" onClick={() => handleSubmit('draft')} disabled={saving} variant="outline">
                     {saving ? '저장 중...' : '임시저장'}
                  </Button>
                  <Button type="button" onClick={() => handleSubmit('published')} disabled={saving}>
                     {saving ? '게시 중...' : '게시하기'}
                  </Button>
               </div>
            </form>
         </div>
      </AdminLayout>
   )
}
