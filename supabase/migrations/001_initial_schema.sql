-- KHAMA 웹사이트 초기 데이터베이스 스키마
-- Supabase 프로젝트용

-- 1. 사용자 프로필 테이블
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- 기본 정보
    name VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    
    -- 주소 정보
    postal_code VARCHAR(10),
    address TEXT,
    detail_address TEXT,
    
    -- 계정 상태
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- 마케팅 동의
    marketing_agreed BOOLEAN DEFAULT false,
    marketing_agreed_at TIMESTAMPTZ,
    
    -- 메타데이터
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

-- 2. 관리자 테이블
CREATE TABLE public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    created_by UUID REFERENCES public.admins(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

-- 3. 자격증 정보 테이블
CREATE TABLE public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- 시험 정보
    exam_subjects JSONB,
    exam_methods JSONB,
    passing_criteria TEXT,
    
    -- 비용 정보
    application_fee INTEGER,
    certificate_fee INTEGER,
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. 시험 일정 테이블
CREATE TABLE public.exam_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    certification_id UUID NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
    
    -- 일정 정보
    exam_date DATE NOT NULL,
    registration_start_date DATE NOT NULL,
    registration_end_date DATE NOT NULL,
    result_announcement_date DATE,
    
    -- 장소 정보
    exam_location TEXT NOT NULL,
    exam_address TEXT,
    max_applicants INTEGER DEFAULT 100,
    current_applicants INTEGER DEFAULT 0,
    
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'registration_open', 'registration_closed', 
        'exam_completed', 'results_announced', 'cancelled'
    )),
    
    exam_instructions TEXT,
    required_items JSONB,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. 시험 신청 테이블
CREATE TABLE public.exam_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_schedule_id UUID NOT NULL REFERENCES public.exam_schedules(id) ON DELETE CASCADE,
    certification_id UUID NOT NULL REFERENCES public.certifications(id),
    
    -- 신청자 정보
    applicant_name VARCHAR(100) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_birth_date DATE NOT NULL,
    applicant_address TEXT,
    
    -- 교육 이수 정보
    education_completed BOOLEAN DEFAULT false,
    education_certificate_url TEXT,
    
    -- 신청 상태
    application_status VARCHAR(30) DEFAULT 'submitted' CHECK (application_status IN (
        'draft', 'submitted', 'payment_pending', 'payment_completed', 
        'confirmed', 'exam_taken', 'passed', 'failed', 'cancelled'
    )),
    
    -- 결제 정보
    payment_amount INTEGER,
    payment_method VARCHAR(50),
    payment_status VARCHAR(30) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    
    -- 시험 결과
    exam_taken_at TIMESTAMPTZ,
    written_score INTEGER,
    practical_score INTEGER,
    total_score INTEGER,
    pass_status BOOLEAN,
    
    exam_number VARCHAR(50) UNIQUE,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, exam_schedule_id)
);

-- 6. 게시판 테이블
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    
    -- 분류
    type VARCHAR(20) NOT NULL CHECK (type IN ('notice', 'qna', 'faq')),
    category VARCHAR(50),
    
    -- 작성자
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    is_admin_author BOOLEAN DEFAULT false,
    
    -- 상태
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
    is_pinned BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    
    -- 조회 및 상호작용
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Q&A 전용
    question_type VARCHAR(50),
    questioner_email VARCHAR(255),
    questioner_phone VARCHAR(20),
    is_answered BOOLEAN DEFAULT false,
    answered_at TIMESTAMPTZ,
    
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. 갤러리 테이블
CREATE TABLE public.galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    
    -- Supabase Storage 이미지 URL
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    taken_date DATE,
    photographer VARCHAR(100),
    location VARCHAR(200),
    
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. 시스템 설정 테이블
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50) NOT NULL,
    
    category VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    is_required BOOLEAN DEFAULT false,
    validation_rules JSONB,
    
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_exam_schedules_date ON public.exam_schedules(exam_date);
CREATE INDEX idx_exam_applications_status ON public.exam_applications(application_status);
CREATE INDEX idx_exam_applications_user_id ON public.exam_applications(user_id);
CREATE INDEX idx_posts_type_status ON public.posts(type, status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_galleries_category ON public.galleries(category);
CREATE INDEX idx_galleries_display_order ON public.galleries(display_order);

-- 초기 데이터 삽입
INSERT INTO public.certifications (name, registration_number, description, application_fee, certificate_fee) VALUES
('가전제품분해청소관리사', '2024-001234', '세탁기, 에어컨, 공기청정기 등 가전제품 전문 청소', 50000, 30000),
('냉난방기세척서비스관리사', '2024-001235', '냉난방기 청소 및 유지보수 전문가', 50000, 30000),
('에어컨설치관리사', '2024-001236', '에어컨 설치 및 시공 전문가', 50000, 30000),
('환기청정시스템관리사', '2024-001237', '환기 및 공기 정화 시스템 전문가', 50000, 30000);

INSERT INTO public.settings (setting_key, setting_value, setting_type, category, name) VALUES
('site_name', '"KHAMA"', 'string', 'site_info', '사이트명'),
('site_description', '"한국생활가전유지관리협회"', 'string', 'site_info', '사이트 설명'),
('contact_phone', '"1566-3321"', 'string', 'contact', '대표 전화번호'),
('contact_email', '"haan@hanallcompany.com"', 'string', 'contact', '대표 이메일'),
('contact_address', '"인천광역시 서구 청라한내로72번길 13 (청라동) 203호"', 'string', 'contact', '협회 주소'),
('exam_application_fee', '50000', 'number', 'exam', '기본 응시료'),
('exam_certificate_fee', '30000', 'number', 'exam', '자격발급비');