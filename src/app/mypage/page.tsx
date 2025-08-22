import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function MyPage() {
   // 임시 데이터 (실제로는 API에서 가져올 데이터)
   const userInfo = {
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      joinDate: '2024-01-15',
   }

   const examHistory = [
      {
         id: 1,
         examName: '가전제품분해청소관리사',
         examDate: '2024-03-15',
         status: '합격',
         score: 85,
         certificateNumber: 'KHAMA-2024-001',
      },
      {
         id: 2,
         examName: '냉난방기세척서비스관리사',
         examDate: '2024-06-20',
         status: '대기중',
         score: null,
         certificateNumber: null,
      },
      {
         id: 3,
         examName: '에어컨설치관리사',
         examDate: '2024-02-10',
         status: '불합격',
         score: 55,
         certificateNumber: null,
      },
   ]

   const educationHistory = [
      {
         id: 1,
         courseName: '가전제품 분해청소 기초과정',
         startDate: '2024-01-20',
         endDate: '2024-02-20',
         status: '수료',
         instructor: '김전문',
      },
      {
         id: 2,
         courseName: '냉난방기 세척 전문과정',
         startDate: '2024-05-15',
         endDate: '2024-06-15',
         status: '진행중',
         instructor: '이기술',
      },
   ]

   const getStatusBadge = (status: string) => {
      switch (status) {
         case '합격':
         case '수료':
            return <Badge variant="success">{status}</Badge>
         case '불합격':
            return <Badge variant="error">{status}</Badge>
         case '대기중':
         case '진행중':
            return <Badge variant="warning">{status}</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">마이페이지</h1>
                  <p className="text-lg text-blue-100">개인 정보와 자격증 현황을 관리하세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* 사이드바 */}
                  <div className="lg:col-span-1">
                     <Card>
                        <div className="text-center mb-6">
                           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                           </div>
                           <h2 className="text-xl font-bold text-gray-900 mb-2">{userInfo.name}</h2>
                           <p className="text-gray-600">{userInfo.email}</p>
                           <p className="text-sm text-gray-500 mt-2">가입일: {userInfo.joinDate}</p>
                        </div>

                        <div className="space-y-2">
                           <Button href="#profile" variant="ghost" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              개인정보 수정
                           </Button>
                           <Button href="#exams" variant="ghost" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              시험 내역
                           </Button>
                           <Button href="#education" variant="ghost" className="w-full justify-start">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                 />
                              </svg>
                              교육 이력
                           </Button>
                        </div>
                     </Card>
                  </div>

                  {/* 메인 콘텐츠 */}
                  <div className="lg:col-span-2 space-y-8">
                     {/* 개인정보 */}
                     <Card id="profile">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">개인정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                              <input type="text" value={userInfo.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readOnly />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                              <input type="email" value={userInfo.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readOnly />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                              <input type="tel" value={userInfo.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readOnly />
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                              <input type="text" value={userInfo.address} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readOnly />
                           </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                           <Button>정보 수정</Button>
                           <Button variant="outline">비밀번호 변경</Button>
                        </div>
                     </Card>

                     {/* 시험 내역 */}
                     <Card id="exams">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-bold text-gray-900">시험 내역</h3>
                           <Button href="/exam/apply" size="sm">
                              새 시험 신청
                           </Button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                 <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">자격증명</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">점수</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                                 </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                 {examHistory.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-gray-50">
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.examName}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.examDate}</td>
                                       <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(exam.status)}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.score ? `${exam.score}점` : '-'}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          {exam.status === '합격' && (
                                             <Button size="sm" variant="outline">
                                                자격증 다운로드
                                             </Button>
                                          )}
                                          {exam.status === '대기중' && (
                                             <Button size="sm" variant="ghost">
                                                결과 대기중
                                             </Button>
                                          )}
                                          {exam.status === '불합격' && (
                                             <Button size="sm" variant="outline">
                                                재신청
                                             </Button>
                                          )}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </Card>

                     {/* 교육 이력 */}
                     <Card id="education">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-bold text-gray-900">교육 이력</h3>
                           <Button href="/business/education" size="sm" variant="secondary">
                              교육 신청
                           </Button>
                        </div>
                        <div className="space-y-4">
                           {educationHistory.map((course) => (
                              <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900">{course.courseName}</h4>
                                    {getStatusBadge(course.status)}
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div>
                                       <span className="font-medium">교육기간:</span> {course.startDate} ~ {course.endDate}
                                    </div>
                                    <div>
                                       <span className="font-medium">강사:</span> {course.instructor}
                                    </div>
                                    <div>
                                       {course.status === '수료' && (
                                          <Button size="sm" variant="outline">
                                             수료증 다운로드
                                          </Button>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </Card>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
