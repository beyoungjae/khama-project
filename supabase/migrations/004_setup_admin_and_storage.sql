-- 관리자 계정 설정
-- 2단계가 완료된 후 이 SQL을 실행하세요

-- 1. 현재 사용자들 확인
SELECT 
    id, 
    email, 
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. profiles 테이블의 현재 상태 확인
SELECT 
    id,
    name,
    phone,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 3. 관리자 권한 부여 (실제 사용자 ID로 변경 필요)
-- 아래 주석을 해제하고 실제 사용자 ID로 변경하세요
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = 'your-actual-user-id-here';

-- 4. Storage 정책 설정 (갤러리 이미지 업로드용)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage 정책 생성
CREATE POLICY "gallery_upload_policy" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'gallery' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "gallery_read_policy" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gallery');

CREATE POLICY "gallery_delete_policy" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'gallery' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 완료 메시지
SELECT 'Gallery system setup completed successfully!' as status;