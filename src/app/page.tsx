import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { StreamingShowcase } from '@/components/sections/StreamingShowcase';
import { BarMatchShowcase } from '@/components/sections/BarMatchShowcase';
import { CtaSection } from '@/components/sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects />
      <StreamingShowcase />
      <BarMatchShowcase />
      <CtaSection />
    </>
  );
}
