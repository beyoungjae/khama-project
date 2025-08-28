import type { IronSessionOptions } from 'iron-session'

export interface AdminUserSession {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
}

export interface UserSession {
  id: string
  email: string
  name?: string
  role: 'user'
}

export interface SessionData {
  admin?: AdminUserSession
  user?: UserSession
}

export const adminSessionOptions: IronSessionOptions = {
  cookieName: 'khama_admin_session',
  password: process.env.IRON_SESSION_PASSWORD || 'development-only-password-change-me-please-32chars+',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
}

export const userSessionOptions: IronSessionOptions = {
  cookieName: 'khama_user_session',
  password: process.env.IRON_SESSION_PASSWORD || 'development-only-password-change-me-please-32chars+',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
}

// 기본값 (하위 호환성)
export const sessionOptions = adminSessionOptions

