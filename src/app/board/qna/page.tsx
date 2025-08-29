'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { IMAGES } from '@/constants/images'

interface QnaItem {
   id: number
   title: string
   content: string
   category?: string
   question_type?: string
   author?: string
   author_name?: string
   createdAt?: string
   created_at?: string
   status?: string
   is_answered?: boolean
   isPrivate?: boolean
   is_private?: boolean
   views?: number
   view_count?: number
   answerCount?: number
}

export default function QnaPage() {
   const router = useRouter()
   const [qnaList, setQnaList] = useState<QnaItem[]>([])
   const [loading, setLoading] = useState(true)
   const [selectedCategory, setSelectedCategory] = useState('전체')
   const [selectedStatus, setSelectedStatus] = useState('전체')
   const [searchQuery, setSearchQuery] = useState('')
   const [totalCount, setTotalCount] = useState(0)
   const [page, setPage] = useState(1)

   // 폴백 데이터 (메모이제이션)
   const fallbackQnaList = useMemo(
      () => [
         {
            id: 1,
            title: '가전제품분해청소관리사 시험 난이도는 어느 정도인가요?',
            content: '시험 준비를 하고 있는데 난이도가 궁금합니다.',
            category: '시험문의',
            author: '김**',
            createdAt: '2025-01-15',
            status: '답변완료',
            isPrivate: false,
            views: 45,
            answerCount: 1,
         },
         {
            id: 2,
            title: '교육 과정 수강 후 바로 시험 응시가 가능한가요?',
            content: '교육과정을 수강한 후 언제부터 시험에 응시할 수 있는지 궁금합니다.',
            category: '교육문의',
            author: '이**',
            createdAt: '2025-01-14',
            status: '답변대기',
            isPrivate: false,
            views: 32,
            answerCount: 0,
         },
         {
            id: 3,
            title: '자격증 발급 기간은 얼마나 걸리나요?',
            content: '합격 후 자격증 발급까지 소요되는 기간이 궁금합니다.',
            category: '자격증문의',
            author: '박**',
            createdAt: '2025-01-13',
            status: '답변완료',
            isPrivate: false,
            views: 78,
            answerCount: 1,
         },
         {
            id: 4,
            title: '[비공개] 개인 사정으로 인한 시험 일정 변경 문의',
            content: '비공개 글입니다.',
            category: '기타문의',
            author: '최**',
            createdAt: '2025-01-12',
            status: '답변완료',
            isPrivate: true,
            views: 1,
            answerCount: 1,
         },
         {
            id: 5,
            title: '타 지역에서도 시험 응시가 가능한가요?',
            content: '서울 거주자인데 인천에서 시험을 볼 수 있는지 궁금합니다.',
            category: '시험문의',
            author: '정**',
            createdAt: '2025-01-11',
            status: '답변완료',
            isPrivate: false,
            views: 56,
            answerCount: 1,
         },
      ],
      []
   )

   // Q&A 목록 로드
   const loadQnaList = useCallback(async () => {
      try {
         setLoading(true)

         // API 호출
         const response = await fetch(
            `/api/board/qna?` +
               new URLSearchParams({
                  page: page.toString(),
                  limit: '10',
                  category: selectedCategory === '전체' ? '' : selectedCategory,
                  search: searchQuery,
                  answered: selectedStatus === '전체' ? '' : selectedStatus === '답변완료' ? 'true' : 'false',
               }).toString()
         )

         const data = await response.json()

         if (response.ok) {
            // 데이터 변환
            const transformedData = (data.posts || []).map((post: unknown) => ({
               id: post.id,
               title: post.title,
               content: post.content,
               category: post.category || '기타문의',
               status: post.is_answered ? '답변완료' : '답변대기',
               isPrivate: post.is_private || false,
               author: post.author_name || '익명',
               createdAt: new Date(post.created_at).toLocaleDateString('ko-KR'),
               views: post.view_count || 0,
               answerCount: post.is_answered ? 1 : 0,
            }))

            setQnaList(transformedData)
            setTotalCount(data.pagination?.total_count || transformedData.length)
         } else {
            console.error('QNA 목록 로드 실패:', data.error)
            setQnaList(fallbackQnaList)
            setTotalCount(fallbackQnaList.length)
         }
      } catch (error) {
         console.error('QNA 목록 로드 오류:', error)
         setQnaList(fallbackQnaList)
         setTotalCount(fallbackQnaList.length)
      } finally {
         setLoading(false)
      }
   }, [selectedCategory, selectedStatus, searchQuery, page, fallbackQnaList])

   // Q&A 데이터 로드
   useEffect(() => {
      loadQnaList()
   }, [loadQnaList])

   const handleSearch = () => {
      loadQnaList()
   }

   const categories = ['전체', '시험문의', '교육문의', '자격증문의', '기타문의']

   const getCategoryBadge = (category: string) => {
      switch (category) {
         case '시험문의':
            return <Badge variant="primary">{category}</Badge>
         case '교육문의':
            return <Badge variant="secondary">{category}</Badge>
         case '자격증문의':
            return <Badge variant="success">{category}</Badge>
         case '기타문의':
            return <Badge variant="default">{category}</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   const getStatusBadge = (status: string) => {
      switch (status) {
         case '답변완료':
            return <Badge variant="success">{status}</Badge>
         case '답변대기':
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
            <section
               className="relative py-12 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.QNA})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Q&A</h1>
                  <p className="text-lg text-blue-100">궁금한 사항을 질문하고 전문가의 답변을 받아보세요</p>
               </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* 질문 작성 버튼 */}
               <div className="mb-8 text-center">
                  <Link href="/board/qna/write">
                     <Button size="lg" className="px-8">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        질문하기
                     </Button>
                  </Link>
               </div>

               {/* 검색 및 필터 */}
               <Card className="mb-8">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                           <Button key={category} variant={category === selectedCategory ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)}>
                              {category}
                           </Button>
                        ))}
                     </div>
                     <div className="flex gap-2 w-full md:w-auto">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                           <option value="전체">전체</option>
                           <option value="답변완료">답변완료</option>
                           <option value="답변대기">답변대기</option>
                        </select>
                        <input
                           type="text"
                           placeholder="제목, 내용으로 검색..."
                           className="flex-1 md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch}>검색</Button>
                     </div>
                  </div>
               </Card>

               {/* Q&A 목록 */}
               {loading ? (
                  <div className="space-y-4">
                     {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                           <div className="space-y-4">
                              <div className="flex gap-2">
                                 <div className="h-6 bg-gray-200 rounded w-20"></div>
                                 <div className="h-6 bg-gray-200 rounded w-16"></div>
                              </div>
                              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-16 bg-gray-200 rounded"></div>
                           </div>
                        </Card>
                     ))}
                  </div>
               ) : qnaList.length === 0 ? (
                  <Card>
                     <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                           <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">질문이 없습니다</h3>
                        <p className="text-gray-500 mb-4">아직 등록된 질문이 없습니다. 궁금한 사항을 질문해보세요.</p>
                        <Link href="/board/qna/write">
                           <Button>첫 질문하기</Button>
                        </Link>
                     </div>
                  </Card>
               ) : (
                  <div className="space-y-4">
                     {qnaList.map((qna) => (
                        <Card key={qna.id} hover className="cursor-pointer" onClick={() => router.push(`/board/qna/${qna.id}`)}>
                           <div className="flex items-start justify-between">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    {getCategoryBadge(qna.category || '기타문의')}
                                    {getStatusBadge(qna.status || '답변대기')}
                                    {qna.isPrivate && (
                                       <Badge variant="error" size="sm">
                                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                          </svg>
                                          비공개
                                       </Badge>
                                    )}
                                 </div>

                                 <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">{qna.title}</h3>

                                 {!qna.isPrivate && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{qna.content}</p>}

                                 <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>작성자: {qna.author}</span>
                                    <span>작성일: {qna.createdAt}</span>
                                    <span>조회: {qna.views}</span>
                                    {(qna.answerCount || 0) > 0 && <span className="text-blue-600 font-medium">답변: {qna.answerCount}</span>}
                                 </div>
                              </div>

                              <div className="flex items-center ml-4">
                                 {qna.status === '답변완료' ? (
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                       <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                       </svg>
                                    </div>
                                 ) : (
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                       <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                       </svg>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
               )}

               {/* 페이지네이션 */}
               <Card className="mt-8">
                  <div className="flex items-center justify-between px-4 py-3">
                     <div className="flex flex-1 justify-between sm:hidden">
                        <Button variant="outline" size="sm">
                           이전
                        </Button>
                        <Button variant="outline" size="sm">
                           다음
                        </Button>
                     </div>
                     <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                           <p className="text-sm text-gray-700">
                              총 <span className="font-medium">{totalCount}</span>개의 질문
                           </p>
                        </div>
                        <div>
                           <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                              <Button variant="outline" size="sm" className="rounded-l-md">
                                 이전
                              </Button>
                              <Button variant="primary" size="sm" className="rounded-none">
                                 1
                              </Button>
                              <Button variant="outline" size="sm" className="rounded-r-md">
                                 다음
                              </Button>
                           </nav>
                        </div>
                     </div>
                  </div>
               </Card>

               {/* 자주 묻는 질문 */}
               <Card className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문</h3>
                  <div className="space-y-4">
                     <div className="border-b border-gray-200 pb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q. 시험 응시 자격이 있나요?</h4>
                        <p className="text-gray-600 text-sm">A. 협회에서 제공하는 교육과정을 이수하신 분은 누구나 시험에 응시하실 수 있습니다.</p>
                     </div>
                     <div className="border-b border-gray-200 pb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q. 시험 합격 기준은 무엇인가요?</h4>
                        <p className="text-gray-600 text-sm">A. 필기시험과 실기시험 각각 60점 이상 득점하시면 합격입니다.</p>
                     </div>
                     <div className="border-b border-gray-200 pb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q. 자격증 유효기간이 있나요?</h4>
                        <p className="text-gray-600 text-sm">A. 발급된 자격증은 3년 유효합니다.</p>
                     </div>
                  </div>
               </Card>
            </div>
         </main>

         <Footer />
      </div>
   )
}
