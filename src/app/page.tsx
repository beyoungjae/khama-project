'use client'

import { useEffect, useRef } from 'react'
import 'fullpage.js/dist/fullpage.css'
import Header from '@/components/layout/Header'
import FirstSection from '@/components/home/FirstSection'
import SecondSection from '@/components/home/SecondSection'
import ThirdSection from '@/components/home/ThirdSection'
import FourthSection from '@/components/home/FourthSection'
import FifthSection from '@/components/home/FifthSection'

// fullpage.js 타입 임포트
interface FullPageSection {
   index: number
   anchor?: string
}

interface FullPageAPI {
   destroy: (mode: string) => void
}

export default function Home() {
   const isInitialized = useRef(false)

   useEffect(() => {
      // 중복 초기화 방지
      if (isInitialized.current) return

      let fullPageInstance: FullPageAPI | null = null

      // 동적으로 fullpage.js import (클라이언트에서만)
      const initFullPage = async () => {
         try {
            // 기존 인스턴스가 있다면 제거
            if (typeof window !== 'undefined' && window.fullpage_api) {
               try {
                  window.fullpage_api.destroy('all')
               } catch (error) {
                  console.warn('Failed to destroy existing fullpage instance:', error)
               }
            }

            // DOM 요소 존재 확인
            const fullpageElement = document.getElementById('fullpage')
            if (!fullpageElement) {
               console.warn('Fullpage element not found')
               return
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const FullPageModule = (await import('fullpage.js')) as { default: new (selector: string, options: Record<string, unknown>) => FullPageAPI }
            const FullPage = FullPageModule.default

            fullPageInstance = new FullPage('#fullpage', {
               // 라이센스 키 (오픈소스/개발용)
               licenseKey: 'gplv3-license',

               // 기본 설정
               autoScrolling: true,
               scrollHorizontally: true,
               navigation: true,
               navigationPosition: 'right',
               showActiveTooltips: false,
               slidesNavigation: false,
               controlArrows: false,

               // 속도 설정
               scrollingSpeed: 700,

               // 섹션 앵커 (URL 해시) - 정확히 5개
               anchors: ['home', 'certification', 'education', 'contact', 'footer'],

               // 네비게이션 툴팁 - 정확히 5개
               navigationTooltips: ['홈', '자격증', '교육', '문의', '푸터'],

               // CSS3 애니메이션 사용
               css3: true,

               // 키보드 네비게이션
               keyboardScrolling: true,

               // 터치 디바이스 지원
               touchSensitivity: 15,

               // 워터마크 비활성화
               credits: {
                  enabled: false,
               },

               // 콜백 함수들
               onLeave: function (origin: FullPageSection, destination: FullPageSection) {
                  console.log('Leaving section', origin.index, 'to', destination.index)
               },

               afterLoad: function (_origin: FullPageSection, destination: FullPageSection) {
                  console.log('Section', destination.index, 'loaded')
               },
            })

            isInitialized.current = true
         } catch (error) {
            console.error('Failed to initialize FullPage.js:', error)
         }
      }

      // DOM이 준비되면 초기화
      if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', initFullPage)
      } else {
         initFullPage()
      }

      // cleanup
      return () => {
         try {
            if (typeof window !== 'undefined' && window.fullpage_api) {
               window.fullpage_api.destroy('all')
            } else if (fullPageInstance) {
               fullPageInstance.destroy('all')
            }
         } catch (error) {
            console.warn('Failed to destroy fullpage instance during cleanup:', error)
         }
         isInitialized.current = false
      }
   }, [])

   return (
      <>
         {/* Header를 fullpage 컨테이너 밖에 두어 fixed로 고정 */}
         <Header />

         {/* fullpage 컨테이너 - 정확히 5개 섹션만 */}
         <div id="fullpage">
            <div className="section">
               <FirstSection />
            </div>
            <div className="section">
               <SecondSection />
            </div>
            <div className="section">
               <ThirdSection />
            </div>
            <div className="section">
               <FourthSection />
            </div>
            <div className="section">
               <FifthSection />
            </div>
         </div>
      </>
   )
}
