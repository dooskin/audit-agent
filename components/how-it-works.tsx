'use client';

import { Bot, PenTool, Shield } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "Evidence‑Bot",
    description: "API agents with 30+ connectors automatically pull logs, configs, and screenshots. No more manual hunting.",
    details: ["AWS, Azure, GCP integrations", "SIEM & log aggregation", "Automated screenshots", "Real-time sync"]
  },
  {
    icon: PenTool,
    title: "Narrative‑Gen",
    description: "Private GPT‑4o writes audit narratives with RAG citations. Your auditors will think you hired an army.",
    details: ["Private model deployment", "RAG-powered responses", "Cited paragraphs", "Custom templates"]
  },
  {
    icon: Shield,
    title: "Audit‑Trail Vault",
    description: "SHA‑256 hashed evidence with PCAOB‑ready audit trails. Hash‑linked evidence or GTFO.",
    details: ["Cryptographic hashing", "PCAOB compliance", "Immutable records", "Full export capability"]
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-6">
            How <span className="text-mint">AuditCopilot</span> works
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Three pillars that transform audit prep from months of chaos into weeks of structured automation.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-mint/50 transition-all duration-500 hover-lift"
              >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-mint/10 rounded-xl group-hover:bg-mint/20 transition-colors duration-300">
                      <Icon className="w-10 h-10 text-mint group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-mono font-bold text-center mb-4 group-hover:text-mint transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 text-center mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Feature list */}
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-slate-400">
                        <div className="w-1.5 h-1.5 bg-mint rounded-full mr-3 flex-shrink-0"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}