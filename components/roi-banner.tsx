'use client';

import { Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ROIBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-mint/10 to-mint/5 border-y border-mint/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-mint/20 rounded-xl">
              <Calculator className="w-8 h-8 text-mint" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4">
            ROI Calculator
          </h2>
          
          <div className="bg-slate-800/50 rounded-2xl p-8 max-w-4xl mx-auto border border-slate-700/50">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-mono font-bold text-mint mb-2">1,500</div>
                <div className="text-slate-300">Staff‑hours saved</div>
              </div>
              <div className="flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-mint mx-2" />
              </div>
              <div>
                <div className="text-3xl font-mono font-bold text-mint mb-2">$75K</div>
                <div className="text-slate-300">Back in your pocket</div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-lg text-slate-300 mb-6">
                <span className="font-semibold text-white">Typical customer:</span> 1,500 staff‑hours saved → 
                <span className="text-mint font-bold"> $75K back in your pocket before year‑end.</span>
              </p>
              
              <Button 
                size="lg" 
                className="bg-mint hover:bg-mint/90 text-slate-900 font-semibold px-8 py-3"
                onClick={() => window.open('https://calendly.com/auditcopilot/30min', '_blank')}
              >
                Calculate Your Savings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}