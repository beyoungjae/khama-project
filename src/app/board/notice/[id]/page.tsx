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
   id: number
   title: string
   content: string
   category: string
   author: string
   date: string
   views: number
   isImportant: boolean
   attachments?: Array<{
      id: number
      name: string
      size: string
      downloadUrl: string
   }>
}

export default function NoticeDetailPage() {
   const params = useParams()
   const router = useRouter()
   const [notice, setNotice] = useState<NoticeDetail | null>(null)
   const [isLoading, setIsLoading] = useState(true)
   const [relatedNotices, setRelatedNotices] = useState<
      Array<{
         id: number
         title: string
         date: string
         category: string
      }>
   >([])

   useEffect(() => {
      const fetchNotice = async () => {
         setIsLoading(true)

         try {
            // TODO: 실제 API 호출
            await new Promise((resolve) => setTimeout(resolve, 500))

            // 임시 데이터
            const mockNotice: NoticeDetail = {
               id: Number(params.id),
               title: '2025년 1분기 자격시험 일정 안내',
               content: `
            <h3>2025년 1분기 자격시험 일정을 안내드립니다.</h3>
            
            <h4>1. 시험 일정</h4>
            <ul>
              <li><strong>가전제품분해청소관리사</strong>: 2025년 3월 15일 (토)</li>
              <li><strong>냉난방기세척서비스관리사</strong>: 2025년 3월 22일 (토)</li>
              <li><strong>에어컨설치관리사</strong>: 2025년 4월 12일 (토)</li>
              <li><strong>환기청정시스템관리사</strong>: 2025년 4월 19일 (토)</li>
            </ul>
            
            <h4>2. 접수 기간</h4>
            <p>2025년 2월 1일 (토) ~ 각 시험일 1주일 전까지</p>
            
            <h4>3. 시험장 안내</h4>
            <p><strong>장소</strong>: 인천 청라 한올평생교육원<br>
            <strong>주소</strong>: 인천광역시 서구 청라한내로72번길 13 (청라동) 203호</p>
            
            <h4>4. 준비물</h4>
            <ul>
              <li>신분증 (주민등록증, 운전면허증, 여권 중 1개)</li>
              <li>필기구 (검은색 볼펜, 연필, 지우개)</li>
              <li>교육 이수증 원본</li>
            </ul>
            
            <h4>5. 주의사항</h4>
            <ul>
              <li>시험 당일 30분 전까지 입실 완료</li>
              <li>휴대폰 등 전자기기 반입 금지</li>
              <li>교육 이수증 미지참 시 응시 불가</li>
            </ul>
            
            <p>기타 문의사항은 협회 사무국(1566-3321)으로 연락주시기 바랍니다.</p>
          `,
               category: '시험공지',
               author: '관리자',
               date: '2025.01.15',
               views: 1247,
               isImportant: true,
               attachments: [
                  {
                     id: 1,
                     name: '2025년_1분기_시험일정표.pdf',
                     size: '245KB',
                     downloadUrl: '#',
                  },
                  {
                     id: 2,
                     name: '시험장_오시는길.pdf',
                     size: '180KB',
                     downloadUrl: '#',
                  },
               ],
            }

            setNotice(mockNotice)

            // 관련 공지사항
            setRelatedNotices([
               { id: 2, title: '2024년 4분기 합격자 발표', date: '2024.12.20', category: '시험공지' },
               { id: 3, title: '시험 접수 시 유의사항 안내', date: '2024.12.15', category: '시험공지' },
               { id: 4, title: '교육 과정 개편 안내', date: '2024.12.10', category: '교육공지' },
            ])
         } catch (error) {
            console.error('공지사항 로딩 실패:', error)
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
                     <Link href="/" className="hover:text-blue-600" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
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
                           {notice.isImportant && <Badge variant="error">중요</Badge>}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                           목록으로
                        </Button>
                     </div>

                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>

                     <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                           <span>작성자: {notice.author}</span>
                           <span>작성일: {notice.date}</span>
                           <span>조회수: {notice.views.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  {/* 첨부파일 */}
                  {notice.attachments && notice.attachments.length > 0 && (
                     <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">첨부파일</h3>
                        <div className="space-y-2">
                           {notice.attachments.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                 <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                       <p className="font-medium text-gray-900">{file.name}</p>
                                       <p className="text-sm text-gray-500">{file.size}</p>
                                    </div>
                                 </div>
                                 <Button variant="outline" size="sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    다운로드
                                 </Button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* 공지사항 내용 */}
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: notice.content }} />
               </Card>

               {/* 이전/다음 글 */}
               <Card className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">이전/다음 글</h3>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                           <span className="text-sm text-gray-500">이전글</span>
                           <Link href="/board/notice/1" className="text-gray-900 hover:text-blue-600">
                              2024년 4분기 합격자 발표
                           </Link>
                        </div>
                        <span className="text-sm text-gray-500">2024.12.20</span>
                     </div>
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                           <span className="text-sm text-gray-500">다음글</span>
                           <Link href="/board/notice/3" className="text-gray-900 hover:text-blue-600">
                              시험 접수 시 유의사항 안내
                           </Link>
                        </div>
                        <span className="text-sm text-gray-500">2024.12.15</span>
                     </div>
                  </div>
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
                           <span className="text-sm text-gray-500">{item.date}</span>
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
