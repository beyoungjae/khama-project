// 인증 관련 헬퍼 함수들

export function getBaseUrl() {
   // Vercel 환경변수 우선 사용
   if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
   }

   // 커스텀 도메인 사용
   if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL
   }

   // 개발 환경
   return 'http://localhost:3000'
}

export function getAuthCallbackUrl() {
   return `${getBaseUrl()}/auth/callback`
}
