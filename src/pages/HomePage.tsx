import { AboutSection } from '../components/AboutSection';
import { HowToUseSection } from '../components/HowToUseSection';
import { ContactSection } from '../components/ContactSection';
import { FooterSection } from '../components/FooterSection';
import { GemGallerySection } from '../components/GemGallerySection';
import { HeroSection } from '../components/HeroSection';
import { Navbar } from '../components/Navbar';
import { ServicesSection } from '../components/ServicesSection';

export function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <GemGallerySection />
      <HowToUseSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}

