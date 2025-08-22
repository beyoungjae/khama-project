import { ReactNode } from 'react'

interface HeroBackgroundProps {
   backgroundImage?: string
   fallbackGradient: string
   overlay?: boolean
   overlayOpacity?: number
   children: ReactNode
   className?: string
}

export default function HeroBackground({ backgroundImage, fallbackGradient, overlay = true, overlayOpacity = 20, children, className = '' }: HeroBackgroundProps) {
   const backgroundStyle = backgroundImage
      ? {
           backgroundImage: `url(${backgroundImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
        }
      : {}

   return (
      <section className={`relative ${backgroundImage ? '' : fallbackGradient} ${className}`} style={backgroundStyle}>
         {overlay && <div className={`absolute inset-0 bg-black/${overlayOpacity}`} />}
         <div className="relative">{children}</div>
      </section>
   )
}
