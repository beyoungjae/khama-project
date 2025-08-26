-- 자격증 테이블에 시험 면제 혜택 컬럼 추가
ALTER TABLE certifications 
ADD COLUMN IF NOT EXISTS exemption_benefits TEXT;

-- 이미 존재하는 컬럼들 확인 및 필요시 수정
DO $$ 
BEGIN
  -- description 컬럼이 없으면 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'description'
  ) THEN
    ALTER TABLE certifications ADD COLUMN description TEXT;
  END IF;

  -- exam_subjects 컬럼이 없으면 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'exam_subjects'
  ) THEN
    ALTER TABLE certifications ADD COLUMN exam_subjects JSONB;
  END IF;

  -- exam_methods 컬럼이 없으면 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'exam_methods'
  ) THEN
    ALTER TABLE certifications ADD COLUMN exam_methods JSONB;
  END IF;

  -- passing_criteria 컬럼이 없으면 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certifications' AND column_name = 'passing_criteria'
  ) THEN
    ALTER TABLE certifications ADD COLUMN passing_criteria TEXT;
  END IF;
END $$;