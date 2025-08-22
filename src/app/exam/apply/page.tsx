import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ApplicationForm from '@/components/exam/ApplicationForm'

export default function ExamApplyPage() {
   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            {/* TODO: 실제 이미지로 교체 - IMAGES.PAGES.EXAM 사용 */}
            <section
               className="relative py-16 bg-gradient-to-r from-blue-900 to-blue-700"
               style={
                  {
                     // backgroundImage: `url(${IMAGES.PAGES.EXAM})`, // 실제 이미지로 교체 시 사용
                     // backgroundSize: 'cover',
                     // backgroundPosition: 'center',
                     // backgroundRepeat: 'no-repeat'
                  }
               }
            >
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">시험 신청</h1>
                  <p className="text-lg text-blue-100">자격증 시험 신청을 위한 정보를 입력해주세요</p>
               </div>
            </section>

            {/* 신청 폼 */}
            <section className="py-20 bg-gray-50">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <ApplicationForm />
               </div>
            </section>
         </main>

         <Footer />
      </div>
   )
}
