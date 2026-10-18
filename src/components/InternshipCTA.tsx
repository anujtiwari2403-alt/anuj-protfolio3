import React from 'react';
import { sound } from '../utils/sound';

export const InternshipCTA: React.FC = () => {
  const roles = [
    'Software Development Intern',
    'Java Developer Intern',
    'Backend Development Intern',
    'Web Development Intern',
    'AI/ML Intern',
  ];

  return (
    <section className="py-24 md:py-36 border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12">
        <div className="p-8 sm:p-14 lg:p-20 rounded-3xl bg-gradient-to-br from-[#111116] via-[#15151c] to-[#0a0a0c] border border-white/15 relative overflow-hidden shadow-2xl font-sans">
          {/* Ambient Lighting Orb */}
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#3b82f6]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-4xl space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffb690]/10 border border-[#ffb690]/20 text-[#ffb690] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb690] animate-pulse" />
              <span>Hiring availability</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.1]">
              Ready to learn.<br />Ready to build.
            </h2>

            <p className="font-sans text-[17px] sm:text-[18px] text-zinc-300 leading-[1.75] font-normal max-w-2xl">
              "I am looking for opportunities where I can apply my programming knowledge, contribute to real-world software projects, learn from experienced developers, and strengthen my software engineering skills."
            </p>

            {/* Preferred Roles */}
            <div className="space-y-3 pt-2">
              <span className="text-xs sm:text-[13px] text-zinc-400 font-medium block">
                Target internship positions:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {roles.map((r, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[#adc6ff] text-xs sm:text-[13px] font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Arrangements */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-[13px] text-zinc-400 font-normal">
              <span className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">domain</span>
                <span>On-site (Bhopal, MP)</span>
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[#ffb690] text-[18px]">wifi</span>
                <span>Remote</span>
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[#a4c9ff] text-[18px]">sync_alt</span>
                <span>Hybrid</span>
              </span>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                onClick={() => sound.playClick()}
                className="px-8 py-4 rounded-full bg-white text-[#0a0a0c] hover:bg-[#4d8eff] hover:text-white font-sans text-sm font-semibold tracking-normal transition-all duration-300 inline-flex items-center gap-2.5 shadow-[0_0_30px_rgba(255,255,255,0.18)]"
              >
                <span>Get in touch for opportunities</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
