import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function BusinessPage() {
   const certifications = [
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
            application: '50,000원',
            certificate: '30,000원',
            total: '80,000원',
         },
         image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
         color: 'from-blue-500 to-blue-700',
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
            application: '50,000원',
            certificate: '30,000원',
            total: '80,000원',
         },
         image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
         color: 'from-emerald-500 to-emerald-700',
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
            application: '50,000원',
            certificate: '30,000원',
            total: '80,000원',
         },
         image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
         color: 'from-orange-500 to-orange-700',
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
            application: '50,000원',
            certificate: '30,000원',
            total: '80,000원',
         },
         image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
         color: 'from-purple-500 to-purple-700',
      },
   ]

   const educationPrograms = [
      {
         title: '창업교육',
         description: '예비 창업자를 위한 체계적인 창업 교육 프로그램',
         duration: '4주 과정',
         format: '온라인 + 오프라인',
         features: ['사업계획 수립', '마케팅 전략', '고객 관리', '재무 관리', '법규 및 안전'],
         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
         color: 'from-blue-500 to-blue-700',
      },
      {
         title: '전문가교육',
         description: '현업 종사자들의 전문성 향상을 위한 심화 교육',
         duration: '6주 과정',
         format: '실습 중심',
         features: ['최신 기술 동향', '고급 기술 습득', '품질 관리', '고객 서비스', '안전 관리'],
         image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
         color: 'from-emerald-500 to-emerald-700',
      },
      {
         title: '신아이템교육',
         description: '새로운 가전제품과 기술에 대한 전문 교육',
         duration: '2주 과정',
         format: '집중 교육',
         features: ['신제품 분석', '신기술 적용', '시장 동향', '경쟁력 강화', '미래 준비'],
         image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
         color: 'from-orange-500 to-orange-700',
      },
   ]

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700">
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
                     <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl max-w-5xl mx-auto">
                        <h3 className="text-lg font-bold text-blue-900 mb-4">민간자격 등록 정보</h3>
                        <div className="text-sm text-blue-800 space-y-2 text-left">
                           <p>
                              <strong>• 자격 종류:</strong> 등록민간자격
                           </p>
                           <p>
                              <strong>• 관리·운영기관:</strong> 한국생활가전유지관리협회(KHAMA)
                           </p>
                           <p>
                              <strong>• 총비용:</strong> 80,000원 (응시료 50,000원 + 자격발급비 30,000원)
                           </p>
                           <p>
                              <strong>• 환불규정:</strong> 접수마감 전 100% 환불, 시험 당일 취소 시 30% 공제 후 환불
                           </p>
                           <p>
                              <strong>• 연락처:</strong> 02-1234-5678
                           </p>
                           <p className="text-red-700 font-medium mt-4">※ 본 자격은 자격기본법 규정에 따라 등록한 민간자격으로, 국가로부터 인정받은 공인자격이 아닙니다.</p>
                           <p className="text-blue-700">※ 민간자격 등록 및 공인 제도에 대한 상세내용은 민간자격정보서비스(www.pqi.or.kr)의 &apos;민간자격 소개&apos; 란을 참고하여 주십시오.</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-16">
                     {certifications.map((cert, index) => (
                        <div key={cert.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                           <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                              <div className="relative h-80 rounded-xl overflow-hidden">
                                 <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cert.image})` }} />
                                 <div className={`absolute inset-0 bg-gradient-to-r ${cert.color} opacity-80`} />
                                 <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                                    <div>
                                       <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
                                       <p className="text-lg opacity-90">{cert.subtitle}</p>
                                    </div>
                                 </div>
                                 <div className="absolute top-4 right-4">
                                    <Badge variant="default">등록번호: {cert.registrationNumber}</Badge>
                                 </div>
                              </div>
                           </div>

                           <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                              <Card>
                                 <h3 className="text-2xl font-bold text-gray-900 mb-4">{cert.title}</h3>
                                 <p className="text-gray-600 mb-6 leading-relaxed">{cert.description}</p>

                                 {/* 주요 특징 */}
                                 <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">주요 특징</h4>
                                    <div className="flex flex-wrap gap-2">
                                       {cert.features.map((feature, idx) => (
                                          <Badge key={idx} variant="primary">
                                             {feature}
                                          </Badge>
                                       ))}
                                    </div>
                                 </div>

                                 {/* 시험 정보 */}
                                 <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">시험 정보</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                       <p>
                                          <strong>필기시험:</strong> {cert.examInfo.written}
                                       </p>
                                       <p>
                                          <strong>실기시험:</strong> {cert.examInfo.practical}
                                       </p>
                                       <p>
                                          <strong>합격기준:</strong> {cert.examInfo.passingScore}
                                       </p>
                                    </div>
                                 </div>

                                 {/* 비용 정보 */}
                                 <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">비용 정보</h4>
                                    <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                                       <p>
                                          <strong>응시료:</strong> {cert.cost.application}
                                       </p>
                                       <p>
                                          <strong>자격발급비:</strong> {cert.cost.certificate}
                                       </p>
                                       <p className="text-blue-900 font-semibold">
                                          <strong>총 비용:</strong> {cert.cost.total}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="flex flex-col sm:flex-row gap-3">
                                    <Button href={`/business/certifications/${cert.id}`} className="flex-1">
                                       자세히 보기
                                    </Button>
                                    <Button href="/exam" variant="secondary" className="flex-1">
                                       시험 신청
                                    </Button>
                                 </div>
                              </Card>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* 교육 프로그램 */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">교육 프로그램</h2>
                     <p className="text-xl text-gray-600">창업부터 전문가 양성까지, 단계별 맞춤 교육 프로그램</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {educationPrograms.map((program, index) => (
                        <Card key={index} hover>
                           <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${program.image})` }} />
                              <div className={`absolute inset-0 bg-gradient-to-r ${program.color} opacity-80`} />
                              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                                 <h3 className="text-2xl font-bold">{program.title}</h3>
                              </div>
                           </div>

                           <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>

                           <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                 <span>
                                    <strong>기간:</strong> {program.duration}
                                 </span>
                                 <span>
                                    <strong>형태:</strong> {program.format}
                                 </span>
                              </div>
                           </div>

                           <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3">교육 내용</h4>
                              <div className="space-y-2">
                                 {program.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-gray-600">
                                       <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                       </svg>
                                       {feature}
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <Button href="/business/education" fullWidth>
                              교육 신청하기
                           </Button>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
