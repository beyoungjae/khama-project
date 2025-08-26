-- profiles 테이블에 role 컬럼 추가
-- 이 SQL을 먼저 실행하세요

-- 1. profiles 테이블에 role 컬럼 추가
ALTER TABLE public.profiles 
ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- 2. role 컬럼 인덱스 생성
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- 3. 기본 관리자 계정 설정 (필요시)
-- 주의: 실제 사용자 ID로 변경하세요
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-id-here';

-- 완료 확인
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';