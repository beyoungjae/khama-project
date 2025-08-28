'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminEducationScheduleEditPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/education/schedules/${params.id}`, { credentials: 'include' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '일정 조회 실패')
        setForm({
          id: data.schedule.id,
          course: data.schedule.education_courses,
          start_date: data.schedule.start_date?.slice(0, 16),
          end_date: data.schedule.end_date?.slice(0, 16),
          registration_start_date: data.schedule.registration_start_date?.slice(0, 16),
          registration_end_date: data.schedule.registration_end_date?.slice(0, 16),
          location: data.schedule.location || '',
          address: data.schedule.address || '',
          classroom: data.schedule.classroom || '',
          max_participants: data.schedule.max_participants || 0,
          status: data.schedule.status || 'scheduled',
          special_notes: data.schedule.special_notes || '',
        })
      } catch (e) {
        alert(e instanceof Error ? e.message : '조회 실패')
        router.push('/admin/education/schedules')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) load()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: name === 'max_participants' ? parseInt(value) || 0 : value }))
  }

  const handleSave = async () => {
    if (!form) return
    // 간단한 검증
    if (!form.location || !form.start_date || !form.end_date || !form.registration_start_date || !form.registration_end_date) {
      alert('필수 항목을 입력해주세요.')
      return
    }
    if (new Date(form.start_date) >= new Date(form.end_date)) {
      alert('종료일은 시작일보다 이후여야 합니다.')
      return
    }
    if (new Date(form.registration_start_date) >= new Date(form.registration_end_date)) {
      alert('등록 종료일은 등록 시작일보다 이후여야 합니다.')
      return
    }
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/education/schedules/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          start_date: new Date(form.start_date).toISOString(),
          end_date: new Date(form.end_date).toISOString(),
          registration_start_date: new Date(form.registration_start_date).toISOString(),
          registration_end_date: new Date(form.registration_end_date).toISOString(),
          location: form.location,
          address: form.address || null,
          classroom: form.classroom || null,
          max_participants: form.max_participants,
          status: form.status,
          special_notes: form.special_notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '수정 실패')
      alert('수정되었습니다')
      router.push(`/admin/education/schedules/${form.id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : '수정 실패')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">교육 일정 수정</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>router.back()}>취소</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
          </div>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">과정명</div>
              <div className="font-medium">{form.course?.name || '-'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">상태</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option value="scheduled">예정</option>
                <option value="registration_open">모집중</option>
                <option value="registration_closed">모집마감</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">교육 시작일시</label>
              <input type="datetime-local" name="start_date" value={form.start_date} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">교육 종료일시</label>
              <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">접수 시작일시</label>
              <input type="datetime-local" name="registration_start_date" value={form.registration_start_date} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">접수 종료일시</label>
              <input type="datetime-local" name="registration_end_date" value={form.registration_end_date} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">장소</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">주소</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">강의실</label>
              <input name="classroom" value={form.classroom} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">정원</label>
              <input type="number" min={0} name="max_participants" value={form.max_participants} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">비고</label>
              <textarea name="special_notes" rows={4} value={form.special_notes} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

