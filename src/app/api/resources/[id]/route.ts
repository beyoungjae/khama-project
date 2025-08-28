import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 자료실 상세 정보 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params

      if (!id) {
         return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
      }

      // 자료실 상세 정보 조회 (posts 테이블에서 type='resource')
      const { data: post, error } = await supabaseAdmin.from('posts').select('*').eq('id', id).eq('type', 'resource').single()

      if (error) {
         console.error('자료실 상세 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if (!post) {
         return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 })
      }

      // 조회수 증가
      await supabaseAdmin
         .from('posts')
         .update({
            view_count: (post.view_count || 0) + 1,
         })
         .eq('id', id)

      // posts 데이터를 resource 형태로 변환
      const resource = {
         id: post.id,
         title: post.title,
         description: post.content,
         category: post.category || '기타',
         file_name: 'document.pdf', // 실제로는 첨부파일 정보를 별도로 저장해야 함
         file_size: 1024 * 1024, // 1MB (임시값)
         view_count: (post.view_count || 0) + 1,
         download_count: 0, // 별도 카운트 필요
         created_at: post.created_at
      }

      return NextResponse.json({ resource })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
