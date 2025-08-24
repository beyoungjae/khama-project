'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function NoticePage() {
   const router = useRouter()
   
   // 임시 데이터 (실제로는 API에서 가져올 데이터)
   const noticeList = [
      {
         id: 1,
         title: '2025년 1분기 자격시험 일정 안내',
         content: '2025년 1분기 자격시험 일정이 확정되었습니다. 자세한 내용을 확인해주세요.',
         category: '시험공지',
         author: '관리자',
         createdAt: '2025.01.15',
         views: 1247,
         isImportant: true,
         isNew: true,
      },
      {
         id: 2,
         title: '2024년 4분기 합격자 발표',
         content: '2024년 4분기 자격시험 합격자를 발표합니다.',
         category: '시험공지',
         author: '관리자',
         createdAt: '2024.12.20',
         views: 892,
         isImportant: false,
         isNew: false,
      },
      {
         id: 3,
         title: '신규 교육과정 개설 안내',
         content: '2025년부터 새로운 교육과정이 개설됩니다.',
         category: '교육공지',
         author: '관리자',
         createdAt: '2024.12.15',
         views: 634,
         isImportant: false,
         isNew: false,
      },
      {
         id: 4,
         title: '협회 홈페이지 리뉴얼 안내',
         content: '더 나은 서비스 제공을 위해 홈페이지를 리뉴얼했습니다.',
         category: '일반공지',
         author: '관리자',
         createdAt: '2024.12.10',
         views: 445,
         isImportant: false,
         isNew: false,
      },
      {
         id: 5,
         title: '시험 접수 시 유의사항 안내',
         content: '시험 접수 시 반드시 확인해야 할 사항들을 안내드립니다.',
         category: '시험공지',
         author: '관리자',
         createdAt: '2024.12.05',
         views: 723,
         isImportant: true,
         isNew: false,
      },
      {
         id: 6,
         title: '연말연시 휴무 안내',
         content: '연말연시 협회 사무국 휴무 일정을 안내드립니다.',
         category: '일반공지',
         author: '관리자',
         createdAt: '2024.12.01',
         views: 356,
         isImportant: false,
         isNew: false,
      },
   ]

   const getCategoryBadge = (category: string) => {
      switch (category) {
         case '시험공지':
            return <Badge variant="primary">{category}</Badge>
         case '교육공지':
            return <Badge variant="secondary">{category}</Badge>
         case '일반공지':
            return <Badge variant="default">{category}</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            {/* TODO: 실제 이미지로 교체 - IMAGES.PAGES.NOTICE 사용 */}
            <section
               className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700"
               style={
                  {
                     // backgroundImage: `url(${IMAGES.PAGES.NOTICE})`, // 실제 이미지로 교체 시 사용
                     // backgroundSize: 'cover',
                     // backgroundPosition: 'center',
                     // backgroundRepeat: 'no-repeat'
                  }
               }
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">공지사항</h1>
                  <p className="text-lg text-blue-100">협회의 중요한 소식과 공지사항을 확인하세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* 카테고리 필터 */}
               <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                     <Button variant="primary" size="sm">
                        전체
                     </Button>
                     <Button variant="outline" size="sm">
                        시험공지
                     </Button>
                     <Button variant="outline" size="sm">
                        교육공지
                     </Button>
                     <Button variant="outline" size="sm">
                        일반공지
                     </Button>
                  </div>
               </div>

               {/* 검색 */}
               <div className="mb-8">
                  <div className="flex gap-2">
                     <input type="text" placeholder="공지사항을 검색하세요..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                     <Button>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                     </Button>
                  </div>
               </div>

               {/* 공지사항 목록 */}
               <Card>
                  {/* 데스크톱 테이블 뷰 */}
                  <div className="hidden lg:block overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분류</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {noticeList.map((notice) => (
                              <tr 
                                 key={notice.id} 
                                 className="hover:bg-gray-50 cursor-pointer transition-colors"
                                 onClick={() => router.push(`/board/notice/${notice.id}`)}
                              >
                                    <td className="px-6 py-4">
                                       <div className="flex items-center">
                                          {notice.isImportant && (
                                             <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                             </svg>
                                          )}
                                          <div>
                                             <div className="flex items-center">
                                                <span className={`text-sm font-medium ${notice.isImportant ? 'text-red-600' : 'text-gray-900'}`}>{notice.title}</span>
                                                {notice.isNew && (
                                                   <Badge variant="success" size="sm">
                                                      NEW
                                                   </Badge>
                                                )}
                                             </div>
                                             <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notice.content}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(notice.category)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.createdAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.views.toLocaleString()}</td>
                                 </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* 모바일/태블릿 카드 뷰 */}
                  <div className="lg:hidden space-y-4">
                     {noticeList.map((notice) => (
                        <Link key={notice.id} href={`/board/notice/${notice.id}`}>
                           <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center gap-2 flex-wrap">
                                    {getCategoryBadge(notice.category)}
                                    {notice.isImportant && (
                                       <Badge variant="error" size="sm">
                                          중요
                                       </Badge>
                                    )}
                                    {notice.isNew && (
                                       <Badge variant="success" size="sm">
                                          NEW
                                       </Badge>
                                    )}
                                 </div>
                                 <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                 </svg>
                              </div>

                              <h3 className={`font-medium mb-2 text-base leading-tight ${notice.isImportant ? 'text-red-600' : 'text-gray-900'}`}>
                                 {notice.isImportant && (
                                    <svg className="w-4 h-4 text-red-500 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                 )}
                                 {notice.title}
                              </h3>

                              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{notice.content}</p>

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                 <div className="flex items-center space-x-3">
                                    <span>{notice.author}</span>
                                    <span>조회 {notice.views.toLocaleString()}</span>
                                 </div>
                                 <span>{notice.createdAt}</span>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>

                  {/* 페이지네이션 */}
                  <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
                     <nav className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                           이전
                        </Button>
                        <Button variant="primary" size="sm">
                           1
                        </Button>
                        <Button variant="outline" size="sm">
                           2
                        </Button>
                        <Button variant="outline" size="sm">
                           3
                        </Button>
                        <Button variant="outline" size="sm">
                           다음
                        </Button>
                     </nav>
                  </div>
               </Card>

               {/* 빠른 링크 */}
               <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="text-center">
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Q&A</h3>
                     <p className="text-gray-600 mb-4">궁금한 사항을 문의하세요</p>
                     <Button href="/board/qna" size="sm">
                        바로가기
                     </Button>
                  </Card>

                  <Card className="text-center">
                     <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">시험 신청</h3>
                     <p className="text-gray-600 mb-4">자격시험에 신청하세요</p>
                     <Button href="/exam/apply" size="sm">
                        바로가기
                     </Button>
                  </Card>

                  <Card className="text-center">
                     <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                           />
                        </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">문의하기</h3>
                     <p className="text-gray-600 mb-4">직접 문의해주세요</p>
                     <Button href="/support/contact" size="sm">
                        바로가기
                     </Button>
                  </Card>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
