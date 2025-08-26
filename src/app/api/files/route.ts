import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 파일 목록 조회
export async function GET(request: NextRequest) {
   try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category') // 'gallery', 'user-files', 'notice-attachments'
      const relatedType = searchParams.get('related_type')
      const relatedId = searchParams.get('related_id')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')

      const offset = (page - 1) * limit

      // 파일 목록 조회 쿼리 구성
      let query = supabase.from('files').select('*', { count: 'exact' }).eq('status', 'active')

      // 카테고리 필터
      if (category) {
         query = query.eq('file_category', category)
      }

      // 관련 타입/ID 필터
      if (relatedType) {
         query = query.eq('related_type', relatedType)
      }
      if (relatedId) {
         query = query.eq('related_id', relatedId)
      }

      // 권한별 필터링
      const { data: adminData } = await supabase.from('admins').select('id').eq('user_id', user.id).eq('status', 'active').single()

      if (!adminData) {
         // 일반 사용자는 자신이 업로드한 파일만 조회 가능
         query = query.eq('uploaded_by_id', user.id)
      }

      // 정렬 및 페이지네이션
      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      const { data: files, error, count } = await query

      if (error) {
         console.error('파일 목록 조회 오류:', error)
         return NextResponse.json({ error: '파일 목록을 조회할 수 없습니다.' }, { status: 500 })
      }

      // 공개 URL 추가 (갤러리 파일의 경우)
      const filesWithUrls = files?.map((file) => {
         let publicUrl = null
         if (file.file_category === 'gallery') {
            const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(file.file_path)
            publicUrl = urlData.publicUrl
         }

         return {
            ...file,
            public_url: publicUrl,
            download_url: publicUrl || `/api/files/download?bucket=${file.file_category}&path=${encodeURIComponent(file.file_path)}`,
         }
      })

      return NextResponse.json({
         files: filesWithUrls || [],
         pagination: {
            current_page: page,
            total_pages: Math.ceil((count || 0) / limit),
            total_count: count || 0,
            per_page: limit,
         },
      })
   } catch (error: unknown) {
      console.error('파일 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 파일 정보 업데이트
export async function PUT(request: NextRequest) {
   try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const updateData = await request.json()
      const { file_id, alt_text, description, related_type, related_id } = updateData

      if (!file_id) {
         return NextResponse.json({ error: '파일 ID가 필요합니다.' }, { status: 400 })
      }

      // 권한 확인 - 관리자이거나 본인이 업로드한 파일
      let query = supabase
         .from('files')
         .update({
            alt_text,
            description,
            related_type,
            related_id,
         })
         .eq('id', file_id)

      // 관리자가 아닌 경우 본인 파일만 수정 가능
      const { data: adminData } = await supabase.from('admins').select('id').eq('user_id', user.id).eq('status', 'active').single()

      if (!adminData) {
         query = query.eq('uploaded_by_id', user.id)
      }

      const { data: file, error } = await query.select().single()

      if (error) {
         console.error('파일 정보 업데이트 오류:', error)
         return NextResponse.json({ error: '파일 정보 업데이트에 실패했습니다.' }, { status: 400 })
      }

      if (!file) {
         return NextResponse.json({ error: '파일을 찾을 수 없거나 수정 권한이 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({
         file,
         message: '파일 정보가 업데이트되었습니다.',
      })
   } catch (error: unknown) {
      console.error('파일 정보 업데이트 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
