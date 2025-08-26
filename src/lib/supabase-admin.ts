import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// 서버 사이드 전용 관리자 클라이언트
export const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})
