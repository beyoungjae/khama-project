export async function GET() {
   const baseUrl = 'https://khama.or.kr' // 실제 도메인으로 변경 필요

   const routes = [
      '',
      '/about',
      '/business',
      '/business/education',
      '/exam',
      '/exam/apply',
      '/exam/schedule',
      '/exam/results/search',
      '/services',
      '/mypage',
      '/board/notice',
      '/board/qna',
      '/board/qna/write',
      '/support',
      '/support/inquiry',
      '/support/resources',
      '/login',
      '/signup',
      '/forgot-password',
      '/terms',
      '/privacy',
      '/sitemap',
   ]

   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
   .map((route) => {
      const priority = route === '' ? '1.0' : route.includes('/board/') || route.includes('/exam/') ? '0.8' : route.includes('/support/') || route.includes('/business/') ? '0.7' : route.includes('/login') || route.includes('/signup') ? '0.5' : '0.6'

      const changefreq = route === '' ? 'daily' : route.includes('/board/') ? 'weekly' : route.includes('/exam/') ? 'monthly' : 'monthly'

      return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
   })
   .join('\n')}
</urlset>`

   return new Response(sitemap, {
      headers: {
         'Content-Type': 'application/xml',
      },
   })
}
