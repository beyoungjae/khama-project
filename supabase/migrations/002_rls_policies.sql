-- RLS 정책 설정
-- KHAMA 웹사이트 보안 정책

-- 1. profiles 테이블 RLS 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. admins 테이블 RLS 정책
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access admin table" ON public.admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 3. certifications 테이블 RLS 정책
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active certifications" ON public.certifications
    FOR SELECT USING (status = 'active');

CREATE POLICY "Only admins can modify certifications" ON public.certifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 4. exam_schedules 테이블 RLS 정책
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exam schedules" ON public.exam_schedules
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify exam schedules" ON public.exam_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 5. exam_applications 테이블 RLS 정책
ALTER TABLE public.exam_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.exam_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON public.exam_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own draft applications" ON public.exam_applications
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        application_status IN ('draft', 'submitted')
    );

CREATE POLICY "Admins can access all applications" ON public.exam_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 6. posts 테이블 RLS 정책
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published public posts" ON public.posts
    FOR SELECT USING (
        status = 'published' AND is_private = false
    );

CREATE POLICY "Users can view own private posts" ON public.posts
    FOR SELECT USING (
        auth.uid() = author_id AND is_private = true
    );

CREATE POLICY "Authenticated users can create QNA" ON public.posts
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND 
        type = 'qna' AND
        is_admin_author = false
    );

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (
        auth.uid() = author_id AND
        status IN ('draft', 'published')
    );

CREATE POLICY "Admins can access all posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 7. galleries 테이블 RLS 정책
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published galleries" ON public.galleries
    FOR SELECT USING (status = 'published');

CREATE POLICY "Only admins can modify galleries" ON public.galleries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- 8. settings 테이블 RLS 정책
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public settings" ON public.settings
    FOR SELECT USING (
        setting_key NOT LIKE '%_key' AND 
        setting_key NOT LIKE '%_secret' AND
        setting_key NOT LIKE '%_password'
    );

CREATE POLICY "Only admins can modify settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );