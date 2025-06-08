import HeroSection from '@/components/hero-section';
import ProblemStats from '@/components/problem-stats';
import HowItWorks from '@/components/how-it-works';
import ROIBanner from '@/components/roi-banner';
import PricingTeaser from '@/components/pricing-teaser';
import SecurityCompliance from '@/components/security-compliance';
import SocialProof from '@/components/social-proof';
import CTAStrip from '@/components/cta-strip';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <HeroSection />
      <ProblemStats />
      <HowItWorks />
      <ROIBanner />
      <PricingTeaser />
      <SecurityCompliance />
      <SocialProof />
      <CTAStrip />
      <Footer />
    </main>
  );
}