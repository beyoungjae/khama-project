'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface NoticeDetail {
   id: string
   title: string
   content: string
   category: string
   author_name: string
   created_at: string
   view_count: number
   is_important: boolean
   is_pinned: boolean
   status: string
   published_at: string
}

export default function NoticeDetailPage() {
   const params = useParams()
   const router = useRouter()
   const [notice, setNotice] = useState<NoticeDetail | null>(null)
   const [isLoading, setIsLoading] = useState(true)
   const [relatedNotices, setRelatedNotices] = useState<
      Array<{
         id: string
         title: string
         created_at: string
         category: string
      }>
   >([])
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchNotice = async () => {
         setIsLoading(true)
         setError(null)

         try {
            // 최초 데이터 로드 (조회수 증가 없이)
            const response = await fetch(`/api/board/notices/${params.id}`)

            if (!response.ok) {
               throw new Error('공지사항을 불러오는데 실패했습니다.')
            }

            const data = await response.json()
            setNotice(data.notice)

            // 데이터 로드 완료 후 조회수 증가 (한 번만)
            fetch(`/api/board/notices/${params.id}?increment=true`).catch(console.error)

            // 관련 공지사항 (임시 데이터)
            setRelatedNotices([
               { id: '2', title: '2024년 4분기 합격자 발표', created_at: '2024-12-20', category: '시험공지' },
               { id: '3', title: '시험 접수 시 유의사항 안내', created_at: '2024-12-15', category: '시험공지' },
               { id: '4', title: '교육 과정 개편 안내', created_at: '2024-12-10', category: '교육공지' },
            ])
         } catch (error) {
            console.error('공지사항 로딩 실패:', error)
            setError(error instanceof Error ? error.message : '공지사항을 불러오는데 실패했습니다.')
         } finally {
            setIsLoading(false)
         }
      }

      if (params.id) {
         fetchNotice()
      }
   }, [params.id])

   if (isLoading) {
      return (
         <div className="min-h-screen">
            <Header />
            <main className="pt-16">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="animate-pulse">
                     <div className="h-8 bg-gray-200 rounded mb-4"></div>
                     <div className="h-4 bg-gray-200 rounded mb-2"></div>
                     <div className="h-4 bg-gray-200 rounded mb-8"></div>
                     <div className="h-64 bg-gray-200 rounded"></div>
                  </div>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   if (error) {
      return (
         <div className="min-h-screen">
            <Header />
            <main className="pt-16">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">공지사항을 불러오는데 실패했습니다</h1>
                  <p className="text-gray-600 mb-8">{error}</p>
                  <Button onClick={() => router.back()}>이전으로 돌아가기</Button>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   if (!notice) {
      return (
         <div className="min-h-screen">
            <Header />
            <main className="pt-16">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">공지사항을 찾을 수 없습니다</h1>
                  <p className="text-gray-600 mb-8">요청하신 공지사항이 존재하지 않거나 삭제되었습니다.</p>
                  <Button onClick={() => router.back()}>이전으로 돌아가기</Button>
               </div>
            </main>
            <Footer />
         </div>
      )
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <nav className="flex items-center space-x-2 text-sm text-gray-600">
                     <Link
                        href="/"
                        className="hover:text-blue-600"
                        onClick={(e) => {
                           e.preventDefault()
                           window.location.href = '/'
                        }}
                     >
                        홈
                     </Link>
                     <span>/</span>
                     <Link href="/board/notice" className="hover:text-blue-600">
                        공지사항
                     </Link>
                     <span>/</span>
                     <span className="text-gray-900">상세보기</span>
                  </nav>
               </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               {/* 공지사항 헤더 */}
               <Card className="mb-8">
                  <div className="border-b border-gray-200 pb-6 mb-6">
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <Badge variant={notice.category === '시험공지' ? 'primary' : notice.category === '교육공지' ? 'secondary' : 'default'}>{notice.category}</Badge>
                           {notice.is_important && <Badge variant="error">중요</Badge>}
                           {notice.is_pinned && <Badge variant="default">고정</Badge>}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                           목록으로
                        </Button>
                     </div>

                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>

                     <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                           <span>작성자: {notice.author_name}</span>
                           <span>작성일: {new Date(notice.created_at).toLocaleDateString('ko-KR')}</span>
                           <span>조회수: {notice.view_count?.toLocaleString() || 0}</span>
                        </div>
                     </div>
                  </div>

                  {/* 공지사항 내용 */}
                  <div className="prose prose-lg max-w-none whitespace-pre-line" dangerouslySetInnerHTML={{ __html: notice.content }} />
               </Card>

               {/* 관련 공지사항 */}
               <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 공지사항</h3>
                  <div className="space-y-3">
                     {relatedNotices.map((item) => (
                        <Link key={item.id} href={`/board/notice/${item.id}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                           <div className="flex items-center gap-3">
                              <Badge variant="default" size="sm">
                                 {item.category}
                              </Badge>
                              <span className="text-gray-900">{item.title}</span>
                           </div>
                           <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        </Link>
                     ))}
                  </div>
               </Card>

               {/* 하단 버튼 */}
               <div className="flex justify-center mt-8">
                  <Link href="/board/notice">
                     <Button size="lg">목록으로 돌아가기</Button>
                  </Link>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
