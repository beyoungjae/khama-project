import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import jwt from 'jsonwebtoken'

// JWT 토큰 검증 함수
export function verifyAdminToken(token: string) {
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key')
      return { valid: true, decoded }
   } catch (error) {
      return { valid: false, error }
   }
}

export async function POST(request: NextRequest) {
   try {
      const { adminId, password } = await request.json()

      // 입력값 검증
      if (!adminId || !password) {
         return NextResponse.json({ error: '관리자 ID와 비밀번호를 입력해주세요.' }, { status: 400 })
      }

      // 관리자 계정 정보 확인 (예시: 환경변수에서 관리자 정보를 가져옴)
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

      // 관리자 프로필 정보 조회
      // 실제 애플리케이션에서는 데이터베이스에서 관리자 프로필을 조회해야 합니다.
      // 여기서는 예시로 고정된 프로필 정보를 사용합니다.
      const adminProfile = {
         id: 'admin-user-id',
         email: 'admin@khama.org',
         name: '최고관리자',
         role: 'super_admin',
         status: 'active',
      }

      // JWT 토큰 생성
      const token = jwt.sign(
         {
            userId: adminProfile.id,
            email: adminProfile.email,
            role: adminProfile.role,
         },
         process.env.JWT_SECRET || 'admin-secret-key',
         { expiresIn: '24h' }
      )

      return NextResponse.json({
         message: '로그인 성공',
         token,
         profile: adminProfile,
      })
   } catch (error) {
      console.error('관리자 로그인 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
