// 다음 우편번호 라이브러리 타입 정의
declare global {
   interface Window {
      daum: {
         Postcode: new (config: {
            oncomplete: (data: {
               zonecode: string
               address: string
               addressEnglish: string
               addressType: string
               userSelectedType: string
               noSelected: string
               userLanguageType: string
               roadAddress: string
               roadAddressEnglish: string
               jibunAddress: string
               jibunAddressEnglish: string
               autoRoadAddress: string
               autoRoadAddressEnglish: string
               autoJibunAddress: string
               autoJibunAddressEnglish: string
               buildingCode: string
               buildingName: string
               apartment: string
               sido: string
               sigungu: string
               sigunguCode: string
               roadnameCode: string
               bcode: string
               roadname: string
               bname: string
               bname1: string
               bname2: string
               hname: string
               query: string
            }) => void
            onresize?: (size: { width: number; height: number }) => void
            onclose?: (state: string) => void
            onsearch?: (data: { count: number }) => void
            width?: number | string
            height?: number | string
            animation?: boolean
            focusInput?: boolean
            autoMapping?: boolean
            shorthand?: boolean
            pleaseReadGuide?: number
            pleaseReadGuideTimer?: number
            maxSuggestItems?: number
            showMoreHName?: boolean
            hideMapBtn?: boolean
            hideEngBtn?: boolean
            alwaysShowEngAddr?: boolean
            zonecodeOnly?: boolean
            theme?: {
               bgColor?: string
               searchBgColor?: string
               contentBgColor?: string
               pageBgColor?: string
               textColor?: string
               queryTextColor?: string
               postcodeTextColor?: string
               emphTextColor?: string
               outlineColor?: string
            }
         }) => {
            open: () => void
            embed: (element: HTMLElement) => void
         }
      }
   }
}

export {}
