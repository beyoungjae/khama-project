-- 자격증 테이블에 이미지 URL 컬럼 추가
ALTER TABLE certifications 
ADD COLUMN IF NOT EXISTS image_url TEXT;