import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 자료실 파일 조회 쿼리 구성
    let query = supabaseAdmin
      .from('resources')
      .select('*')
      .eq('is_active', true)

    // 카테고리 필터
    if (category && category !== '전체') {
      query = query.eq('category', category)
    }

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 정렬 (최신순)
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: resources, error, count } = await query

    if (error) {
      console.error('자료실 조회 오류:', error)
      return NextResponse.json({ error: '자료실을 조회할 수 없습니다.' }, { status: 500 })
    }

    return NextResponse.json({
      resources: resources || [],
      total: count || 0
    })
  } catch (error: unknown) {
    console.error('자료실 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}