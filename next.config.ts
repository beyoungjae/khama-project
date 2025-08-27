import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   eslint: {
      // 빌드 시 ESLint 오류를 경고로 처리
      ignoreDuringBuilds: true,
   },
   typescript: {
      // 빌드 시 TypeScript 오류를 무시 (개발 중에만)
      ignoreBuildErrors: true,
   },
   // Vercel 배포 환경에서 세션 쿠키 설정 최적화
   experimental: {
      serverActions: {
         bodySizeLimit: '2mb'
      }
   },
   // 캐시 설정 및 CORS 지원
   headers: async () => {
     return [
       {
         source: '/api/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'no-store, must-revalidate',
           },
           {
             key: 'Access-Control-Allow-Origin',
             value: '*',
           },
           {
             key: 'Access-Control-Allow-Methods',
             value: 'GET, POST, PUT, DELETE, OPTIONS',
           },
           {
             key: 'Access-Control-Allow-Headers',
             value: 'Content-Type, Authorization',
           },
         ],
       },
       {
         source: '/_next/static/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ]
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            port: '',
            pathname: '/**',
         },
         {
            protocol: 'https',
            hostname: 'xiwxydrildgwvbluedmd.supabase.co',
            port: '',
            pathname: '/storage/v1/object/public/**',
         },
      ],
   },
}

export default nextConfig
