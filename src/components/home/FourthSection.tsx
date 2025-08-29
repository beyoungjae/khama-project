import Link from 'next/link'
import { IMAGES } from '@/constants/images'

export default function FourthSection() {
   return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* 배경 이미지 */}
         <div
            className="absolute inset-0"
            style={{
               backgroundImage: `url(${IMAGES.HERO.SLIDE4})`, // 실제 이미지로 교체 시 사용
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
            }}
         />
         <div className="absolute inset-0 bg-black/40" />

         {/* 컨텐츠 */}
         <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
               <p className="text-lg md:text-xl mb-4 opacity-90">Join KHAMA</p>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">함께하세요</h1>
               <p className="text-xl md:text-2xl mb-12 leading-relaxed whitespace-pre-line opacity-90">새로운 미래를{'\n'}함께 만들어가요</p>

               {/* 버튼 그룹 */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                     onClick={() => {
                        window.location.href = '/'
                     }}
                     className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-4xl font-medium transition-all duration-300"
                  >
                     처음으로
                  </button>
                  <Link href="/support/inquiry" className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-4xl font-medium transition-all duration-300">
                     문의하기
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}
