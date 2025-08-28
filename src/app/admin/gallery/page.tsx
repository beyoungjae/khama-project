'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import OptimizedImage from '@/components/ui/OptimizedImage'

interface GalleryImage {
   id: string
   title: string
   description: string | null
   file_url: string
   file_name: string
   file_path: string
   category: string
   display_order: number | null
   is_active: boolean | null
   alt_text: string | null
   tags: string[] | null
   uploaded_by: string | null
   created_at: string
   updated_at: string
}

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminGalleryPage() {
   const { isAdmin, isChecking } = useAdmin()

   const [images, setImages] = useState<GalleryImage[]>([])
   const [loading, setLoading] = useState(true)

   const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
   })

   const [filters, setFilters] = useState({
      category: 'all',
      status: 'all',
      search: '',
   })

   const [showUploadModal, setShowUploadModal] = useState(false)
   const [uploadForm, setUploadForm] = useState({
      title: '',
      description: '',
      category: 'education',
      display_order: 1,
      is_active: true,
   })
   const [uploading, setUploading] = useState(false)
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [previewUrl, setPreviewUrl] = useState<string | null>(null)

   const categoryOptions = [
      { value: 'all', label: '전체' },
      { value: 'education', label: '교육 현장' },
      { value: 'exam', label: '시험' },
      { value: 'practice', label: '실습' },
      { value: 'graduation', label: '수료식' },
      { value: 'association', label: '협회 활동' },
      { value: 'seminar', label: '세미나' },
   ]

   const statusOptions = [
      { value: 'all', label: '전체' },
      { value: 'published', label: '게시됨' },
      { value: 'draft', label: '임시저장' },
   ]

   // 갤러리 목록 로드
   const loadImages = useCallback(
      async (page = 1) => {
         if (!isAdmin) return

         try {
            setLoading(true)

            const params = new URLSearchParams({
               page: page.toString(),
               limit: pagination.limit.toString(),
               category: filters.category,
               status: filters.status,
               ...(filters.search && { search: filters.search }),
            })

            const headers: Record<string, string> = { 'Content-Type': 'application/json' }

            const response = await fetch(`/api/admin/gallery?${params}`, {
               headers,
            })

            if (!response.ok) {
               throw new Error('갤러리 목록을 불러올 수 없습니다.')
            }

            const data = await response.json()
            setImages(data.images || [])
            setPagination(data.pagination)
         } catch (error) {
            console.error('갤러리 목록 로드 오류:', error)
            alert(error instanceof Error ? error.message : '서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [isAdmin, pagination.limit, filters.category, filters.status, filters.search]
   )

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadImages()
      }
   }, [isAdmin, isChecking, loadImages])

   // 카테고리 뱃지 렌더링
   const renderCategoryBadge = (category: string) => {
      switch (category) {
         case 'education':
            return <Badge variant="primary">교육 현장</Badge>
         case 'exam':
            return <Badge variant="secondary">시험</Badge>
         case 'practice':
            return <Badge variant="success">실습</Badge>
         case 'graduation':
            return <Badge variant="warning">수료식</Badge>
         case 'association':
            return <Badge variant="error">협회 활동</Badge>
         case 'seminar':
            return <Badge variant="default">세미나</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   // 상태 뱃지 렌더링
   const renderStatusBadge = (status: string) => {
      return status === 'active' ? <Badge variant="success">활성</Badge> : <Badge variant="default">비활성</Badge>
   }

   // 이미지 업로드 처리
   const handleImageUpload = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!uploadForm.title.trim()) {
         alert('제목을 입력해주세요.')
         return
      }

      if (!selectedFile) {
         alert('이미지 파일을 선택해주세요.')
         return
      }

      try {
         setUploading(true)

         // FormData로 파일 업로드
         const formData = new FormData()
         formData.append('file', selectedFile)
         formData.append('title', uploadForm.title)
         formData.append('description', uploadForm.description)
         formData.append('category', uploadForm.category)
         formData.append('display_order', uploadForm.display_order.toString())
         formData.append('is_active', uploadForm.is_active.toString())

         const headers: Record<string, string> = {}

         const response = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers,
            body: formData,
         })

         if (!response.ok) {
            throw new Error('이미지 업로드에 실패했습니다.')
         }

         alert('이미지가 성공적으로 추가되었습니다.')
         setShowUploadModal(false)
         setUploadForm({
            title: '',
            description: '',
            category: 'education',
            display_order: 1,
            is_active: true,
         })
         setSelectedFile(null)
         setPreviewUrl(null)
         loadImages()
      } catch (error) {
         console.error('이미지 업로드 오류:', error)
         alert(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
      } finally {
         setUploading(false)
      }
   }

   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!isAdmin) {
      return null
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">갤러리 관리</h1>
                  <p className="text-gray-600">협회 활동 이미지를 관리할 수 있습니다.</p>
               </div>
               <Button onClick={() => setShowUploadModal(true)}>새 이미지 추가</Button>
            </div>

            {/* 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                     {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                     {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
                  <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="제목, 설명으로 검색" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
               </div>

               <div className="flex items-end">
                  <Button onClick={() => loadImages()} disabled={loading}>
                     {loading ? '로딩 중...' : '검색'}
                  </Button>
               </div>
            </div>

            {/* 갤러리 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                     <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                     </div>
                  ))
               ) : images.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                     <p className="text-gray-500">갤러리 이미지가 없습니다.</p>
                  </div>
               ) : (
                  images.map((image) => (
                     <div key={image.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 relative">
                           <OptimizedImage src={image.file_url} alt={image.title} width={300} height={300} className="w-full h-full object-cover" fallbackSrc="https://via.placeholder.com/300x300?text=No+Image" />
                           <div className="absolute top-2 right-2">{renderStatusBadge(image.is_active ? 'active' : 'inactive')}</div>
                        </div>
                        <div className="p-4">
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                              {renderCategoryBadge(image.category)}
                           </div>
                           <p className="text-sm text-gray-500 mb-3 line-clamp-2">{image.description}</p>
                           <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>순서: {image.display_order}</span>
                              <span>{new Date(image.created_at).toLocaleDateString('ko-KR')}</span>
                           </div>
                           <div className="mt-3 flex space-x-2">
                              <Button
                                 size="sm"
                                 variant="outline"
                                 className="text-blue-600 hover:text-blue-700"
                                 onClick={() => {
                                    navigator.clipboard.writeText(image.file_url)
                                    alert('이미지 URL이 복사되었습니다.')
                                 }}
                              >
                                 URL 복사
                              </Button>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 className="text-red-600 hover:text-red-700"
                                 onClick={async () => {
                                    if (!confirm('해당 이미지를 삭제하시겠습니까? 되돌릴 수 없습니다.')) return
                                    try {
                                       const res = await fetch(`/api/admin/gallery/${image.id}`, { method: 'DELETE', credentials: 'include' })
                                       const data = await res.json()
                                       if (!res.ok) throw new Error(data.error || '삭제 실패')
                                       alert('삭제되었습니다.')
                                       loadImages(pagination.page)
                                    } catch (e) {
                                       alert(e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.')
                                    }
                                 }}
                              >
                                 삭제
                              </Button>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
               <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                     총 {pagination.total}개 중 {pagination.page * pagination.limit - pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}개 표시
                  </div>
                  <div className="flex space-x-2">
                     <Button onClick={() => loadImages(pagination.page - 1)} disabled={pagination.page === 1} variant="outline">
                        이전
                     </Button>
                     <Button onClick={() => loadImages(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} variant="outline">
                        다음
                     </Button>
                  </div>
               </div>
            )}

            {/* 이미지 업로드 모달 */}
            {showUploadModal && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                     <h3 className="text-lg font-semibold mb-4">새 이미지 추가</h3>
                     <form onSubmit={handleImageUpload} className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                           <input
                              type="text"
                              value={uploadForm.title}
                              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="이미지 제목을 입력하세요"
                              required
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                           <textarea
                              value={uploadForm.description}
                              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="이미지 설명을 입력하세요"
                              rows={3}
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">이미지 파일 *</label>
                           <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                 const file = e.target.files?.[0]
                                 if (file) {
                                    setSelectedFile(file)
                                    const url = URL.createObjectURL(file)
                                    setPreviewUrl(url)
                                 }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                           />
                           {previewUrl && (
                              <div className="mt-2">
                                 <Image src={previewUrl} alt="미리보기" width={300} height={128} className="w-full h-32 object-cover rounded-md" />
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                           <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                              {categoryOptions.slice(1).map((option) => (
                                 <option key={option.value} value={option.value}>
                                    {option.label}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
                              <input
                                 type="number"
                                 value={uploadForm.display_order}
                                 onChange={(e) => setUploadForm({ ...uploadForm, display_order: parseInt(e.target.value) || 1 })}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                 min="1"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                              <select
                                 value={uploadForm.is_active ? 'active' : 'inactive'}
                                 onChange={(e) => setUploadForm({ ...uploadForm, is_active: e.target.value === 'active' })}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                 <option value="active">활성</option>
                                 <option value="inactive">비활성</option>
                              </select>
                           </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                           <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)} disabled={uploading}>
                              취소
                           </Button>
                           <Button type="submit" disabled={uploading}>
                              {uploading ? '업로드 중...' : '추가'}
                           </Button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
