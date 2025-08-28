import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { IMAGES } from '@/constants/images'

export default function ServicesPage() {
   const services = [
      {
         id: 1,
         title: '공지사항',
         description: '협회의 최신 소식과 중요한 공지사항을 확인하세요',
         icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
         ),
         href: '/board/notice',
         color: 'emerald',
         features: ['시험 공지', '교육 안내', '협회 소식', '법령 변경'],
      },
   ]

   const getColorClasses = (color: string) => {
      const colors = {
         blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'text-blue-600',
            title: 'text-blue-900',
            button: 'bg-blue-600 hover:bg-blue-700',
         },
         emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: 'text-emerald-600',
            title: 'text-emerald-900',
            button: 'bg-emerald-600 hover:bg-emerald-700',
         },
         orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: 'text-orange-600',
            title: 'text-orange-900',
            button: 'bg-orange-600 hover:bg-orange-700',
         },
         purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            icon: 'text-purple-600',
            title: 'text-purple-900',
            button: 'bg-purple-600 hover:bg-purple-700',
         },
      }
      return colors[color as keyof typeof colors]
   }

   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section
               className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700"
               style={{
                  backgroundImage: `url(${IMAGES.PAGES.SERVICES})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
               }}
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">서비스 목록</h1>
               </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">제공 서비스</h2>
                     <p className="text-xl text-gray-600 max-w-3xl mx-auto">회원님의 편의를 위한 다양한 온라인 서비스를 제공합니다</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                     {services.map((service) => {
                        const colorClasses = getColorClasses(service.color)
                        return (
                           <Card key={service.id} hover className="h-full">
                              <div className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-xl p-6 h-full flex flex-col`}>
                                 <div className="flex items-center mb-4">
                                    <div className={`w-16 h-16 ${colorClasses.bg} rounded-full flex items-center justify-center mr-4 ${colorClasses.icon}`}>{service.icon}</div>
                                    <div>
                                       <h3 className={`text-xl font-bold ${colorClasses.title} mb-2`}>{service.title}</h3>
                                    </div>
                                 </div>

                                 <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>

                                 <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">주요 기능</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                       {service.features.map((feature, idx) => (
                                          <div key={idx} className="flex items-center text-sm text-gray-600">
                                             <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                             </svg>
                                             {feature}
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 <Button href={service.href} className={`w-full ${colorClasses.button} text-white`}>
                                    {service.title} 이용하기
                                 </Button>
                              </div>
                           </Card>
                        )
                     })}
                  </div>
               </div>
            </section>

            {/* Quick Access */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">빠른 접근</h2>
                     <p className="text-xl text-gray-600">자주 사용하는 서비스에 빠르게 접근하세요</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Card hover className="text-center p-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                           </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">시험 신청</h3>
                        <p className="text-gray-600 text-sm mb-4">자격시험 온라인 신청</p>
                        <Button href="/exam/apply" size="sm" className="w-full">
                           신청하기
                        </Button>
                     </Card>

                     <Card hover className="text-center p-6">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                           </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">합격 조회</h3>
                        <p className="text-gray-600 text-sm mb-4">시험 결과 확인</p>
                        <Button href="/exam/results/search" variant="secondary" size="sm" className="w-full">
                           조회하기
                        </Button>
                     </Card>

                     <Card hover className="text-center p-6">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                           </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">문의하기</h3>
                        <p className="text-gray-600 text-sm mb-4">1:1 문의 및 상담</p>
                        <Button href="/support/inquiry" variant="outline" size="sm" className="w-full">
                           문의하기
                        </Button>
                     </Card>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
