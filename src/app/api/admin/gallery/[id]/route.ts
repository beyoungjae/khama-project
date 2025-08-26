import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../login/route'

// 갤러리 이미지 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: imageId } = await params
      const { title, description, category, display_order, is_active } = await request.json()

      if (!title || !category) {
         return NextResponse.json({ error: '제목과 카테고리는 필수입니다.' }, { status: 400 })
      }

      const updateData: Record<string, unknown> = {
         title,
         description: description || null,
         category,
         is_active: is_active !== undefined ? is_active : true,
         updated_at: new Date().toISOString(),
      }

      // display_order가 제공된 경우에만 업데이트
      if (display_order !== undefined) {
         updateData.display_order = display_order
      }

      const { data, error } = await supabaseAdmin.from('gallery_images').update(updateData).eq('id', imageId).select().single()

      if (error) {
         console.error('갤러리 이미지 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      if (!data) {
         return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 })
      }

      return NextResponse.json({
         message: '갤러리 이미지가 성공적으로 수정되었습니다.',
         image: data,
      })
   } catch (error: unknown) {
      console.error('갤러리 수정 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 갤러리 이미지 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: imageId } = await params

      // 먼저 이미지 정보 조회
      const { data: image, error: fetchError } = await supabaseAdmin.from('gallery_images').select('file_path').eq('id', imageId).single()

      if (fetchError || !image) {
         return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 })
      }

      // Supabase Storage에서 파일 삭제
      if (image.file_path) {
         const { error: storageError } = await supabaseAdmin.storage.from('gallery').remove([image.file_path])

         if (storageError) {
            console.warn('Storage 파일 삭제 실패:', storageError)
            // 파일 삭제 실패해도 DB 레코드는 삭제 진행
         }
      }

      // 데이터베이스에서 삭제
      const { error } = await supabaseAdmin.from('gallery_images').delete().eq('id', imageId)

      if (error) {
         console.error('갤러리 이미지 삭제 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
         message: '갤러리 이미지가 성공적으로 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('갤러리 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
