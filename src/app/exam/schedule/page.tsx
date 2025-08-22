import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function ExamSchedulePage() {
   const examSchedules = [
      {
         id: 1,
         title: '가전제품분해청소관리사',
         examDate: '2025년 9월 15일 (일)',
         applicationStart: '2025년 8월 1일',
         applicationEnd: '2025년 9월 8일',
         resultDate: '2025년 9월 22일',
         locations: [{ city: '인천', venue: '인천 청라 한올평생교육원', address: '인천광역시 서구 청라한내로72번길 13 (청라동) 203호' }],
         status: 'open',
      },
      {
         id: 2,
         title: '냉난방기세척서비스관리사',
         examDate: '2025년 9월 22일 (일)',
         applicationStart: '2025년 8월 8일',
         applicationEnd: '2025년 9월 15일',
         resultDate: '2025년 9월 29일',
         locations: [{ city: '인천', venue: '인천 청라 한올평생교육원', address: '인천광역시 서구 청라한내로72번길 13 (청라동) 203호' }],
         status: 'open',
      },
      {
         id: 3,
         title: '에어컨설치관리사',
         examDate: '2025년 10월 13일 (일)',
         applicationStart: '2025년 9월 1일',
         applicationEnd: '2025년 10월 6일',
         resultDate: '2025년 10월 20일',
         locations: [{ city: '인천', venue: '인천 청라 한올평생교육원', address: '인천광역시 서구 청라한내로72번길 13 (청라동) 203호' }],
         status: 'upcoming',
      },
      {
         id: 4,
         title: '환기청정시스템관리사',
         examDate: '2025년 10월 20일 (일)',
         applicationStart: '2025년 9월 8일',
         applicationEnd: '2025년 10월 13일',
         resultDate: '2025년 10월 27일',
         locations: [{ city: '인천', venue: '인천 청라 한올평생교육원', address: '인천광역시 서구 청라한내로72번길 13 (청라동) 203호' }],
         status: 'upcoming',
      },
   ]

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'open':
            return <Badge variant="success">접수중</Badge>
         case 'upcoming':
            return <Badge variant="warning">접수예정</Badge>
         case 'closed':
            return <Badge variant="error">접수마감</Badge>
         default:
            return <Badge variant="default">확인중</Badge>
      }
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">시험 일정</h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">2024년 하반기 자격시험 일정 및 시험장 정보를 확인하세요</p>
               </div>
            </section>

            {/* 시험 일정 목록 */}
            <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="space-y-8">
                     {examSchedules.map((exam) => (
                        <Card key={exam.id} className="overflow-hidden">
                           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                              <div>
                                 <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{exam.title}</h2>
                                    {getStatusBadge(exam.status)}
                                 </div>
                                 <p className="text-lg text-blue-900 font-semibold">{exam.examDate}</p>
                              </div>
                              <div className="mt-4 lg:mt-0">
                                 <Button href={exam.status === 'open' ? `/exam/apply?cert=${exam.id}` : '#'} disabled={exam.status !== 'open'} className={exam.status !== 'open' ? 'opacity-50 cursor-not-allowed' : ''}>
                                    {exam.status === 'open' ? '시험 신청' : exam.status === 'upcoming' ? '접수 예정' : '접수 마감'}
                                 </Button>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* 일정 정보 */}
                              <div>
                                 <h3 className="font-semibold text-gray-900 mb-3">시험 일정</h3>
                                 <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                       <span className="text-gray-600">접수 시작:</span>
                                       <span className="font-medium">{exam.applicationStart}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-600">접수 마감:</span>
                                       <span className="font-medium">{exam.applicationEnd}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-600">시험 일자:</span>
                                       <span className="font-medium text-blue-900">{exam.examDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-600">합격 발표:</span>
                                       <span className="font-medium">{exam.resultDate}</span>
                                    </div>
                                 </div>
                              </div>

                              {/* 시험장 정보 */}
                              <div className="lg:col-span-2">
                                 <h3 className="font-semibold text-gray-900 mb-3">시험장 정보</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {exam.locations.map((location, index) => (
                                       <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                          <div className="font-medium text-gray-900 mb-1">{location.city}</div>
                                          <div className="text-sm text-gray-600 mb-1">{location.venue}</div>
                                          <div className="text-xs text-gray-500">{location.address}</div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>

            {/* 시험 안내 */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">시험 안내사항</h2>
                        <div className="space-y-4 text-sm">
                           <div>
                              <h3 className="font-semibold text-gray-900 mb-2">시험 시간</h3>
                              <p className="text-gray-600">
                                 • 필기시험: 오전 10:00 ~ 11:30 (90분)
                                 <br />• 실기시험: 오후 1:00 ~ 3:00 (120분)
                              </p>
                           </div>
                           <div>
                              <h3 className="font-semibold text-gray-900 mb-2">준비물</h3>
                              <p className="text-gray-600">
                                 • 신분증 (주민등록증, 운전면허증, 여권 중 1개)
                                 <br />
                                 • 수험표 (출력 또는 모바일)
                                 <br />• 필기구 (검은색 볼펜, 연필, 지우개)
                              </p>
                           </div>
                           <div>
                              <h3 className="font-semibold text-gray-900 mb-2">주의사항</h3>
                              <p className="text-gray-600">
                                 • 시험 시작 30분 전까지 입실 완료
                                 <br />
                                 • 시험 시작 후 30분 경과 시 입실 불가
                                 <br />• 휴대폰 등 전자기기 사용 금지
                              </p>
                           </div>
                        </div>
                     </Card>

                     <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">문의처</h2>
                        <div className="space-y-4">
                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                 />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">전화 문의</p>
                                 <p className="text-gray-600">1566-3321</p>
                                 <p className="text-sm text-gray-500">평일 09:00 - 18:00</p>
                              </div>
                           </div>

                           <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <div>
                                 <p className="font-medium text-gray-900">이메일 문의</p>
                                 <p className="text-gray-600">haan@hanallcompany.com</p>
                              </div>
                           </div>

                           <div className="pt-4">
                              <Button href="/support/contact" fullWidth>
                                 온라인 문의하기
                              </Button>
                           </div>
                        </div>
                     </Card>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
