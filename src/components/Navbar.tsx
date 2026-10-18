import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenVoice: () => void;
  onOpenGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResume,
  onOpenVoice,
  onOpenGame,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'LeetCode', href: '#dsa' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#credentials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#0a0a0c]/90 backdrop-blur-xl border-white/10 shadow-2xl py-3.5'
          : 'bg-[#0a0a0c]/60 backdrop-blur-md border-white/5 py-4'
      }`}
    >
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3">
        {/* Brand Wordmark */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2.5 sm:gap-3 group shrink min-w-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] group-hover:scale-125 transition-transform shadow-[0_0_12px_#3b82f6] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-[#adc6ff] transition-colors tracking-tight truncate">
              Anuj Tiwari
            </span>
            <span className="font-sans text-[11px] sm:text-[12px] text-zinc-400 font-normal truncate">
              Software Developer<span className="hidden sm:inline"> · CSE (AI &amp; ML)</span>
            </span>
          </div>
        </a>

        {/* Center Dynamic Telemetry (Desktop) */}
        <div className="hidden xl:flex items-center gap-3.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 font-sans text-[13px] text-zinc-400 backdrop-blur-md">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-200 font-medium">Open to internships</span>
          </span>
          <span className="text-zinc-600">·</span>
          <span>Bhopal, MP</span>
          <span className="text-zinc-600">·</span>
          <span className="text-[#adc6ff] font-medium">B.Tech 2024–2028</span>
        </div>

        {/* Navigation Links & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 font-sans text-[14px] sm:text-[15px] font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => sound.playClick()}
                className="text-zinc-400 hover:text-white transition-colors tracking-normal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Gemini Live Voice Button (Visible on md+, accessible via drawer on mobile) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenVoice();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/35 text-[#adc6ff] font-sans text-xs font-medium transition-all shadow-sm"
            title="Talk with Anuj's AI Twin via Gemini Live API"
          >
            <span className="material-symbols-outlined text-[15px] text-[#38bdf8] animate-pulse">
              mic
            </span>
            <span className="hidden lg:inline">Voice Assistant</span>
          </button>

          {/* Play 3D Game Button (Visible on md+, accessible via drawer on mobile) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGame();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffb690]/10 hover:bg-[#ffb690]/20 border border-[#ffb690]/30 text-[#ffb690] font-sans text-xs font-medium transition-all"
            title="Launch 3D Cyber Runner Game"
          >
            <span className="material-symbols-outlined text-[15px]">sports_esports</span>
            <span className="hidden lg:inline">Play 3D Game</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
              soundEnabled
                ? 'bg-[#3b82f6]/10 border-[#3b82f6]/40 text-[#adc6ff]'
                : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle procedural UI audio feedback"
          >
            <span className="material-symbols-outlined text-[15px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Connect Action */}
          <a
            href="#contact"
            onClick={() => sound.playClick()}
            className="group px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white text-[#0a0a0c] font-sans text-xs sm:text-[14px] font-semibold hover:bg-[#4d8eff] hover:text-white transition-all duration-300 flex items-center gap-1 sm:gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
          >
            <span>Let's Connect</span>
            <span className="material-symbols-outlined text-[14px] sm:text-[15px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white shrink-0"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0c]/98 border-b border-white/10 px-4 sm:px-6 py-5 space-y-4 backdrop-blur-2xl font-sans max-w-full overflow-hidden">
          <div className="flex flex-col gap-2.5 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 text-zinc-300 hover:text-white border-b border-white/5 flex items-center justify-between font-medium"
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-xs text-zinc-500">chevron_right</span>
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5 text-xs">
            <button
              onClick={() => {
                onOpenVoice();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/40 text-[#adc6ff] flex items-center justify-between font-medium"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mic</span>
                <span>Gemini Live Voice Chat</span>
              </span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>

            <button
              onClick={() => {
                onOpenGame();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#ffb690]/10 border border-[#ffb690]/30 text-[#ffb690] flex items-center justify-between font-medium"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">sports_esports</span>
                <span>Play 3D Cyber Runner Game</span>
              </span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  toggleSound();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-zinc-400 font-medium"
              >
                <span className="material-symbols-outlined text-sm">
                  {soundEnabled ? 'volume_up' : 'volume_off'}
                </span>
                <span>Audio: {soundEnabled ? 'Enabled' : 'Disabled'}</span>
              </button>
              <button
                onClick={() => {
                  onOpenResume();
                  setMobileMenuOpen(false);
                }}
                className="text-[#adc6ff] font-medium underline underline-offset-4"
              >
                View Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
