-- 자격증 테이블에 자격 기본 정보 관련 컬럼들 추가
ALTER TABLE certifications 
ADD COLUMN IF NOT EXISTS qualification_type TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS eligibility TEXT,
ADD COLUMN IF NOT EXISTS validity_period TEXT;