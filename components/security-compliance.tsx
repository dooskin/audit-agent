'use client';

import { Shield, Lock, Download, CloudOff } from 'lucide-react';

const features = [
  {
    icon: CloudOff,
    title: "Private‑cloud deploy",
    description: "Your data never leaves your infrastructure"
  },
  {
    icon: Lock,
    title: "Zero‑retention policy",
    description: "We process, not store. Your evidence stays yours."
  },
  {
    icon: Shield,
    title: "SOC 2 in progress",
    description: "Type II certification underway for Q2 2024"
  },
  {
    icon: Download,
    title: "Full evidence export",
    description: "Take your data anywhere, anytime. No lock‑in."
  }
];

export default function SecurityCompliance() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
            Security & <span className="text-mint">Compliance</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Built for paranoid security teams. Because if you're not paranoid about audit data, you should be.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-mint/30 transition-all duration-300 hover-lift"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-mint/10 rounded-lg">
                    <Icon className="w-6 h-6 text-mint" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-400">
            Questions about security? <a href="mailto:security@auditcopilot.com" className="text-mint hover:underline">security@auditcopilot.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}