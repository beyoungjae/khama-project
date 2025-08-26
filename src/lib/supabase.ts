import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// 일반 사용자용 클라이언트
export const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// 타입 정의
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// 주요 테이블 타입들
export type Profile = Tables<'profiles'>
export type ExamApplication = Tables<'exam_applications'>
export type Post = Tables<'posts'>
export type Notice = Tables<'notices'>
export type Gallery = Tables<'galleries'>
export type Certification = Tables<'certifications'>
export type ExamSchedule = Tables<'exam_schedules'>
// export type Comment = Tables<'comments'> // 아직 comments 테이블이 없음
