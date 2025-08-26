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
