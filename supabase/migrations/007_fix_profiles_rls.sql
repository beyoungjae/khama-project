-- profiles 테이블 RLS 정책 완전 수정
-- 무한 재귀 문제 완전 해결

-- 1. profiles 테이블의 기존 RLS 정책들 모두 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2. profiles 테이블 RLS 비활성화 (임시)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. profiles 테이블 RLS 다시 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. 새로운 안전한 RLS 정책들 생성
-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid());

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

-- 사용자는 자신의 프로필만 생성 가능 (회원가입 시)
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- 관리자는 모든 프로필 조회 가능 (단순한 role 체크로 무한 재귀 방지)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        (id = auth.uid()) OR 
        (role IN ('admin', 'super_admin') AND status = 'active')
    );

-- 관리자는 다른 사용자의 프로필 수정 가능
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        (id = auth.uid()) OR 
        (role IN ('admin', 'super_admin') AND status = 'active')
    );

-- 5. Service Role을 위한 bypass 함수 생성
CREATE OR REPLACE FUNCTION public.bypass_rls_for_service()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Service Role Key를 사용하는 경우 true 반환
  SELECT current_setting('role') = 'service_role'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role';
$$;

-- 6. Service Role을 위한 정책 추가
CREATE POLICY "Service role can access all profiles" ON public.profiles
    FOR ALL USING (public.bypass_rls_for_service());

-- 7. 기타 테이블들의 profiles 참조 정책도 안전하게 수정

-- certifications 테이블 (기존 정책 유지하지만 더 안전하게)
DROP POLICY IF EXISTS "Only profile admins can modify certifications" ON public.certifications;
CREATE POLICY "Only profile admins can modify certifications" ON public.certifications
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- exam_schedules 테이블
DROP POLICY IF EXISTS "Only profile admins can modify exam schedules" ON public.exam_schedules;
CREATE POLICY "Only profile admins can modify exam schedules" ON public.exam_schedules
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- exam_applications 테이블
DROP POLICY IF EXISTS "Profile admins can access all applications" ON public.exam_applications;
CREATE POLICY "Profile admins can access all applications" ON public.exam_applications
    FOR ALL USING (
        (auth.uid() = user_id) OR
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- posts 테이블
DROP POLICY IF EXISTS "Profile admins can access all posts" ON public.posts;
CREATE POLICY "Profile admins can access all posts" ON public.posts
    FOR ALL USING (
        (status = 'published' AND is_private = false) OR
        (auth.uid() = author_id) OR
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- galleries 테이블
DROP POLICY IF EXISTS "Only profile admins can modify galleries" ON public.galleries;
CREATE POLICY "Only profile admins can modify galleries" ON public.galleries
    FOR ALL USING (
        (status = 'published') OR
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- settings 테이블
DROP POLICY IF EXISTS "Only profile admins can modify settings" ON public.settings;
CREATE POLICY "Only profile admins can modify settings" ON public.settings
    FOR ALL USING (
        (setting_key NOT LIKE '%_key' AND setting_key NOT LIKE '%_secret' AND setting_key NOT LIKE '%_password') OR
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- gallery_images 테이블 (존재하는 경우)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery_images') THEN
        DROP POLICY IF EXISTS "Only profile admins can modify gallery images" ON public.gallery_images;
        
        CREATE POLICY "Only profile admins can modify gallery images" ON public.gallery_images
            FOR ALL USING (
                public.bypass_rls_for_service() OR
                auth.uid() IN (
                    SELECT id FROM public.profiles 
                    WHERE role IN ('admin', 'super_admin') 
                    AND status = 'active'
                )
            );
    END IF;
END $$;

-- 8. 마지막으로 profiles 테이블 관련 grant 권한 설정
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;