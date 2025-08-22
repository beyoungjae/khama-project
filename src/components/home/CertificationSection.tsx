import Link from 'next/link'

export default function CertificationSection() {
   return (
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">전문 자격증 과정</h2>
               <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">체계적인 교육과 실무 중심의 커리큘럼으로 생활가전 유지관리 전문가가 되세요</p>

               <Link href="/business" className="inline-flex items-center bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  자격증 과정 보기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
               </Link>
            </div>
         </div>
      </section>
   )
}
