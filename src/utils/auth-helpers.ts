// Vercel 배포 환경에서 인증 세션 관리를 위한 헬퍼 함수들

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

// 쿠키 도메인 설정을 위한 함수
export function getCookieDomain() {
  const baseUrl = getBaseUrl()
  
  if (baseUrl.includes('vercel.app')) {
    // Vercel 배포시 쿠키 도메인을 명시적으로 설정
    return '.vercel.app'
  }
  
  if (baseUrl.includes('localhost')) {
    return 'localhost'
  }
  
  // 커스텀 도메인의 경우
  const hostname = new URL(baseUrl).hostname
  return hostname.startsWith('.') ? hostname : `.${hostname}`
}

// 세션 새로고침을 위한 함수
export async function forceRefreshSession() {
  if (typeof window !== 'undefined') {
    // 브라우저에서만 실행
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const sessionData = await response.json()
        console.log('세션 강제 새로고침 성공:', sessionData)
        return sessionData
      }
    } catch (error) {
      console.error('세션 새로고침 실패:', error)
    }
  }
  return null
}