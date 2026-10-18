import React from 'react';
import { TiltCard } from './TiltCard';
import { sound } from '../utils/sound';

interface EducationCertificationsProps {
  onNotify: (msg: string) => void;
}

export const EducationCertifications: React.FC<EducationCertificationsProps> = ({ onNotify }) => {
  const handleCopyCredential = (id: string, name: string) => {
    sound.playClick();
    navigator.clipboard.writeText(id).then(() => {
      sound.playSuccess();
      onNotify(`Credential ID copied: ${id}`);
    });
  };

  const coursework = [
    'Java',
    'OOP Concepts',
    'Data Structures',
    'Algorithms',
    'Git & GitHub',
    'Python',
    'Web Fundamentals',
  ];

  return (
    <section id="education" className="py-24 md:py-36 border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12 space-y-24">
        {/* ==================== 05 / EDUCATION ==================== */}
        <div>
          <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <span className="font-sans font-light text-3xl md:text-4xl text-white/20 tracking-tight">
                05
              </span>
              <div>
                <span className="text-[13px] text-[#adc6ff] font-medium tracking-normal block">
                  05 · Academic foundation
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mt-1">
                  Academic foundation.
                </h2>
              </div>
            </div>
            <span className="text-[13px] text-zinc-400 hidden sm:inline-block font-sans">
              RGPV State Technological University
            </span>
          </div>

          <TiltCard className="p-8 sm:p-12 rounded-3xl bg-[#111116] border border-white/10 shadow-2xl font-sans">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#adc6ff] text-xs font-medium">
                  <span>Undergraduate degree · B.Tech</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-white tracking-tight leading-tight">
                  Bachelor of Technology — Computer Science &amp; Engineering (Artificial Intelligence &amp; Machine Learning)
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-zinc-300 font-sans text-base sm:text-lg pt-1">
                  <span className="font-semibold text-white">Technocrats Institute of Technology &amp; Science</span>
                  <span className="text-zinc-600">·</span>
                  <span>Bhopal, Madhya Pradesh</span>
                </div>

                <p className="font-sans text-sm text-zinc-400 font-normal">
                  Affiliated with Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV).
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 text-left lg:text-right shrink-0 space-y-1">
                <span className="text-[12px] text-zinc-400 font-normal block">
                  Duration
                </span>
                <div className="font-semibold text-xl sm:text-2xl text-[#ffb690] tabular-nums">
                  Sept 2024 – July 2028
                </div>
                <span className="text-xs text-[#adc6ff] block font-medium">
                  4-Year Full-Time Program
                </span>
              </div>
            </div>

            {/* Relevant Learning Areas */}
            <div className="pt-8 space-y-4">
              <span className="text-xs sm:text-[13px] text-zinc-400 font-medium block">
                Relevant learning areas &amp; foundations
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {coursework.map((subj, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#0a0a0c] border border-white/5 text-center text-xs sm:text-[13px] font-medium text-zinc-200"
                  >
                    {subj}
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* ==================== 06 / CERTIFICATIONS & LEARNING ==================== */}
        <div id="credentials">
          <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <span className="font-sans font-light text-3xl md:text-4xl text-white/20 tracking-tight">
                06
              </span>
              <div>
                <span className="text-[13px] text-[#adc6ff] font-medium tracking-normal block">
                  06 · Certifications &amp; credentials
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mt-1">
                  Verified credentials.
                </h2>
              </div>
            </div>
            <span className="text-[13px] text-zinc-400 hidden sm:inline-block font-sans">
              Verified certifications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            {/* Certification 01 */}
            <TiltCard className="p-8 sm:p-10 rounded-3xl bg-[#111116] border border-white/10 flex flex-col justify-between space-y-6 hover:border-[#3b82f6]/40 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs sm:text-[13px]">
                  <span className="text-[#adc6ff] font-medium">Certification 01</span>
                  <span className="text-zinc-400">September 2025</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                  Internship in C, C++ &amp; Campus Competitive Programming
                </h3>

                <div className="flex items-center gap-2 text-zinc-300 font-sans text-sm">
                  <span className="material-symbols-outlined text-[#ffb690] text-[18px]">business</span>
                  <span>Ramraj Technology Solutions Pvt. Ltd.</span>
                </div>

                {/* Credential ID Box with One-Click Copy */}
                <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/10 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-zinc-400 block text-xs font-sans">Credential ID:</span>
                    <span className="text-[#adc6ff] font-medium font-mono">
                      RTSPL/PR/2025/0151693
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyCredential('RTSPL/PR/2025/0151693', 'Ramraj Internship')
                    }
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Copy Credential ID"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs sm:text-[13px]">
                <span className="px-3 py-1 rounded bg-white/[0.04] text-[#adc6ff] font-medium">
                  C
                </span>
                <span className="px-3 py-1 rounded bg-white/[0.04] text-[#adc6ff] font-medium">
                  C++
                </span>
                <span className="px-3 py-1 rounded bg-white/[0.04] text-[#ffb690] font-medium">
                  Competitive Programming
                </span>
              </div>
            </TiltCard>

            {/* Certification 02 */}
            <TiltCard className="p-8 sm:p-10 rounded-3xl bg-[#111116] border border-white/10 flex flex-col justify-between space-y-6 hover:border-[#ffb690]/40 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs sm:text-[13px]">
                  <span className="text-[#ffb690] font-medium">Certification 02</span>
                  <span className="text-zinc-400">September 2026</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                  Certificate Program in Prompt Engineering and ChatGPT
                </h3>

                <div className="flex items-center gap-2 text-zinc-300 font-sans text-sm">
                  <span className="material-symbols-outlined text-[#ffb690] text-[18px]">verified_user</span>
                  <span>IT-ITeS Sector Skills Council, NASSCOM</span>
                </div>

                {/* Credential ID Box with One-Click Copy */}
                <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/10 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-zinc-400 block text-xs font-sans">Credential ID:</span>
                    <span className="text-[#ffb690] font-medium font-mono">
                      FSP/2026/9/10404563
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyCredential('FSP/2026/9/10404563', 'NASSCOM Prompt Engineering')
                    }
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Copy Credential ID"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs sm:text-[13px]">
                <span className="px-3 py-1 rounded bg-white/[0.04] text-[#ffb690] font-medium">
                  Prompt Engineering
                </span>
                <span className="px-3 py-1 rounded bg-white/[0.04] text-[#a4c9ff] font-medium">
                  Generative AI
                </span>
                <span className="px-3 py-1 rounded bg-white/[0.04] text-zinc-300 font-medium">
                  ChatGPT
                </span>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
