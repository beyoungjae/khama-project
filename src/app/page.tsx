import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CertificationSection from '@/components/home/CertificationSection'
import EducationSection from '@/components/home/EducationSection'
import NewsSection from '@/components/home/NewsSection'
import GallerySection from '@/components/home/GallerySection'

export default function Home() {
   return (
      <div className="min-h-screen">
         <Header />
         <main>
            <HeroSection />
            <CertificationSection />
            <EducationSection />
            <NewsSection />
            <GallerySection />
         </main>
         <Footer />
      </div>
   )
}
