import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
   throw new Error('Missing Supabase admin environment variables')
}

// 서버 사이드 전용 관리자 클라이언트
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
   global: {
      headers: {
         'x-application-name': 'khama-admin',
      },
   },
})
