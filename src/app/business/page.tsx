'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CertificationModal from '@/components/business/CertificationModal'

// Certification 타입 정의
interface Certification {
   id: number
   title: string
   subtitle: string
   description: string
   registrationNumber: string
   features: string[]
   curriculum: string[]
   practicalCurriculum: string[]
   examInfo: {
      written: string
      practical: string
      passingScore: string
   }
   cost: {
      application: string
      certificate: string
      total: string
   }
   image: string
}

export default function BusinessPage() {
   const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)
   const [isModalOpen, setIsModalOpen] = useState(false)

   const handleCertificationClick = (cert: Certification) => {
      setSelectedCertification(cert)
      setIsModalOpen(true)
   }

   const closeModal = () => {
      setIsModalOpen(false)
      setSelectedCertification(null)
   }

   const certifications: Certification[] = [
      {
         id: 1,
         title: '가전제품분해청소관리사',
         subtitle: 'Home Appliance Cleaning Manager',
         description: '세탁기, 에어컨, 공기청정기 등 가전제품에 대한 전문적인 지식을 가지고 분해 청소하는 업무',
         registrationNumber: '2024-001234',
         features: ['완전분해 세척', '재조립 기술', '안전 관리', '고객 서비스'],
         curriculum: ['가전제품의 작동 원리', '세탁기 완전분해 세척교육 이론', '에어컨 완전분해 세척교육 이론', '기타 가전제품 케어 교육 이론', '마케팅 실무 이론'],
         practicalCurriculum: ['세탁기 완전분해 세척 실기', '에어컨 완전분해 세척 실기', '기타 가전제품 케어 실기', '마케팅 실무 실기'],
         examInfo: {
            written: '객관식 5과목',
            practical: '실기 구술형 4과목',
            passingScore: '과목당 60점 이상, 평균 60점 이상',
         },
         cost: {
            application: '별도 문의',
            certificate: '별도 문의',
            total: '별도 문의',
         },
         image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      },
      {
         id: 2,
         title: '냉난방기세척서비스관리사',
         subtitle: 'HVAC Cleaning Service Manager',
         description: '냉난방기 청소 및 유지보수 전문가로서 시스템 진단과 효율 최적화를 담당',
         registrationNumber: '2024-001235',
         features: ['시스템 진단', '효율 최적화', '예방 관리', '전문 상담'],
         curriculum: ['냉난방기 시스템 이해', '청소 기법 및 도구 사용법', '안전 관리 및 사고 예방', '고객 관리 및 서비스', '사업 운영 및 마케팅'],
         practicalCurriculum: ['냉난방기 분해 및 청소', '시스템 점검 및 진단', '부품 교체 및 수리', '고객 응대 실습'],
         examInfo: {
            written: '객관식 5과목',
            practical: '실기 구술형 4과목',
            passingScore: '과목당 60점 이상, 평균 60점 이상',
         },
         cost: {
            application: '별도 문의',
            certificate: '별도 문의',
            total: '별도 문의',
         },
         image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      },
      {
         id: 3,
         title: '에어컨설치관리사',
         subtitle: 'Air Conditioner Installation Manager',
         description: '에어컨 설치 및 시공 전문가로서 정확한 설치와 성능 테스트를 담당',
         registrationNumber: '2024-001236',
         features: ['정확한 설치', '배관 작업', '성능 테스트', '안전 점검'],
         curriculum: ['에어컨 시스템 구조 이해', '설치 기법 및 도구 사용', '배관 작업 및 연결', '전기 작업 및 안전', '성능 테스트 및 점검'],
         practicalCurriculum: ['에어컨 설치 실습', '배관 연결 작업', '전기 배선 작업', '성능 테스트 실시'],
         examInfo: {
            written: '객관식 5과목',
            practical: '실기 구술형 4과목',
            passingScore: '과목당 60점 이상, 평균 60점 이상',
         },
         cost: {
            application: '별도 문의',
            certificate: '별도 문의',
            total: '별도 문의',
         },
         image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      },
      {
         id: 4,
         title: '환기청정시스템관리사',
         subtitle: 'Ventilation System Manager',
         description: '환기 및 공기 정화 시스템 전문가로서 공기질 관리와 시스템 점검을 담당',
         registrationNumber: '2024-001237',
         features: ['공기질 관리', '필터 교체', '시스템 점검', '환경 개선'],
         curriculum: ['환기 시스템 원리', '공기질 측정 및 분석', '필터 종류 및 교체', '시스템 유지보수', '환경 개선 방안'],
         practicalCurriculum: ['환기 시스템 점검', '공기질 측정 실습', '필터 교체 작업', '시스템 청소 및 관리'],
         examInfo: {
            written: '객관식 5과목',
            practical: '실기 구술형 4과목',
            passingScore: '과목당 60점 이상, 평균 60점 이상',
         },
         cost: {
            application: '별도 문의',
            certificate: '별도 문의',
            total: '별도 문의',
         },
         image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
      },
   ]

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            {/* TODO: 실제 이미지로 교체 - IMAGES.PAGES.BUSINESS 사용 */}
            <section
               className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700"
               style={
                  {
                     // backgroundImage: `url(${IMAGES.PAGES.BUSINESS})`, // 실제 이미지로 교체 시 사용
                     // backgroundSize: 'cover',
                     // backgroundPosition: 'center',
                     // backgroundRepeat: 'no-repeat'
                  }
               }
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">주요 사업</h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">KHAMA의 전문 자격증 과정과 교육 프로그램을 통해 생활가전 유지관리 전문가가 되세요</p>
               </div>
            </section>

            {/* 자격증 과정 */}
            <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">전문 자격증 과정</h2>
                     <p className="text-xl text-gray-600 max-w-3xl mx-auto">체계적인 교육과 실무 중심의 커리큘럼으로 전문가 자격을 취득하세요</p>

                     {/* 법적 표시사항 */}
                     <div className="mt-8 max-w-6xl mx-auto">
                        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-8 shadow-lg">
                           <div className="flex items-center mb-4 sm:mb-6">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                 </svg>
                              </div>
                              <div>
                                 <h3 className="text-lg sm:text-2xl font-bold text-blue-900 mb-1">민간자격 법적 고지사항</h3>
                                 <p className="text-sm sm:text-base text-blue-700">자격기본법 제17조 제1항에 따른 민간자격 표시의무</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                              <div className="bg-white rounded-xl p-4 sm:p-6 border border-blue-100 shadow-sm">
                                 <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    기본 정보
                                 </h4>
                                 <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                       <span className="font-medium text-gray-600">자격 종류</span>
                                       <span className="text-gray-900 font-semibold">등록민간자격</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="font-medium text-gray-600">관리·운영기관</span>
                                       <span className="text-gray-900 font-semibold">한국생활가전유지관리협회</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="font-medium text-gray-600">대표자</span>
                                       <span className="text-gray-900 font-semibold">김윤채</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="font-medium text-gray-600">연락처</span>
                                       <span className="text-blue-600 font-semibold">1566-3321</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white rounded-xl p-4 sm:p-6 border border-emerald-100 shadow-sm">
                                 <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                                    비용 및 환불 정보
                                 </h4>
                                 <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                       <span className="font-medium text-gray-600">총 비용</span>
                                       <span className="text-emerald-600 font-semibold">별도 문의</span>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3 mt-3">
                                       <div className="font-medium text-emerald-900 mb-2">환불 규정</div>
                                       <div className="text-xs text-emerald-800 space-y-1">
                                          <div>• 접수마감 전: 100% 환불</div>
                                          <div>• 시험 당일 취소: 30% 공제 후 환불</div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-6">
                              <div className="flex items-start">
                                 <div className="flex-1">
                                    <h4 className="font-bold text-amber-900 mb-2">⚠️중요 안내사항</h4>
                                    <div className="text-sm text-amber-800 space-y-2">
                                       <p>
                                          • 본 자격은 <strong>자격기본법 규정에 따라 등록된 민간자격</strong>입니다.
                                       </p>
                                       <p>• 민간자격 취득자에 대한 우대사항은 해당 기관이나 법령에 따라 다를 수 있습니다.</p>
                                       <p>
                                          • 자세한 정보는 <strong className="text-amber-900">민간자격정보서비스(www.pqi.or.kr)</strong>에서 확인하실 수 있습니다.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="mt-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-800">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                                 자격기본법 제17조 제1항 및 제27조에 따른 법정 표시사항
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* 간소화된 자격증 카드 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {certifications.map((cert) => (
                        <Card key={cert.id} hover className="group cursor-pointer" onClick={() => handleCertificationClick(cert)}>
                           <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${cert.image})` }} />
                              <div className="absolute inset-0 bg-blue-900/60" />
                              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                                 <div>
                                    <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                                    <p className="text-sm opacity-90">{cert.subtitle}</p>
                                 </div>
                              </div>
                              <div className="absolute top-3 right-3">
                                 <Badge variant="default" size="sm">
                                    등록번호: {cert.registrationNumber}
                                 </Badge>
                              </div>
                              <div className="absolute bottom-3 left-3">
                                 <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">클릭하여 상세보기</div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{cert.description}</p>

                              {/* 주요 특징 */}
                              <div>
                                 <h4 className="font-medium text-gray-900 mb-2 text-sm">주요 특징</h4>
                                 <div className="flex flex-wrap gap-1">
                                    {cert.features.slice(0, 3).map((feature, idx) => (
                                       <Badge key={idx} variant="primary" size="sm">
                                          {feature}
                                       </Badge>
                                    ))}
                                    {cert.features.length > 3 && (
                                       <Badge variant="secondary" size="sm">
                                          +{cert.features.length - 3}개
                                       </Badge>
                                    )}
                                 </div>
                              </div>

                              {/* 간단한 시험 정보 */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                 <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                       <span className="font-medium text-gray-600">필기:</span>
                                       <span className="ml-1 text-gray-800">객관식 5과목</span>
                                    </div>
                                    <div>
                                       <span className="font-medium text-gray-600">실기:</span>
                                       <span className="ml-1 text-gray-800">구술형 4과목</span>
                                    </div>
                                    <div>
                                       <span className="font-medium text-gray-600">합격기준:</span>
                                       <span className="ml-1 text-gray-800">60점 이상</span>
                                    </div>
                                    <div>
                                       <span className="font-medium text-gray-600">비용:</span>
                                       <span className="ml-1 text-blue-600 font-medium">{cert.cost.total}</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex gap-2">
                                 <Button
                                    onClick={(e) => {
                                       e.stopPropagation()
                                       handleCertificationClick(cert)
                                    }}
                                    className="flex-1"
                                    size="sm"
                                 >
                                    상세보기
                                 </Button>
                                 <Button href="/exam" variant="secondary" className="flex-1" size="sm" onClick={(e) => e.stopPropagation()}>
                                    시험신청
                                 </Button>
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>

            {/* 협회 서비스 */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">협회 서비스</h2>
                     <p className="text-xl text-gray-600">전문가 양성과 업계 발전을 위한 다양한 서비스를 제공합니다</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">전문 교육</h3>
                        <p className="text-gray-600 text-sm">체계적인 이론과 실무 교육을 통한 전문가 양성</p>
                     </Card>

                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">자격 인증</h3>
                        <p className="text-gray-600 text-sm">공정하고 투명한 자격 검정 및 인증 서비스</p>
                     </Card>

                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">회원 지원</h3>
                        <p className="text-gray-600 text-sm">회원 간 네트워킹 및 사업 지원 서비스</p>
                     </Card>

                     <Card hover className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">기술 지원</h3>
                        <p className="text-gray-600 text-sm">최신 기술 정보 제공 및 기술 상담 서비스</p>
                     </Card>
                  </div>

                  <div className="text-center mt-12">
                     <Button href="/about" size="lg">
                        협회 소개 보기
                     </Button>
                  </div>
               </div>
            </section>
         </main>

         {/* 모달 */}
         <CertificationModal isOpen={isModalOpen} onClose={closeModal} certification={selectedCertification} />

         <Footer />
      </div>
   )
}
