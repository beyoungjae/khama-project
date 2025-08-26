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
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 교육 프로그램 조회 쿼리 구성
    let query = supabaseAdmin
      .from('education_programs')
      .select('*')
      .eq('is_active', true)

    // 상태 필터
    if (status && status !== '전체') {
      query = query.eq('status', status)
    }

    // 카테고리 필터
    if (category && category !== '전체') {
      query = query.eq('category', category)
    }

    // 정렬 (display_order 우선, 최신순)
    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: programs, error, count } = await query

    if (error) {
      console.error('교육 프로그램 조회 오류:', error)
      return NextResponse.json({ error: '교육 프로그램을 조회할 수 없습니다.' }, { status: 500 })
    }

    return NextResponse.json({
      programs: programs || [],
      total: count || 0
    })
  } catch (error: unknown) {
    console.error('교육 프로그램 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}