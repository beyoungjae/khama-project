-- 새로운 테이블들에 대한 RLS 정책 설정

-- 1. exam_applications 테이블 RLS 정책
ALTER TABLE IF EXISTS public.exam_applications ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 신청만 조회/수정 가능
DROP POLICY IF EXISTS "Users can view own exam applications" ON public.exam_applications;
CREATE POLICY "Users can view own exam applications" ON public.exam_applications
    FOR SELECT USING (user_id = auth.uid());
    
DROP POLICY IF EXISTS "Users can create own exam applications" ON public.exam_applications;
CREATE POLICY "Users can create own exam applications" ON public.exam_applications
    FOR INSERT WITH CHECK (user_id = auth.uid());
    
DROP POLICY IF EXISTS "Users can update own exam applications" ON public.exam_applications;
CREATE POLICY "Users can update own exam applications" ON public.exam_applications
    FOR UPDATE USING (
        user_id = auth.uid() AND 
        application_status IN ('draft', 'submitted', 'payment_pending')
    );

-- 관리자는 모든 신청 접근 가능
DROP POLICY IF EXISTS "Admins can access all exam applications" ON public.exam_applications;
CREATE POLICY "Admins can access all exam applications" ON public.exam_applications
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- 2. education_courses 테이블 RLS 정책
ALTER TABLE IF EXISTS public.education_courses ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 활성화된 교육 과정 조회 가능
DROP POLICY IF EXISTS "Everyone can view active education courses" ON public.education_courses;
CREATE POLICY "Everyone can view active education courses" ON public.education_courses
    FOR SELECT USING (status = 'active');

-- 관리자는 모든 교육 과정 접근 가능
DROP POLICY IF EXISTS "Admins can access all education courses" ON public.education_courses;
CREATE POLICY "Admins can access all education courses" ON public.education_courses
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- 3. education_schedules 테이블 RLS 정책
ALTER TABLE IF EXISTS public.education_schedules ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 활성화된 교육 스케줄 조회 가능
DROP POLICY IF EXISTS "Everyone can view active education schedules" ON public.education_schedules;
CREATE POLICY "Everyone can view active education schedules" ON public.education_schedules
    FOR SELECT USING (
        status IN ('scheduled', 'registration_open', 'in_progress') AND
        course_id IN (SELECT id FROM public.education_courses WHERE status = 'active')
    );

-- 관리자는 모든 교육 스케줄 접근 가능
DROP POLICY IF EXISTS "Admins can access all education schedules" ON public.education_schedules;
CREATE POLICY "Admins can access all education schedules" ON public.education_schedules
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- 4. user_education_enrollments 테이블 RLS 정책
ALTER TABLE IF EXISTS public.user_education_enrollments ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 교육 신청만 조회/수정 가능
DROP POLICY IF EXISTS "Users can view own education enrollments" ON public.user_education_enrollments;
CREATE POLICY "Users can view own education enrollments" ON public.user_education_enrollments
    FOR SELECT USING (user_id = auth.uid());
    
DROP POLICY IF EXISTS "Users can create own education enrollments" ON public.user_education_enrollments;
CREATE POLICY "Users can create own education enrollments" ON public.user_education_enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());
    
DROP POLICY IF EXISTS "Users can update own education enrollments" ON public.user_education_enrollments;
CREATE POLICY "Users can update own education enrollments" ON public.user_education_enrollments
    FOR UPDATE USING (
        user_id = auth.uid() AND 
        enrollment_status IN ('pending', 'approved')
    );

-- 관리자는 모든 교육 신청 접근 가능
DROP POLICY IF EXISTS "Admins can access all education enrollments" ON public.user_education_enrollments;
CREATE POLICY "Admins can access all education enrollments" ON public.user_education_enrollments
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- 5. notices 테이블 RLS 정책
ALTER TABLE IF EXISTS public.notices ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 공지사항 조회 가능
DROP POLICY IF EXISTS "Everyone can view notices" ON public.notices;
CREATE POLICY "Everyone can view notices" ON public.notices
    FOR SELECT USING (is_published = true);

-- 관리자는 모든 공지사항 접근 가능
DROP POLICY IF EXISTS "Admins can access all notices" ON public.notices;
CREATE POLICY "Admins can access all notices" ON public.notices
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- 6. qna_questions 테이agrams RLS 정책
ALTER TABLE IF EXISTS public.qna_questions ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 Q&A만 조회 가능 (비공개 포함)
DROP POLICY IF EXISTS "Users can view own questions" ON public.qna_questions;
CREATE POLICY "Users can view own questions" ON public.qna_questions
    FOR SELECT USING (author_id = auth.uid());

-- 모든 사용자는 공개된 Q&A 조회 가능
DROP POLICY IF EXISTS "Everyone can view public questions" ON public.qna_questions;
CREATE POLICY "Everyone can view public questions" ON public.qna_questions
    FOR SELECT USING (is_private = false AND status != 'pending');

-- 관리자는 모든 Q&A 접근 가능
DROP POLICY IF EXISTS "Admins can access all questions" ON public.qna_questions;
CREATE POLICY "Admins can access all questions" ON public.qna_questions
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );

-- 7. qna_answers 테이agrams RLS 정책
ALTER TABLE IF EXISTS public.qna_answers ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 답변 조회 가능
DROP POLICY IF EXISTS "Everyone can view answers" ON public.qna_answers;
CREATE POLICY "Everyone can view answers" ON public.qna_answers
    FOR SELECT USING (
        question_id IN (
            SELECT id FROM public.qna_questions 
            WHERE is_private = false OR author_id = auth.uid()
        )
    );

-- 관리자는 모든 답변 접근 가능
DROP POLICY IF EXISTS "Admins can access all answers" ON public.qna_answers;
CREATE POLICY "Admins can access all answers" ON public.qna_answers
    FOR ALL USING (
        public.bypass_rls_for_service() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin') 
            AND status = 'active'
        )
    );