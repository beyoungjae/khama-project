'use client'

import { useState } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
   src: string
   alt: string
   width: number
   height: number
   fallbackSrc?: string
   className?: string
   priority?: boolean
   fill?: boolean
   sizes?: string
   quality?: number
}

export default function OptimizedImage({ src, alt, width, height, fallbackSrc, className = '', priority = false, fill = false, sizes, quality = 75 }: OptimizedImageProps) {
   const [imgSrc, setImgSrc] = useState(src)
   const [hasError, setHasError] = useState(false)

   const handleError = () => {
      if (fallbackSrc && !hasError) {
         setImgSrc(fallbackSrc)
         setHasError(true)
      }
   }

   const imageProps = {
      src: imgSrc,
      alt,
      className,
      priority,
      quality,
      onError: handleError,
      ...(fill ? { fill: true, sizes } : { width, height }),
   }

   return <Image {...imageProps} />
}
