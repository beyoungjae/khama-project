'use client'

import { useEffect } from 'react'

interface ModalProps {
   isOpen: boolean
   onClose: () => void
   children: React.ReactNode
   title?: string
   size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Modal({ isOpen, onClose, children, title, size = 'lg' }: ModalProps) {
   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = 'hidden'
      } else {
         document.body.style.overflow = 'unset'
      }

      return () => {
         document.body.style.overflow = 'unset'
      }
   }, [isOpen])

   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            onClose()
         }
      }

      if (isOpen) {
         document.addEventListener('keydown', handleEscape)
      }

      return () => {
         document.removeEventListener('keydown', handleEscape)
      }
   }, [isOpen, onClose])

   if (!isOpen) return null

   const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-full',
   }

   return (
      <div className="fixed inset-0 z-99999 overflow-y-auto">
         <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal */}
            <div className={`relative w-full ${sizeClasses[size]} transform transition-all`}>
               <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                  {/* Header */}
                  {title && (
                     <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-4">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     </div>
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>

                  {/* Close button if no title */}
                  {!title && (
                     <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white/90 backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}
