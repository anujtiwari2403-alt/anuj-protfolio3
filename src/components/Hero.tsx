import React, { useRef } from 'react';
import { ThreeHeroCanvas } from './ThreeHeroCanvas';
import { sound } from '../utils/sound';

interface HeroProps {
  onOpenResume: () => void;
  onOpenVoice: () => void;
  onOpenGame: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onOpenVoice, onOpenGame }) => {
  const photoCardRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);

  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = photoCardRef.current;
    const wrap = photoWrapRef.current;
    if (!card || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;

    card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handlePhotoMouseLeave = () => {
    const card = photoCardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-between border-b border-white/10 glow-divider overflow-hidden"
    >
      {/* 3D Geometric Canvas */}
      <ThreeHeroCanvas />

      {/* Subtle Background Monogram Typography */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-full select-none pointer-events-none text-center overflow-hidden z-0 opacity-[0.04]">
        <h1 className="font-sans font-bold text-[18vw] leading-none tracking-tighter text-stroke-subtle">
          Anuj Tiwari
        </h1>
      </div>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-10 items-center relative z-10 my-auto">
        {/* Left Editorial Narrative Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-7 min-w-0">
          {/* Status Badges in Sentence Case */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-[13px] text-zinc-300 font-medium backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              <span>Hello, I'm Anuj Tiwari</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffb690]/10 border border-[#ffb690]/25 text-xs sm:text-[13px] text-[#ffb690] font-medium backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb690]" />
              <span>Open to internship opportunities</span>
            </div>
          </div>

          {/* Editorial Headline Hierarchy (Scale 76–104px desktop) */}
          <div className="space-y-3 min-w-0">
            <div className="text-xs sm:text-[15px] text-[#adc6ff] font-medium tracking-normal flex flex-wrap items-center gap-2">
              <span>B.Tech CSE (AI &amp; ML) · Java &amp; Python Learner · Software Development</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[98px] font-bold text-white tracking-[-0.03em] leading-[1.08] break-words">
              Building digital<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#d4e4ff] to-white">
                experiences.
              </span>
            </h1>
          </div>

          {/* Lead Quote (17–19px, comfortable line height) */}
          <p className="text-[15px] sm:text-[18px] text-zinc-300 max-w-2xl font-normal leading-[1.75] border-l-2 border-[#adc6ff]/40 pl-3.5 sm:pl-4 py-1">
            "I am a computer science student focused on strengthening my programming fundamentals, mastering Data Structures and Algorithms, and building practical software projects. I am interested in software development, backend engineering, and AI integration."
          </p>

          {/* Action Launchpad & Feature Triggers */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2 font-sans text-xs sm:text-sm font-medium">
            <a
              href="#projects"
              onClick={() => sound.playClick()}
              className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white text-[#0a0a0c] hover:bg-[#adc6ff] hover:text-[#0a0a0c] font-semibold tracking-normal transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
            >
              <span>Explore projects</span>
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>

            <a
              href="#contact"
              onClick={() => sound.playClick()}
              className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white border border-white/10 tracking-normal transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
            >
              <span>Contact me</span>
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </a>

            <a
              href="/Anuj_Tiwari_Resume.pdf"
              download="Anuj_Tiwari_Resume.pdf"
              onClick={() => sound.playSuccess()}
              className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-[#adc6ff] border border-white/10 tracking-normal transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
              title="Download verified resume PDF"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Resume</span>
            </a>

            {/* Launch 3D Game CTA */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenGame();
              }}
              className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-[#ffb690]/15 hover:bg-[#ffb690]/25 text-[#ffb690] border border-[#ffb690]/35 tracking-normal transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              <span>Play 3D Game</span>
            </button>

            {/* Gemini Live Voice CTA */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenVoice();
              }}
              className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#adc6ff] border border-[#3b82f6]/35 tracking-normal transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-[18px] text-[#38bdf8] animate-pulse">
                mic
              </span>
              <span>Talk to AI Twin</span>
            </button>

            <div className="flex items-center gap-2 pl-0.5">
              <a
                href="https://github.com/anujtiwari2403-alt"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-semibold transition-all"
                title="GitHub"
              >
                GH
              </a>
              <a
                href="https://www.linkedin.com/in/anuj-tiwari-4905b6335/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-semibold transition-all"
                title="LinkedIn"
              >
                IN
              </a>
            </div>
          </div>

          {/* Telemetry Ticker Strip in Sentence Case */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-[13px] text-zinc-400 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Location:</span>
              <span className="text-zinc-300 font-medium">Bhopal, MP · Hybrid / Remote</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Institution:</span>
              <span className="text-zinc-300 font-medium">Technocrats Institute (RGPV) 2024–2028</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Focus:</span>
              <span className="text-[#ffb690] font-medium">Java 21 · OOP · DSA</span>
            </div>
          </div>
        </div>

        {/* Right 3D Perspective Photo Frame (5 cols) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-container">
          <div
            ref={photoWrapRef}
            onMouseMove={handlePhotoMouseMove}
            onMouseLeave={handlePhotoMouseLeave}
            className="relative w-full max-w-md preserve-3d px-1 sm:px-0"
          >
            {/* Radial Backlight */}
            <div className="absolute -inset-2 sm:-inset-6 bg-gradient-to-tr from-[#3b82f6]/25 via-[#adc6ff]/15 to-[#ffb690]/10 rounded-3xl blur-2xl sm:blur-3xl opacity-75 pointer-events-none" />

            {/* Spatial Floating Indicators */}
            <div
              className="absolute -top-3 -left-3 z-30 px-3.5 py-1.5 rounded-full bg-[#0a0a0c]/90 border border-[#adc6ff]/40 shadow-xl backdrop-blur-md text-[13px] font-medium text-[#adc6ff] hidden sm:flex items-center gap-2 pointer-events-none"
              style={{ transform: 'translateZ(30px)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]" />
              <span>Java 21 &amp; OOP Architecture</span>
            </div>

            <div
              className="absolute -bottom-3 -right-3 z-30 px-3.5 py-1.5 rounded-full bg-[#0a0a0c]/90 border border-[#ffb690]/40 shadow-xl backdrop-blur-md text-[13px] font-medium text-[#ffb690] hidden sm:flex items-center gap-2 pointer-events-none"
              style={{ transform: 'translateZ(35px)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb690]" />
              <span>LeetCode DSA Practice</span>
            </div>

            {/* Architectural Portrait Frame Container */}
            <div
              ref={photoCardRef}
              className="relative rounded-2xl bg-[#111116]/95 border border-white/15 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl overflow-hidden group tilt-card"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="card-glare" />

              {/* Technical Top Header Bar */}
              <div
                className="flex items-center justify-between pb-3 px-1 border-b border-white/5 text-xs sm:text-[13px] text-zinc-400"
                style={{ transform: 'translateZ(10px)' }}
              >
                <span className="flex items-center gap-2 text-zinc-300 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">Authentic engineer profile</span>
                </span>
                <span className="font-mono text-xs text-zinc-400 shrink-0">2024–2028</span>
              </div>

              {/* Bleed Portrait Image Container with Fallback Support */}
              <div
                className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black mt-3"
                style={{ transform: 'translateZ(20px)' }}
              >
                <img
                  src="/anuj-tiwari.png"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuChOAtHQ8yiWfXefen-KLpUWHQfWIeuYvgJ_EmfNhojgionFqt6HZTlO18PIg4nGCmvBtFZvcDnlDmIquK_MFwOa-txybJPeJut737qt0e0ApFGCwqNvG5n0n4e6IqE3obP8vSDQ78_c5D0HHTrXqrE1dhfqcK06TfaTpNHJb3FlIGWutvCQ-ulb2S0aPUTdi3qtUgNKOKVSg7dcsxekFFqhbk1EPnUW1sZJ6VB586ZTY0apd5I7XUEiThiGUxOumo0ZD0';
                  }}
                  alt="Anuj Tiwari — B.Tech Computer Science &amp; Engineering (AI &amp; ML)"
                  className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-75 pointer-events-none" />

                {/* Floating Coordinates Overlay */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[10px] sm:text-[11px] text-zinc-300 flex items-center gap-1.5 shadow-md">
                  <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                  <span>23.2599° N, 77.4126° E</span>
                </div>

                {/* Floating Bottom Dossier Pill */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 p-2.5 sm:p-3.5 rounded-xl bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-lg min-w-0">
                  <div className="min-w-0 pr-2">
                    <h3 className="font-semibold text-sm sm:text-base text-white truncate">Anuj Tiwari</h3>
                    <p className="text-xs sm:text-[13px] text-[#adc6ff] font-medium truncate">B.Tech CSE (AI &amp; ML) · RGPV</p>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <span className="text-zinc-400 block text-[10px] sm:text-[11px]">Enrollment</span>
                    <span className="text-[#ffb690] font-medium text-xs">2024 — 2028</span>
                  </div>
                </div>
              </div>

              {/* Technical Lower Telemetry Grid */}
              <div
                className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-3 pt-1 text-xs"
                style={{ transform: 'translateZ(15px)' }}
              >
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center min-w-0">
                  <span className="block text-[11px] sm:text-[12px] text-zinc-400 mb-0.5 truncate">Primary focus</span>
                  <span className="font-medium text-white text-xs sm:text-[13px] truncate block">Java &amp; OOP</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center min-w-0">
                  <span className="block text-[11px] sm:text-[12px] text-zinc-400 mb-0.5 truncate">Problem solving</span>
                  <span className="font-medium text-[#ffb690] text-xs sm:text-[13px] truncate block">LeetCode DSA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Continuous Bar in Sentence Case */}
      <div className="w-full mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-[1560px] mx-auto px-4 sm:px-6 md:px-12 text-xs sm:text-[13px] text-zinc-400 relative z-10 font-sans">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6] shrink-0" />
          <span>Available for Summer / Fall Internships</span>
        </span>
        <span className="hidden md:inline-block">Core stack: Java · Python · C · C++ · DSA · OOP · Web Fundamentals</span>
        <span className="text-zinc-400">Portfolio edition 2025</span>
      </div>
    </section>
  );
};
