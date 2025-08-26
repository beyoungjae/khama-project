'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Member {
   id: string
   name: string
   email: string
   phone: string
   birth_date: string
   gender: 'male' | 'female' | 'other'
   address: string
   status: 'active' | 'inactive' | 'suspended'
   role: 'user' | 'admin' | 'super_admin'
   marketing_agreed: boolean
   created_at: string
   last_login_at: string
}

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminMembersPage() {
   const { isAdmin, isChecking } = useAdmin()

   const [members, setMembers] = useState<Member[]>([])
   const [loading, setLoading] = useState(true)

   const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
   })

   const [filters, setFilters] = useState({
      status: 'all',
      role: 'all',
      search: '',
   })

   const statusOptions = [
      { value: 'all', label: '전체' },
      { value: 'active', label: '활성' },
      { value: 'inactive', label: '비활성' },
      { value: 'suspended', label: '정지' },
   ]

   const roleOptions = [
      { value: 'all', label: '전체' },
      { value: 'user', label: '일반회원' },
      { value: 'admin', label: '관리자' },
      { value: 'super_admin', label: '최고관리자' },
   ]

   // 회원 목록 로드
   const loadMembers = useCallback(
      async (page = 1) => {
         if (!isAdmin) return

         try {
            setLoading(true)

            const params = new URLSearchParams({
               page: page.toString(),
               limit: pagination.limit.toString(),
               status: filters.status,
               role: filters.role,
               ...(filters.search && { search: filters.search }),
            })

            const token = localStorage.getItem('admin-token')
            const headers: Record<string, string> = {
               'Content-Type': 'application/json',
            }

            if (token) {
               headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`/api/admin/members?${params}`, {
               headers,
            })

            if (!response.ok) {
               throw new Error('회원 목록을 불러올 수 없습니다.')
            }

            const data = await response.json()
            setMembers(data.members || [])
            setPagination(data.pagination)
         } catch (error) {
            console.error('회원 목록 로드 오류:', error)
            alert(error instanceof Error ? error.message : '서버 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [isAdmin, pagination.limit, filters.status, filters.role, filters.search]
   )

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadMembers()
      }
   }, [isAdmin, isChecking, loadMembers])

   // 상태 뱃지 렌더링
   const renderStatusBadge = (status: string) => {
      switch (status) {
         case 'active':
            return <Badge variant="success">활성</Badge>
         case 'inactive':
            return <Badge variant="warning">비활성</Badge>
         case 'suspended':
            return <Badge variant="error">정지</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   // 역할 뱃지 렌더링
   const renderRoleBadge = (role: string) => {
      switch (role) {
         case 'user':
            return <Badge variant="default">일반회원</Badge>
         case 'admin':
            return <Badge variant="primary">관리자</Badge>
         case 'super_admin':
            return <Badge variant="error">최고관리자</Badge>
         default:
            return <Badge variant="default">{role}</Badge>
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
                  <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
                  <p className="text-gray-600">회원 정보를 조회하고 관리할 수 있습니다.</p>
               </div>
            </div>

            {/* 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                  <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                     {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
                  <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="이름, 이메일로 검색" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
               </div>

               <div className="flex items-end">
                  <Button onClick={() => loadMembers()} disabled={loading}>
                     {loading ? '로딩 중...' : '검색'}
                  </Button>
               </div>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           회원 정보
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           연락처
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           역할
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           가입일
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           최근 로그인
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-4 text-center">
                              <LoadingSpinner />
                           </td>
                        </tr>
                     ) : members.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              회원이 없습니다.
                           </td>
                        </tr>
                     ) : (
                        members.map((member) => (
                           <tr key={member.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                 <div className="text-sm text-gray-500">{member.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{member.phone}</div>
                                 <div className="text-sm text-gray-500">
                                    {member.birth_date} ({member.gender === 'male' ? '남' : member.gender === 'female' ? '여' : '기타'})
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(member.status)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{renderRoleBadge(member.role)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(member.created_at).toLocaleDateString('ko-KR')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.last_login_at ? new Date(member.last_login_at).toLocaleDateString('ko-KR') : '없음'}</td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
               <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                     총 {pagination.total}개 중 {pagination.page * pagination.limit - pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}개 표시
                  </div>
                  <div className="flex space-x-2">
                     <Button onClick={() => loadMembers(pagination.page - 1)} disabled={pagination.page === 1} variant="outline">
                        이전
                     </Button>
                     <Button onClick={() => loadMembers(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} variant="outline">
                        다음
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </AdminLayout>
   )
}
