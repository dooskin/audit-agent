'use client';

import { Clock, Users, Wrench } from 'lucide-react';

const stats = [
  {
    icon: Clock,
    number: "1,000+",
    text: "hours wasted per year on audit prep busywork",
    highlight: "hours wasted"
  },
  {
    icon: Users,
    number: "66%",
    text: "of teams spend 3+ months on SOC 2 prep alone",
    highlight: "3+ months"
  },
  {
    icon: Wrench,
    number: "92%",
    text: "juggle 3+ different tools just to collect evidence",
    highlight: "3+ tools"
  }
];

export default function ProblemStats() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
            Yes, audits suck. <span className="text-mint">Let's fix it.</span>
          </h2>
          <p className="text-xl text-slate-400">Stop screenshot roulette. Here's what's really happening:</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover-lift hover:border-mint/30 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-mint/10 rounded-xl">
                    <Icon className="w-8 h-8 text-mint" />
                  </div>
                </div>
                
                <div className="text-4xl md:text-5xl font-mono font-bold text-mint mb-4">
                  {stat.number}
                </div>
                
                <p className="text-lg text-slate-300 leading-relaxed">
                  {stat.text.split(stat.highlight).map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && <span className="text-red-400 font-semibold">{stat.highlight}</span>}
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}