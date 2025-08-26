'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/layout/AdminLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAdmin } from '@/hooks/useAdmin'

interface Certification {
   id: string
   name: string
   registration_number: string
   description: string | null
   application_fee: number
   certificate_fee: number
   exam_subjects: string[]
   exam_methods: string[]
   passing_criteria: string | null
   exemption_benefits: string | null
   status: 'active' | 'inactive' | 'draft'
   created_at: string
   updated_at: string
   image_url?: string
   qualification_type?: string
   grade?: string
   eligibility?: string
   validity_period?: string
}

interface Pagination {
   page: number
   limit: number
   total: number
   totalPages: number
}

export default function AdminCertificationsPage() {
   const { isAdmin, isChecking } = useAdmin()
   const [certifications, setCertifications] = useState<Certification[]>([])
   const [loading, setLoading] = useState(true)
   const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
   })

   // 필터 상태
   const [filters, setFilters] = useState({
      status: 'active',
      search: '',
   })

   // 자격증 추가/수정 상태
   const [showModal, setShowModal] = useState(false)
   const [saving, setSaving] = useState(false)
   const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
   const [form, setForm] = useState({
      name: '',
      registration_number: '',
      description: '',
      application_fee: 0,
      certificate_fee: 0,
      exam_subjects: '',
      exam_methods: '',
      passing_criteria: '',
      exemption_benefits: '',
      status: 'active' as 'active' | 'inactive' | 'draft',
      image_url: '',
      qualification_type: '',
      grade: '',
      eligibility: '',
      validity_period: '',
   })

   // 시험 과목 및 방법 상태
   const [examSubjects, setExamSubjects] = useState<Array<{ name: string; description: string }>>([{ name: '', description: '' }])
   const [examMethods, setExamMethods] = useState<Array<{ type: string; questions: string; time: string; subjects: string[] }>>([{ type: '', questions: '', time: '', subjects: [] }])
   const [passingCriteria, setPassingCriteria] = useState({ written: '', practical: '' })

   // 상태 관리 추가
   const [structuredCriteria, setStructuredCriteria] = useState<Array<{ category: string; details: string[] }>>([
      { category: '필기시험', details: [''] },
      { category: '실기시험', details: [''] },
   ])

   // 기존 형식 사용 여부
   const [useLegacyFormat, setUseLegacyFormat] = useState(false)

   // 자격증 목록 로드 함수
   const loadCertifications = useCallback(
      async (page: number = 1) => {
         try {
            setLoading(true)
            const response = await fetch(`/api/admin/certifications?page=${page}&limit=${pagination.limit}&status=${filters.status}&search=${filters.search}`)
            const result = await response.json()

            if (response.ok) {
               setCertifications(result.certifications)
               setPagination((prev) => ({
                  ...prev,
                  page: result.pagination.page,
                  total: result.pagination.total,
                  totalPages: result.pagination.totalPages,
               }))
            } else {
               throw new Error(result.error || '자격증 목록을 불러오는데 실패했습니다.')
            }
         } catch (error) {
            console.error('자격증 목록 로드 오류:', error)
            alert(error instanceof Error ? error.message : '자격증 목록을 불러오는데 실패했습니다.')
         } finally {
            setLoading(false)
         }
      },
      [filters, pagination.limit] // 의존성 배열에 필요한 값만 포함
   )

   // 페이지 로드 시 자격증 목록 로드
   useEffect(() => {
      if (isAdmin) {
         loadCertifications(1)
      }
   }, [isAdmin, loadCertifications]) // loadCertifications를 의존성 배열에 추가

   // 시험 과목 관리 함수들
   const addExamSubject = () => {
      setExamSubjects([...examSubjects, { name: '', description: '' }])
   }

   const removeExamSubject = (index: number) => {
      setExamSubjects(examSubjects.filter((_, i) => i !== index))
   }

   const handleExamSubjectChange = (index: number, field: string, value: string) => {
      const updatedSubjects = [...examSubjects]
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value }
      setExamSubjects(updatedSubjects)
   }

   // 시험 방법 관리 함수들
   const addExamMethod = () => {
      setExamMethods([...examMethods, { type: '', questions: '', time: '', subjects: [] }])
   }

   const removeExamMethod = (index: number) => {
      setExamMethods(examMethods.filter((_, i) => i !== index))
   }

   const handleExamMethodChange = (index: number, field: string, value: string | string[]) => {
      const updatedMethods = [...examMethods]
      updatedMethods[index] = { ...updatedMethods[index], [field]: value }
      setExamMethods(updatedMethods)
   }

   // 자격증 추가 모달 열기
   const openAddModal = () => {
      setEditingCertification(null)
      setForm({
         name: '',
         registration_number: '',
         description: '',
         application_fee: 0,
         certificate_fee: 0,
         exam_subjects: '',
         exam_methods: '',
         passing_criteria: '',
         exemption_benefits: '',
         status: 'active' as 'active' | 'inactive' | 'draft',
         image_url: '',
         qualification_type: '등록민간자격',
         grade: '단일등급',
         eligibility: '교육 이수자',
         validity_period: '평생유효',
      })
      setExamSubjects([{ name: '', description: '' }])
      setExamMethods([{ type: '', questions: '', time: '', subjects: [] }])
      setPassingCriteria({ written: '', practical: '' })
      setStructuredCriteria([
         { category: '필기시험', details: [''] },
         { category: '실기시험', details: [''] },
      ])
      setUseLegacyFormat(false)
      setShowModal(true)
   }

   // 자격증 수정 모달 열기
   const openEditModal = (certification: Certification) => {
      setEditingCertification(certification)
      setForm({
         name: certification.name,
         registration_number: certification.registration_number,
         description: certification.description || '',
         application_fee: certification.application_fee || 0,
         certificate_fee: certification.certificate_fee || 0,
         exam_subjects: certification.exam_subjects ? JSON.stringify(certification.exam_subjects, null, 2) : '',
         exam_methods: certification.exam_methods ? JSON.stringify(certification.exam_methods, null, 2) : '',
         passing_criteria: certification.passing_criteria || '',
         exemption_benefits: certification.exemption_benefits || '',
         status: certification.status,
         image_url: certification.image_url || '',
         // 기본 정보가 없으면 기본값 설정
         qualification_type: certification.qualification_type || '등록민간자격',
         grade: certification.grade || '단일등급',
         eligibility: certification.eligibility || '교육 이수자',
         validity_period: certification.validity_period || '평생유효',
      })

      // 시험 과목 파싱
      try {
         if (typeof certification.exam_subjects === 'string') {
            setExamSubjects(JSON.parse(certification.exam_subjects))
         } else if (Array.isArray(certification.exam_subjects)) {
            // 배열이지만 올바른 형태인지 확인
            const validSubjects = certification.exam_subjects.every((item: unknown) => typeof item === 'object' && item !== null && 'name' in item && 'description' in item)
            if (validSubjects) {
               setExamSubjects(certification.exam_subjects as unknown as Array<{ name: string; description: string }>)
            } else {
               setExamSubjects([{ name: '', description: '' }])
            }
         } else {
            setExamSubjects([{ name: '', description: '' }])
         }
      } catch (error) {
         setExamSubjects([{ name: '', description: '' }])
      }

      // 시험 방법 파싱
      try {
         let parsedMethods: Array<{ type: string; questions: string; time: string; subjects: string[] }> = []
         if (typeof certification.exam_methods === 'string') {
            parsedMethods = JSON.parse(certification.exam_methods)
         } else if (Array.isArray(certification.exam_methods)) {
            // 배열이지만 올바른 형태인지 확인
            const validMethods = certification.exam_methods.every((item: unknown) => typeof item === 'object' && item !== null && 'type' in item)
            if (validMethods) {
               parsedMethods = certification.exam_methods as unknown as Array<{ type: string; questions: string; time: string; subjects: string[] }>
            } else {
               parsedMethods = [{ type: '', questions: '', time: '', subjects: [] }]
            }
         } else {
            parsedMethods = [{ type: '', questions: '', time: '', subjects: [] }]
         }

         // 시험 방법에 과목 인덱스 정보 포함
         const processedMethods = parsedMethods.map((method) => {
            // 기존 데이터에 subjects가 없는 경우 빈 배열로 초기화
            if (method.subjects === undefined) {
               method.subjects = []
            }
            return method
         })

         setExamMethods(processedMethods)
      } catch (error) {
         setExamMethods([{ type: '', questions: '', time: '', subjects: [] }])
      }

      // 합격 기준 파싱
      try {
         if (certification.passing_criteria) {
            // 1. JSON 형식인지 확인
            if (certification.passing_criteria.startsWith('{')) {
               try {
                  const criteria = JSON.parse(certification.passing_criteria)
                  if (criteria.items && Array.isArray(criteria.items)) {
                     // 구조화된 데이터가 있으면 구조화된 UI로 표시
                     setStructuredCriteria(criteria.items)
                     setUseLegacyFormat(false)

                     // 기존 형식의 필드는 비워둠
                     setPassingCriteria({ written: '', practical: '' })
                     return
                  }
               } catch (error) {
                  // JSON 파싱 실패 시 기존 방식으로 계속 진행
               }
            }

            // 2. 기존 텍스트 형식 파싱
            const lines = certification.passing_criteria.split('\n')
            let written = ''
            let practical = ''
            const others = []

            for (const line of lines) {
               if (line.startsWith('필기시험:')) {
                  written = line.substring('필기시험:'.length).trim()
               } else if (line.startsWith('실기시험:')) {
                  practical = line.substring('실기시험:'.length).trim()
               } else if (line.trim()) {
                  others.push(line.trim())
               }
            }

            setPassingCriteria({ written, practical })
            setForm((prev) => ({ ...prev, passing_criteria: others.join('\n') }))
            setUseLegacyFormat(true)

            // 구조화된 데이터 UI 초기화
            if (written || practical) {
               const initialCriteria = []
               if (written) initialCriteria.push({ category: '필기시험', details: [written] })
               if (practical) initialCriteria.push({ category: '실기시험', details: [practical] })
               if (others.length > 0) initialCriteria.push({ category: '기타', details: others })
               setStructuredCriteria(initialCriteria)
            } else {
               setStructuredCriteria([
                  { category: '필기시험', details: [''] },
                  { category: '실기시험', details: [''] },
               ])
            }
         } else {
            setPassingCriteria({ written: '', practical: '' })
            setStructuredCriteria([
               { category: '필기시험', details: [''] },
               { category: '실기시험', details: [''] },
            ])
            setUseLegacyFormat(false)
         }
      } catch (error) {
         setPassingCriteria({ written: '', practical: '' })
         setStructuredCriteria([
            { category: '필기시험', details: [''] },
            { category: '실기시험', details: [''] },
         ])
         setUseLegacyFormat(false)
      }

      setShowModal(true)
   }

   // 입력값 변경 핸들러
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target

      // 숫자 필드의 경우 형변환
      if (type === 'number') {
         setForm({ ...form, [name]: parseInt(value) || 0 })
      } else {
         setForm({ ...form, [name]: value })
      }
   }

   // JSON 입력값 변경 핸들러
   const handleJsonChange = (name: string, value: string) => {
      setForm({ ...form, [name]: value })
   }

   // 자격증 저장 (추가/수정)
   const handleSave = async () => {
      try {
         setSaving(true)

         // 필수 필드 검증
         if (!form.name.trim() || !form.registration_number.trim()) {
            alert('자격증명과 등록번호는 필수입니다.')
            return
         }

         // 시험 과목 및 방법을 JSON 형식으로 변환
         const examSubjectsJson = examSubjects.length > 0 && examSubjects.some((s) => s.name.trim() !== '') ? examSubjects : null

         // 시험 방법에 과목 인덱스 정보 포함
         const processedExamMethods = examMethods.map((method) => {
            // subjects가 배열이 아닌 경우 빈 배열로 처리
            const subjectIndexes = Array.isArray(method.subjects) ? method.subjects : []
            return {
               ...method,
               subjects: subjectIndexes,
            }
         })

         const examMethodsJson = processedExamMethods.length > 0 && processedExamMethods.some((m) => m.type.trim() !== '') ? processedExamMethods : null

         // 합격 기준을 처리
         let passingCriteriaText = ''

         if (useLegacyFormat) {
            // 기존 형식 (텍스트)으로 처리
            passingCriteriaText = form.passing_criteria || ''
            if (passingCriteria.written || passingCriteria.practical) {
               passingCriteriaText = `필기시험: ${passingCriteria.written}
실기시험: ${passingCriteria.practical}`
               if (form.passing_criteria) {
                  passingCriteriaText += `
${form.passing_criteria}`
               }
            }
         } else {
            // 구조화된 데이터 (JSON)로 처리
            // 빈 항목 필터링
            const filteredCriteria = structuredCriteria
               .filter((item) => item.category.trim() !== '')
               .map((item) => ({
                  ...item,
                  details: item.details.filter((detail) => detail.trim() !== ''),
               }))
               .filter((item) => item.details.length > 0)

            if (filteredCriteria.length > 0) {
               passingCriteriaText = JSON.stringify({ items: filteredCriteria })
            } else {
               // 구조화된 데이터가 비어있을 경우 기존 방식으로 폴백
               if (passingCriteria.written || passingCriteria.practical) {
                  passingCriteriaText = `필기시험: ${passingCriteria.written}
실기시험: ${passingCriteria.practical}`
                  if (form.passing_criteria) {
                     passingCriteriaText += `
${form.passing_criteria}`
                  }
               }
            }
         }

         const formData = {
            name: form.name,
            registration_number: form.registration_number,
            description: form.description,
            application_fee: form.application_fee,
            certificate_fee: form.certificate_fee,
            exam_subjects: examSubjectsJson,
            exam_methods: examMethodsJson,
            passing_criteria: passingCriteriaText,
            exemption_benefits: form.exemption_benefits,
            status: form.status,
            image_url: form.image_url,
            qualification_type: form.qualification_type,
            grade: form.grade,
            eligibility: form.eligibility,
            validity_period: form.validity_period,
         }

         const isEditing = !!editingCertification
         const endpoint = isEditing ? `/api/admin/certifications/${editingCertification?.id}` : '/api/admin/certifications'
         const method = isEditing ? 'PUT' : 'POST'

         const response = await fetch(endpoint, {
            method,
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
         })

         const result = await response.json()

         if (response.ok) {
            alert(isEditing ? '자격증이 성공적으로 수정되었습니다.' : '자격증이 성공적으로 추가되었습니다.')
            setShowModal(false)
            loadCertifications(pagination.page)
         } else {
            throw new Error(result.error || (isEditing ? '수정 실패' : '추가 실패'))
         }
      } catch (error: unknown) {
         console.error('자격증 저장 오류:', error)
         alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // 자격증 삭제
   const handleDelete = async (certificationId: string, certificationName: string) => {
      if (!confirm(`'${certificationName}' 자격증을 정말 삭제하시겠습니까?`)) {
         return
      }

      try {
         const response = await fetch(`/api/admin/certifications/${certificationId}`, {
            method: 'DELETE',
         })

         const result = await response.json()

         if (response.ok) {
            alert('자격증이 성공적으로 삭제되었습니다.')
            loadCertifications(pagination.page)
         } else {
            throw new Error(result.error || '삭제 실패')
         }
      } catch (error: unknown) {
         console.error('삭제 오류:', error)
         alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
      }
   }

   // 상태 뱃지 렌더링
   const renderStatusBadge = (status: string) => {
      switch (status) {
         case 'active':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">활성</span>
         case 'inactive':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">비활성</span>
         case 'draft':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">초안</span>
         default:
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
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
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   return (
      <AdminLayout>
         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">자격증 관리</h1>
                  <p className="text-gray-600">자격증을 등록, 수정, 삭제할 수 있습니다.</p>
               </div>
               <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  새 자격증 등록
               </button>
            </div>

            {/* 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                     <option value="all">전체 상태</option>
                     <option value="active">활성</option>
                     <option value="inactive">비활성</option>
                     <option value="draft">초안</option>
                  </select>
               </div>

               <div className="md:col-span-2">
                  <div className="flex gap-2">
                     <input
                        type="text"
                        placeholder="자격증명 또는 등록번호로 검색..."
                        value={filters.search}
                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                     <button onClick={() => loadCertifications(1)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        검색
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* 자격증 목록 */}
         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           자격증명
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           등록번호
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           자격종류
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           응시료
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           자격발급비
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                           액션
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              </div>
                           </td>
                        </tr>
                     ) : certifications.length > 0 ? (
                        certifications.map((certification) => (
                           <tr key={certification.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                 <div className="text-sm font-medium text-gray-900">{certification.name}</div>
                                 <div className="text-sm text-gray-500 truncate max-w-xs">{certification.description}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{certification.registration_number}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{certification.qualification_type || '등록민간자격'}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{certification.application_fee.toLocaleString()}원</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{certification.certificate_fee.toLocaleString()}원</td>
                              <td className="px-6 py-4">{renderStatusBadge(certification.status)}</td>
                              <td className="px-6 py-4 text-right text-sm font-medium">
                                 <div className="flex justify-end space-x-2">
                                    <button onClick={() => openEditModal(certification)} className="text-blue-600 hover:text-blue-900">
                                       편집
                                    </button>
                                    <button onClick={() => handleDelete(certification.id, certification.name)} className="text-red-600 hover:text-red-900">
                                       삭제
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                              등록된 자격증이 없습니다.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
               <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                     <button onClick={() => loadCertifications(pagination.page - 1)} disabled={pagination.page <= 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        이전
                     </button>
                     <button
                        onClick={() => loadCertifications(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                     >
                        다음
                     </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                     <div>
                        <p className="text-sm text-gray-700">
                           총 <span className="font-medium">{pagination.total}</span>개 중 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> 표시
                        </p>
                     </div>
                     <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                           <button onClick={() => loadCertifications(pagination.page - 1)} disabled={pagination.page <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                              <span className="sr-only">이전</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                 <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                           </button>
                           {[...Array(pagination.totalPages)].map((_, i) => {
                              const pageNum = i + 1
                              return (
                                 <button
                                    key={pageNum}
                                    onClick={() => loadCertifications(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === pageNum ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                 >
                                    {pageNum}
                                 </button>
                              )
                           })}
                           <button
                              onClick={() => loadCertifications(pagination.page + 1)}
                              disabled={pagination.page >= pagination.totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                           >
                              <span className="sr-only">다음</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                 <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                           </button>
                        </nav>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* 자격증 추가/수정 모달 */}
         {showModal && (
            <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
               <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>

               <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl transform transition-all">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-semibold text-gray-900">{editingCertification ? '자격증 수정' : '새 자격증 등록'}</h2>
                     <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                     </button>
                  </div>

                  <div className="space-y-4">
                     {/* 자격증명 */}
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                           자격증명 *
                        </label>
                        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                     </div>

                     {/* 등록번호 */}
                     <div>
                        <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-1">
                           등록번호 *
                        </label>
                        <input type="text" id="registration_number" name="registration_number" value={form.registration_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                     </div>

                     {/* 설명 */}
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                           설명
                        </label>
                        <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                     </div>

                     {/* 사진 URL */}
                     <div>
                        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                           사진 URL
                        </label>
                        <input
                           type="text"
                           id="image_url"
                           name="image_url"
                           value={form.image_url}
                           onChange={handleChange}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="https://example.com/image.jpg"
                        />
                        {form.image_url && (
                           <div className="mt-2">
                              <Image src={form.image_url} alt="자격증 미리보기" width={128} height={128} className="w-32 h-32 object-cover rounded-md" />
                           </div>
                        )}
                     </div>

                     {/* 자격 기본 정보 */}
                     <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">자격 기본 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* 자격 종류 */}
                           <div>
                              <label htmlFor="qualification_type" className="block text-sm font-medium text-gray-700 mb-1">
                                 자격 종류
                              </label>
                              <input
                                 type="text"
                                 id="qualification_type"
                                 name="qualification_type"
                                 value={form.qualification_type || ''}
                                 onChange={handleChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="예: 등록민간자격"
                              />
                           </div>
                           {/* 등급 */}
                           <div>
                              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                                 등급
                              </label>
                              <input type="text" id="grade" name="grade" value={form.grade || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 단일등급" />
                           </div>
                           {/* 응시자격 */}
                           <div>
                              <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-1">
                                 응시자격
                              </label>
                              <input
                                 type="text"
                                 id="eligibility"
                                 name="eligibility"
                                 value={form.eligibility || ''}
                                 onChange={handleChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="예: 교육 이수자"
                              />
                           </div>
                           {/* 유효기간 */}
                           <div>
                              <label htmlFor="validity_period" className="block text-sm font-medium text-gray-700 mb-1">
                                 유효기간
                              </label>
                              <input
                                 type="text"
                                 id="validity_period"
                                 name="validity_period"
                                 value={form.validity_period || ''}
                                 onChange={handleChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="예: 평생유효"
                              />
                           </div>
                        </div>
                     </div>

                     {/* 응시료 */}
                     <div>
                        <label htmlFor="application_fee" className="block text-sm font-medium text-gray-700 mb-1">
                           응시료 (원)
                        </label>
                        <input type="number" id="application_fee" name="application_fee" value={form.application_fee} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                     </div>

                     {/* 자격발급비 */}
                     <div>
                        <label htmlFor="certificate_fee" className="block text-sm font-medium text-gray-700 mb-1">
                           자격발급비 (원)
                        </label>
                        <input type="number" id="certificate_fee" name="certificate_fee" value={form.certificate_fee} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                     </div>

                     {/* 시험 과목 및 방법 */}
                     <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">시험 과목 및 방법</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                           <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">시험 과목</label>
                              <div className="space-y-2">
                                 {examSubjects.map((subject, index) => (
                                    <div key={index} className="flex gap-2">
                                       <input
                                          type="text"
                                          value={subject.name || ''}
                                          onChange={(e) => handleExamSubjectChange(index, 'name', e.target.value)}
                                          placeholder="과목명"
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       />
                                       <input
                                          type="text"
                                          value={subject.description || ''}
                                          onChange={(e) => handleExamSubjectChange(index, 'description', e.target.value)}
                                          placeholder="설명 (선택)"
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       />
                                       <button type="button" onClick={() => removeExamSubject(index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                                          삭제
                                       </button>
                                    </div>
                                 ))}
                                 <button type="button" onClick={addExamSubject} className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    과목 추가
                                 </button>
                              </div>
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">시험 방법</label>
                              <div className="space-y-4">
                                 {examMethods.map((method, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-4">
                                       <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                                          <div className="md:col-span-1">
                                             <label className="block text-xs text-gray-500 mb-1">유형</label>
                                             <select value={method.type || ''} onChange={(e) => handleExamMethodChange(index, 'type', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <option value="">선택</option>
                                                <option value="필기">필기</option>
                                                <option value="실기">실기</option>
                                             </select>
                                          </div>
                                          <div className="md:col-span-1">
                                             <label className="block text-xs text-gray-500 mb-1">문항수</label>
                                             <input
                                                type="text"
                                                value={method.questions || ''}
                                                onChange={(e) => handleExamMethodChange(index, 'questions', e.target.value)}
                                                placeholder="예: 25문항"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                             />
                                          </div>
                                          <div className="md:col-span-2">
                                             <label className="block text-xs text-gray-500 mb-1">시간</label>
                                             <input
                                                type="text"
                                                value={method.time || ''}
                                                onChange={(e) => handleExamMethodChange(index, 'time', e.target.value)}
                                                placeholder="예: 120분(2시간)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                             />
                                          </div>
                                          <div className="md:col-span-1">
                                             <button type="button" onClick={() => removeExamMethod(index)} className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                                                삭제
                                             </button>
                                          </div>
                                       </div>

                                       {/* 필기/실기별 과목 선택 */}
                                       <div className="mt-3">
                                          <label className="block text-xs text-gray-500 mb-1">{method.type === '필기' ? '필기 과목' : method.type === '실기' ? '실기 과목' : '과목 선택'}</label>
                                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                             {examSubjects.map((subject, subjectIndex) => (
                                                <div key={subjectIndex} className="flex items-center">
                                                   <input
                                                      type="checkbox"
                                                      id={`method-${index}-subject-${subjectIndex}`}
                                                      checked={method.subjects?.includes(String(subjectIndex)) || false}
                                                      onChange={(e) => {
                                                         const currentSubjects = method.subjects || []
                                                         let newSubjects
                                                         if (e.target.checked) {
                                                            newSubjects = [...currentSubjects, String(subjectIndex)]
                                                         } else {
                                                            newSubjects = currentSubjects.filter((i) => i !== String(subjectIndex))
                                                         }
                                                         handleExamMethodChange(index, 'subjects', newSubjects)
                                                      }}
                                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                   />
                                                   <label htmlFor={`method-${index}-subject-${subjectIndex}`} className="ml-2 text-sm text-gray-700">
                                                      {subject.name || `과목 ${subjectIndex + 1}`}
                                                   </label>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                                 <button type="button" onClick={addExamMethod} className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    방법 추가
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* 합격 기준 */}
                     <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">합격 기준</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                           <div className="space-y-4">
                              {structuredCriteria.map((criteria, criteriaIndex) => (
                                 <div key={criteriaIndex} className="border border-gray-200 rounded-md p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                       <div className="flex items-center space-x-2">
                                          <input
                                             type="text"
                                             value={criteria.category}
                                             onChange={(e) => {
                                                const newCriteria = [...structuredCriteria]
                                                newCriteria[criteriaIndex].category = e.target.value
                                                setStructuredCriteria(newCriteria)
                                             }}
                                             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                             placeholder="카테고리 (예: 필기시험)"
                                          />
                                       </div>
                                       <button
                                          type="button"
                                          onClick={() => {
                                             const newCriteria = structuredCriteria.filter((_, i) => i !== criteriaIndex)
                                             setStructuredCriteria(newCriteria)
                                          }}
                                          className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                                          disabled={structuredCriteria.length <= 1}
                                       >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                       </button>
                                    </div>
                                    <div className="ml-2 space-y-2">
                                       {criteria.details.map((detail, detailIndex) => (
                                          <div key={detailIndex} className="flex items-center space-x-2">
                                             <input
                                                type="text"
                                                value={detail}
                                                onChange={(e) => {
                                                   const newCriteria = [...structuredCriteria]
                                                   newCriteria[criteriaIndex].details[detailIndex] = e.target.value
                                                   setStructuredCriteria(newCriteria)
                                                }}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="상세 기준 입력"
                                             />
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   const newCriteria = [...structuredCriteria]
                                                   newCriteria[criteriaIndex].details = newCriteria[criteriaIndex].details.filter((_, i) => i !== detailIndex)
                                                   setStructuredCriteria(newCriteria)
                                                }}
                                                className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                disabled={criteria.details.length <= 1}
                                             >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                             </button>
                                          </div>
                                       ))}
                                       <button
                                          type="button"
                                          onClick={() => {
                                             const newCriteria = [...structuredCriteria]
                                             newCriteria[criteriaIndex].details.push('')
                                             setStructuredCriteria(newCriteria)
                                          }}
                                          className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none"
                                       >
                                          + 기준 추가
                                       </button>
                                    </div>
                                 </div>
                              ))}
                              <button
                                 type="button"
                                 onClick={() => {
                                    setStructuredCriteria([...structuredCriteria, { category: '', details: [''] }])
                                 }}
                                 className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                 + 카테고리 추가
                              </button>
                           </div>

                           <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center mb-2">
                                 <input type="checkbox" id="use_legacy_format" className="h-4 w-4 text-blue-600" checked={useLegacyFormat} onChange={(e) => setUseLegacyFormat(e.target.checked)} />
                                 <label htmlFor="use_legacy_format" className="ml-2 text-sm text-gray-700">
                                    기존 형식으로 직접 입력 (고급)
                                 </label>
                              </div>
                              {useLegacyFormat && (
                                 <div className="space-y-4">
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">필기시험 기준</label>
                                       <textarea
                                          value={passingCriteria.written || ''}
                                          onChange={(e) => setPassingCriteria({ ...passingCriteria, written: e.target.value })}
                                          rows={3}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="필기시험 합격 기준을 입력하세요"
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">실기시험 기준</label>
                                       <textarea
                                          value={passingCriteria.practical || ''}
                                          onChange={(e) => setPassingCriteria({ ...passingCriteria, practical: e.target.value })}
                                          rows={3}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="실기시험 합격 기준을 입력하세요"
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">기타 정보</label>
                                       <textarea
                                          value={form.passing_criteria}
                                          onChange={(e) => handleJsonChange('passing_criteria', e.target.value)}
                                          rows={2}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="기타 합격 관련 정보를 입력하세요"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* 시험 면제 혜택 */}
                     <div>
                        <label htmlFor="exemption_benefits" className="block text-sm font-medium text-gray-700 mb-1">
                           시험 면제 혜택
                        </label>
                        <textarea id="exemption_benefits" name="exemption_benefits" value={form.exemption_benefits} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                     </div>

                     {/* 상태 */}
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                           상태
                        </label>
                        <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                           <option value="active">활성</option>
                           <option value="inactive">비활성</option>
                           <option value="draft">초안</option>
                        </select>
                     </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                     <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        취소
                     </button>
                     <button onClick={handleSave} disabled={saving || !form.name || !form.registration_number} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                        {saving ? '저장 중...' : '저장'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </AdminLayout>
   )
}
