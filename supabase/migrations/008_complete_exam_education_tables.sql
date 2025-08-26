-- 시험 및 교육 관련 테이블 완성
-- 사용자 시험 신청, 교육 이력 등 관리

-- 1. 사용자 시험 신청 기록 테이블
CREATE TABLE IF NOT EXISTS public.user_exam_applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            exam_schedule_id UUID REFERENCES public.exam_schedules(id) ON DELETE CASCADE NOT NULL,
            
            -- 신청 정보
            application_number VARCHAR(50) UNIQUE NOT NULL,
            application_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            application_status VARCHAR(20) DEFAULT 'pending' CHECK (
                application_status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')
            ),
            
            -- 결제 정보
            payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
                payment_status IN ('pending', 'paid', 'failed', 'refunded')
            ),
            payment_amount INTEGER DEFAULT 0,
            payment_date TIMESTAMPTZ,
            payment_method VARCHAR(20),
            
            -- 시험 결과
            exam_score INTEGER,
            exam_result VARCHAR(20) CHECK (exam_result IN ('pass', 'fail', 'pending')),
            certificate_number VARCHAR(100),
            certificate_issued_date TIMESTAMPTZ,
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            
            UNIQUE(user_id, exam_schedule_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_exam_applications_user_id ON public.user_exam_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_applications_exam_schedule_id ON public.user_exam_applications(exam_schedule_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_applications_status ON public.user_exam_applications(application_status);

-- 시퀀스 생성
CREATE SEQUENCE IF NOT EXISTS application_number_seq START 1;

-- 신청번호 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.application_number := 'APP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('application_number_seq')::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS set_application_number ON public.user_exam_applications;
CREATE TRIGGER set_application_number
    BEFORE INSERT ON public.user_exam_applications
    FOR EACH ROW
    WHEN (NEW.application_number IS NULL)
    EXECUTE FUNCTION generate_application_number();

-- 2. 교육 과정 테이블
CREATE TABLE IF NOT EXISTS public.education_courses (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            
            -- 기본 정보
            name VARCHAR(255) NOT NULL,
            description TEXT,
            course_code VARCHAR(50) UNIQUE NOT NULL,
            category VARCHAR(100) NOT NULL,
            
            -- 교육 정보
            duration_hours INTEGER NOT NULL DEFAULT 0,
            max_participants INTEGER NOT NULL DEFAULT 20,
            instructor_name VARCHAR(100),
            instructor_bio TEXT,
            
            -- 비용 정보
            course_fee INTEGER DEFAULT 0,
            
            -- 커리큘럼
            curriculum JSONB DEFAULT '[]',
            prerequisites TEXT,
            materials_included TEXT,
            
            -- 상태
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_education_courses_category ON public.education_courses(category);
CREATE INDEX IF NOT EXISTS idx_education_courses_status ON public.education_courses(status);

-- 3. 교육 스케줄 테이블
CREATE TABLE IF NOT EXISTS public.education_schedules (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            course_id UUID REFERENCES public.education_courses(id) ON DELETE CASCADE NOT NULL,
            
            -- 스케줄 정보
            start_date TIMESTAMPTZ NOT NULL,
            end_date TIMESTAMPTZ NOT NULL,
            registration_start_date TIMESTAMPTZ NOT NULL,
            registration_end_date TIMESTAMPTZ NOT NULL,
            
            -- 장소 정보
            location VARCHAR(255) NOT NULL,
            address TEXT,
            classroom VARCHAR(100),
            
            -- 참가자 정보
            max_participants INTEGER NOT NULL DEFAULT 20,
            current_participants INTEGER DEFAULT 0,
            
            -- 상태
            status VARCHAR(20) DEFAULT 'scheduled' CHECK (
                status IN ('scheduled', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')
            ),
            
            -- 추가 정보
            special_notes TEXT,
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_education_schedules_course_id ON public.education_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_education_schedules_start_date ON public.education_schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_education_schedules_status ON public.education_schedules(status);

-- 4. 사용자 교육 신청 테이블
CREATE TABLE IF NOT EXISTS public.user_education_enrollments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            education_schedule_id UUID REFERENCES public.education_schedules(id) ON DELETE CASCADE NOT NULL,
            
            -- 신청 정보
            enrollment_number VARCHAR(50) UNIQUE NOT NULL,
            enrollment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            enrollment_status VARCHAR(20) DEFAULT 'pending' CHECK (
                enrollment_status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')
            ),
            
            -- 결제 정보
            payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
                payment_status IN ('pending', 'paid', 'failed', 'refunded')
            ),
            payment_amount INTEGER DEFAULT 0,
            payment_date TIMESTAMPTZ,
            
            -- 교육 결과
            attendance_rate DECIMAL(5,2), -- 출석률 (0.00 ~ 100.00)
            completion_status VARCHAR(20) CHECK (completion_status IN ('completed', 'incomplete', 'pending')),
            certificate_number VARCHAR(100),
            certificate_issued_date TIMESTAMPTZ,
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            
            UNIQUE(user_id, education_schedule_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_education_enrollments_user_id ON public.user_education_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_enrollments_schedule_id ON public.user_education_enrollments(education_schedule_id);
CREATE INDEX IF NOT EXISTS idx_user_education_enrollments_status ON public.user_education_enrollments(enrollment_status);

-- 5. 공지사항 테이블 (posts 테이블이 있지만 더 구체적인 notices 테이블)
CREATE TABLE IF NOT EXISTS public.notices (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            
            -- 기본 정보
            title VARCHAR(500) NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            category VARCHAR(100) DEFAULT 'general',
            
            -- 우선순위
            is_pinned BOOLEAN DEFAULT false,
            is_important BOOLEAN DEFAULT false,
            
            -- 표시 설정
            is_published BOOLEAN DEFAULT false,
            published_at TIMESTAMPTZ,
            expires_at TIMESTAMPTZ,
            
            -- 조회수
            view_count INTEGER DEFAULT 0,
            
            -- 첨부파일
            attachments JSONB DEFAULT '[]',
            
            -- 작성자 정보
            author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            author_name VARCHAR(100),
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON public.notices(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notices_author ON public.notices(author_id);

-- 6. QNA 테이블
CREATE TABLE IF NOT EXISTS public.qna_questions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            
            -- 질문 정보
            title VARCHAR(500) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(100) DEFAULT 'general',
            
            -- 질문자 정보
            author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            author_name VARCHAR(100),
            author_email VARCHAR(255),
            
            -- 상태
            is_private BOOLEAN DEFAULT false,
            is_answered BOOLEAN DEFAULT false,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
            
            -- 조회수
            view_count INTEGER DEFAULT 0,
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_qna_questions_author ON public.qna_questions(author_id);
CREATE INDEX IF NOT EXISTS idx_qna_questions_category ON public.qna_questions(category);
CREATE INDEX IF NOT EXISTS idx_qna_questions_status ON public.qna_questions(status);
CREATE INDEX IF NOT EXISTS idx_qna_questions_answered ON public.qna_questions(is_answered);

-- 7. QNA 답변 테이블
CREATE TABLE IF NOT EXISTS public.qna_answers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            question_id UUID REFERENCES public.qna_questions(id) ON DELETE CASCADE NOT NULL,
            
            -- 답변 정보
            content TEXT NOT NULL,
            
            -- 답변자 정보 (관리자)
            author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            author_name VARCHAR(100),
            
            -- 상태
            is_official BOOLEAN DEFAULT true, -- 공식 답변 여부
            
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_qna_answers_question ON public.qna_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_qna_answers_author ON public.qna_answers(author_id);

-- 8. 업데이트 트리거 함수들 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 모든 테이블에 updated_at 트리거 추가
DROP TRIGGER IF EXISTS update_user_exam_applications_updated_at ON public.user_exam_applications;
CREATE TRIGGER update_user_exam_applications_updated_at
    BEFORE UPDATE ON public.user_exam_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_courses_updated_at ON public.education_courses;
CREATE TRIGGER update_education_courses_updated_at
    BEFORE UPDATE ON public.education_courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_schedules_updated_at ON public.education_schedules;
CREATE TRIGGER update_education_schedules_updated_at
    BEFORE UPDATE ON public.education_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_education_enrollments_updated_at ON public.user_education_enrollments;
CREATE TRIGGER update_user_education_enrollments_updated_at
    BEFORE UPDATE ON public.user_education_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notices_updated_at ON public.notices;
CREATE TRIGGER update_notices_updated_at
    BEFORE UPDATE ON public.notices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_qna_questions_updated_at ON public.qna_questions;
CREATE TRIGGER update_qna_questions_updated_at
    BEFORE UPDATE ON public.qna_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_qna_answers_updated_at ON public.qna_answers;
CREATE TRIGGER update_qna_answers_updated_at
    BEFORE UPDATE ON public.qna_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();