import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 서비스 롤 키로 RLS 우회하는 Supabase 클라이언트
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 갤러리 이미지 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 갤러리 이미지 조회 쿼리 구성
    let query = supabaseServiceRole
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)

    // 카테고리 필터
    if (category && category !== '전체') {
      query = query.eq('category', category)
    }

    // 정렬 (display_order 우선, 최신순)
    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: images, error, count } = await query

    if (error) {
      console.error('갤러리 이미지 조회 오류:', error)
      return NextResponse.json({ error: '갤러리 이미지를 조회할 수 없습니다.' }, { status: 500 })
    }

    return NextResponse.json({
      images: images || [],
      total: count || 0
    })
  } catch (error: unknown) {
    console.error('갤러리 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}