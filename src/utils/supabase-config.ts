// Supabase 환경별 설정 관리
export const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  return url
}

export const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }
  return key
}

export const getSiteUrl = () => {
  // 프로덕션에서는 실제 도메인, 개발환경에서는 localhost
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// 인증 리다이렉트 URL 설정
export const getAuthRedirectUrls = () => {
  const baseUrl = getSiteUrl()
  
  return {
    signIn: `${baseUrl}/auth/callback`,
    signUp: `${baseUrl}/auth/callback`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    
    // 성공 후 리다이렉트
    afterSignIn: `${baseUrl}/mypage`,
    afterSignUp: `${baseUrl}/login?message=signup-success`,
    afterSignOut: `${baseUrl}/login?message=logout`
  }
}

// OAuth Provider 설정 (추후 사용)
export const getOAuthConfig = () => {
  const redirectUrls = getAuthRedirectUrls()
  
  return {
    redirectTo: redirectUrls.signIn,
    scopes: 'email'
  }
}