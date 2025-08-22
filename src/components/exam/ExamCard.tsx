import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface ExamCardProps {
   exam: {
      id: number
      title: string
      registrationNumber: string
      examDate: string
      applicationPeriod: string
      examFee: string
      certificateFee: string
      totalFee: string
      status: 'open' | 'closed' | 'upcoming'
      examLocation: string
      description: string
      color: string
   }
}

export default function ExamCard({ exam }: ExamCardProps) {
   const getStatusInfo = (status: string) => {
      switch (status) {
         case 'open':
            return { text: '접수중', variant: 'success' as const, bgColor: 'bg-green-50', textColor: 'text-green-700' }
         case 'closed':
            return { text: '접수마감', variant: 'error' as const, bgColor: 'bg-red-50', textColor: 'text-red-700' }
         case 'upcoming':
            return { text: '접수예정', variant: 'warning' as const, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' }
         default:
            return { text: '확인중', variant: 'default' as const, bgColor: 'bg-gray-50', textColor: 'text-gray-700' }
      }
   }

   const statusInfo = getStatusInfo(exam.status)

   return (
      <Card hover className="overflow-hidden">
         {/* 헤더 */}
         <div className={`relative h-32 bg-gradient-to-r ${exam.color} mb-6`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex items-center justify-center text-center text-white p-4">
               <div>
                  <h3 className="text-xl font-bold mb-1">{exam.title}</h3>
                  <p className="text-sm opacity-90">등록번호: {exam.registrationNumber}</p>
               </div>
            </div>
            <div className="absolute top-4 right-4">
               <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            </div>
         </div>

         {/* 내용 */}
         <div className="space-y-4">
            <p className="text-gray-600 text-sm">{exam.description}</p>

            {/* 시험 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <h4 className="font-semibold text-gray-900 mb-2">시험 일정</h4>
                  <div className="space-y-1 text-sm">
                     <p>
                        <span className="text-gray-500">시험일:</span> {exam.examDate}
                     </p>
                     <p>
                        <span className="text-gray-500">접수기간:</span> {exam.applicationPeriod}
                     </p>
                     <p>
                        <span className="text-gray-500">시험지역:</span> {exam.examLocation}
                     </p>
                  </div>
               </div>

               <div>
                  <h4 className="font-semibold text-gray-900 mb-2">시험 비용</h4>
                  <div className="space-y-1 text-sm">
                     <p>
                        <span className="text-gray-500">응시료:</span> {exam.examFee}
                     </p>
                     <p>
                        <span className="text-gray-500">자격발급비:</span> {exam.certificateFee}
                     </p>
                     <p className="font-semibold text-blue-900">
                        <span className="text-gray-500">총 비용:</span> {exam.totalFee}
                     </p>
                  </div>
               </div>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
               <Button href={`/business/certifications/${exam.id}`} variant="outline" className="flex-1">
                  자격증 정보
               </Button>
               <Button href={exam.status === 'open' ? `/exam/apply?cert=${exam.id}` : '#'} className={`flex-1 ${exam.status !== 'open' ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={exam.status !== 'open'}>
                  {exam.status === 'open' ? '시험 신청' : exam.status === 'upcoming' ? '접수 예정' : '접수 마감'}
               </Button>
            </div>

            {/* 상태별 안내 메시지 */}
            {exam.status !== 'open' && (
               <div className={`p-3 rounded-lg ${statusInfo.bgColor} ${statusInfo.textColor} text-sm`}>
                  {exam.status === 'upcoming' && `접수 시작일: ${exam.applicationPeriod.split(' ~ ')[0]}`}
                  {exam.status === 'closed' && '접수가 마감되었습니다. 다음 시험 일정을 확인해주세요.'}
               </div>
            )}
         </div>
      </Card>
   )
}
