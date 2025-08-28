import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function ForbiddenPage() {
   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
               <div className="mx-auto max-w-md w-full">
                  <div className="text-center">
                     {/* 아이콘 */}
                     <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-red-100 mb-8">
                        <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                     </div>

                     {/* 제목 */}
                     <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                     <h2 className="text-2xl font-semibold text-gray-700 mb-6">접근 권한이 없습니다</h2>

                     {/* 설명 */}
                     <p className="text-gray-600 mb-8 leading-relaxed">
                        요청하신 페이지에 접근할 권한이 없습니다.
                        <br />
                        관리자 페이지는 관리자만 접근 가능합니다.
                        <br />
                        문의사항이 있으시면 관리자에게 연락해주세요.
                     </p>

                     {/* 액션 버튼들 */}
                     <div className="space-y-4">
                        <Link href="/">
                           <Button size="lg" className="w-full">
                              홈페이지로 돌아가기
                           </Button>
                        </Link>

                        <Link href="/support/inquiry">
                           <Button variant="outline" size="lg" className="w-full">
                              관리자에게 문의하기
                           </Button>
                        </Link>
                     </div>

                     {/* 추가 정보 */}
                     <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                           에러 코드: 403 Forbidden
                           <br />
                           시간: {new Date().toLocaleString('ko-KR')}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
