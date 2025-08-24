import { ReactNode } from 'react'

interface BadgeProps {
   children: ReactNode
   variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
   size?: 'sm' | 'md'
   className?: string
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
   const variants = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-emerald-100 text-emerald-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
   }

   const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
   }

   const classes = `
    inline-flex items-center font-medium rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()

   return <span className={classes}>{children}</span>
}
