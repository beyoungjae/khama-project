-- profiles 테이블 RLS 정책 수정 (무한 재귀 문제 해결)
-- 013_fix_profiles_infinite_recursion.sql

-- 1. 기존 정책들 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.profiles;

-- 2. 간단하고 안전한 새로운 정책들 생성

-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 생성 가능 (회원가입 시)
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 관리자는 모든 프로필 조회 및 수정 가능 (직접 role 체크)
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        role IN ('admin', 'super_admin') AND status = 'active'
    );

-- Service Role은 모든 프로필에 접근 가능
CREATE POLICY "Service role full access" ON public.profiles
    FOR ALL USING (
        current_setting('role') = 'service_role'
    );