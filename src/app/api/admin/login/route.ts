import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function POST(request: NextRequest) {
   try {
      const { adminId, password } = await request.json()

      // 입력값 검증
      if (!adminId || !password) {
         return NextResponse.json({ error: '관리자 ID와 비밀번호를 입력해주세요.' }, { status: 400 })
      }

      // 관리자 계정 정보 확인
      const ADMIN_ID = process.env.ADMIN_ID
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

      if (!ADMIN_ID || !ADMIN_PASSWORD) {
         console.error('관리자 계정 정보가 설정되지 않았습니다.')
         return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
      }

      // 관리자 계정 확인
      if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
         return NextResponse.json({ error: '관리자 ID 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
      }

      // 관리자 프로필 정보
      const adminProfile = {
         id: 'admin-khama',
         email: 'admin@khama.org',
         name: '한올컴퍼니 관리자',
         role: 'admin' as const,
         status: 'active',
      }
      // iron-session 세션에 저장 (cookies 기반)
      const cookieStore = await cookies()
      const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
      session.admin = {
        id: adminProfile.id,
        email: adminProfile.email,
        name: adminProfile.name,
        role: adminProfile.role,
      }
      await session.save()
      return NextResponse.json({ message: '로그인 성공', profile: adminProfile })
   } catch (error) {
      console.error('관리자 로그인 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
