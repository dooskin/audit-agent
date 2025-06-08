'use client';

import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTAStrip() {
  return (
    <section className="py-16 bg-gradient-to-r from-mint/20 to-mint/10 border-y border-mint/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-mint/20 rounded-xl">
            <Zap className="w-8 h-8 text-mint" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
          Ready to vaporize audit busywork?
        </h2>
        
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Let's talk. 30 minutes to see if AuditCopilot can save your team months of screenshot roulette.
        </p>
        
        <Button 
          size="lg" 
          className="bg-mint hover:bg-mint/90 text-slate-900 font-semibold px-8 py-4 text-lg hover-lift group"
          onClick={() => window.open('https://calendly.com/auditcopilot/30min', '_blank')}
        >
          Book Your Demo
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}