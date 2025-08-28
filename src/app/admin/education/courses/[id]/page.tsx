'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AdminEducationCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/education/courses/${params.id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '조회 실패')
        setCourse(data.course)
      } catch (e) {
        alert(e instanceof Error ? e.message : '조회 실패')
        router.push('/admin/education/courses')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) load()
  }, [params.id, router])

  if (loading) return <div className="min-h-screen bg-gray-100" />
  if (!course) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">교육 과정 상세</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>router.push('/admin/education/courses')}>목록</Button>
            <Button onClick={()=>router.push(`/admin/education/courses/${params.id}/edit`)}>수정</Button>
          </div>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>과정명</strong><div>{course.name}</div></div>
            <div><strong>카테고리</strong><div>{course.category}</div></div>
            <div><strong>코드</strong><div>{course.course_code}</div></div>
            <div><strong>수강료</strong><div>{course.course_fee?.toLocaleString() || 0}원</div></div>
            <div className="md:col-span-2"><strong>설명</strong><div className="text-gray-700 whitespace-pre-line">{course.description || '-'}</div></div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">등록된 일정</h2>
          {(!course.education_schedules || course.education_schedules.length === 0) ? (
            <div className="text-gray-500">등록된 일정이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {course.education_schedules.map((s: any)=> (
                <div key={s.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{new Date(s.start_date).toLocaleDateString('ko-KR')} ~ {new Date(s.end_date).toLocaleDateString('ko-KR')}</div>
                    <div className="text-sm text-gray-600">{s.location}</div>
                  </div>
                  <div className="text-sm text-gray-500">상태: {s.status || 'scheduled'}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}

