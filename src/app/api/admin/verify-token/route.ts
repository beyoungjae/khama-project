import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '../login/route'

export async function POST(request: NextRequest) {
   try {
      // 인증 헤더 확인
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ valid: false, error: '인증 헤더가 없습니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]

      // JWT 토큰 검증
      const { valid, decoded, error } = verifyAdminToken(token)

      if (!valid) {
         return NextResponse.json({ valid: false, error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      return NextResponse.json({ valid: true, decoded })
   } catch (error) {
      console.error('토큰 검증 오류:', error)
      return NextResponse.json({ valid: false, error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
