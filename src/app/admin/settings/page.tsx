'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useAdmin } from '@/hooks/useAdmin'

interface Setting {
   id: string
   setting_key: string
   setting_value: unknown
   setting_type: string
   category: string
   name: string
   description?: string
   is_required: boolean
   updated_at: string
}

type SettingsByCategory = Record<string, Setting[]>

export default function AdminSettingsPage() {
   const { isAdmin, isChecking } = useAdmin()
   

   const [settings, setSettings] = useState<SettingsByCategory>({})
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)
   const [formData, setFormData] = useState<Record<string, unknown>>({})
   const [activeCategory, setActiveCategory] = useState('site_info')

   // 카테고리 정보
   const categoryInfo = {
      site_info: { name: '사이트 정보', icon: '🌐', description: '사이트 기본 정보 설정' },
      contact: { name: '연락처 정보', icon: '📞', description: '협회 연락처 및 주소 정보' },
      business: { name: '사업 정보', icon: '💼', description: '협회 사업 관련 설정' },
      general: { name: '일반 설정', icon: '⚙️', description: '기타 일반적인 설정' },
   }

   // 설정 로드
   const loadSettings = async () => {
      try {
         setLoading(true)

         const response = await fetch('/api/admin/settings')
         const data = await response.json()

         if (response.ok) {
            setSettings(data.settings)

            // 폼 데이터 초기화
            const initialFormData: Record<string, unknown> = {}
            Object.values(data.settings)
               .flat()
               .forEach((setting) => {
                  const typedSetting = setting as Setting
                  // JSON 형태로 저장된 문자열 값을 파싱
                  if (typedSetting.setting_type === 'string' && typeof typedSetting.setting_value === 'string') {
                     try {
                        initialFormData[typedSetting.setting_key] = JSON.parse(typedSetting.setting_value)
                     } catch {
                        initialFormData[typedSetting.setting_key] = typedSetting.setting_value
                     }
                  } else {
                     initialFormData[typedSetting.setting_key] = typedSetting.setting_value
                  }
               })
            setFormData(initialFormData)
         } else {
            console.error('설정 로드 실패:', data.error)
            alert('설정을 불러오는데 실패했습니다.')
         }
      } catch (error) {
         console.error('설정 로드 오류:', error)
         alert('서버 오류가 발생했습니다.')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (isAdmin && !isChecking) {
         loadSettings()
      }
   }, [isAdmin, isChecking])

   // 폼 데이터 변경
   const handleInputChange = (key: string, value: unknown) => {
      setFormData((prev) => ({
         ...prev,
         [key]: value,
      }))
   }

   // 설정 저장
   const handleSaveSettings = async () => {
      try {
         setSaving(true)

         // 변경된 설정만 추출
         const allSettings = Object.values(settings).flat()
         const updatedSettings = allSettings
            .filter((setting) => {
               const currentValue = formData[setting.setting_key]
               let originalValue

               try {
                  // 문자열 값일 경우 파싱 시도 (JSON 형태인 경우)
                  if (setting.setting_type === 'string' && typeof setting.setting_value === 'string') {
                     if (setting.setting_value.startsWith('"') && setting.setting_value.endsWith('"')) {
                        originalValue = JSON.parse(setting.setting_value)
                     } else {
                        originalValue = setting.setting_value
                     }
                  } else {
                     originalValue = setting.setting_value
                  }
               } catch (error) {
                  // 파싱 실패시 원본 값 사용
                  originalValue = setting.setting_value
               }

               return JSON.stringify(currentValue) !== JSON.stringify(originalValue)
            })
            .map((setting) => ({
               setting_key: setting.setting_key,
               setting_value: formData[setting.setting_key],
               setting_type: setting.setting_type,
            }))

         if (updatedSettings.length === 0) {
            alert('변경된 설정이 없습니다.')
            return
         }

         const response = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               settings: updatedSettings,
            }),
         })

         const result = await response.json()

         if (response.ok) {
            alert('설정이 성공적으로 저장되었습니다.')
            await loadSettings() // 설정 다시 로드
         } else {
            throw new Error(result.error || '설정 저장 실패')
         }
      } catch (error: unknown) {
         console.error('설정 저장 오류:', error)
         alert(error instanceof Error ? error.message : '설정 저장 중 오류가 발생했습니다.')
      } finally {
         setSaving(false)
      }
   }

   // 입력 필드 렌더링
   const renderInput = (setting: Setting) => {
      const value = formData[setting.setting_key]

      switch (setting.setting_type) {
         case 'string':
            return (
               <input
                  type="text"
                  value={String(value || '')}
                  onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={setting.description}
               />
            )

         case 'number':
            return (
               <input
                  type="number"
                  value={Number(value || 0)}
                  onChange={(e) => handleInputChange(setting.setting_key, parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={setting.description}
               />
            )

         case 'boolean':
            return (
               <div className="flex items-center">
                  <input type="checkbox" checked={Boolean(value)} onChange={(e) => handleInputChange(setting.setting_key, e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">{setting.description || '활성화'}</label>
               </div>
            )

         case 'json':
            return (
               <textarea
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                     try {
                        const parsed = JSON.parse(e.target.value)
                        handleInputChange(setting.setting_key, parsed)
                     } catch {
                        // 유효하지 않은 JSON은 무시
                     }
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder={setting.description}
               />
            )

         default:
            return (
               <input
                  type="text"
                  value={String(value || '')}
                  onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={setting.description}
               />
            )
      }
   }

   // 로딩 중이거나 권한이 없는 경우
   if (isChecking) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
         </div>
      )
   }

   if (!isAdmin) {
      return null // useAdmin 훅에서 리다이렉트 처리
   }

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">설정을 불러오는 중...</p>
            </div>
         </div>
      )
   }

   return (
      <AdminLayout>
         <div className=" bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8 pt-16">
               {/* 헤더 */}
               <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-2xl font-bold text-gray-900">사이트 설정 관리</h1>
                        <p className="text-gray-600 mt-1">웹사이트의 기본 정보와 설정을 관리할 수 있습니다.</p>
                     </div>
                     <button onClick={handleSaveSettings} disabled={saving} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                        {saving ? '저장 중...' : '설정 저장'}
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* 카테고리 네비게이션 */}
                  <div className="lg:col-span-1">
                     <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="font-semibold text-gray-900 mb-4">설정 카테고리</h2>
                        <nav className="space-y-2">
                           {Object.entries(categoryInfo).map(([key, info]) => (
                              <button key={key} onClick={() => setActiveCategory(key)} className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === key ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                                 <div className="flex items-center">
                                    <span className="mr-2">{info.icon}</span>
                                    <div>
                                       <div className="font-medium">{info.name}</div>
                                       <div className="text-xs text-gray-500">{info.description}</div>
                                    </div>
                                 </div>
                              </button>
                           ))}
                        </nav>
                     </div>
                  </div>

                  {/* 설정 폼 */}
                  <div className="lg:col-span-3">
                     <div className="bg-white rounded-lg shadow-sm p-6">
                        {settings[activeCategory] && settings[activeCategory].length > 0 ? (
                           <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-6">{categoryInfo[activeCategory as keyof typeof categoryInfo]?.name} 설정</h2>

                              <div className="space-y-6">
                                 {settings[activeCategory].map((setting) => (
                                    <div key={setting.id}>
                                       <label className="block text-sm font-medium text-gray-900 mb-2">
                                          {setting.name}
                                          {setting.is_required && <span className="text-red-500 ml-1">*</span>}
                                       </label>

                                       {renderInput(setting)}

                                       {setting.description && <p className="mt-1 text-xs text-gray-500">{setting.description}</p>}

                                       <p className="mt-1 text-xs text-gray-400">
                                          설정 키: {setting.setting_key} | 타입: {setting.setting_type}
                                       </p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ) : (
                           <div className="text-center py-8">
                              <div className="text-gray-400 text-4xl mb-4">📝</div>
                              <p className="text-gray-500">이 카테고리에 설정이 없습니다.</p>
                              <p className="text-gray-400 text-sm mt-2">새로운 설정을 추가하려면 관리자에게 문의하세요.</p>
                           </div>
                        )}
                     </div>

                     {/* 도움말 */}
                     <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 설정 관리 도움말</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                           <li>• 설정 변경 후 반드시 &apos;설정 저장&apos; 버튼을 클릭하세요</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AdminLayout>
   )
}
