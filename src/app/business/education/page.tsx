'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface EducationProgram {
   id: string
   title: string
   subtitle: string
   description: string
   duration: string
   schedule: string
   location: string
   capacity: number
   currentEnrollment: number
   fee: string
   features: string[]
   curriculum: Array<{
      week: number
      topic: string
      content: string
   }>
   requirements: string[]
   benefits: string[]
   instructor: {
      name: string
      career: string
      image: string
   }
   status: 'open' | 'closed' | 'upcoming'
   nextStartDate: string
}

export default function EducationPage() {
   const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

   const programs: EducationProgram[] = [
      {
         id: 'startup',
         title: '창업교육 과정',
         subtitle: '가전 청소 서비스 창업의 모든 것',
         description: '가전제품 청소 서비스업 창업을 위한 실무 중심 교육과정입니다. 기술 습득부터 사업 운영까지 체계적으로 학습할 수 있습니다.',
         duration: '4주 (32시간)',
         schedule: '주 2회 (화, 목) 19:00-23:00',
         location: '인천 청라 한올평생교육원',
         capacity: 20,
         currentEnrollment: 15,
         fee: '350,000원',
         features: ['실무 중심 커리큘럼', '1:1 멘토링 제공', '창업 컨설팅 포함', '수료 후 취업 연계'],
         curriculum: [
            { week: 1, topic: '가전청소 기초 이론', content: '가전제품 구조 이해, 청소 원리, 안전 수칙' },
            { week: 2, topic: '실습 및 기술 습득', content: '세탁기, 에어컨, 공기청정기 청소 실습' },
            { week: 3, topic: '사업 계획 수립', content: '시장 분석, 사업 모델, 마케팅 전략' },
            { week: 4, topic: '창업 실무', content: '사업자 등록, 보험, 고객 관리 시스템' },
         ],
         requirements: ['만 18세 이상', '기본적인 컴퓨터 활용 능력', '창업 의지가 있는 분'],
         benefits: ['수료증 발급', '창업 자금 지원 정보 제공', '협회 회원 혜택', '지속적인 기술 지원'],
         instructor: {
            name: '김창업',
            career: '가전청소업계 15년 경력, 성공 창업자 멘토',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
         },
         status: 'open',
         nextStartDate: '2025.03.05',
      },
      {
         id: 'professional',
         title: '전문가교육 과정',
         subtitle: '고급 기술과 전문성 향상',
         description: '이미 업계에 종사하고 있는 분들을 위한 고급 기술 교육과정입니다. 최신 기술과 트렌드를 학습하여 전문성을 높일 수 있습니다.',
         duration: '6주 (48시간)',
         schedule: '주 2회 (월, 수) 14:00-18:00',
         location: '인천 청라 한올평생교육원',
         capacity: 15,
         currentEnrollment: 8,
         fee: '480,000원',
         features: ['최신 기술 교육', '고급 장비 실습', '전문가 네트워킹', '기술 인증서 발급'],
         curriculum: [
            { week: 1, topic: '고급 청소 기술', content: '최신 청소 기법, 친환경 세제 활용법' },
            { week: 2, topic: '특수 가전 청소', content: '산업용 가전, 대형 가전 청소 기법' },
            { week: 3, topic: '고객 서비스', content: '고급 고객 응대, 클레임 처리 방법' },
            { week: 4, topic: '품질 관리', content: '서비스 품질 표준화, 체크리스트 작성' },
            { week: 5, topic: '사업 확장', content: '프랜차이즈, 직원 관리, 시스템 구축' },
            { week: 6, topic: '실무 프로젝트', content: '종합 실습, 포트폴리오 작성' },
         ],
         requirements: ['가전청소 관련 경력 1년 이상', '기본 자격증 보유자 우대', '사업 확장 계획이 있는 분'],
         benefits: ['전문가 인증서 발급', '협회 전문가 등록', '우수 업체 추천', '지속적인 기술 업데이트'],
         instructor: {
            name: '이전문',
            career: '가전청소 기술 개발 20년, 업계 최고 전문가',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
         },
         status: 'open',
         nextStartDate: '2025.03.12',
      },
      {
         id: 'new-item',
         title: '신아이템교육 과정',
         subtitle: '신기술과 새로운 서비스 모델',
         description: '최신 가전제품과 신기술을 활용한 새로운 서비스 모델을 학습하는 과정입니다. 시장 선도 기업이 되기 위한 혁신적 아이디어를 제공합니다.',
         duration: '3주 (24시간)',
         schedule: '주 2회 (토, 일) 10:00-14:00',
         location: '인천 청라 한올평생교육원',
         capacity: 25,
         currentEnrollment: 12,
         fee: '280,000원',
         features: ['최신 트렌드 분석', '신기술 체험', '아이디어 워크숍', '시장 진출 전략'],
         curriculum: [
            { week: 1, topic: '신기술 동향', content: 'IoT 가전, 스마트홈 기술, AI 청소 로봇' },
            { week: 2, topic: '신서비스 모델', content: '구독 서비스, 플랫폼 비즈니스, O2O 서비스' },
            { week: 3, topic: '사업화 전략', content: '아이디어 구체화, 시장 검증, 투자 유치' },
         ],
         requirements: ['혁신적 사고를 가진 분', '새로운 도전을 원하는 분', '기술에 관심이 많은 분'],
         benefits: ['신기술 교육 수료증', '스타트업 인큐베이팅 연계', '투자자 네트워킹', '특허 출원 지원'],
         instructor: {
            name: '박혁신',
            career: '스타트업 CEO, 기술 혁신 전문가',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
         },
         status: 'upcoming',
         nextStartDate: '2025.04.05',
      },
   ]

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'open':
            return <Badge variant="success">접수중</Badge>
         case 'closed':
            return <Badge variant="error">마감</Badge>
         case 'upcoming':
            return <Badge variant="warning">접수예정</Badge>
         default:
            return <Badge variant="default">미정</Badge>
      }
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            {/* TODO: 실제 이미지로 교체 - IMAGES.PAGES.EDUCATION 사용 */}
            <section
               className="relative py-16 bg-gradient-to-r from-emerald-900 to-emerald-700"
               style={
                  {
                     // backgroundImage: `url(${IMAGES.PAGES.EDUCATION})`, // 실제 이미지로 교체 시 사용
                     // backgroundSize: 'cover',
                     // backgroundPosition: 'center',
                     // backgroundRepeat: 'no-repeat'
                  }
               }
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">교육 프로그램</h1>
                  <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                     체계적인 교육과정을 통해 가전 청소 전문가로 성장하세요.
                     <br />
                     창업부터 전문성 향상까지, 단계별 맞춤 교육을 제공합니다.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button variant="primary" size="lg">
                        교육 신청하기
                     </Button>
                     <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-emerald-900 font-semibold">
                        교육 문의
                     </Button>
                  </div>
               </div>
            </section>

            {/* 교육 과정 소개 */}
            <section className="py-16 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">교육 과정 안내</h2>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">수준별, 목적별로 구성된 3가지 교육과정을 통해 여러분의 목표를 달성하세요.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {programs.map((program) => (
                        <Card key={program.id} className="h-full">
                           <div className="flex flex-col h-full">
                              {/* 헤더 */}
                              <div className="mb-6">
                                 <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                                    {getStatusBadge(program.status)}
                                 </div>
                                 <p className="text-emerald-600 font-medium mb-2">{program.subtitle}</p>
                                 <p className="text-gray-600 text-sm">{program.description}</p>
                              </div>

                              {/* 기본 정보 */}
                              <div className="space-y-3 mb-6">
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-600">기간: {program.duration}</span>
                                 </div>
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                                    </svg>
                                    <span className="text-gray-600">일정: {program.schedule}</span>
                                 </div>
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-600">장소: {program.location}</span>
                                 </div>
                                 <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    <span className="text-gray-600">
                                       정원: {program.currentEnrollment}/{program.capacity}명
                                    </span>
                                 </div>
                              </div>

                              {/* 특징 */}
                              <div className="mb-6">
                                 <h4 className="font-semibold text-gray-900 mb-2">주요 특징</h4>
                                 <ul className="space-y-1">
                                    {program.features.map((feature, index) => (
                                       <li key={index} className="flex items-center text-sm text-gray-600">
                                          <svg className="w-3 h-3 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          {feature}
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              {/* 가격 및 버튼 */}
                              <div className="mt-auto">
                                 <div className="flex items-center justify-between mb-4">
                                    <div>
                                       <span className="text-2xl font-bold text-emerald-600">{program.fee}</span>
                                       <p className="text-sm text-gray-500">다음 개강: {program.nextStartDate}</p>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <Button className="w-full" disabled={program.status === 'closed'}>
                                       {program.status === 'open' ? '신청하기' : program.status === 'closed' ? '마감' : '사전신청'}
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}>
                                       {selectedProgram === program.id ? '접기' : '자세히 보기'}
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>

            {/* 상세 정보 */}
            {selectedProgram && (
               <section className="py-16">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                     {programs
                        .filter((p) => p.id === selectedProgram)
                        .map((program) => (
                           <div key={program.id} className="space-y-8">
                              {/* 강사 소개 */}
                              <Card>
                                 <h3 className="text-xl font-bold text-gray-900 mb-4">강사 소개</h3>
                                 <div className="flex items-center gap-4">
                                    <img src={program.instructor.image} alt={program.instructor.name} className="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                       <h4 className="font-semibold text-gray-900">{program.instructor.name}</h4>
                                       <p className="text-gray-600">{program.instructor.career}</p>
                                    </div>
                                 </div>
                              </Card>

                              {/* 커리큘럼 */}
                              <Card>
                                 <h3 className="text-xl font-bold text-gray-900 mb-4">커리큘럼</h3>
                                 <div className="space-y-4">
                                    {program.curriculum.map((item) => (
                                       <div key={item.week} className="border-l-4 border-emerald-500 pl-4">
                                          <h4 className="font-semibold text-gray-900">
                                             {item.week}주차: {item.topic}
                                          </h4>
                                          <p className="text-gray-600">{item.content}</p>
                                       </div>
                                    ))}
                                 </div>
                              </Card>

                              {/* 수강 요건 및 혜택 */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <Card>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">수강 요건</h3>
                                    <ul className="space-y-2">
                                       {program.requirements.map((req, index) => (
                                          <li key={index} className="flex items-center text-gray-600">
                                             <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                             </svg>
                                             {req}
                                          </li>
                                       ))}
                                    </ul>
                                 </Card>

                                 <Card>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">수료 혜택</h3>
                                    <ul className="space-y-2">
                                       {program.benefits.map((benefit, index) => (
                                          <li key={index} className="flex items-center text-gray-600">
                                             <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                             </svg>
                                             {benefit}
                                          </li>
                                       ))}
                                    </ul>
                                 </Card>
                              </div>
                           </div>
                        ))}
                  </div>
               </section>
            )}

            {/* 교육 신청 안내 */}
            <section className="py-16 bg-emerald-50">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">교육 신청 안내</h2>
                  <p className="text-lg text-gray-600 mb-8">교육 신청은 온라인으로 간편하게 하실 수 있습니다.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                     <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-white font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">과정 선택</h3>
                        <p className="text-gray-600">원하는 교육과정을 선택하고 상세 정보를 확인하세요.</p>
                     </div>
                     <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">온라인 신청</h3>
                        <p className="text-gray-600">신청서를 작성하고 교육비를 결제합니다.</p>
                     </div>
                     <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-white font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">교육 참여</h3>
                        <p className="text-gray-600">개강일에 교육장에 오셔서 교육을 받으세요.</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link href="/support/contact">
                        <Button size="lg">교육 문의하기</Button>
                     </Link>
                     <Link href="/board/qna">
                        <Button variant="outline" size="lg">
                           자주 묻는 질문
                        </Button>
                     </Link>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
