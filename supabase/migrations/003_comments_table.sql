-- 댓글 테이블 추가
-- Q&A 답변 및 게시글 댓글 기능을 위한 테이블

CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 연결된 게시글
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    
    -- 댓글 내용
    content TEXT NOT NULL,
    
    -- 작성자 정보
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    author_type VARCHAR(20) DEFAULT 'user' CHECK (author_type IN ('user', 'admin', 'guest')),
    is_admin_author BOOLEAN DEFAULT false,
    is_official_answer BOOLEAN DEFAULT false,
    
    -- 계층 구조 (대댓글)
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    depth INTEGER DEFAULT 0 CHECK (depth >= 0 AND depth <= 3),
    
    -- 상태
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
    
    -- 메타데이터
    ip_address INET,
    user_agent TEXT,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_comment_id);
CREATE INDEX idx_comments_status ON public.comments(status);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);

-- RLS 정책 설정
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (게시된 댓글만)
CREATE POLICY "comments_public_read" ON public.comments
    FOR SELECT
    USING (status = 'published');

-- 작성자 본인 댓글 관리 정책
CREATE POLICY "comments_author_all" ON public.comments
    FOR ALL
    TO authenticated
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

-- 관리자 전체 액세스 정책
CREATE POLICY "comments_admin_all" ON public.comments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- 인증된 사용자 댓글 작성 정책
CREATE POLICY "comments_authenticated_insert" ON public.comments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        author_id = auth.uid() 
        AND status = 'published'
        AND is_admin_author = (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role IN ('admin', 'super_admin')
            )
        )
    );

-- 댓글 수 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 댓글 추가/삭제 시 게시글의 comment_count 업데이트
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts 
        SET comment_count = comment_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts 
        SET comment_count = GREATEST(0, comment_count - 1)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 댓글 수 업데이트 트리거
CREATE TRIGGER update_comment_count_trigger
    AFTER INSERT OR DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();