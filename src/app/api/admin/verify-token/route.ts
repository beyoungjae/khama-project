import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    if (!session.admin) {
      return NextResponse.json({ error: 'No admin session', valid: false }, { status: 401 })
    }
    const { id, email, name, role } = session.admin
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Invalid role', valid: false }, { status: 403 })
    }
    return NextResponse.json({ valid: true, user: { id, email, name, role } })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json({ error: 'Internal server error', valid: false }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
