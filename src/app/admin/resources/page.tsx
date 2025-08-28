'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface Resource {
   id: string
   title: string
   category: string
   file_name: string
   file_path: string
   file_size: number
   download_count: number
   is_public: boolean
   created_at: string
   author_name: string
}

export default function AdminResourcesPage() {
   const { isAdmin, isChecking } = useAdmin()
   const [resources, setResources] = useState<Resource[]>([])
   const [loading, setLoading] = useState(true)
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const [showUpload, setShowUpload] = useState(false)
   const [uploading, setUploading] = useState(false)
   const [file, setFile] = useState<File | null>(null)
   const [meta, setMeta] = useState({ title: '', description: '', category: 'general', is_public: true })
   const [filter, setFilter] = useState({ category: 'all', search: '' })

   // 카테고리별 뱃지
   const getCategoryBadge = (category: string) => {
      switch (category) {
         case 'notice':
            return <Badge variant="primary">공지사항</Badge>
         case 'manual':
            return <Badge variant="success">매뉴얼</Badge>
         case 'form':
            return <Badge variant="warning">양식</Badge>
         case 'etc':
            return <Badge variant="default">기타</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   // 자료 목록 로드
   const loadResources = async (page = 1) => {
      if (!isAdmin) return

      try {
         setLoading(true)

         const params = new URLSearchParams({ page: String(page), limit: '20' })
         if (filter.category && filter.category !== 'all') params.set('category', filter.category)
         if (filter.search) params.set('search', filter.search)

         const response = await fetch(`/api/admin/resources?${params}`)

         const data = await response.json()

         if (response.ok) {
            const list: Resource[] = data.resources || []
            setResources(list)
            setTotalPages(data.pagination?.totalPages || 1)
            setCurrentPage(page)
            if (list.length === 0) {
               setShowUpload(true)
            }
         } else {
            console.error('자료 목록 로드 실패:', data.error)
            alert('자료 목록을 불러오는데 실패했습니다.')
         }
      } catch (error) {
         console.error('자료 목록 로드 오류:', error)
         alert('서버 오류가 발생했습니다.')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadResources()
      }
   }, [isAdmin, isChecking, filter.category, filter.search])

   const handleUpload = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!file || !meta.title.trim()) {
         alert('파일과 제목을 입력하세요.')
         return
      }
      try {
         setUploading(true)
         const form = new FormData()
         form.append('file', file)
         form.append('title', meta.title)
         form.append('description', meta.description)
         form.append('category', meta.category)
         form.append('is_public', String(meta.is_public))

         const res = await fetch('/api/admin/resources', { method: 'POST', body: form })
         const data = await res.json()
         if (!res.ok) throw new Error(data.error || '업로드 실패')
         alert('업로드 완료')
         setShowUpload(false)
         setFile(null)
         setMeta({ title: '', description: '', category: 'general', is_public: true })
         loadResources(currentPage)
      } catch (err) {
         console.error('업로드 오류:', err)
         alert(err instanceof Error ? err.message : '업로드 중 오류')
      } finally {
         setUploading(false)
      }
   }

   // 자료 삭제
   const handleDelete = async (resourceId: string, title: string) => {
      if (!confirm(`'${title}' 자료를 정말 삭제하시겠습니까?`)) {
         return
      }

      try {
         const response = await fetch(`/api/admin/resources/${resourceId}`, {
            method: 'DELETE',
         })

         const result = await response.json()

         if (response.ok) {
            alert('자료가 성공적으로 삭제되었습니다.')
            loadResources(currentPage)
         } else {
            throw new Error(result.error || '삭제 실패')
         }
      } catch (error: unknown) {
         console.error('삭제 오류:', error)
         alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
      }
   }

   // 로딩 중이거나 권한이 없는 경우
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
         <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">자료실 관리</h1>
                  <p className="text-gray-600">업로드된 자료를 관리할 수 있습니다.</p>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" onClick={() => (window.location.href = '/support/resources')}>
                     자료실 보기
                  </Button>
                  <Button onClick={() => setShowUpload(true)}>자료 업로드</Button>
               </div>
            </div>

            {/* 필터 */}
            <Card className="p-4 mb-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                     <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                     <select
                        className="w-full px-3 py-2 border rounded"
                        value={filter.category}
                        onChange={(e) => {
                           setFilter({ ...filter, category: e.target.value })
                           setCurrentPage(1)
                        }}
                     >
                        <option value="all">전체</option>
                        <option value="general">일반</option>
                        <option value="exam">시험자료</option>
                        <option value="education">교육자료</option>
                        <option value="certificate">자격증자료</option>
                     </select>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm text-gray-700 mb-1">검색</label>
                     <input
                        className="w-full px-3 py-2 border rounded"
                        placeholder="제목/설명 검색"
                        value={filter.search}
                        onChange={(e) => {
                           setFilter({ ...filter, search: e.target.value })
                           setCurrentPage(1)
                        }}
                     />
                  </div>
               </div>
            </Card>

            {/* 자료 목록 */}
            {loading ? (
               <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="mt-2 text-gray-600">자료 목록을 불러오는 중입니다...</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {showUpload && (
                     <Card className="p-4">
                        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                           <div className="md:col-span-2">
                              <label className="block text-sm text-gray-700 mb-1">파일</label>
                              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                           </div>
                           <div>
                              <label className="block text-sm text-gray-700 mb-1">제목</label>
                              <input className="w-full px-3 py-2 border rounded" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />
                           </div>
                           <div>
                              <label className="block text-sm text-gray-700 mb-1">카테고리</label>
                              <select className="w-full px-3 py-2 border rounded" value={meta.category} onChange={(e) => setMeta({ ...meta, category: e.target.value })}>
                                 <option value="general">일반</option>
                                 <option value="exam">시험자료</option>
                                 <option value="education">교육자료</option>
                                 <option value="certificate">자격증자료</option>
                              </select>
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-sm text-gray-700 mb-1">설명</label>
                              <textarea className="w-full px-3 py-2 border rounded" rows={3} value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
                           </div>
                           <div className="flex items-center gap-2">
                              <input id="is_public" type="checkbox" checked={meta.is_public} onChange={(e) => setMeta({ ...meta, is_public: e.target.checked })} />
                              <label htmlFor="is_public" className="text-sm text-gray-700">
                                 공개
                              </label>
                           </div>
                           <div className="flex justify-end gap-2 md:col-span-2">
                              <Button type="button" variant="outline" onClick={() => setShowUpload(false)} disabled={uploading}>
                                 취소
                              </Button>
                              <Button type="submit" disabled={uploading}>
                                 {uploading ? '업로드 중...' : '업로드'}
                              </Button>
                           </div>
                        </form>
                     </Card>
                  )}
                  {resources.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">등록된 자료가 없습니다.</p>
                        <Button onClick={() => setShowUpload(true)}>자료 업로드</Button>
                     </div>
                  ) : (
                     resources.map((resource) => {
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(resource.file_path)
                        const base = process.env.NEXT_PUBLIC_SUPABASE_URL
                        const publicUrl = isImage && base ? `${base}/storage/v1/object/public/resources/${resource.file_path}` : ''
                        return (
                           <Card key={resource.id} className="p-6">
                              <div className="flex items-center justify-between">
                                 <div className="flex-1 min-w-0 flex items-start gap-4">
                                    {isImage ? (
                                       <img src={publicUrl} alt={resource.title} className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                       <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs">{resource.file_name?.split('.').pop()?.toUpperCase() || 'FILE'}</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center space-x-3 mb-2">
                                          {getCategoryBadge(resource.category)}
                                          {!resource.is_public && <Badge variant="error">비공개</Badge>}
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 truncate mb-1">{resource.title}</h3>
                                       <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                                          <span>작성자: {resource.author_name}</span>
                                          <span>크기: {Math.round(resource.file_size / 1024)} KB</span>
                                          <span>등록일: {new Date(resource.created_at).toLocaleDateString('ko-KR')}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => window.open(`/api/files/download/${resource.id}`, '_blank')}>
                                       다운로드
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(resource.id, resource.title)}>
                                       삭제
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        )
                     })
                  )}
               </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
               <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                     페이지 {currentPage} / {totalPages}
                  </div>
                  <div className="flex space-x-2">
                     <Button onClick={() => loadResources(currentPage - 1)} disabled={currentPage === 1} variant="outline">
                        이전
                     </Button>
                     <Button onClick={() => loadResources(currentPage + 1)} disabled={currentPage === totalPages} variant="outline">
                        다음
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
