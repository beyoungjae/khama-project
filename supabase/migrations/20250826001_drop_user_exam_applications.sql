-- user_exam_applications 테이블 삭제
-- exam_applications 테이블만 사용하도록 변경

-- 트리거 삭제
DROP TRIGGER IF EXISTS update_user_exam_applications_updated_at ON public.user_exam_applications;

-- 테이블 삭제
DROP TABLE IF EXISTS public.user_exam_applications;