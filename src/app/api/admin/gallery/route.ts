import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const category = searchParams.get('category') || 'all'
      const status = searchParams.get('status') || 'all'
      const search = searchParams.get('search') || ''

      const offset = (page - 1) * limit

      // 갤러리 목록 조회 (gallery_images 테이블 사용)
      let query = supabaseAdmin.from('gallery_images').select('*', { count: 'exact' }).order('display_order', { ascending: true })

      // 카테고리 필터
      if (category !== 'all') {
         query = query.eq('category', category)
      }

      // 상태 필터 (gallery_images 테이블은 is_active 필드 사용)
      if (status === 'active') {
         query = query.eq('is_active', true)
      } else if (status === 'inactive') {
         query = query.eq('is_active', false)
      }

      // 검색어 필터
      if (search) {
         query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data: images, count, error } = await query.range(offset, offset + limit - 1)

      if (error) {
         console.error('갤러리 목록 조회 오류:', error)
         return NextResponse.json({ error: '갤러리 목록을 조회할 수 없습니다.' }, { status: 500 })
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         images: images || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
         },
      })
   } catch (error) {
      console.error('갤러리 관리 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 갤러리 이미지 추가
export async function POST(request: NextRequest) {
   try {
      // 관리자 권한 확인
      const { valid } = await verifyAdminTokenFromRequest(request)
      if (!valid) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      const formData = await request.formData()
      const file = formData.get('file') as File
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const category = formData.get('category') as string
      const display_order = parseInt(formData.get('display_order') as string) || 1
      const is_active = formData.get('is_active') === 'true'

      // 필수 필드 검증
      if (!title || !file || !category) {
         return NextResponse.json({ error: '제목, 파일, 카테고리는 필수입니다.' }, { status: 400 })
      }

      // 파일 확장자 추출
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
         return NextResponse.json({ error: '지원하지 않는 파일 형식입니다.' }, { status: 400 })
      }

      // 파일명 생성 (타임스탬프 + 랜덤 문자열)
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileName = `${timestamp}-${randomString}.${fileExtension}`
      const filePath = `${category}/${fileName}`

      // Supabase Storage에 파일 업로드
      const { error: uploadError } = await supabaseAdmin.storage.from('gallery').upload(filePath, file, {
         cacheControl: '3600',
         upsert: false,
      })

      if (uploadError) {
         console.error('파일 업로드 오류:', uploadError)
         return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 })
      }

      // 파일 URL 생성
      const { data: publicUrlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(filePath)
      const fileUrl = publicUrlData.publicUrl

      // 갤러리 이미지 추가 (gallery_images 테이블 사용)
      const { data, error } = await supabaseAdmin
         .from('gallery_images')
         .insert([
            {
               title,
               description: description || '',
               file_url: fileUrl,
               file_name: `${fileName}`, // 실제 파일명
               file_path: filePath, // 스토리지 경로
               category,
               display_order,
               is_active,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            },
         ])
         .select()
         .single()

      if (error) {
         console.error('갤러리 이미지 추가 오류:', error)
         // 업로드된 파일 삭제
         await supabaseAdmin.storage.from('gallery').remove([filePath])
         return NextResponse.json({ error: '갤러리 이미지를 추가할 수 없습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         message: '갤러리 이미지가 성공적으로 추가되었습니다.',
         image: data,
      })
   } catch (error) {
      console.error('갤러리 이미지 추가 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
