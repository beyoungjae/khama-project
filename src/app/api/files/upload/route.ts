import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// 서비스 롤 키로 RLS 우회하는 Supabase 클라이언트
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
   try {
      // FormData로 파일 받기
      const formData = await request.formData()
      const file = formData.get('file') as File
      const bucket = formData.get('bucket') as string
      const folder = formData.get('folder') as string
      const category = bucket || 'gallery' // 기본값은 gallery

      // 관리자 갤러리 업로드인 경우 인증 체크 생략
      if (category !== 'gallery') {
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
      }

      if (!file) {
         return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 })
      }

      // MIME 타입 정규화 (JPG -> JPEG)
      let normalizedMimeType = file.type
      if (file.type === 'image/jpg') {
         normalizedMimeType = 'image/jpeg'
      }
      
      // 파일 확장자 기반으로 MIME 타입 추론
      const fileExtension = file.name.toLowerCase().split('.').pop()
      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
         normalizedMimeType = 'image/jpeg'
      } else if (fileExtension === 'png') {
         normalizedMimeType = 'image/png'
      } else if (fileExtension === 'webp') {
         normalizedMimeType = 'image/webp'
      }

      console.log(`원본 MIME: ${file.type}, 정규화된 MIME: ${normalizedMimeType}, 파일명: ${file.name}`)

      // 파일 크기 및 타입 검증
      const maxSize =
         category === 'gallery'
            ? 10 * 1024 * 1024 // 10MB
            : category === 'user-files'
              ? 10 * 1024 * 1024 // 10MB
              : 20 * 1024 * 1024 // 20MB for notice-attachments

      if (file.size > maxSize) {
         return NextResponse.json({ error: `파일 크기는 ${Math.floor(maxSize / 1024 / 1024)}MB를 초과할 수 없습니다.` }, { status: 400 })
      }

      // 허용된 MIME 타입 확인
      const allowedTypes = {
         gallery: ['image/jpeg', 'image/png', 'image/webp'],
         'user-files': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
         'notice-attachments': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      }

      const categoryAllowedTypes = allowedTypes[category as keyof typeof allowedTypes]
      if (!categoryAllowedTypes || !categoryAllowedTypes.includes(normalizedMimeType)) {
         const allowedTypeNames = {
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPG',
            'image/png': 'PNG',
            'image/webp': 'WebP',
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
         }

         const allowedExtensions = categoryAllowedTypes.map((type) => allowedTypeNames[type as keyof typeof allowedTypeNames] || type).join(', ')

         return NextResponse.json(
            {
               error: `지원하지 않는 파일 형식입니다. 허용되는 형식: ${allowedExtensions} (현재 파일 형식: ${normalizedMimeType})`,
            },
            { status: 400 }
         )
      }

      // 파일명 생성 (중복 방지)
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`

      // 버킷별 경로 설정
      let filePath = fileName
      if (category === 'gallery' && folder) {
         filePath = `${folder}/${fileName}`
      } else if (category === 'user-files') {
         // user가 없을 수 있으므로 기본 경로 사용
         filePath = `uploads/${fileName}`
      } else if (category === 'notice-attachments') {
         filePath = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`
      }

      // 정규화된 MIME 타입으로 새 File 객체 생성
      let fileToUpload = file
      if (normalizedMimeType !== file.type) {
         // 파일 내용을 ArrayBuffer로 읽어서 새 File 객체 생성
         const arrayBuffer = await file.arrayBuffer()
         fileToUpload = new File([arrayBuffer], file.name, { 
            type: normalizedMimeType,
            lastModified: file.lastModified 
         })
      }

      // Supabase Storage에 파일 업로드 (서비스 롤 키 사용으로 RLS 우회)
      const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage.from(category).upload(filePath, fileToUpload)

      if (uploadError) {
         console.error('파일 업로드 오류:', uploadError)
         // Storage 오류 메시지가 있는 경우 해당 메시지를 전달
         if (uploadError.message) {
            return NextResponse.json({ error: uploadError.message }, { status: 400 })
         }
         return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 400 })
      }

      // 공개 URL 생성 (갤러리만 공개)
      let publicUrl = null
      if (category === 'gallery') {
         const { data: urlData } = supabaseServiceRole.storage.from(category).getPublicUrl(filePath)
         publicUrl = urlData.publicUrl
      }

      // 간단한 업로드 (갤러리용)
      return NextResponse.json({
         file_name: fileName,
         file_path: filePath,
         file_url: publicUrl,
         file_size: fileToUpload.size,
         mime_type: normalizedMimeType,
         upload_path: uploadData.path,
         message: '파일이 업로드되었습니다.',
      })
   } catch (error: unknown) {
      console.error('파일 업로드 API 오류:', error)
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
   }
}
