import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminToken } from '../../login/route'

// GET: 회원 목록 조회
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const search = searchParams.get('search')
      const status = searchParams.get('status')
      const role = searchParams.get('role')

      const offset = (page - 1) * limit

      let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' })

      // 검색 필터
      if (search) {
         query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      // 상태 필터
      if (status && status !== 'all') {
         query = query.eq('status', status)
      }

      // 역할 필터
      if (role && role !== 'all') {
         query = query.eq('role', role)
      }

      // 정렬 및 페이지네이션
      const { data: members, count, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      if (error) {
         console.error('회원 목록 조회 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return NextResponse.json({
         members: members || [],
         pagination: {
            page,
            limit,
            total: count || 0,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
         },
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// PATCH: 회원 정보 수정 (관리자용)
export async function PATCH(request: NextRequest) {
   try {
      const body = await request.json()
      const { userId, updates } = body

      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      const allowedFields = ['status', 'role', 'name', 'phone', 'address']
      const filteredUpdates = Object.keys(updates)
         .filter((key) => allowedFields.includes(key))
         .reduce(
            (obj, key) => {
               obj[key] = updates[key]
               return obj
            },
            {} as Record<string, string | number | boolean>
         )

      if (Object.keys(filteredUpdates).length === 0) {
         return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
      }

      filteredUpdates.updated_at = new Date().toISOString()

      const { data: updatedProfile, error } = await supabaseAdmin.from('profiles').update(filteredUpdates).eq('id', userId).select().single()

      if (error) {
         console.error('회원 정보 수정 오류:', error)
         return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ member: updatedProfile })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
