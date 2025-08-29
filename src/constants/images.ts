// 이미지 경로 상수 파일
// 실제 이미지 파일을 public 폴더에 업로드한 후 경로를 수정하세요

export const IMAGES = {
   // 로고 이미지
   LOGO: {
      MAIN: '/images/logo.png', // 메인 로고 (SVG)
      WHITE: '/images/logo/khama-logo-white.svg', // 흰색 로고 (어두운 배경용)
      ICON: '/images/logo/khama-icon.svg', // 아이콘만 (SVG)
      FAVICON: '/images/logo/favicon.svg', // 파비콘 (SVG)
   },

   // 히어로 섹션 배경 이미지
   HERO: {
      SLIDE1: '/images/hero/firstsection.jpg', // 첫 번째 슬라이드 배경 (전문성 & 신뢰성)
      SLIDE2: '/images/hero/secondsection.jpg', // 두 번째 슬라이드 배경 (혁신 & 기술)
      SLIDE3: '/images/hero/thirdsection.jpg', // 세 번째 슬라이드 배경 (교육 & 성장)
      SLIDE4: '/images/hero/fourthsection.jpg', // 네 번째 슬라이드 배경 ()
      SLIDE5: '/images/hero/fifthsection.png', // 다섯 번째 슬라이드 배경 ()
   },

   // 페이지별 히어로 배경 (임시로 fallback 이미지 사용)
   PAGES: {
      ABOUT: '/images/association/education.jpg', // 협회 소개 페이지
      GALLERY: '/images/association/gallery.png',
      BUSINESS: '/images/business/business.jpg', // 주요 사업 페이지
      EXAM: '/images/hero/banner-background2.jpg', // 자격 검정 페이지
      EXAM2: '/images/hero/banner-background3.jpg', // 자격 검정 페이지
      EDUCATION: '/images/education/hero.jpg', // 교육 프로그램 페이지
      SERVICES: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop', // 온라인 서비스 페이지
      SUPPORT: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop', // 고객 지원 페이지
      NOTICE: '/images/board/notice.png', // 공지사항 페이지
      QNA: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop', // Q&A 페이지
      LOGIN: '/images/login/login.jpg', // 로그인 페이지
      SIGNUP: '/images/login/login.jpg', // 회원가입 페이지
      SITEMAP: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop', // 사이트맵 페이지
      MYPAGE: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop', // 마이페이지
      RESOURCES: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop', // 자료실 페이지
      CONTACT: '/images/support/office01.jpg', // 문의하기 페이지
      ADMIN: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop', // 관리자 페이지
   },

   // 교육 프로그램 이미지
   EDUCATION: {
      STARTUP: '/images/education/startup-program.jpg', // 창업교육
      PROFESSIONAL: '/images/education/professional.jpg', // 전문가교육
      NEW_ITEM: '/images/education/new-item.jpg', // 신아이템교육
   },

   // 강사 프로필 이미지
   INSTRUCTORS: {
      KIM_STARTUP: '/images/instructors/kim-startup.jpg', // 김창업 강사
      LEE_PROFESSIONAL: '/images/instructors/lee-pro.jpg', // 이전문 강사
      PARK_INNOVATION: '/images/instructors/park-innovation.jpg', // 박혁신 강사
   },

   // 회장 및 임원 이미지
   EXECUTIVES: {
      PRESIDENT: '/images/association/meet.png', // 회장 사진
      VICE_PRESIDENT: '/images/executives/vice-president.jpg', // 부회장 사진
   },

   // 기본 플레이스홀더 이미지
   PLACEHOLDER: {
      HERO: '/images/placeholder/hero-placeholder.jpg', // 히어로 플레이스홀더
      PROFILE: '/images/placeholder/profile-placeholder.jpg', // 프로필 플레이스홀더
      GALLERY: '/images/placeholder/gallery-placeholder.jpg', // 갤러리 플레이스홀더
   },
}

// 이미지 로딩 실패 시 대체 이미지
export const FALLBACK_IMAGES = {
   HERO: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop',
   PROFILE: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
   GALLERY: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
   EDUCATION: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
}

// 이미지 최적화 함수
export const getOptimizedImageUrl = (imagePath: string, width?: number, height?: number) => {
   // Next.js Image 컴포넌트와 함께 사용할 때 자동 최적화
   if (width && height) {
      return `${imagePath}?w=${width}&h=${height}&fit=crop`
   }
   return imagePath
}

// 이미지 존재 여부 확인 함수
export const checkImageExists = async (imagePath: string): Promise<boolean> => {
   try {
      const response = await fetch(imagePath, { method: 'HEAD' })
      return response.ok
   } catch {
      return false
   }
}
