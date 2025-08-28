'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AdminEducationCourseEditPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/education/courses/${params.id}`)
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || '조회 실패')
        router.push('/admin/education/courses')
        return
      }
      setCourse(data.course)
    }
    if (params.id) load()
  }, [params.id, router])

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/education/courses/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: course.name,
          description: course.description,
          category: course.category,
          course_code: course.course_code,
          duration_hours: course.duration_hours,
          max_participants: course.max_participants,
          course_fee: course.course_fee,
          prerequisites: course.prerequisites,
          instructor_name: course.instructor_name,
          materials_included: course.materials_included,
          status: course.status || 'active',
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '수정 실패')
      alert('수정되었습니다')
      router.push(`/admin/education/courses/${params.id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : '수정 실패')
    } finally {
      setSaving(false)
    }
  }

  if (!course) return <div className="min-h-screen bg-gray-100" />

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">교육 과정 수정</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>router.back()}>취소</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
          </div>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">과정명</label>
              <input className="w-full px-3 py-2 border rounded" value={course.name||''} onChange={(e)=>setCourse({...course, name:e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-gray-700">카테고리</label>
              <select className="w-full px-3 py-2 border rounded" value={course.category||'basic'} onChange={(e)=>setCourse({...course, category:e.target.value})}>
                <option value="basic">기초과정</option>
                <option value="intermediate">중급과정</option>
                <option value="advanced">고급과정</option>
                <option value="special">특별과정</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">코드</label>
              <input className="w-full px-3 py-2 border rounded" value={course.course_code||''} onChange={(e)=>setCourse({...course, course_code:e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-gray-700">수강료(원)</label>
              <input type="number" className="w-full px-3 py-2 border rounded" value={course.course_fee||0} onChange={(e)=>setCourse({...course, course_fee: parseInt(e.target.value)||0})} />
            </div>
            <div>
              <label className="text-sm text-gray-700">교육시간(시간)</label>
              <input type="number" className="w-full px-3 py-2 border rounded" value={course.duration_hours||0} onChange={(e)=>setCourse({...course, duration_hours: parseInt(e.target.value)||0})} />
            </div>
            <div>
              <label className="text-sm text-gray-700">최대 정원</label>
              <input type="number" className="w-full px-3 py-2 border rounded" value={course.max_participants||0} onChange={(e)=>setCourse({...course, max_participants: parseInt(e.target.value)||0})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700">설명</label>
              <textarea className="w-full px-3 py-2 border rounded" rows={6} value={course.description||''} onChange={(e)=>setCourse({...course, description:e.target.value})} />
            </div>
            {/* 강사명 입력 제거 */}
            {/* 강사 소개 에디터 제거 */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700">제공 자료</label>
              <input className="w-full px-3 py-2 border rounded" value={course.materials_included||''} onChange={(e)=>setCourse({...course, materials_included:e.target.value})} />
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
