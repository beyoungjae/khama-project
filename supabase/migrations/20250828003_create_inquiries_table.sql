-- 문의 시스템을 위한 inquiries 테이블 생성
-- 20250828003_create_inquiries_table.sql

-- 1. inquiries 테이블 생성
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 문의자 정보
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_phone TEXT,
    
    -- 문의 내용
    category TEXT NOT NULL CHECK (category IN ('exam', 'education', 'certificate', 'payment', 'technical', 'other')),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- 상태 관리
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'closed')),
    is_answered BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    
    -- 답변 정보
    admin_response TEXT,
    answered_by UUID REFERENCES public.admins(id),
    answered_at TIMESTAMP WITH TIME ZONE,
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON public.inquiries(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_author_email ON public.inquiries(author_email);

-- 3. RLS 정책 활성화
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성
-- 사용자는 자신의 문의만 조회 가능
CREATE POLICY "Users can view own inquiries" ON public.inquiries
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 문의만 생성 가능
CREATE POLICY "Users can create own inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 답변이 없는 자신의 문의만 수정 가능
CREATE POLICY "Users can update own unanswered inquiries" ON public.inquiries
    FOR UPDATE USING (auth.uid() = user_id AND is_answered = FALSE);

-- 관리자는 모든 문의를 조회하고 수정 가능
CREATE POLICY "Admins can manage all inquiries" ON public.inquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE admins.user_id = auth.uid() 
            AND admins.status = 'active'
        )
    );

-- Service Role은 모든 문의에 접근 가능
CREATE POLICY "Service role can access all inquiries" ON public.inquiries
    FOR ALL TO service_role USING (true);

-- 5. 업데이트 트리거 생성
CREATE OR REPLACE FUNCTION update_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON public.inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_inquiries_updated_at();

-- 6. 기존 posts 테이블의 문의 데이터 마이그레이션 (선택사항)
INSERT INTO public.inquiries (
    id, user_id, author_name, author_email, author_phone, 
    category, subject, content, status, is_answered, is_private,
    admin_response, answered_at, created_at, updated_at
)
SELECT 
    p.id,
    p.author_id,
    p.author_name,
    p.questioner_email,
    p.questioner_phone,
    COALESCE(p.category, 'other'),
    p.title,
    p.content,
    CASE 
        WHEN p.is_answered = true THEN 'completed'
        ELSE 'pending'
    END,
    COALESCE(p.is_answered, false),
    COALESCE(p.is_private, false),
    p.excerpt, -- excerpt를 관리자 답변으로 사용
    p.answered_at,
    p.created_at,
    p.updated_at
FROM public.posts p
WHERE p.type = 'qna'
ON CONFLICT (id) DO NOTHING;

-- 7. 댓글 (기존 comments)는 그대로 유지하고, inquiry_id로 연결
-- 필요시 별도 migration에서 처리