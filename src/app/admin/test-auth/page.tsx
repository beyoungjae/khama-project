'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'

export default function TestAuthPage() {
   const [result, setResult] = useState<any>(null)
   const [loading, setLoading] = useState(false)

   const testAuth = async () => {
      setLoading(true)
      try {
         const response = await fetch('/api/admin/verify-token', {
            method: 'GET',
            credentials: 'include',
         })

         const data = await response.json()
         setResult({
            status: response.status,
            data,
            cookies: document.cookie,
         })
      } catch (error) {
         setResult({ error: error.message })
      } finally {
         setLoading(false)
      }
   }

   return (
      <AdminLayout>
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">인증 테스트</h1>

            <div className="space-y-4">
               <button onClick={testAuth} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                  {loading ? '테스트 중...' : '인증 상태 확인'}
               </button>

               {result && (
                  <div className="bg-gray-100 p-4 rounded">
                     <h3 className="font-bold mb-2">결과:</h3>
                     <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                  </div>
               )}
            </div>
         </div>
      </AdminLayout>
   )
}
