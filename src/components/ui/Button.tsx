import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
   size?: 'sm' | 'md' | 'lg'
   children: ReactNode
   href?: string
   fullWidth?: boolean
}

export default function Button({ variant = 'primary', size = 'md', children, href, fullWidth = false, className = '', ...props }: ButtonProps) {
   const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

   const variants = {
      primary: 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-500',
      secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
   }

   const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
   }

   const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim()

   if (href) {
      // 홈페이지로 이동할 때 강제 새로고침
      if (href === '/') {
         return (
            <button 
               className={classes} 
               onClick={() => window.location.href = '/'}
               {...props}
            >
               {children}
            </button>
         )
      }
      
      return (
         <Link href={href} className={classes}>
            {children}
         </Link>
      )
   }

   return (
      <button className={classes} {...props}>
         {children}
      </button>
   )
}
