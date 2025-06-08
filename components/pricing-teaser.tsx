'use client';

import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pricingTiers = [
  {
    name: "Growth",
    price: "$36K",
    period: "/year",
    description: "Perfect for teams just starting their audit automation journey",
    features: [
      "Up to 5 evidence sources",
      "Basic narrative generation",
      "Standard audit trail",
      "Email support"
    ],
    cta: "Book a Call",
    popular: false
  },
  {
    name: "Scale",
    price: "$60K",
    period: "/year",
    description: "For established teams ready to eliminate audit busywork",
    features: [
      "Up to 15 evidence sources",
      "Advanced narrative generation",
      "Premium audit trail + hashing",
      "Priority support",
      "Custom integrations"
    ],
    cta: "Book a Call",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Contact us",
    period: "",
    description: "Custom solutions for complex audit environments",
    features: [
      "Unlimited evidence sources",
      "White-label deployment",
      "Custom AI model training",
      "Dedicated success manager",
      "24/7 premium support"
    ],
    cta: "Book a Call",
    popular: false
  }
];

export default function PricingTeaser() {
  return (
    <section className="py-20 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-6">
            Simple pricing, <span className="text-mint">serious savings</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Choose the plan that matches your audit complexity. All plans include full platform access.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover-lift ${
                tier.popular 
                  ? 'border-mint bg-mint/5 scale-105' 
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-mint/30'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-mint text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-mono font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-mono font-bold text-mint">{tier.price}</span>
                  <span className="text-slate-400">{tier.period}</span>
                </div>
                <p className="text-slate-300 text-sm">{tier.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-mint mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  tier.popular 
                    ? 'bg-mint hover:bg-mint/90 text-slate-900' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                } font-semibold py-3 group`}
                onClick={() => window.open('https://calendly.com/auditcopilot/30min', '_blank')}
              >
                {tier.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}