import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// 설정 목록 조회
export async function GET(request: NextRequest) {
   try {
      // 관리자 권한 확인 (미들웨어에서 처리됨)

      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')

      // 설정 조회 쿼리 구성
      let query = supabaseAdmin.from('settings').select('*')

      // 카테고리 필터
      if (category && category !== 'all') {
         query = query.eq('category', category)
      }

      const { data: settings, error } = await query.order('category').order('setting_key')

      if (error) {
         console.error('설정 조회 오류:', error)
         return NextResponse.json({ error: '설정을 조회할 수 없습니다.' }, { status: 500 })
      }

      // 카테고리별로 그룹화
      const groupedSettings = settings.reduce(
         (acc, setting) => {
            const category = setting.category || 'general'
            if (!acc[category]) {
               acc[category] = []
            }
            acc[category].push(setting)
            return acc
         },
         {} as Record<string, typeof settings>
      )

      return NextResponse.json({
         settings: groupedSettings,
         total: settings.length,
      })
   } catch (error: unknown) {
      console.error('설정 목록 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 설정 업데이트 (일괄 처리)
export async function PUT(request: NextRequest) {
   try {
      // 관리자 권한 확인 (미들웨어에서 처리됨)

      const updateData = await request.json()
      const { settings } = updateData

      if (!settings || !Array.isArray(settings)) {
         return NextResponse.json({ error: '설정 데이터가 올바르지 않습니다.' }, { status: 400 })
      }

      // 설정 업데이트 (트랜잭션 처리)
      const updatePromises = settings.map(async (setting: { setting_key: string; setting_value: unknown; setting_type: string }) => {
         const { setting_key, setting_value, setting_type } = setting

         // 값 유효성 검증
         if (!setting_key || setting_value === undefined) {
            throw new Error(`설정 ${setting_key}의 값이 누락되었습니다.`)
         }

         // 타입에 따른 값 처리
         let processedValue: unknown
         if (setting_type === 'string') {
            processedValue = JSON.stringify(String(setting_value))
         } else if (setting_type === 'number') {
            const numValue = Number(setting_value)
            if (isNaN(numValue)) {
               throw new Error(`설정 ${setting_key}의 값이 숫자가 아닙니다.`)
            }
            processedValue = numValue
         } else if (setting_type === 'boolean') {
            processedValue = Boolean(setting_value)
         } else if (setting_type === 'json') {
            processedValue = setting_value
         } else {
            processedValue = JSON.stringify(setting_value)
         }

         // Supabase 업데이트
         const { error } = await supabaseAdmin
            .from('settings')
            .update({
               setting_value: processedValue,
               updated_at: new Date().toISOString(),
            })
            .eq('setting_key', setting_key)

         if (error) {
            throw new Error(`설정 ${setting_key} 업데이트 실패: ${error.message}`)
         }

         return { setting_key, success: true }
      })

      const results = await Promise.all(updatePromises)

      return NextResponse.json({
         message: '설정이 성공적으로 업데이트되었습니다.',
         results,
      })
   } catch (error: unknown) {
      console.error('설정 업데이트 API 오류:', error)
      const message = error instanceof Error ? error.message : '설정 업데이트 중 오류가 발생했습니다.'
      return NextResponse.json({ error: message }, { status: 500 })
   }
}

// 새 설정 추가
export async function POST(request: NextRequest) {
   try {
      // 관리자 권한 확인 (미들웨어에서 처리됨)

      const settingData = await request.json()
      const { setting_key, setting_value, setting_type, category, name, description, is_required = false } = settingData

      // 필수 필드 검증
      if (!setting_key || setting_value === undefined || !setting_type || !name) {
         return NextResponse.json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 })
      }

      // 중복 키 검증
      const { data: existingSetting } = await supabaseAdmin.from('settings').select('setting_key').eq('setting_key', setting_key).single()

      if (existingSetting) {
         return NextResponse.json({ error: '이미 존재하는 설정 키입니다.' }, { status: 400 })
      }

      // 타입에 따른 값 처리
      let processedValue: unknown
      if (setting_type === 'string') {
         processedValue = JSON.stringify(String(setting_value))
      } else if (setting_type === 'number') {
         const numValue = Number(setting_value)
         if (isNaN(numValue)) {
            return NextResponse.json({ error: '숫자 타입의 값이 올바르지 않습니다.' }, { status: 400 })
         }
         processedValue = numValue
      } else if (setting_type === 'boolean') {
         processedValue = Boolean(setting_value)
      } else if (setting_type === 'json') {
         processedValue = setting_value
      } else {
         processedValue = JSON.stringify(setting_value)
      }

      // 새 설정 생성
      const { data: setting, error } = await supabaseAdmin
         .from('settings')
         .insert([
            {
               setting_key,
               setting_value: processedValue,
               setting_type,
               category: category || 'general',
               name,
               description,
               is_required,
            },
         ])
         .select()
         .single()

      if (error) {
         console.error('설정 생성 오류:', error)
         return NextResponse.json({ error: '설정 생성에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         setting,
         message: '새 설정이 생성되었습니다.',
      })
   } catch (error: unknown) {
      console.error('설정 생성 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
