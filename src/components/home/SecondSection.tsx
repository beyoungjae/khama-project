import Link from 'next/link'

export default function SecondSection() {
   return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* 배경 이미지 */}
         <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop)` }} />
         <div className="absolute inset-0 bg-black/40" />

         {/* 컨텐츠 */}
         <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
               <p className="text-lg md:text-xl mb-4 opacity-90">Professional Certification</p>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">전문 자격증</h1>
               <p className="text-xl md:text-2xl mb-12 leading-relaxed whitespace-pre-line opacity-90">체계적인 교육과정으로{'\n'}전문가가 되세요</p>

               {/* 버튼 그룹 */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                     onClick={() => {
                        if (typeof window !== 'undefined' && window.fullpage_api) {
                           window.fullpage_api.moveTo('education')
                        }
                     }}
                     className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-lg font-medium transition-all duration-300"
                  >
                     교육 프로그램 보기
                  </button>
                  <Link href="/exam/apply" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300">
                     시험 신청
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}
