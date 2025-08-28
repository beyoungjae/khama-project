'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAdmin } from '@/hooks/useAdmin'

interface Member {
   id: string
   email: string
   name: string | null
   phone: string | null
   address: string | null
   detail_address: string | null
   role: string
   status: string
   created_at: string
   updated_at: string
   exam_applications?: Array<{
      id: string
      application_number: string
      application_status: string
      created_at: string
      exam_schedules?: {
         exam_date: string
         exam_location: string
         certifications?: {
            name: string
         }
      }
   }>
   qna_questions?: Array<{
      id: string
      title: string
      created_at: string
      is_answered: boolean
   }>
}

export default function AdminMemberDetailPage() {
   const { isAdmin, isChecking } = useAdmin()
   const params = useParams()
   const router = useRouter()
   const [member, setMember] = useState<Member | null>(null)
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)

   const [editData, setEditData] = useState({
      name: '',
      phone: '',
      address: '',
      detail_address: '',
      role: '',
      status: '',
   })

   useEffect(() => {
      if (!isAdmin || isChecking) return

      const loadMember = async () => {
         try {
            setLoading(true)

            const response = await fetch(`/api/admin/members/${params.id}`)

            if (response.ok) {
               const data = await response.json()
               setMember(data.member)
               setEditData({
                  name: data.member.name || '',
                  phone: data.member.phone || '',
                  address: data.member.address || '',
                  detail_address: data.member.detail_address || '',
                  role: data.member.role || '',
                  status: data.member.status || '',
               })
            } else {
               console.error('회원 정보 로드 실패:', await response.text())
               alert('회원 정보를 불러오는데 실패했습니다.')
            }
         } catch (error) {
            console.error('회원 정보 로드 오류:', error)
            alert('회원 정보를 불러오는 중 오류가 발생했습니다.')
         } finally {
            setLoading(false)
         }
      }

      loadMember()
   }, [isAdmin, isChecking, params.id])

   const handleSave = async () => {
      try {
         setSaving(true)

         const response = await fetch(`/api/admin/members/${params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               userId: params.id,
               updates: editData,
            }),
         })

         if (response.ok) {
            const data = await response.json()
            setMember(data.member)
            alert('회원 정보가 업데이트되었습니다.')
         } else {
            const errorData = await response.json()
            console.error('회원 정보 업데이트 실패:', errorData)
            alert('회원 정보 업데이트에 실패했습니다.')
         }
      } catch (error) {
         console.error('회원 정보 업데이트 오류:', error)
         alert('회원 정보를 업데이트하는 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   const handleDelete = async () => {
      if (!confirm('정말로 이 회원을 삭제하시겠습니까?')) {
         return
      }

      try {
         setSaving(true)

         // 인증 헤더 추가
         const token = localStorage.getItem('admin-token')
         const headers: Record<string, string> = {
            'Content-Type': 'application/json',
         }

         if (token) {
            headers['Authorization'] = `Bearer ${token}`
         }

         const response = await fetch(`/api/admin/members/${params.id}`, {
            method: 'DELETE',
            headers,
         })

         if (response.ok) {
            alert('회원이 삭제되었습니다.')
            router.push('/admin/users')
         } else {
            const errorData = await response.json()
            console.error('회원 삭제 실패:', errorData)
            alert('회원 삭제에 실패했습니다.')
         }
      } catch (error) {
         console.error('회원 삭제 오류:', error)
         alert('회원을 삭제하는 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   const handleStatusChange = async (newStatus: string) => {
      try {
         setSaving(true)

         const response = await fetch(`/api/admin/members/${params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               userId: params.id,
               updates: { status: newStatus },
            }),
         })

         if (response.ok) {
            const data = await response.json()
            setMember(data.member)
            setEditData({ ...editData, status: newStatus })
            alert('회원 상태가 업데이트되었습니다.')
         } else {
            const errorData = await response.json()
            console.error('회원 상태 업데이트 실패:', errorData)
            alert('회원 상태 업데이트에 실패했습니다.')
         }
      } catch (error) {
         console.error('회원 상태 업데이트 오류:', error)
         alert('회원 상태를 업데이트하는 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   const handleRoleChange = async (newRole: string) => {
      try {
         setSaving(true)

         const response = await fetch(`/api/admin/members/${params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               userId: params.id,
               updates: { role: newRole },
            }),
         })

         if (response.ok) {
            const data = await response.json()
            setMember(data.member)
            setEditData({ ...editData, role: newRole })
            alert('회원 역할이 업데이트되었습니다.')
         } else {
            const errorData = await response.json()
            console.error('회원 역할 업데이트 실패:', errorData)
            alert('회원 역할 업데이트에 실패했습니다.')
         }
      } catch (error) {
         console.error('회원 역할 업데이트 오류:', error)
         alert('회원 역할을 업데이트하는 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
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
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
         </div>
      )
   }

   if (!member) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h1 className="text-2xl font-bold text-gray-900 mb-4">회원을 찾을 수 없습니다</h1>
               <Link href="/admin/users" className="text-blue-600 hover:text-blue-800">
                  ← 사용자 목록으로 돌아가기
               </Link>
            </div>
         </div>
      )
   }

   return (
      <div className="bg-white rounded-lg shadow-sm p-6">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">회원 상세 정보</h1>
               <p className="text-gray-600">회원의 상세 정보를 확인하고 관리할 수 있습니다.</p>
            </div>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-800">
               ← 목록으로 돌아가기
            </Link>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-lg p-6">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700">이메일</label>
                     <p className="mt-1 text-sm text-gray-900">{member.email}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">이름</label>
                     <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">전화번호</label>
                     <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">주소</label>
                     <input type="text" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="기본 주소" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">상세 주소</label>
                     <input type="text" value={editData.detail_address} onChange={(e) => setEditData({ ...editData, detail_address: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="상세 주소 (아파트/빌딩명, 동호수 등)" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">역할</label>
                     <select value={editData.role} onChange={(e) => handleRoleChange(e.target.value)} disabled={saving} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="user">일반 사용자</option>
                        <option value="admin">관리자</option>
                        <option value="super_admin">슈퍼 관리자</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">상태</label>
                     <select value={editData.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={saving} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                        <option value="suspended">정지</option>
                        <option value="deleted">삭제</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">가입일</label>
                     <p className="mt-1 text-sm text-gray-900">{new Date(member.created_at).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">최근 업데이트</label>
                     <p className="mt-1 text-sm text-gray-900">{new Date(member.updated_at).toLocaleDateString('ko-KR')}</p>
                  </div>
               </div>
               <div className="mt-6 flex space-x-3">
                  <button
                     onClick={handleSave}
                     disabled={saving}
                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                     {saving ? '저장 중...' : '정보 저장'}
                  </button>
                  <button
                     onClick={handleDelete}
                     disabled={saving}
                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                     {saving ? '삭제 중...' : '회원 삭제'}
                  </button>
               </div>
            </div>

            {/* 시험 신청 이력 */}
            <div>
               <h2 className="text-lg font-semibold text-gray-900 mb-4">시험 신청 이력</h2>
               {member.exam_applications && member.exam_applications.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                     <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                           <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                 시험명
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 신청번호
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 상태
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 신청일
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                           {member.exam_applications.map((application) => (
                              <tr key={application.id} className="hover:bg-gray-50">
                                 <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{application.exam_schedules?.certifications?.name || '시험명 미상'}</td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{application.application_number}</td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{application.application_status}</span>
                                 </td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(application.created_at).toLocaleDateString('ko-KR')}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <p className="text-gray-500">시험 신청 이력이 없습니다.</p>
               )}

               {/* Q&A 이력 */}
               <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Q&A 이력</h2>
               {member.qna_questions && member.qna_questions.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                     <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                           <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                 제목
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 상태
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 작성일
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                           {member.qna_questions.map((question) => (
                              <tr key={question.id} className="hover:bg-gray-50">
                                 <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{question.title}</td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${question.is_answered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{question.is_answered ? '답변완료' : '답변대기'}</span>
                                 </td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(question.created_at).toLocaleDateString('ko-KR')}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <p className="text-gray-500">Q&A 이력이 없습니다.</p>
               )}
            </div>
         </div>
      </div>
   )
}
