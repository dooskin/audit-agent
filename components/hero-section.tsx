'use client';

import { Bot, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Animated background */}
      <div className="absolute inset-0 terminal-bg opacity-10"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in-up">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 glow-mint">
              <Bot className="w-12 h-12 text-mint" />
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold tracking-tight">
            Kill the grunt work
            <br />
            <span className="text-mint">in IT audits.</span>
          </h1>
          
          {/* Sub-tagline */}
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
            AI‑powered evidence bots + narrative generation + hash‑linked audit trail.
            <br />
            <span className="text-mint font-semibold">50% faster prep. 10% lower external fees.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up animate-delay-200">
            <Button 
              size="lg" 
              className="bg-mint hover:bg-mint/90 text-slate-900 font-semibold px-8 py-4 text-lg hover-lift group"
              onClick={() => window.open('https://calendly.com/auditcopilot/30min', '_blank')}
            >
              Book a Demo
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-mint text-mint hover:bg-mint/10 px-8 py-4 text-lg hover-lift group"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch 90‑sec Video
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full p-1">
              <div className="w-1 h-3 bg-mint rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}