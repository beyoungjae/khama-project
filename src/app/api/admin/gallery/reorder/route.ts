import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '@/utils/admin-auth'

// 갤러리 이미지 순서 변경
export async function PUT(request: NextRequest) {
   try {
      const { images } = await request.json()

      if (!images || !Array.isArray(images)) {
         return NextResponse.json({ error: '올바른 이미지 순서 데이터가 필요합니다.' }, { status: 400 })
      }

      // 트랜잭션 시뮬레이션: 각 이미지의 display_order 업데이트
      const updatePromises = images.map((item, index) => {
         return supabaseAdmin
            .from('gallery_images')
            .update({
               display_order: index + 1,
               updated_at: new Date().toISOString(),
            })
            .eq('id', item.id)
      })

      const results = await Promise.all(updatePromises)

      // 에러가 있는지 확인
      const errors = results.filter((result) => result.error)
      if (errors.length > 0) {
         console.error('순서 변경 중 오류:', errors)
         return NextResponse.json({ error: '일부 이미지 순서 변경에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         message: '갤러리 이미지 순서가 성공적으로 변경되었습니다.',
         updatedCount: images.length,
      })
   } catch (error: unknown) {
      console.error('갤러리 순서 변경 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
