import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { cookies } from 'next/headers'

// 핵심 검증기: 토큰 문자열을 받아 검증
export function verifyAdminToken(token: string | undefined | null): { valid: boolean; decoded?: any; user?: any; error?: string } {
   try {
      if (!token) {
         return { valid: false, error: 'No admin token provided' }
      }

      const jwtSecret = process.env.JWT_SECRET || 'your-production-jwt-secret'
      const decoded = jwt.verify(token, jwtSecret) as any

      if (!decoded || decoded.role !== 'admin') {
         return { valid: false, error: 'Invalid admin role' }
      }

      return {
         valid: true,
         decoded,
         user: {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
         },
      }
   } catch (err) {
      return { valid: false, error: 'Invalid token' }
   }
}

// 요청에서 토큰을 추출하여 검증 (헤더 → 쿠키 순)
export function verifyAdminTokenFromRequestSync(request: NextRequest): { valid: boolean; user?: any; error?: string } {
  // Deprecated: kept for backward compatibility; prefers JWT cookie if present
  try {
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined
    const cookieToken = request.cookies.get('admin-token')?.value
    const first = headerToken ? verifyAdminToken(headerToken) : { valid: false }
    if (first.valid) return { valid: true, user: first.user }
    const second = verifyAdminToken(cookieToken)
    if (second.valid) return { valid: true, user: second.user }
    return { valid: false, error: 'No valid token' }
  } catch {
    return { valid: false, error: 'Token verification failed' }
  }
}

export async function verifyAdminTokenFromRequest(request: NextRequest): Promise<{ valid: boolean; user?: any; error?: string }>
{
  try {
    // 1) iron-session 우선 (App Router cookies 사용; await 필요)
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    if (session.admin && (session.admin.role === 'admin' || session.admin.role === 'super_admin')) {
      return { valid: true, user: session.admin }
    }
    // 2) 폴백: JWT (과도기 호환)
    const sync = verifyAdminTokenFromRequestSync(request)
    return sync
  } catch (error) {
    return { valid: false, error: 'Token verification failed' }
  }
}
