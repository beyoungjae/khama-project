interface LoadingProps {
   size?: 'sm' | 'md' | 'lg'
   text?: string
   fullScreen?: boolean
}

export default function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
   const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
   }

   const LoadingSpinner = () => (
      <div className="flex flex-col items-center justify-center">
         <svg className={`animate-spin text-blue-600 ${sizeClasses[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
         </svg>
         {text && <p className={`mt-2 text-gray-600 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>{text}</p>}
      </div>
   )

   if (fullScreen) {
      return (
         <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <LoadingSpinner />
         </div>
      )
   }

   return <LoadingSpinner />
}

// 스켈레톤 로딩 컴포넌트들
export function PostListSkeleton() {
   return (
      <div className="space-y-4">
         {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
               <div className="flex items-start justify-between">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        <div className="h-5 w-12 bg-gray-200 rounded"></div>
                     </div>
                     <div className="h-6 bg-gray-200 rounded mb-2"></div>
                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                     <div className="flex items-center space-x-4">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                     </div>
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
               </div>
            </div>
         ))}
      </div>
   )
}

export function PostDetailSkeleton() {
   return (
      <div className="animate-pulse space-y-8">
         <div className="border border-gray-200 rounded-lg p-6">
            <div className="border-b border-gray-200 pb-6 mb-6">
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
               </div>
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="flex items-center gap-4">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
               </div>
            </div>
            <div className="space-y-4">
               <div className="h-4 bg-gray-200 rounded"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6"></div>
               <div className="h-4 bg-gray-200 rounded w-4/6"></div>
               <div className="h-4 bg-gray-200 rounded"></div>
               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
         </div>
      </div>
   )
}

export function CardSkeleton() {
   return (
      <div className="animate-pulse border border-gray-200 rounded-lg p-6">
         <div className="h-6 bg-gray-200 rounded mb-4"></div>
         <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
         </div>
      </div>
   )
}
