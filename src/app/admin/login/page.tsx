'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AdminLoginPage() {
   const [formData, setFormData] = useState({
      adminId: '',
      password: '',
   })
   const [isLoading, setIsLoading] = useState(false)
   const [errors, setErrors] = useState<{ [key: string]: string }>({})
   const router = useRouter()

   // 이미 로그인된 경우 대시보드로 리다이렉트
   useEffect(() => {
      if (typeof window !== 'undefined') {
         const adminToken = localStorage.getItem('admin-token')
         console.log('Admin login page - existing token:', !!adminToken)
         if (adminToken) {
            console.log('기존 토큰으로 리다이렉트 시도')
            // 지연 시간을 주어 예상치 못한 문제 방지
            setTimeout(() => {
               console.log('어드민 리다이렉트 실행!')
               window.location.href = '/admin' // router.push 대신 강제 리다이렉트
            }, 500)
         }
      }
   }, [router])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // 에러 메시지 클리어
      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: '' }))
      }
   }

   const validateForm = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.adminId) {
         newErrors.adminId = '관리자 ID를 입력해주세요.'
      }

      if (!formData.password) {
         newErrors.password = '비밀번호를 입력해주세요.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setIsLoading(true)
      setErrors({})

      try {
         // 관리자 로그인 API 호출
         const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               adminId: formData.adminId,
               password: formData.password,
            }),
         })

         const result = await response.json()

         if (response.ok) {
            console.log('어드민 로그인 성공!', result)
            // 로그인 성공 시 토큰을 localStorage와 쿠키 둘 다 저장
            localStorage.setItem('admin-token', result.token)
            // 쿠키에도 저장 (middleware에서 확인용)
            document.cookie = `admin-token=${result.token}; path=/; max-age=3600; SameSite=Lax; Secure=${location.protocol === 'https:'}`
            
            console.log('어드민 리다이렉트 시도...')
            // 세션 설정 시간을 주고 강제 리다이렉트
            setTimeout(() => {
               console.log('어드민 대시보드로 이동!')
               setIsLoading(false)
               window.location.href = '/admin'
            }, 1000)
         } else {
            setErrors({ general: result.error || '로그인에 실패했습니다. 관리자 ID와 비밀번호를 확인해주세요.' })
            setIsLoading(false) // 로딩 상태 해제
         }
      } catch (error) {
         console.error('로그인 오류:', error)
         setErrors({ general: '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
         setIsLoading(false) // 로딩 상태 해제
      }
   }

   return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            {/* 헤더 */}
            <div className="text-center">
               <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                     <span className="text-white font-bold text-xl">K</span>
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-gray-900">KHAMA</div>
                     <div className="text-xs text-gray-600">관리자 시스템</div>
                  </div>
               </Link>
            </div>

            <Card>
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                     </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">관리자 로그인</h2>
                  <p className="text-gray-600">관리자 권한이 필요한 서비스입니다</p>
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
                  <div>
                     <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 mb-2">
                        관리자 ID *
                     </label>
                     <input
                        type="text"
                        id="adminId"
                        name="adminId"
                        value={formData.adminId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.adminId ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="관리자 ID를 입력하세요"
                     />
                     {errors.adminId && <p className="mt-1 text-sm text-red-600">{errors.adminId}</p>}
                  </div>

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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="비밀번호를 입력하세요"
                     />
                     {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700" size="lg">
                     {isLoading ? (
                        <div className="flex items-center justify-center">
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           로그인 중...
                        </div>
                     ) : (
                        '관리자 로그인'
                     )}
                  </Button>
               </form>

               <div className="mt-8 text-center">
                  <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
                     ← 메인 사이트로 돌아가기
                  </Link>
               </div>

               <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                     <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                     </svg>
                     <div>
                        <h4 className="text-sm font-medium text-yellow-800">보안 안내</h4>
                        <p className="text-xs text-yellow-700 mt-1">
                           관리자 계정은 협회 내부 직원만 사용할 수 있습니다.
                           <br />
                           로그인 시도는 모두 기록되며, 무단 접근 시 법적 조치가 취해질 수 있습니다.
                        </p>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
   )
}
