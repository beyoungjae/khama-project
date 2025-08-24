'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import Button from './Button'

interface Props {
   children: ReactNode
   fallback?: ReactNode
}

interface State {
   hasError: boolean
   error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props)
      this.state = { hasError: false }
   }

   static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error }
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
   }

   render() {
      if (this.state.hasError) {
         if (this.props.fallback) {
            return this.props.fallback
         }

         return (
            <div className="min-h-[400px] flex items-center justify-center">
               <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">문제가 발생했습니다</h2>
                  <p className="text-gray-600 mb-6">
                     페이지를 불러오는 중 오류가 발생했습니다.
                     <br />
                     잠시 후 다시 시도해주세요.
                  </p>
                  <div className="space-x-4">
                     <Button onClick={() => window.location.reload()}>페이지 새로고침</Button>
                     <Button variant="outline" onClick={() => window.history.back()}>
                        이전 페이지로
                     </Button>
                  </div>
               </div>
            </div>
         )
      }

      return this.props.children
   }
}

// 간단한 에러 표시 컴포넌트
export function ErrorMessage({ title = '오류가 발생했습니다', message = '요청을 처리하는 중 문제가 발생했습니다.', onRetry, showRetry = true }: { title?: string; message?: string; onRetry?: () => void; showRetry?: boolean }) {
   return (
      <div className="text-center py-12">
         <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
         <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
         <p className="text-gray-600 mb-6">{message}</p>
         {showRetry && onRetry && <Button onClick={onRetry}>다시 시도</Button>}
      </div>
   )
}

// 404 에러 컴포넌트
export function NotFound({ title = '페이지를 찾을 수 없습니다', message = '요청하신 페이지가 존재하지 않거나 이동되었습니다.', showHomeButton = true }: { title?: string; message?: string; showHomeButton?: boolean }) {
   return (
      <div className="text-center py-12">
         <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
         <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
         <p className="text-gray-600 mb-6">{message}</p>
         <div className="space-x-4">
            {showHomeButton && <Button href="/">홈으로 가기</Button>}
            <Button variant="outline" onClick={() => window.history.back()}>
               이전 페이지로
            </Button>
         </div>
      </div>
   )
}
