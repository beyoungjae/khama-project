// fullpage.js TypeScript 선언 파일

interface FullPageSection {
   index: number
   anchor?: string
}

interface FullPageAPI {
   destroy: (type: string) => void
   moveTo: (section: string | number) => void
}

interface FullPageOptions {
   licenseKey?: string
   autoScrolling?: boolean
   scrollHorizontally?: boolean
   navigation?: boolean
   navigationPosition?: string
   showActiveTooltips?: boolean
   slidesNavigation?: boolean
   controlArrows?: boolean
   scrollingSpeed?: number
   anchors?: string[]
   navigationTooltips?: string[]
   css3?: boolean
   keyboardScrolling?: boolean
   touchSensitivity?: number
   credits?: { enabled: boolean }
   onLeave?: (origin: FullPageSection, destination: FullPageSection) => void
   afterLoad?: (origin: FullPageSection, destination: FullPageSection) => void
}

declare module 'fullpage.js' {
   export default class FullPage {
      constructor(selector: string, options: FullPageOptions)
   }
}

// Window 인터페이스 확장
declare global {
   interface Window {
      fullpage_api?: FullPageAPI
   }
}

export {}