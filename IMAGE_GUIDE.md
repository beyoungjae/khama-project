# KHAMA 웹사이트 이미지 교체 가이드

## 📁 이미지 파일 구조

실제 이미지 파일들을 다음 경로에 업로드하세요:

```
public/
├── images/
│   ├── logo/
│   │   ├── khama-logo.png          # 메인 로고 (권장: 200x60px)
│   │   ├── khama-logo-white.png    # 흰색 로고 (어두운 배경용)
│   │   ├── khama-icon.png          # 아이콘만 (권장: 64x64px)
│   │   └── favicon.ico             # 파비콘 (32x32px)
│   │
│   ├── hero/
│   │   ├── hero-bg-1.jpg           # 첫 번째 슬라이드 (권장: 1920x1080px)
│   │   ├── hero-bg-2.jpg           # 두 번째 슬라이드 (권장: 1920x1080px)
│   │   └── hero-bg-3.jpg           # 세 번째 슬라이드 (권장: 1920x1080px)
│   │
│   ├── pages/
│   │   ├── about-hero-bg.jpg       # 협회 소개 페이지 배경
│   │   ├── business-hero-bg.jpg    # 주요 사업 페이지 배경
│   │   ├── exam-hero-bg.jpg        # 자격 검정 페이지 배경
│   │   ├── education-hero-bg.jpg   # 교육 프로그램 페이지 배경
│   │   ├── services-hero-bg.jpg    # 온라인 서비스 페이지 배경
│   │   ├── support-hero-bg.jpg     # 고객 지원 페이지 배경
│   │   ├── notice-hero-bg.jpg      # 공지사항 페이지 배경
│   │   ├── qna-hero-bg.jpg         # Q&A 페이지 배경
│   │   ├── login-hero-bg.jpg       # 로그인 페이지 배경
│   │   ├── signup-hero-bg.jpg      # 회원가입 페이지 배경
│   │   └── sitemap-hero-bg.jpg     # 사이트맵 페이지 배경
│   │
│   ├── gallery/
│   │   ├── education-1.jpg         # 교육 현장 1 (권장: 800x600px)
│   │   ├── education-2.jpg         # 교육 현장 2
│   │   ├── exam-1.jpg              # 시험 현장 1
│   │   ├── exam-2.jpg              # 시험 현장 2
│   │   ├── practice-1.jpg          # 실습 현장 1
│   │   ├── practice-2.jpg          # 실습 현장 2
│   │   ├── ceremony.jpg            # 수료식
│   │   ├── activity.jpg            # 협회 활동
│   │   └── seminar.jpg             # 세미나
│   │
│   ├── education/
│   │   ├── startup-program.jpg     # 창업교육 (권장: 600x400px)
│   │   ├── professional.jpg       # 전문가교육
│   │   └── new-item.jpg            # 신아이템교육
│   │
│   ├── instructors/
│   │   ├── kim-startup.jpg         # 김창업 강사 (권장: 300x300px)
│   │   ├── lee-pro.jpg             # 이전문 강사
│   │   └── park-innovation.jpg     # 박혁신 강사
│   │
│   ├── executives/
│   │   ├── president.jpg           # 회장 사진 (권장: 300x400px)
│   │   └── vice-president.jpg      # 부회장 사진
│   │
│   └── placeholder/
│       ├── hero-placeholder.jpg    # 히어로 플레이스홀더
│       ├── profile-placeholder.jpg # 프로필 플레이스홀더
│       └── gallery-placeholder.jpg # 갤러리 플레이스홀더
```

## 🔧 이미지 교체 방법

### 1단계: 이미지 파일 업로드

위의 폴더 구조에 맞게 `public/images/` 폴더에 이미지 파일들을 업로드하세요.

### 2단계: 페이지별 배경 이미지 활성화

각 페이지 파일에서 해당 이미지의 주석을 해제하세요.

**예시 - About 페이지 배경 이미지 교체:**

```typescript
// 변경 전 (src/app/about/page.tsx)
style={{
   // backgroundImage: `url(${IMAGES.PAGES.ABOUT})`, // 실제 이미지로 교체 시 사용
   // backgroundSize: 'cover',
   // backgroundPosition: 'center',
   // backgroundRepeat: 'no-repeat'
}}

// 변경 후
style={{
   backgroundImage: `url(${IMAGES.PAGES.ABOUT})`, // 실제 이미지로 교체 시 사용
   backgroundSize: 'cover',
   backgroundPosition: 'center',
   backgroundRepeat: 'no-repeat'
}}
```

### 3단계: 히어로 섹션 이미지 교체

홈페이지 히어로 섹션과 갤러리 이미지도 동일한 방식으로 교체하세요:

```typescript
// 홈페이지 히어로 (src/components/home/HeroSection.tsx)
// image: IMAGES.HERO.SLIDE1, // 실제 이미지로 교체 시 사용
image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',

// 갤러리 (src/components/home/GallerySection.tsx)
// image: IMAGES.GALLERY.EDUCATION1, // 실제 이미지로 교체 시 사용
image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
```

### 4단계: 로고 이미지 교체

헤더의 로고를 실제 이미지로 교체하려면:

**실제 적용 예시 (599x106 크기 로고):**

```typescript
// Header.tsx에서 실제 적용된 코드
<OptimizedImage
   src={IMAGES.LOGO.MAIN}
   alt="KHAMA 로고"
   width={168}  // 599 * (30/106) ≈ 168
   height={30}  // 헤더 높이에 맞게 조정
   fallbackSrc="data:image/svg+xml,..." // SVG fallback
   className="h-8 w-auto object-contain"
   priority
/>
```

**로고 크기 계산 방법:**

