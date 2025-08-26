import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      // Service Role Key로 프로필 조회 (RLS 우회)
      const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single()

      if (error) {
         console.error('프로필 조회 오류:', error)

         // 데이터가 없는 경우 기본 프로필 반환
         if (error.code === 'PGRST116') {
            return NextResponse.json({
               profile: {
                  id: userId,
                  name: null,
                  phone: null,
                  birth_date: null,
                  gender: null,
                  postal_code: null,
                  address: null,
                  detail_address: null,
                  status: 'active',
                  role: 'user',
                  marketing_agreed: false,
                  marketing_agreed_at: null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  last_login_at: null,
               },
            })
         }

         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ profile: data })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { userId, profileData } = body

      console.log('프로필 생성 요청:', { userId, profileData })

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      // Service Role Key로 프로필 업데이트 (RLS 우회)
      const { data, error } = await supabaseAdmin
         .from('profiles')
         .upsert(
            {
               id: userId,
               ...profileData,
               updated_at: new Date().toISOString(),
            },
            {
               onConflict: 'id',
            }
         )
         .select()
         .single()

      if (error) {
         console.error('프로필 업데이트 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('프로필 생성 성공:', data)
      return NextResponse.json({ profile: data })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function PUT(request: NextRequest) {
   try {
      const body = await request.json()
      const { userId, profileData } = body

      console.log('프로필 업데이트 요청:', { userId, profileData })

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      // Service Role Key로 프로필 업데이트 (RLS 우회)
      const { data, error } = await supabaseAdmin
         .from('profiles')
         .update({
            ...profileData,
            updated_at: new Date().toISOString(),
         })
         .eq('id', userId)
         .select()
         .single()

      if (error) {
         console.error('프로필 업데이트 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('프로필 업데이트 성공:', data)
      return NextResponse.json({ profile: data })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
