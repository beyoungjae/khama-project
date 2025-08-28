import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
   try {
      // 사용자 인증 확인
      const supabase = createRouteHandlerClient({ cookies })
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (!user || authError) {
         return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
      }

      // Admin 클라이언트로 프로필 정보 조회 (RLS 우회)
      const { data: profile, error } = await supabaseAdmin
         .from('profiles')
         .select('name, phone, email')
         .eq('id', user.id)
         .single()

      if (error) {
         console.error('프로필 조회 오류:', error)
         // 프로필이 없으면 기본 정보 반환
         return NextResponse.json({
            profile: {
               name: '',
               phone: '',
               email: user.email || ''
            }
         })
      }

      return NextResponse.json({
         profile: {
            name: profile?.name || '',
            phone: profile?.phone || '',
            email: user.email || profile?.email || ''
         }
      })

   } catch (error) {
      console.error('사용자 프로필 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}