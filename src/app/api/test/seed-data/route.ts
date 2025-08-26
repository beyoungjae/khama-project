import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
   try {
      // 개발 환경에서만 실행
      if (process.env.NODE_ENV !== 'development') {
         return NextResponse.json({ error: '개발 환경에서만 사용 가능합니다.' }, { status: 403 })
      }

      // 1. 자격증 데이터 생성
      const certifications = [
         {
            id: 'cert-1',
            name: '가전제품분해청소관리사',
            registration_number: '2024-001234',
            description: '세탁기, 에어컨, 공기청정기 등 가전제품 전문 청소',
            status: 'active',
         },
         {
            id: 'cert-2',
            name: '냉난방기세척서비스관리사',
            registration_number: '2024-001235',
            description: '냉난방기 청소 및 유지보수 전문가',
            status: 'active',
         },
         {
            id: 'cert-3',
            name: '에어컨설치관리사',
            registration_number: '2024-001236',
            description: '에어컨 설치 및 시공 전문가',
            status: 'active',
         },
         {
            id: 'cert-4',
            name: '환기청정시스템관리사',
            registration_number: '2024-001237',
            description: '환기 및 공기 정화 시스템 전문가',
            status: 'active',
         },
      ]

      // 자격증 데이터 삽입
      const { error: certError } = await supabaseAdmin.from('certifications').upsert(certifications)
      if (certError) {
         console.error('자격증 데이터 생성 오류:', certError)
      }

      return NextResponse.json({
         message: '테스트 데이터가 성공적으로 생성되었습니다.',
         data: {
            certifications: certifications.length,
         },
      })
   } catch (error) {
      console.error('테스트 데이터 생성 오류:', error)
      return NextResponse.json({ error: '테스트 데이터 생성 중 오류가 발생했습니다.' }, { status: 500 })
   }
}
