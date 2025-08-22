import Link from 'next/link'
import Badge from '@/components/ui/Badge'

interface Post {
   id: number
   title: string
   content?: string
   category: string
   author: string
   createdAt: string
   views: number
   isImportant?: boolean
   isNew?: boolean
   status?: string
   isPrivate?: boolean
   answerCount?: number
}

interface PostListProps {
   posts: Post[]
   type: 'notice' | 'qna'
   currentPage?: number
   totalPages?: number
   onPageChange?: (page: number) => void
}

export default function PostList({ posts, type, currentPage = 1, totalPages = 1, onPageChange }: PostListProps) {
   const getCategoryBadge = (category: string) => {
      switch (category) {
         case '시험공지':
            return <Badge variant="primary">{category}</Badge>
         case '교육공지':
            return <Badge variant="secondary">{category}</Badge>
         case '일반공지':
            return <Badge variant="default">{category}</Badge>
         case '시험문의':
            return <Badge variant="primary">{category}</Badge>
         case '교육문의':
            return <Badge variant="secondary">{category}</Badge>
         case '자격증문의':
            return <Badge variant="success">{category}</Badge>
         case '기타문의':
            return <Badge variant="default">{category}</Badge>
         default:
            return <Badge variant="default">{category}</Badge>
      }
   }

   const getStatusBadge = (status?: string) => {
      if (!status) return null

      switch (status) {
         case '답변완료':
            return <Badge variant="success">{status}</Badge>
         case '답변대기':
            return <Badge variant="warning">{status}</Badge>
         default:
            return <Badge variant="default">{status}</Badge>
      }
   }

   const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
         return dateString
      }

      return dateString
   }

   const isNew = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return diffDays <= 3
   }

   return (
      <div className="space-y-4">
         {/* 게시글 목록 */}
         <div className="space-y-2">
            {posts.map((post) => (
               <Link key={post.id} href={`/board/${type}/${post.id}`} className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                           {getCategoryBadge(post.category)}
                           {post.isImportant && <Badge variant="error">중요</Badge>}
                           {isNew(post.createdAt) && (
                              <Badge variant="success" size="sm">
                                 NEW
                              </Badge>
                           )}
                           {type === 'qna' && getStatusBadge(post.status)}
                           {post.isPrivate && (
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                           )}
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{post.title}</h3>

                        {post.content && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>}

                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                           <span>작성자: {post.author}</span>
                           <span>작성일: {formatDate(post.createdAt)}</span>
                           <span>조회: {post.views.toLocaleString()}</span>
                           {type === 'qna' && post.answerCount !== undefined && <span>답변: {post.answerCount}</span>}
                        </div>
                     </div>

                     <div className="ml-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </div>
                  </div>
               </Link>
            ))}
         </div>

         {/* 페이지네이션 */}
         {totalPages > 1 && (
            <div className="flex justify-center mt-8">
               <nav className="flex items-center space-x-2">
                  <button onClick={() => onPageChange?.(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                     이전
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                     const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                     if (pageNum > totalPages) return null

                     return (
                        <button key={pageNum} onClick={() => onPageChange?.(pageNum)} className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === pageNum ? 'text-white bg-blue-600 border border-blue-600' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'}`}>
                           {pageNum}
                        </button>
                     )
                  })}

                  <button onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                     다음
                  </button>
               </nav>
            </div>
         )}

         {/* 빈 상태 */}
         {posts.length === 0 && (
            <div className="text-center py-12">
               <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <h3 className="text-lg font-medium text-gray-900 mb-2">게시글이 없습니다</h3>
               <p className="text-gray-600">{type === 'notice' ? '등록된 공지사항이 없습니다.' : '등록된 질문이 없습니다.'}</p>
            </div>
         )}
      </div>
   )
}
