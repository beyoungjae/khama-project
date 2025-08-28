import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { userSessionOptions, type SessionData } from '@/lib/session'

export async function POST(request: NextRequest) {
   try {
      console.log('문의 등록 API 호출')
      
      // iron-session에서 사용자 세션 확인
      // App Router에서는 cookies()를 사용해 세션을 읽습니다. (await 필요)
      const cookieStore = await cookies()
      const session = await getIronSession<SessionData>(cookieStore, userSessionOptions)
      
      console.log('세션 상태:', { hasUser: !!session.user, userId: session.user?.id })
      
      if (!session.user) {
         console.log('세션 없음 - 로그인 필요')
         return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
      }
      
      const user = session.user
      console.log('인증된 사용자:', { userId: user.id, email: user.email })

      // 요청 데이터 파싱
      const body = await request.json()
      console.log('받은 데이터:', body)
      const { name, phone, email, category, subject, message, is_private } = body
      if (!category || !subject || !message) {
         return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
      }
      // 프로필에서 보조 정보 채우기 (없으면 빈값)
      let finalName = name
      let finalPhone = phone
      let finalEmail = email
      if (!finalName || !finalPhone || !finalEmail) {
         const { data: prof } = await supabaseAdmin.from('profiles').select('name, phone').eq('id', user.id).single()
         finalName = finalName || prof?.name || '사용자'
         finalPhone = finalPhone || prof?.phone || ''
         finalEmail = finalEmail || user.email || ''
      }

      // 문의 데이터 저장 (inquiries 테이블에 저장)
      // Supabase Admin 클라이언트를 사용하여 RLS 정책 우회
      const { data, error } = await supabaseAdmin
         .from('inquiries')
         .insert({
            user_id: user.id,
            author_name: finalName,
            author_email: finalEmail,
            author_phone: finalPhone,
            category,
            subject,
            content: message,
            status: 'pending',
            is_answered: false,
            is_private: !!is_private,
         })
         .select()
         .single()

      if (error) {
         console.error('문의 저장 오류:', error)
         return NextResponse.json(
            {
               error: '문의 등록에 실패했습니다.',
               details: error.message,
               code: error.code,
            },
            { status: 500 }
         )
      }

      return NextResponse.json(
         {
            message: '문의가 성공적으로 등록되었습니다.',
            inquiry: data,
         },
         { status: 201 }
      )
   } catch (error) {
      console.error('문의 등록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)

      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const email = searchParams.get('email') // 사용자별 문의 조회

      // Supabase Admin 클라이언트를 사용하여 RLS 정책 우회
      let query = supabaseAdmin.from('inquiries').select('*', { count: 'exact' })

      // 특정 사용자의 문의만 조회 (마이페이지용)
      if (email) {
         query = query.eq('author_email', email)
      }

      // 페이지네이션
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: inquiries, error, count } = await query.range(from, to).order('created_at', { ascending: false })

      if (error) {
         console.error('문의 목록 조회 오류:', error)
         return NextResponse.json({ error: '문의 목록을 불러오는데 실패했습니다.' }, { status: 500 })
      }

      // 데이터 매핑 (inquiries 테이블 -> inquiry 형태로)
      const mappedInquiries = inquiries?.map((inquiry) => ({
         id: inquiry.id,
         name: inquiry.author_name,
         email: inquiry.author_email,
         phone: inquiry.author_phone,
         category: inquiry.category,
         subject: inquiry.subject,
         content: inquiry.content,
         status: inquiry.status,
         is_answered: inquiry.is_answered || false,
         admin_response: inquiry.admin_response,
         created_at: inquiry.created_at,
         answered_at: inquiry.answered_at,
      }))

      const totalPages = count ? Math.ceil(count / limit) : 1

      return NextResponse.json({
         inquiries: mappedInquiries || [],
         pagination: {
            currentPage: page,
            totalPages,
            totalCount: count || 0,
            limit,
         },
      })
   } catch (error) {
      console.error('문의 목록 조회 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
