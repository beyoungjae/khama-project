import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

interface Attachment {
   id: number
   name: string
   size: string
   downloadUrl: string
   type: string
}

interface PostDetailProps {
   post: {
      id: number
      title: string
      content: string
      category: string
      author: string
      createdAt: string
      views: number
      isImportant?: boolean
      attachments?: Attachment[]
      status?: string
   }
   type: 'notice' | 'qna'
   prevPost?: { id: number; title: string; createdAt: string }
   nextPost?: { id: number; title: string; createdAt: string }
   relatedPosts?: Array<{ id: number; title: string; createdAt: string; category: string }>
   onBack: () => void
}

export default function PostDetail({ post, type, prevPost, nextPost, relatedPosts = [], onBack }: PostDetailProps) {
   const [isLiked, setIsLiked] = useState(false)
   const [likeCount, setLikeCount] = useState(0)

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

   const getFileIcon = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase()

      switch (extension) {
         case 'pdf':
            return (
               <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
               </svg>
            )
         case 'doc':
         case 'docx':
            return (
               <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            )
         case 'xls':
         case 'xlsx':
            return (
               <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
               </svg>
            )
         case 'jpg':
         case 'jpeg':
         case 'png':
         case 'gif':
            return (
               <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            )
         default:
            return (
               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            )
      }
   }

   const handleLike = () => {
      setIsLiked(!isLiked)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
   }

   return (
      <div className="space-y-8">
         {/* 게시글 헤더 */}
         <Card>
            <div className="border-b border-gray-200 pb-6 mb-6">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                     {getCategoryBadge(post.category)}
                     {post.isImportant && <Badge variant="error">중요</Badge>}
                     {post.status && <Badge variant={post.status === '답변완료' ? 'success' : 'warning'}>{post.status}</Badge>}
                  </div>
                  <Button variant="outline" size="sm" onClick={onBack}>
                     목록으로
                  </Button>
               </div>

               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

               <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                     <span>작성자: {post.author}</span>
                     <span>작성일: {post.createdAt}</span>
                     <span>조회수: {post.views.toLocaleString()}</span>
                  </div>

                  {type === 'notice' && (
                     <div className="flex items-center gap-2">
                        <button onClick={handleLike} className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${isLiked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}>
                           <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                           </svg>
                           {likeCount}
                        </button>

                        <button className="flex items-center gap-1 px-2 py-1 rounded text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                              />
                           </svg>
                           공유
                        </button>
                     </div>
                  )}
               </div>
            </div>

            {/* 첨부파일 */}
            {post.attachments && post.attachments.length > 0 && (
               <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">첨부파일</h3>
                  <div className="space-y-2">
                     {post.attachments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <div className="flex items-center gap-3">
                              {getFileIcon(file.name)}
                              <div>
                                 <p className="font-medium text-gray-900">{file.name}</p>
                                 <p className="text-sm text-gray-500">{file.size}</p>
                              </div>
                           </div>
                           <Button variant="outline" size="sm">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              다운로드
                           </Button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* 게시글 내용 */}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
         </Card>

         {/* 이전/다음 글 */}
         {(prevPost || nextPost) && (
            <Card>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">이전/다음 글</h3>
               <div className="space-y-3">
                  {prevPost && (
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                           <span className="text-sm text-gray-500">이전글</span>
                           <Link href={`/board/${type}/${prevPost.id}`} className="text-gray-900 hover:text-blue-600">
                              {prevPost.title}
                           </Link>
                        </div>
                        <span className="text-sm text-gray-500">{prevPost.createdAt}</span>
                     </div>
                  )}
                  {nextPost && (
                     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                           <span className="text-sm text-gray-500">다음글</span>
                           <Link href={`/board/${type}/${nextPost.id}`} className="text-gray-900 hover:text-blue-600">
                              {nextPost.title}
                           </Link>
                        </div>
                        <span className="text-sm text-gray-500">{nextPost.createdAt}</span>
                     </div>
                  )}
               </div>
            </Card>
         )}

         {/* 관련 게시글 */}
         {relatedPosts.length > 0 && (
            <Card>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 {type === 'notice' ? '공지사항' : '질문'}</h3>
               <div className="space-y-3">
                  {relatedPosts.map((item) => (
                     <Link key={item.id} href={`/board/${type}/${item.id}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <Badge variant="secondary" size="sm">
                              {item.category}
                           </Badge>
                           <span className="text-gray-900">{item.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.createdAt}</span>
                     </Link>
                  ))}
               </div>
            </Card>
         )}

         {/* 하단 버튼 */}
         <div className="flex justify-center">
            <Button size="lg" onClick={onBack}>
               목록으로 돌아가기
            </Button>
         </div>
      </div>
   )
}
