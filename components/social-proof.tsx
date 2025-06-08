'use client';

import { Star, Quote } from 'lucide-react';

const logos = [
  { name: "Design Partner #1", width: "w-32" },
  { name: "Partner CPA Firm", width: "w-36" },
  { name: "Tech Scale‑up #1", width: "w-28" },
  { name: "Financial Services Co", width: "w-40" },
  { name: "Healthcare Org", width: "w-32" },
];

const testimonials = [
  {
    quote: "Cut audit prep in half. Our team went from 3 months of chaos to 6 weeks of structured execution.",
    author: "Sarah Chen",
    title: "IT Audit Director",
    company: "Scale‑up Partner #1"
  },
  {
    quote: "Finally, audit evidence that doesn't make me want to quit my job. The hash‑linked trail is chef's kiss.",
    author: "Mike Rodriguez",
    title: "Compliance Lead",
    company: "Design Partner #2"
  }
];

export default function SocialProof() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partner Logos */}
        <div className="text-center mb-16">
          <h3 className="text-lg font-semibold text-slate-400 mb-8">
            Trusted by forward‑thinking audit teams
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {logos.map((logo, index) => (
              <div key={index} className={`${logo.width} h-12 bg-slate-700/30 rounded-lg flex items-center justify-center border border-slate-600/30`}>
                <span className="text-xs text-slate-500 font-mono">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-mint/30 transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-mint fill-current" />
                ))}
              </div>
              
              <Quote className="w-6 h-6 text-mint mb-4" />
              
              <blockquote className="text-lg text-slate-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="border-t border-slate-700 pt-4">
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-sm text-slate-400">{testimonial.title}</div>
                <div className="text-sm text-mint">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}