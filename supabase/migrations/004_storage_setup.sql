-- Supabase Storage 설정
-- KHAMA 웹사이트 파일 저장소 설정

-- 1. 갤러리 이미지용 공개 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'gallery', 
    'gallery', 
    true, 
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. 사용자 파일용 비공개 버킷 생성 (교육 이수증 등)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'user-files', 
    'user-files', 
    false, 
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. 공지사항 첨부파일용 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'notice-attachments', 
    'notice-attachments', 
    false, 
    20971520, -- 20MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Gallery 버킷 정책

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can modify gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;

-- 모든 사용자가 갤러리 이미지 조회 가능
CREATE POLICY "Gallery images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery');

-- 관리자만 갤러리 이미지 업로드 가능
CREATE POLICY "Admins can upload gallery images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 관리자만 갤러리 이미지 수정/삭제 가능
CREATE POLICY "Admins can modify gallery images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'gallery' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

CREATE POLICY "Admins can delete gallery images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'gallery' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- User Files 버킷 정책 (사용자별 폴더 구조: user-files/{user_id}/*)

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can access own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can modify own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can access all user files" ON storage.objects;

-- 사용자는 자신의 폴더에만 접근 가능
CREATE POLICY "Users can access own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'user-files' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- 사용자는 자신의 폴더에만 업로드 가능
CREATE POLICY "Users can upload to own folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-files' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- 사용자는 자신의 파일만 수정/삭제 가능
CREATE POLICY "Users can modify own files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'user-files' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'user-files' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- 관리자는 모든 사용자 파일 접근 가능
CREATE POLICY "Admins can access all user files" ON storage.objects
    FOR ALL USING (
        bucket_id = 'user-files' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- Notice Attachments 버킷 정책

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Authenticated users can view notice attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload notice attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can modify notice attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete notice attachments" ON storage.objects;

-- 인증된 사용자만 공지사항 첨부파일 조회 가능
CREATE POLICY "Authenticated users can view notice attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'notice-attachments' AND
        auth.role() = 'authenticated'
    );

-- 관리자만 공지사항 첨부파일 업로드 가능
CREATE POLICY "Admins can upload notice attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'notice-attachments' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 관리자만 공지사항 첨부파일 수정/삭제 가능
CREATE POLICY "Admins can modify notice attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'notice-attachments' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

CREATE POLICY "Admins can delete notice attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'notice-attachments' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- Storage Helper Functions

-- 기존 함수 및 트리거 삭제 (있다면)
DROP TRIGGER IF EXISTS cleanup_file_references_trigger ON storage.objects;
DROP TRIGGER IF EXISTS validate_file_upload_trigger ON storage.objects;
DROP FUNCTION IF EXISTS public.cleanup_file_references();
DROP FUNCTION IF EXISTS public.validate_file_upload();
DROP FUNCTION IF EXISTS public.get_file_url(TEXT, TEXT);

-- 1. 파일 URL 생성 함수
CREATE OR REPLACE FUNCTION public.get_file_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
DECLARE
    base_url TEXT;
BEGIN
    -- Supabase 프로젝트 URL (실제 프로젝트 URL로 변경 필요)
    base_url := 'https://xiwxydrildgwvbluedmd.supabase.co/storage/v1/object/public/';
    
    IF bucket_name IN ('gallery') THEN
        RETURN base_url || bucket_name || '/' || file_path;
    ELSE
        -- 비공개 버킷은 signed URL 사용 (클라이언트에서 처리)
        RETURN 'signed-url-required';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 파일 삭제 시 관련 레코드 정리 함수
CREATE OR REPLACE FUNCTION public.cleanup_file_references()
RETURNS TRIGGER AS $$
BEGIN
    -- 갤러리 이미지 삭제 시 갤러리 레코드도 삭제 고려
    IF OLD.bucket_id = 'gallery' THEN
        UPDATE public.galleries 
        SET image_url = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE image_url LIKE '%' || OLD.name;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage 객체 삭제 시 참조 정리 트리거
CREATE TRIGGER cleanup_file_references_trigger
    AFTER DELETE ON storage.objects
    FOR EACH ROW EXECUTE FUNCTION public.cleanup_file_references();

-- 3. 파일 크기 및 타입 검증 함수
CREATE OR REPLACE FUNCTION public.validate_file_upload()
RETURNS TRIGGER AS $$
DECLARE
    max_size BIGINT;
    allowed_types TEXT[];
BEGIN
    -- 버킷별 제한 확인
    SELECT file_size_limit, allowed_mime_types 
    INTO max_size, allowed_types
    FROM storage.buckets 
    WHERE id = NEW.bucket_id;
    
    -- 파일 크기 검증
    IF NEW.metadata->>'size' IS NOT NULL THEN
        IF (NEW.metadata->>'size')::BIGINT > max_size THEN
            RAISE EXCEPTION 'File size exceeds limit: % bytes', max_size;
        END IF;
    END IF;
    
    -- MIME 타입 검증
    IF allowed_types IS NOT NULL AND array_length(allowed_types, 1) > 0 THEN
        IF NEW.metadata->>'mimetype' IS NULL OR 
           NOT (NEW.metadata->>'mimetype' = ANY(allowed_types)) THEN
            RAISE EXCEPTION 'File type not allowed. Allowed types: %', array_to_string(allowed_types, ', ');
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 파일 업로드 시 검증 트리거 (MIME 타입 문제로 주석 처리)
-- CREATE TRIGGER validate_file_upload_trigger
--     BEFORE INSERT ON storage.objects
--     FOR EACH ROW EXECUTE FUNCTION public.validate_file_upload();