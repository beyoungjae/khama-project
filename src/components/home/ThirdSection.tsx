import Link from 'next/link'
import { IMAGES } from '@/constants/images'

export default function ThirdSection() {
   return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* 배경 이미지 */}
         <div
            className="absolute inset-0"
            style={{
               backgroundImage: `url(${IMAGES.HERO.SLIDE3})`, // 실제 이미지로 교체 시 사용
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
            }}
         />
         <div className="absolute inset-0 bg-black/40" />

         {/* 컨텐츠 */}
         <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
               <p className="text-lg md:text-xl mb-4 opacity-90">Education Programs</p>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">교육 프로그램</h1>
               <p className="text-xl md:text-2xl mb-12 leading-relaxed whitespace-pre-line opacity-90">창업부터 전문가까지{'\n'}맞춤형 교육</p>

               {/* 버튼 그룹 */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                     onClick={() => {
                        if (typeof window !== 'undefined' && window.fullpage_api) {
                           window.fullpage_api.moveTo('contact')
                        }
                     }}
                     className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-4xl font-medium transition-all duration-300"
                  >
                     문의하기
                  </button>
                  <Link href="/business/education/apply" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-4xl font-medium transition-all duration-300">
                     교육 신청
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}
