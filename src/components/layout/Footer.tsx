'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Settings {
   association_name: string
   association_name_en: string
   phone: string
   email: string
   address: string
   business_registration: string
   representative_name: string
   description: string
}

interface Certification {
   id: string
   name: string
   status: 'active' | 'inactive' | 'draft'
}

export default function Footer() {
   const [settings, setSettings] = useState<Settings | null>(null)
   const [certifications, setCertifications] = useState<Certification[]>([])

   useEffect(() => {
      loadFooterData()
   }, [])

   const loadFooterData = async () => {
      try {
         // 설정 정보 로드
         const settingsResponse = await fetch('/api/admin/settings')
         if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json()
            setSettings(settingsData.settings)
         }

         // 자격증 정보 로드
         const certificationsResponse = await fetch('/api/certifications?status=active')
         if (certificationsResponse.ok) {
            const certificationsData = await certificationsResponse.json()
            setCertifications(certificationsData.certifications || [])
         }
      } catch (error) {
         console.error('Footer 데이터 로드 오류:', error)
      }
   }
   return (
      <footer className="bg-gray-900 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {/* 협회 정보 */}
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                     <div>
                        <div className="text-xl font-bold">{settings?.association_name_en || 'KHAMA'}</div>
                        <div className="text-sm text-gray-400">{settings?.association_name || '한국생활가전유지관리협회'}</div>
                     </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{settings?.description || '생활가전 유지관리 분야의 표준화 연구와 교육, 자문을 제공하는 협회입니다.'}</p>
                  <div className="text-sm text-gray-400">
                     <p>주소: {settings?.address || '인천광역시 서구 청라한내로72번길 13 (청라동) 203호'}</p>
                     <p>대표번호: {settings?.phone || '1566-3321'}</p>
                     <p>고유번호: {settings?.business_registration || '108-82-87006'}</p>
                     <p>대표자명: {settings?.representative_name || '김윤채'}</p>
                     <p>이메일: {settings?.email || 'haan@hanallcompany.com'}</p>
                  </div>
               </div>

               {/* 빠른 링크 */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
                  <ul className="space-y-2 text-sm">
                     <li>
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                           협회 소개
                        </Link>
                     </li>
                     <li>
                        <Link href="/business" className="text-gray-400 hover:text-white transition-colors duration-200">
                           주요 사업
                        </Link>
                     </li>
                     <li>
                        <Link href="/exam" className="text-gray-400 hover:text-white transition-colors duration-200">
                           자격 검정
                        </Link>
                     </li>
                     <li>
                        <Link href="/services" className="text-gray-400 hover:text-white transition-colors duration-200">
                           온라인 서비스
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* 자격증 정보 */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">자격증</h3>
                  <ul className="space-y-2 text-sm">
                     {certifications.length > 0 ? (
                        certifications.map((cert) => (
                           <li key={cert.id} className="text-gray-400">
                              {cert.name}
                           </li>
                        ))
                     ) : (
                        // 폴백 데이터
                        <>
                           <li className="text-gray-400">가전제품분해청소관리사</li>
                           <li className="text-gray-400">냉난방기세척서비스관리사</li>
                           <li className="text-gray-400">에어컨설치관리사</li>
                           <li className="text-gray-400">환기청정시스템관리사</li>
                        </>
                     )}
                  </ul>
               </div>
            </div>

            {/* 하단 정보 */}
            <div className="border-t border-gray-800 mt-8 pt-8">
               <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-sm text-gray-400 mb-4 md:mb-0">
                     © 2025 {settings?.association_name || '한국생활가전유지관리협회'}({settings?.association_name_en || 'KHAMA'}). All rights reserved.
                  </div>
                  <div className="flex space-x-6 text-sm">
                     <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                        개인정보처리방침
                     </Link>
                     <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                        이용약관
                     </Link>
                     <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-200">
                        사이트맵
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   )
}
