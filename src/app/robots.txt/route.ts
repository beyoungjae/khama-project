export async function GET() {
   const baseUrl = 'https://khama.or.kr' // 실제 도메인으로 변경 필요

   const robotsTxt = `User-agent: *
Allow: /

# 관리자 페이지 차단
Disallow: /admin/
Disallow: /api/

# 개인정보 관련 페이지 차단
Disallow: /mypage/
Disallow: /forgot-password/

# 사이트맵 위치
Sitemap: ${baseUrl}/sitemap.xml

# 크롤링 지연 (선택사항)
Crawl-delay: 1`

   return new Response(robotsTxt, {
      headers: {
         'Content-Type': 'text/plain',
      },
   })
}
