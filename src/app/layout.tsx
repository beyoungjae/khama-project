import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
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
         <body className={`${notoSansKr.variable} font-sans antialiased`}>{children}</body>
      </html>
   )
}
