'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ExamResultsPage() {
   const [searchData, setSearchData] = useState({
      examNumber: '',
      name: '',
      birthDate: '',
   })
   const [searchResult, setSearchResult] = useState<unknown>(null)
   const [isSearching, setIsSearching] = useState(false)

   const recentResults = [
      {
         examDate: '2025년 8월 18일',
         certification: '가전제품분해청소관리사',
         announcementDate: '2025년 8월 25일',
         status: 'announced',
      },
      {
         examDate: '2025년 8월 25일',
         certification: '냉난방기세척서비스관리사',
         announcementDate: '2025년 9월 1일',
         status: 'announced',
      },
      {
         examDate: '2025년 9월 15일',
         certification: '가전제품분해청소관리사',
         announcementDate: '2025년 9월 22일',
         status: 'pending',
      },
      {
         examDate: '2025년 9월 22일',
         certification: '냉난방기세척서비스관리사',
         announcementDate: '2025년 9월 29일',
         status: 'pending',
      },
   ]

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setSearchData((prev) => ({ ...prev, [name]: value }))
   }

   const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!searchData.examNumber || !searchData.name || !searchData.birthDate) {
         alert('모든 항목을 입력해주세요.')
         return
      }

      setIsSearching(true)

      // 임시 검색 결과 (실제로는 API 호출)
      setTimeout(() => {
         // 임시 데이터
         const mockResult = {
            examNumber: searchData.examNumber,
            name: searchData.name,
            certification: '가전제품분해청소관리사',
            examDate: '2025년 8월 18일',
            result: 'pass', // pass, fail, pending
            totalScore: 85,
            writtenScore: 88,
            practicalScore: 82,
            certificateNumber: 'KHAMA-2025-001234',
         }

         setSearchResult(mockResult)
         setIsSearching(false)
      }, 1500)
   }

   const downloadCertificate = () => {
      // 임시 처리 (실제로는 PDF 다운로드)
      alert('합격증을 다운로드합니다.')
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">합격자 발표</h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">수험번호로 시험 결과를 조회하고 합격증을 다운로드하세요</p>
               </div>
            </section>

            <div className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* 합격자 조회 */}
                     <div className="lg:col-span-2">
                        <Card>
                           <h2 className="text-2xl font-bold text-gray-900 mb-6">합격자 조회</h2>

                           <form onSubmit={handleSearch} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       수험번호 <span className="text-red-500">*</span>
                                    </label>
                                    <input type="text" name="examNumber" value={searchData.examNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="예: 2025001234" required />
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       성명 <span className="text-red-500">*</span>
                                    </label>
                                    <input type="text" name="name" value={searchData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="홍길동" required />
                                 </div>

                                 <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       생년월일 <span className="text-red-500">*</span>
                                    </label>
                                    <input type="date" name="birthDate" value={searchData.birthDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                                 </div>
                              </div>

                              <Button type="submit" fullWidth disabled={isSearching} className={isSearching ? 'opacity-50 cursor-not-allowed' : ''}>
                                 {isSearching ? '조회 중...' : '합격자 조회'}
                              </Button>
                           </form>

                           {/* 검색 결과 */}
                           {searchResult && (
                              <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
                                 <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">조회 결과</h3>
                                    {searchResult.result === 'pass' && <Badge variant="success">합격</Badge>}
                                    {searchResult.result === 'fail' && <Badge variant="error">불합격</Badge>}
                                    {searchResult.result === 'pending' && <Badge variant="warning">발표 대기</Badge>}
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                       <p className="text-sm text-gray-600">수험번호</p>
                                       <p className="font-semibold">{searchResult.examNumber}</p>
                                    </div>
                                    <div>
                                       <p className="text-sm text-gray-600">성명</p>
                                       <p className="font-semibold">{searchResult.name}</p>
                                    </div>
                                    <div>
                                       <p className="text-sm text-gray-600">자격증</p>
                                       <p className="font-semibold">{searchResult.certification}</p>
                                    </div>
                                    <div>
                                       <p className="text-sm text-gray-600">시험일</p>
                                       <p className="font-semibold">{searchResult.examDate}</p>
                                    </div>
                                 </div>

                                 {searchResult.result === 'pass' && (
                                    <>
                                       <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
                                          <div className="text-center">
                                             <p className="text-sm text-gray-600">필기점수</p>
                                             <p className="text-lg font-bold text-green-700">{searchResult.writtenScore}점</p>
                                          </div>
                                          <div className="text-center">
                                             <p className="text-sm text-gray-600">실기점수</p>
                                             <p className="text-lg font-bold text-green-700">{searchResult.practicalScore}점</p>
                                          </div>
                                          <div className="text-center">
                                             <p className="text-sm text-gray-600">총점</p>
                                             <p className="text-lg font-bold text-green-700">{searchResult.totalScore}점</p>
                                          </div>
                                       </div>

                                       <div className="mb-4">
                                          <p className="text-sm text-gray-600">자격증 번호</p>
                                          <p className="font-semibold text-blue-900">{searchResult.certificateNumber}</p>
                                       </div>

                                       <Button onClick={downloadCertificate} fullWidth>
                                          합격증 다운로드 (PDF)
                                       </Button>
                                    </>
                                 )}

                                 {searchResult.result === 'fail' && (
                                    <div className="p-4 bg-red-50 rounded-lg">
                                       <p className="text-red-700 text-sm">아쉽게도 불합격하셨습니다. 다음 시험에 다시 도전해보세요.</p>
                                       <div className="mt-4">
                                          <Button href="/exam" variant="outline" fullWidth>
                                             다음 시험 신청하기
                                          </Button>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           )}
                        </Card>
                     </div>

                     {/* 최근 합격 발표 */}
                     <div>
                        <Card>
                           <h3 className="text-xl font-bold text-gray-900 mb-6">최근 합격 발표</h3>
                           <div className="space-y-4">
                              {recentResults.map((result, index) => (
                                 <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                       <h4 className="font-semibold text-gray-900 text-sm">{result.certification}</h4>
                                       {result.status === 'announced' ? (
                                          <Badge variant="success" size="sm">
                                             발표완료
                                          </Badge>
                                       ) : (
                                          <Badge variant="warning" size="sm">
                                             발표예정
                                          </Badge>
                                       )}
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1">
                                       <p>시험일: {result.examDate}</p>
                                       <p>발표일: {result.announcementDate}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </Card>

                        {/* 안내사항 */}
                        <Card className="mt-6">
                           <h3 className="text-lg font-bold text-gray-900 mb-4">안내사항</h3>
                           <div className="text-sm text-gray-600 space-y-2">
                              <p>• 합격 발표는 시험 종료 후 7일 이내에 진행됩니다.</p>
                              <p>• 합격증은 PDF 형태로 다운로드 가능합니다.</p>
                              <p>• 자격증 원본은 별도 신청 후 우편 발송됩니다.</p>
                              <p>• 문의사항은 고객센터로 연락해주세요.</p>
                           </div>
                           <div className="mt-4">
                              <Button href="/support/contact" variant="outline" size="sm" fullWidth>
                                 문의하기
                              </Button>
                           </div>
                        </Card>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
