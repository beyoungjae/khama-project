-- Fix generate_exam_number ambiguity on column vs variable
-- Error: column reference "exam_number" is ambiguous (variable name clashes with table column)

CREATE OR REPLACE FUNCTION public.generate_exam_number(cert_id UUID, schedule_id UUID)
RETURNS TEXT AS $$
DECLARE
    cert_code TEXT;
    year_code TEXT;
    sequence_num INTEGER;
    generated_exam_number TEXT; -- renamed to avoid ambiguity
BEGIN
    -- Certification short code by name
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

    -- Year code (e.g., 24 for 2024)
    year_code := RIGHT(EXTRACT(YEAR FROM CURRENT_DATE)::TEXT, 2);

    -- Determine next sequence based on existing exam_numbers for this cert and year
    SELECT COALESCE(MAX(
        CAST(RIGHT(ea.exam_number, 4) AS INTEGER)
    ), 0) + 1
    INTO sequence_num
    FROM public.exam_applications ea
    WHERE ea.certification_id = cert_id
      AND ea.exam_number IS NOT NULL
      AND ea.exam_number LIKE cert_code || year_code || '%';

    -- Compose final exam number: e.g., AC240001
    generated_exam_number := cert_code || year_code || LPAD(sequence_num::TEXT, 4, '0');

    RETURN generated_exam_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

