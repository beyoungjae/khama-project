import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 파일 다운로드 (Signed URL 생성)
export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const bucket = searchParams.get('bucket')
      const filePath = searchParams.get('path')
      const download = searchParams.get('download') === 'true'

      if (!bucket || !filePath) {
         return NextResponse.json({ error: '버킷과 파일 경로가 필요합니다.' }, { status: 400 })
      }

      // 공개 버킷인 경우 public URL 반환
      if (bucket === 'gallery') {
         const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

         return NextResponse.json({
            url: urlData.publicUrl,
            type: 'public',
         })
      }

      // 비공개 버킷인 경우 권한 확인 및 signed URL 생성
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 사용자 파일인 경우 본인 확인
      if (bucket === 'user-files') {
         const userIdFromPath = filePath.split('/')[0]
         if (userIdFromPath !== user.id) {
            // 관리자 권한 확인
            const { data: adminData } = await supabase.from('admins').select('id').eq('user_id', user.id).eq('status', 'active').single()

            if (!adminData) {
               return NextResponse.json({ error: '파일에 접근할 권한이 없습니다.' }, { status: 403 })
            }
         }
      }

      // 공지사항 첨부파일인 경우 인증된 사용자만
      if (bucket === 'notice-attachments') {
         // 별도 권한 확인 없이 인증된 사용자라면 접근 허용
      }

      // Signed URL 생성 (1시간 유효)
      const { data: signedUrlData, error: urlError } = await supabase.storage.from(bucket).createSignedUrl(filePath, 3600, {
         download: download,
      })

      if (urlError) {
         console.error('Signed URL 생성 오류:', urlError)
         return NextResponse.json({ error: '파일 URL 생성에 실패했습니다.' }, { status: 400 })
      }

      return NextResponse.json({
         url: signedUrlData.signedUrl,
         type: 'signed',
         expires_in: 3600,
      })
   } catch (error: unknown) {
      console.error('파일 다운로드 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}

// 파일 삭제
export async function DELETE(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const bucket = searchParams.get('bucket')
      const filePath = searchParams.get('path')

      if (!bucket || !filePath) {
         return NextResponse.json({ error: '버킷과 파일 경로가 필요합니다.' }, { status: 400 })
      }

      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const token = authHeader.split(' ')[1]
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser(token)

      if (userError || !user) {
         return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
      }

      // 권한 확인
      let hasPermission = false

      // 관리자인 경우 모든 파일 삭제 가능
      const { data: adminData } = await supabase.from('admins').select('id').eq('user_id', user.id).eq('status', 'active').single()

      if (adminData) {
         hasPermission = true
      } else if (bucket === 'user-files') {
         // 사용자는 자신의 파일만 삭제 가능
         const userIdFromPath = filePath.split('/')[0]
         hasPermission = userIdFromPath === user.id
      }

      if (!hasPermission) {
         return NextResponse.json({ error: '파일을 삭제할 권한이 없습니다.' }, { status: 403 })
      }

      // 파일 삭제
      const { error: deleteError } = await supabase.storage.from(bucket).remove([filePath])

      if (deleteError) {
         console.error('파일 삭제 오류:', deleteError)
         return NextResponse.json({ error: '파일 삭제에 실패했습니다.' }, { status: 400 })
      }

      // 파일 삭제 완료 (데이터베이스 업데이트는 필요시 별도 처리)

      return NextResponse.json({
         message: '파일이 삭제되었습니다.',
      })
   } catch (error: unknown) {
      console.error('파일 삭제 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
