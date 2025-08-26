-- profiles 테이블 기반 RLS 정책 수정
-- 무한 재귀 문제 해결

-- 기존 admins 테이블 기반 정책들 삭제 후 profiles 테이블 role 기반으로 재생성

-- 1. 기존 정책들 삭제 (IF EXISTS 사용)
DROP POLICY IF EXISTS "Only admins can access admin table" ON public.admins;
DROP POLICY IF EXISTS "Only admins can modify certifications" ON public.certifications;
DROP POLICY IF EXISTS "Only profile admins can modify certifications" ON public.certifications;
DROP POLICY IF EXISTS "Only admins can modify exam schedules" ON public.exam_schedules;
DROP POLICY IF EXISTS "Only profile admins can modify exam schedules" ON public.exam_schedules;
DROP POLICY IF EXISTS "Admins can access all applications" ON public.exam_applications;
DROP POLICY IF EXISTS "Profile admins can access all applications" ON public.exam_applications;
DROP POLICY IF EXISTS "Admins can access all posts" ON public.posts;
DROP POLICY IF EXISTS "Profile admins can access all posts" ON public.posts;
DROP POLICY IF EXISTS "Only admins can modify galleries" ON public.galleries;
DROP POLICY IF EXISTS "Only profile admins can modify galleries" ON public.galleries;
DROP POLICY IF EXISTS "Only admins can modify settings" ON public.settings;
DROP POLICY IF EXISTS "Only profile admins can modify settings" ON public.settings;

-- 2. admins 테이블 RLS 비활성화 (사용하지 않음)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- 3. profiles 테이블 기반 새로운 관리자 정책들

-- certifications 테이블
CREATE POLICY "Only profile admins can modify certifications" ON public.certifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'super_admin') 
            AND p.status = 'active'
        )
    );

-- exam_schedules 테이블
CREATE POLICY "Only profile admins can modify exam schedules" ON public.exam_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'super_admin') 
            AND p.status = 'active'
        )
    );

-- exam_applications 테이블
CREATE POLICY "Profile admins can access all applications" ON public.exam_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'super_admin') 
            AND p.status = 'active'
        )
    );

-- posts 테이블
CREATE POLICY "Profile admins can access all posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'super_admin') 
            AND p.status = 'active'
        )
    );

-- galleries 테이블
CREATE POLICY "Only profile admins can modify galleries" ON public.galleries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'super_admin') 
            AND p.status = 'active'
        )
    );

-- settings 테이블
CREATE POLICY "Only profile admins can modify settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'super_admin') 
            AND p.status = 'active'
        )
    );

-- 4. gallery_images 테이블 RLS 정책 (존재하는 경우)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery_images') THEN
        -- 기존 정책 삭제
        DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;
        DROP POLICY IF EXISTS "Only admins can modify gallery images" ON public.gallery_images;
        DROP POLICY IF EXISTS "Only profile admins can modify gallery images" ON public.gallery_images;
        
        -- RLS 활성화
        ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
        
        -- 새 정책 생성
        CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
            FOR SELECT USING (true);
            
        CREATE POLICY "Only profile admins can modify gallery images" ON public.gallery_images
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.profiles p 
                    WHERE p.id = auth.uid() 
                    AND p.role IN ('admin', 'super_admin') 
                    AND p.status = 'active'
                )
            );
    END IF;
END $$;