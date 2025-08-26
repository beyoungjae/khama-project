'use client'

import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoginForm from './LoginForm'

export default function LoginPage() {
   return (
      <div className="min-h-screen">
         <Header />
         <Suspense
            fallback={
               <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               </div>
            }
         >
            <LoginForm />
         </Suspense>
         <Footer />
      </div>
   )
}
