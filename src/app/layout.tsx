import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import ClientSessionDebugger from '@/components/ClientSessionDebugger'
import AuthTokenSync from '@/components/AuthTokenSync'
import VercelAuthFix from '@/components/VercelAuthFix'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
   variable: '--font-noto-sans-kr',
   subsets: ['latin'],
   weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
   title: 'KHAMA | 한국생활가전유지관리협회',
   description: '생활가전 유지관리 전문가 양성과 자격증 관리를 위한 한국생활가전유지관리협회 공식 웹사이트',
   keywords: '가전제품분해청소관리사, 냉난방기세척서비스관리사, 에어컨설치관리사, 환기청정시스템관리사, KHAMA',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang="ko">
         <head>
            <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" async></script>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin=""></script>
         </head>
         <body className={`${notoSansKr.variable} font-sans antialiased`}>
            <Providers>
               <AuthTokenSync />
               <VercelAuthFix />
               {children}
               <ClientSessionDebugger />
            </Providers>
         </body>
      </html>
   )
}
