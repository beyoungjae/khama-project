import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface SearchFilterProps {
   type: 'notice' | 'qna'
   categories: Array<{ value: string; label: string; count?: number }>
   selectedCategory: string
   searchQuery: string
   onCategoryChange: (category: string) => void
   onSearchChange: (query: string) => void
   onSearch: () => void
}

export default function SearchFilter({ type, categories, selectedCategory, searchQuery, onCategoryChange, onSearchChange, onSearch }: SearchFilterProps) {
   const [isSearchExpanded, setIsSearchExpanded] = useState(false)

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSearch()
   }

   return (
      <div className="space-y-6">
         {/* 카테고리 필터 */}
         <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">{type === 'notice' ? '공지 유형' : '문의 유형'}</h3>
            <div className="flex flex-wrap gap-2">
               <button onClick={() => onCategoryChange('')} className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedCategory === '' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  전체
               </button>
               {categories.map((category) => (
                  <button
                     key={category.value}
                     onClick={() => onCategoryChange(category.value)}
                     className={`px-3 py-1 text-sm rounded-full border transition-colors flex items-center gap-1 ${selectedCategory === category.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                     {category.label}
                     {category.count !== undefined && (
                        <Badge variant={selectedCategory === category.value ? 'default' : 'outline'} size="sm" className={selectedCategory === category.value ? 'bg-blue-500 text-white' : ''}>
                           {category.count}
                        </Badge>
                     )}
                  </button>
               ))}
            </div>
         </div>

         {/* 검색 */}
         <div>
            <div className="flex gap-2">
               <div className="flex-1">
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={`${type === 'notice' ? '공지사항' : '질문'}을 검색하세요...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     <Button type="submit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                     </Button>
                  </form>
               </div>

               <Button variant="outline" onClick={() => setIsSearchExpanded(!isSearchExpanded)} className="flex-shrink-0">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  상세검색
               </Button>
            </div>

            {/* 상세 검색 옵션 */}
            {isSearchExpanded && (
               <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">검색 범위</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                           <option value="all">제목 + 내용</option>
                           <option value="title">제목만</option>
                           <option value="content">내용만</option>
                           <option value="author">작성자</option>
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                           <option value="all">전체</option>
                           <option value="1week">1주일</option>
                           <option value="1month">1개월</option>
                           <option value="3months">3개월</option>
                           <option value="6months">6개월</option>
                           <option value="1year">1년</option>
                        </select>
                     </div>
                  </div>

                  <div className="flex justify-end gap-2">
                     <Button variant="outline" size="sm" onClick={() => setIsSearchExpanded(false)}>
                        취소
                     </Button>
                     <Button size="sm" onClick={onSearch}>
                        검색
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {/* 검색 결과 정보 */}
         {searchQuery && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
               <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-800">
                     &apos;<strong>{searchQuery}</strong>&apos; 검색 결과
                  </span>
               </div>
               <button
                  onClick={() => {
                     onSearchChange('')
                     onSearch()
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
               >
                  검색 초기화
               </button>
            </div>
         )}
      </div>
   )
}
