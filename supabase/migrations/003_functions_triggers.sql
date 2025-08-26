-- Functions과 Triggers
-- KHAMA 웹사이트 비즈니스 로직

-- 1. 사용자 생성 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. 시험 신청 시 현재 신청자 수 업데이트
CREATE OR REPLACE FUNCTION public.update_exam_applicants()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.exam_schedules 
        SET current_applicants = current_applicants + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.exam_schedule_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.exam_schedules 
        SET current_applicants = current_applicants - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.exam_schedule_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- 시험 일정이 변경된 경우
        IF OLD.exam_schedule_id != NEW.exam_schedule_id THEN
            -- 기존 일정에서 -1
            UPDATE public.exam_schedules 
            SET current_applicants = current_applicants - 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.exam_schedule_id;
            -- 새 일정에 +1
            UPDATE public.exam_schedules 
            SET current_applicants = current_applicants + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.exam_schedule_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER exam_applicants_counter
    AFTER INSERT OR DELETE OR UPDATE OF exam_schedule_id ON public.exam_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_exam_applicants();

-- 3. 수험번호 자동 생성 함수
CREATE OR REPLACE FUNCTION public.generate_exam_number(cert_id UUID, schedule_id UUID)
RETURNS TEXT AS $$
DECLARE
    cert_code TEXT;
    year_code TEXT;
    sequence_num INTEGER;
    exam_number TEXT;
BEGIN
    -- 자격증 코드 생성 (자격증 ID 기반)
    SELECT 
        CASE 
            WHEN name LIKE '%가전제품분해청소%' THEN 'AC'
            WHEN name LIKE '%냉난방기세척%' THEN 'HC'
            WHEN name LIKE '%에어컨설치%' THEN 'AI'
            WHEN name LIKE '%환기청정시스템%' THEN 'VS'
            ELSE 'GE'
        END
    INTO cert_code
    FROM public.certifications 
    WHERE id = cert_id;
    
    -- 연도 코드 (24 = 2024)
    year_code := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    year_code := RIGHT(year_code, 2);
    
    -- 시퀀스 번호 생성 (해당 자격증의 현재 신청자 수 + 1)
    SELECT COALESCE(MAX(
        CAST(RIGHT(exam_number, 4) AS INTEGER)
    ), 0) + 1
    INTO sequence_num
    FROM public.exam_applications 
    WHERE certification_id = cert_id 
    AND exam_number IS NOT NULL
    AND exam_number LIKE cert_code || year_code || '%';
    
    -- 최종 수험번호 조합 (예: AC240001)
    exam_number := cert_code || year_code || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN exam_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 시험 신청 시 수험번호 자동 할당
CREATE OR REPLACE FUNCTION public.assign_exam_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.exam_number IS NULL AND NEW.application_status = 'payment_completed' THEN
        NEW.exam_number := public.generate_exam_number(NEW.certification_id, NEW.exam_schedule_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_exam_number_trigger
    BEFORE INSERT OR UPDATE ON public.exam_applications
    FOR EACH ROW EXECUTE FUNCTION public.assign_exam_number();

-- 5. 게시글 조회수 증가 함수
CREATE OR REPLACE FUNCTION public.increment_post_views(post_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.posts 
    SET view_count = view_count + 1, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 갤러리 조회수 증가 함수
CREATE OR REPLACE FUNCTION public.increment_gallery_views(gallery_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.galleries 
    SET view_count = view_count + 1, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = gallery_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 시험 일정 상태 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_exam_schedule_status()
RETURNS void AS $$
BEGIN
    -- 접수 시작일이 지난 일정을 'registration_open'으로 변경
    UPDATE public.exam_schedules 
    SET status = 'registration_open',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'scheduled' 
    AND registration_start_date <= CURRENT_DATE;
    
    -- 접수 마감일이 지난 일정을 'registration_closed'로 변경
    UPDATE public.exam_schedules 
    SET status = 'registration_closed',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'registration_open' 
    AND registration_end_date < CURRENT_DATE;
    
    -- 시험일이 지난 일정을 'exam_completed'로 변경
    UPDATE public.exam_schedules 
    SET status = 'exam_completed',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'registration_closed' 
    AND exam_date < CURRENT_DATE;
    
    -- 결과 발표일이 지난 일정을 'results_announced'로 변경
    UPDATE public.exam_schedules 
    SET status = 'results_announced',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'exam_completed' 
    AND result_announcement_date IS NOT NULL
    AND result_announcement_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 적용
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_schedules_updated_at BEFORE UPDATE ON public.exam_schedules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_applications_updated_at BEFORE UPDATE ON public.exam_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Q&A 답변 완료 시 상태 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_qna_answer_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.type = 'qna' THEN
        -- Q&A에 관리자 댓글이 달리면 답변 완료로 처리
        UPDATE public.posts 
        SET is_answered = true,
            answered_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id 
        AND type = 'qna'
        AND EXISTS (
            SELECT 1 FROM public.admins a 
            WHERE a.user_id = NEW.author_id AND a.status = 'active'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 관리자 권한 확인 함수
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins a 
        WHERE a.user_id = user_uuid AND a.status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. 사용자 프로필 조회 함수 (RLS 적용)
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE (
    id UUID,
    name VARCHAR(100),
    phone VARCHAR(20),
    email TEXT,
    status VARCHAR(20),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.phone,
        u.email,
        p.status,
        p.created_at
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE p.id = user_uuid
    AND (auth.uid() = p.id OR public.is_admin());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;