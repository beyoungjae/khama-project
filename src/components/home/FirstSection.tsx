import { IMAGES } from '@/constants/images'

export default function FirstSection() {
   return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* 배경 이미지 */}
         <div
            className="absolute inset-0"
            style={{
               backgroundImage: `url(${IMAGES.HERO.SLIDE1})`, // 실제 이미지로 교체 시 사용
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
            }}
         />
         <div className="absolute inset-0 bg-black/40" />

         {/* 컨텐츠 */}
         <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
               <p className="text-lg md:text-xl mb-4 opacity-90">가전제품 유지관리 전문 협회</p>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">KHAMA</h1>
               <p className="text-md md:text-lg mb-4 opacity-90">Korea Household Appliances Maintenance Association</p>
               <p className="text-xl md:text-2xl mb-12 leading-relaxed whitespace-pre-line opacity-90">전문성과 신뢰성으로{'\n'}업계를 선도합니다</p>
            </div>
         </div>
      </div>
   )
}
