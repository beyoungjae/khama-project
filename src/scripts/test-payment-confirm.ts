// 테스트를 위한 스크립트 (src/scripts/test-payment-confirm.ts)
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function testPaymentConfirm() {
   try {
      // 관리자 계정으로 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
         email: 'admin@example.com', // 실제 관리자 이메일로 변경
         password: 'password', // 실제 관리자 비밀번호로 변경
      })

      if (error) {
         console.error('로그인 오류:', error)
         return
      }

      const token = data.session?.access_token
      if (!token) {
         console.error('토큰을 가져올 수 없습니다.')
         return
      }

      // 테스트할 신청 ID (실제 존재하는 ID로 변경)
      const applicationId = 'test-application-id'

      // API 호출
      const response = await fetch(`/api/admin/exam-applications/${applicationId}/confirm-payment`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      })

      const result = await response.json()
      console.log('응답:', result)
   } catch (error) {
      console.error('테스트 오류:', error)
   }
}

testPaymentConfirm()
