-- 갤러리 이미지 관리 테이블 추가
-- 관리자 갤러리 관리 시스템을 위한 전용 테이블

CREATE TABLE public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 파일 정보
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    
    -- 이미지 메타데이터
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    
    -- 표시 순서 및 상태
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- 추가 정보
    alt_text VARCHAR(255),
    tags JSONB,
    
    -- 업로드자 정보
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_images_display_order ON public.gallery_images(display_order);
CREATE INDEX idx_gallery_images_active ON public.gallery_images(is_active);
CREATE INDEX idx_gallery_images_created_at ON public.gallery_images(created_at DESC);

-- RLS 정책 설정
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (활성 이미지만)
CREATE POLICY "gallery_images_public_read" ON public.gallery_images
    FOR SELECT
    USING (is_active = true);

-- 관리자 전체 액세스 정책
CREATE POLICY "gallery_images_admin_all" ON public.gallery_images
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- profiles 테이블에 role 컬럼이 없다면 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
        
        -- 기본 관리자 계정 생성을 위한 인덱스
        CREATE INDEX idx_profiles_role ON public.profiles(role);
    END IF;
END $$;