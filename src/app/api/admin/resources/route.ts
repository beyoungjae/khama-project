import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminTokenFromRequest } from '@/utils/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabaseAdmin.from('resources').select('*', { count: 'exact' })
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    const { data, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    if (error) {
      console.error('관리자 자료 목록 조회 오류:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      resources: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('관리자 자료 목록 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// POST: 자료 업로드 (form-data)
export async function POST(request: NextRequest) {
  try {
    const { valid } = await verifyAdminTokenFromRequest(request)
    if (!valid) return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })

    const form = await request.formData()
    const file = form.get('file') as File | null
    const title = (form.get('title') as string) || ''
    const description = (form.get('description') as string) || ''
    const category = (form.get('category') as string) || 'general'
    const is_public = (form.get('is_public') as string) === 'true'

    if (!file || !title) {
      return NextResponse.json({ error: '파일과 제목은 필수입니다.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    const allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'zip']
    if (!ext || !allowed.includes(ext)) {
      return NextResponse.json({ error: '허용되지 않는 파일 형식입니다.' }, { status: 400 })
    }

    const timestamp = Date.now()
    const rand = Math.random().toString(36).slice(2)
    const fileName = `${timestamp}-${rand}.${ext}`
    const filePath = `${category}/${fileName}`

    // Storage 업로드
    const { error: uploadError } = await supabaseAdmin.storage.from('resources').upload(filePath, file, {
      cacheControl: '3600', upsert: false,
    })
    if (uploadError) {
      console.error('자료 업로드 오류:', uploadError)
      return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 })
    }

    // DB insert
    const { data, error } = await supabaseAdmin
      .from('resources')
      .insert([
        {
          title,
          description,
          category,
          file_name: file.name,
          file_path: filePath,
          file_size: (file as any).size || 0,
          is_public,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('자료 DB 저장 오류:', error)
      // 업로드 롤백
      await supabaseAdmin.storage.from('resources').remove([filePath])
      return NextResponse.json({ error: '자료 저장에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ message: '업로드 성공', resource: data })
  } catch (error) {
    console.error('자료 업로드 API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
