import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Service Role Key를 사용하여 RLS 우회
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
   auth: {
      autoRefreshToken: false,
      persistSession: false,
   },
})

// GET: 자격증 PDF 생성 및 다운로드
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: applicationId } = await params

      if (!applicationId) {
         return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
      }

      // 시험 신청 정보 및 자격증 정보 조회
      const { data: application, error: fetchError } = await supabaseAdmin
         .from('exam_applications')
         .select(
            `
            *,
            certifications (
              name,
              registration_number
            ),
            exam_schedules (
              exam_date,
              exam_location
            )
          `
         )
         .eq('id', applicationId)
         .eq('pass_status', true)
         .single()

      if (fetchError || !application) {
         return NextResponse.json({ error: '합격한 시험 신청 정보를 찾을 수 없습니다.' }, { status: 404 })
      }

      // PDF 생성
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595.28, 841.89]) // A4 크기
      
      // 폰트 설정
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      // 페이지 크기
      const { width, height } = page.getSize()

      // 제목
      page.drawText('자격증', {
         x: width / 2 - 50,
         y: height - 100,
         size: 36,
         font: boldFont,
         color: rgb(0, 0, 0),
      })

      // 자격증명
      page.drawText(application.certifications?.name || '가전청소 자격증', {
         x: width / 2 - 100,
         y: height - 180,
         size: 24,
         font: boldFont,
         color: rgb(0, 0, 0),
      })

      // 수여자 정보
      page.drawText(`성명: ${application.applicant_name}`, {
         x: 100,
         y: height - 280,
         size: 16,
         font: font,
         color: rgb(0, 0, 0),
      })

      page.drawText(`생년월일: ${new Date(application.applicant_birth_date).toLocaleDateString()}`, {
         x: 100,
         y: height - 320,
         size: 16,
         font: font,
         color: rgb(0, 0, 0),
      })

      page.drawText(`수험번호: ${application.exam_number}`, {
         x: 100,
         y: height - 360,
         size: 16,
         font: font,
         color: rgb(0, 0, 0),
      })

      page.drawText(`시험일: ${new Date(application.exam_schedules?.exam_date || '').toLocaleDateString()}`, {
         x: 100,
         y: height - 400,
         size: 16,
         font: font,
         color: rgb(0, 0, 0),
      })

      // 합격 내용
      page.drawText('위 사람은 위의 시험에 합격하였기에 이 증서를 드립니다.', {
         x: width / 2 - 200,
         y: height - 500,
         size: 16,
         font: font,
         color: rgb(0, 0, 0),
      })

      // 발급일
      const issueDate = new Date().toLocaleDateString()
      page.drawText(`발급일: ${issueDate}`, {
         x: width / 2 - 50,
         y: height - 580,
         size: 14,
         font: font,
         color: rgb(0, 0, 0),
      })

      // 발급기관
      page.drawText('한국가전청소협회', {
         x: width / 2 - 50,
         y: height - 620,
         size: 16,
         font: boldFont,
         color: rgb(0, 0, 0),
      })

      // PDF 데이터 생성
      const pdfBytes = await pdfDoc.save()

      // 파일명 생성
      const fileName = `certificate_${application.exam_number}_${Date.now()}.pdf`

      // Supabase Storage에 업로드
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
         .from('certificates')
         .upload(fileName, pdfBytes, {
            contentType: 'application/pdf',
            cacheControl: '3600'
         })

      if (uploadError) {
         console.error('PDF 업로드 오류:', uploadError)
         // 업로드 실패 시 직접 다운로드 제공
         return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
               'Content-Type': 'application/pdf',
               'Content-Disposition': `attachment; filename="${fileName}"`,
            },
         })
      }

      // 다운로드 URL 생성
      const { data: urlData } = await supabaseAdmin.storage
         .from('certificates')
         .createSignedUrl(fileName, 3600) // 1시간 유효

      const certificateData = {
         id: applicationId,
         certificate_number: application.exam_number,
         applicant_name: application.applicant_name,
         certification_name: application.certifications?.name,
         exam_date: application.exam_schedules?.exam_date,
         issued_date: new Date().toISOString(),
         pdf_url: urlData?.signedUrl || null,
         file_name: fileName,
      }

      return NextResponse.json({
         certificate: certificateData,
         download_url: urlData?.signedUrl,
         message: '자격증 PDF가 성공적으로 생성되었습니다.',
      })
   } catch (error) {
      console.error('API 오류:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