- 원본 로고: 599 x 106px (비율 5.6:1)
- 헤더 높이: 64px (h-16)
- 로고 높이: 32px (h-8)
- 로고 너비: 599 \* (32/106) ≈ 181px

**다양한 로고 크기별 설정:**

```typescript
// 정사각형 로고 (예: 100x100)
width={32} height={32}

// 가로형 로고 (예: 200x50)
width={128} height={32}

// 세로형 로고 (예: 50x200)
width={8} height={32}
```

### 5단계: import 추가 (필요한 경우)

이미지 상수를 사용하는 파일 상단에 import를 추가하세요:

```typescript
import { IMAGES } from '@/constants/images'
import OptimizedImage from '@/components/ui/OptimizedImage'
```

## 📋 교체해야 할 주요 이미지들

### 우선순위 1 (필수)

- [ ] **로고**: `khama-logo.png`, `khama-icon.png`, `favicon.ico`
- [ ] **히어로 배경**: `hero-bg-1.jpg`, `hero-bg-2.jpg`, `hero-bg-3.jpg`
- [ ] **갤러리**: 6개 갤러리 이미지

### 우선순위 2 (권장)

- [ ] **페이지 배경**: 각 페이지별 히어로 배경 이미지
   - `about-hero-bg.jpg` → About 페이지
   - `business-hero-bg.jpg` → Business 페이지
   - `education-hero-bg.jpg` → Education 페이지
   - `exam-hero-bg.jpg` → Exam 관련 페이지들
   - `services-hero-bg.jpg` → Services, MyPage 페이지
   - `support-hero-bg.jpg` → Support 관련 페이지들
   - `notice-hero-bg.jpg` → Notice 페이지
   - `qna-hero-bg.jpg` → Q&A 관련 페이지들
   - `login-hero-bg.jpg` → Login, Forgot Password 페이지
   - `signup-hero-bg.jpg` → Signup 페이지
   - `sitemap-hero-bg.jpg` → Sitemap 페이지
- [ ] **교육 프로그램**: 3개 교육과정 이미지
- [ ] **강사 프로필**: 3명 강사 사진

### 우선순위 3 (선택)

- [ ] **임원 사진**: 회장, 부회장 사진
- [ ] **플레이스홀더**: 기본 대체 이미지들

## 📄 페이지별 이미지 매핑

| 페이지          | 사용 이미지              | 파일 경로                             |
| --------------- | ------------------------ | ------------------------------------- |
| 홈페이지 히어로 | `IMAGES.HERO.SLIDE1-3`   | `/images/hero/hero-bg-1~3.jpg`        |
| 홈페이지 갤러리 | `IMAGES.GALLERY.*`       | `/images/gallery/*.jpg`               |
| About           | `IMAGES.PAGES.ABOUT`     | `/images/pages/about-hero-bg.jpg`     |
| Business        | `IMAGES.PAGES.BUSINESS`  | `/images/pages/business-hero-bg.jpg`  |
| Education       | `IMAGES.PAGES.EDUCATION` | `/images/pages/education-hero-bg.jpg` |
| Exam 관련       | `IMAGES.PAGES.EXAM`      | `/images/pages/exam-hero-bg.jpg`      |
| Services/MyPage | `IMAGES.PAGES.SERVICES`  | `/images/pages/services-hero-bg.jpg`  |
| Support 관련    | `IMAGES.PAGES.SUPPORT`   | `/images/pages/support-hero-bg.jpg`   |
| Notice          | `IMAGES.PAGES.NOTICE`    | `/images/pages/notice-hero-bg.jpg`    |
| Q&A 관련        | `IMAGES.PAGES.QNA`       | `/images/pages/qna-hero-bg.jpg`       |
| Login 관련      | `IMAGES.PAGES.LOGIN`     | `/images/pages/login-hero-bg.jpg`     |
| Signup          | `IMAGES.PAGES.SIGNUP`    | `/images/pages/signup-hero-bg.jpg`    |
| Sitemap         | `IMAGES.PAGES.SITEMAP`   | `/images/pages/sitemap-hero-bg.jpg`   |

## 🎨 이미지 최적화 권장사항

### 파일 형식

- **로고**: PNG (투명 배경 지원)
- **배경 이미지**: JPG (파일 크기 최적화)
- **프로필 사진**: JPG 또는 PNG

### 해상도 권장사항

- **히어로 배경**: 1920x1080px (16:9 비율)
- **페이지 배경**: 1600x900px 이상
- **갤러리**: 800x600px (4:3 비율)
- **로고**: 200x60px (가로형)
- **아이콘**: 64x64px (정사각형)
- **프로필**: 300x300px (정사각형)

### 파일 크기

- **배경 이미지**: 500KB 이하
- **갤러리**: 200KB 이하
- **로고/아이콘**: 50KB 이하
- **프로필**: 100KB 이하

## 🔄 자동 최적화 기능

웹사이트에는 다음과 같은 자동 최적화 기능이 포함되어 있습니다:

1. **Next.js Image 최적화**: 자동 WebP 변환, 지연 로딩
2. **반응형 이미지**: 디바이스별 최적 크기 제공
3. **에러 처리**: 이미지 로딩 실패 시 대체 이미지 표시
4. **로딩 상태**: 스켈레톤 UI로 자연스러운 로딩 경험

## 🚨 주의사항

1. **저작권**: 모든 이미지는 저작권이 없거나 사용 권한이 있는 이미지를 사용하세요
2. **파일명**: 영문, 숫자, 하이픈(-), 언더스코어(\_)만 사용하세요
3. **용량**: 웹 최적화를 위해 적절한 압축을 적용하세요
4. **백업**: 원본 이미지는 별도로 백업해두세요

## 📞 문의

이미지 교체 과정에서 문제가 발생하면 개발팀에 문의하세요.
