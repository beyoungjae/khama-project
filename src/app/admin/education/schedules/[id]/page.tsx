'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminEducationScheduleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [schedule, setSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/education/schedules/${params.id}`, { credentials: 'include' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '일정 조회 실패')
        setSchedule(data.schedule)
      } catch (e) {
        alert(e instanceof Error ? e.message : '조회 실패')
        router.push('/admin/education/schedules')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) load()
  }, [params.id, router])

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!params.id) return
      try {
        setLoadingEnrollments(true)
        const res = await fetch(`/api/admin/education/enrollments?scheduleId=${params.id}`, { credentials: 'include' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '수강자 조회 실패')
        setEnrollments(data.enrollments || [])
      } catch (e) {
        // 조용히 실패
      } finally {
        setLoadingEnrollments(false)
      }
    }
    loadEnrollments()
  }, [params.id])

  const handleDelete = async () => {
    if (!schedule) return
    if (!confirm('정말 이 일정을 삭제하시겠습니까? 되돌릴 수 없습니다.')) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/admin/education/schedules/${schedule.id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '삭제 실패')
      alert('삭제되었습니다')
      router.push('/admin/education/schedules')
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!schedule) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">교육 일정 상세</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>router.push(`/admin/education/schedules/${schedule.id}/edit`)}>수정</Button>
            <Button variant="outline" onClick={()=>router.push('/admin/education/schedules')}>목록</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? '삭제 중...' : '삭제'}</Button>
          </div>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">과정명</div>
              <div className="font-medium">{schedule.education_courses?.name || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">카테고리</div>
              <div className="font-medium">{schedule.education_courses?.category || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">교육 기간</div>
              <div className="font-medium">{new Date(schedule.start_date).toLocaleString()} ~ {new Date(schedule.end_date).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">접수 기간</div>
              <div className="font-medium">{new Date(schedule.registration_start_date).toLocaleString()} ~ {new Date(schedule.registration_end_date).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">장소</div>
              <div className="font-medium">{schedule.location} {schedule.classroom ? `(${schedule.classroom})` : ''}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">정원</div>
              <div className="font-medium">{schedule.current_participants || 0}/{schedule.max_participants}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">상태</div>
              <div className="font-medium">{schedule.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">비고</div>
              <div className="font-medium whitespace-pre-wrap">{schedule.special_notes || '-'}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">수강자 목록</h2>
            <span className="text-sm text-gray-500">총 {enrollments.length}명</span>
          </div>
          {loadingEnrollments ? (
            <div className="text-center py-6">불러오는 중...</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">등록된 수강자가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청번호</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{enr.enrollment_number}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{enr.student_name || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{enr.student_phone || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{enr.enrollment_status}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{enr.enrolled_at ? new Date(enr.enrolled_at).toLocaleDateString('ko-KR') : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
