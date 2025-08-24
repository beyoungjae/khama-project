export default function FourthSection() {
   return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* 배경 이미지 */}
         <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop)` }}
         />
         <div className="absolute inset-0 bg-black/40" />
         
         {/* 컨텐츠 */}
         <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
               <p className="text-lg md:text-xl mb-4 opacity-90">Join KHAMA</p>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                  함께하세요
               </h1>
               <p className="text-xl md:text-2xl mb-12 leading-relaxed whitespace-pre-line opacity-90">
                  새로운 미래를{'\n'}함께 만들어가요
               </p>
               
               {/* 버튼 그룹 */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                     onClick={() => {
                        window.location.href = '/'
                     }}
                     className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-lg font-medium transition-all duration-300"
                  >
                     처음으로
                  </button>
                  <a 
                     href="/support/contact"
                     className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300"
                  >
                     연락하기
                  </a>
               </div>
            </div>
         </div>
      </div>
   )
}