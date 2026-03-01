import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { StreamingShowcase } from '@/components/sections/StreamingShowcase';
import { BarMatchShowcase } from '@/components/sections/BarMatchShowcase';
import { FlowBoardShowcase } from '@/components/sections/FlowBoardShowcase';
import { CtaSection } from '@/components/sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects />
      <StreamingShowcase />
      <BarMatchShowcase />
      <FlowBoardShowcase />
      <CtaSection />
    </>
  );
}
