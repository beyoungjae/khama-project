import Link from 'next/link'

export default function EducationSection() {
   const educationPrograms = [
      {
         title: '창업교육',
         description: '예비 창업자를 위한 체계적 교육',
         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
         color: 'from-blue-500 to-blue-700',
      },
      {
         title: '전문가교육',
         description: '현업 종사자 역량 강화',
         image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
         color: 'from-emerald-500 to-emerald-700',
      },
      {
         title: '신아이템교육',
         description: '최신 트렌드 반영 과정',
         image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
         color: 'from-orange-500 to-orange-700',
      },
   ]

   return (
      <section className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">교육 프로그램</h2>
               <p className="text-xl text-gray-600 mb-8">창업부터 전문가 양성까지, 단계별 맞춤 교육</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               {educationPrograms.map((program, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift">
                     <div className="relative h-48">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${program.image})` }} />
                        <div className={`absolute inset-0 bg-gradient-to-r ${program.color} opacity-80`} />
                        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                           <div>
                              <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                              <p className="text-lg">{program.description}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="text-center">
               <Link href="/business" className="inline-flex items-center bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  교육 프로그램 보기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
               </Link>
            </div>
         </div>
      </section>
   )
}
