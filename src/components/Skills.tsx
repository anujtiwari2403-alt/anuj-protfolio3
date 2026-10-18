import React, { useState } from 'react';
import { TiltCard } from './TiltCard';
import { sound } from '../utils/sound';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const skillGroups = [
    {
      id: 'languages',
      category: 'Languages',
      title: 'Programming languages',
      icon: 'terminal',
      desc: 'Core foundations for systems, object-oriented architecture, and algorithmic implementation.',
      skills: [
        { name: 'Java', badge: 'Primary', color: 'text-[#adc6ff]' },
        { name: 'Python', badge: 'Scripting', color: 'text-[#adc6ff]' },
        { name: 'C', badge: 'Low-Level', color: 'text-zinc-300' },
        { name: 'C++', badge: 'Competitive', color: 'text-zinc-300' },
      ],
    },
    {
      id: 'fundamentals',
      category: 'Foundations',
      title: 'CS fundamentals',
      icon: 'account_tree',
      desc: 'Architectural principles that guide maintainable, scalable, and memory-efficient software.',
      skills: [
        { name: 'Object-Oriented Programming', badge: 'Core', color: 'text-[#ffb690]' },
        { name: 'Data Structures', badge: 'Essential', color: 'text-zinc-300' },
        { name: 'Algorithms', badge: 'Analysis', color: 'text-zinc-300' },
        { name: 'Problem Solving', badge: 'LeetCode', color: 'text-zinc-300' },
      ],
    },
    {
      id: 'web',
      category: 'Client-side',
      title: 'Web development',
      icon: 'web',
      desc: 'Building intuitive user interfaces, responsive designs, and interactive web application frontends.',
      skills: [
        { name: 'HTML', badge: 'Semantic', color: 'text-zinc-300' },
        { name: 'CSS', badge: 'Modern Flex & Grid', color: 'text-zinc-300' },
        { name: 'JavaScript', badge: 'ES6+ Logic', color: 'text-[#adc6ff]' },
      ],
    },
    {
      id: 'tools',
      category: 'Environment',
      title: 'Developer tools',
      icon: 'construction',
      desc: 'Version control pipelines and collaboration workflows for code tracking and open-source hygiene.',
      skills: [
        { name: 'Git', badge: 'Version Control', color: 'text-[#adc6ff]' },
        { name: 'GitHub', badge: 'Open Source', color: 'text-zinc-300' },
        { name: 'VS Code', badge: 'IDE', color: 'text-zinc-400' },
        { name: 'IntelliJ IDEA', badge: 'Java IDE', color: 'text-zinc-400' },
      ],
    },
    {
      id: 'interest',
      category: 'Focus areas',
      title: 'Areas of active interest',
      icon: 'neurology',
      desc: 'Specialized engineering domains where I apply modern computational techniques, explore deep learning models, and architect resilient software solutions.',
      isWide: true,
      skills: [
        { name: 'Software Development', badge: 'Primary Focus', color: 'text-[#adc6ff]' },
        { name: 'Artificial Intelligence', badge: 'Academic Path', color: 'text-[#a4c9ff]' },
        { name: 'Machine Learning', badge: 'Foundations', color: 'text-[#a4c9ff]' },
        { name: 'AI Integration', badge: 'APIs & Agents', color: 'text-[#ffb690]' },
        { name: 'Backend Development', badge: 'Systems', color: 'text-zinc-300' },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 md:py-36 border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="font-sans font-light text-3xl md:text-4xl text-white/20 tracking-tight">
              03
            </span>
            <div>
              <span className="text-[13px] text-[#adc6ff] font-medium tracking-normal block">
                03 · Technical skills
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mt-1">
                Tools &amp; technologies.
              </h2>
            </div>
          </div>
          <span className="text-[13px] text-zinc-400 hidden sm:inline-block font-sans">
            Core capabilities
          </span>
        </div>

        <p className="font-sans text-[16px] sm:text-[18px] text-zinc-300 max-w-2xl leading-[1.75] mb-12 font-normal">
          An honest, transparent view of the technologies, foundations, and engineering tools I study and use daily in my projects.
        </p>

        {/* Technical Capabilities Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => {
            const isSelected = activeCategory === group.id;
            return (
              <TiltCard
                key={group.id}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(isSelected ? null : group.id);
                }}
                className={`p-8 rounded-2xl bg-[#111116] border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  group.isWide ? 'lg:col-span-2' : ''
                } ${
                  isSelected
                    ? 'border-[#3b82f6] shadow-[0_0_25px_rgba(59,130,246,0.18)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#adc6ff]">
                      <span className="material-symbols-outlined text-xl">{group.icon}</span>
                    </span>
                    <span className="text-xs sm:text-[13px] text-zinc-400 font-normal">
                      {group.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white tracking-tight">{group.title}</h3>
                  <p className="font-sans text-sm sm:text-[15px] text-zinc-300 leading-[1.65] font-normal">{group.desc}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-6">
                  {group.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-xs sm:text-[13px] flex items-center gap-2 transition-colors font-sans"
                    >
                      <span className={`font-medium ${s.color}`}>{s.name}</span>
                      <span className="text-xs text-zinc-400 font-normal">· {s.badge}</span>
                    </span>
                  ))}
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
