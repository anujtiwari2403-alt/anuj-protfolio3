import React from 'react';
import { sound } from '../utils/sound';

export const Footer: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#050507] border-t border-white/10 py-16 relative z-10 text-xs font-sans">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Copyright */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold tracking-tight text-sm">
            <span>Anuj Tiwari</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#adc6ff] font-normal">CSE (AI &amp; ML) Student</span>
          </div>
          <p className="text-zinc-500 font-sans text-xs font-normal">
            © 2025 Anuj Tiwari. Designed with editorial clarity, precision engineering, and responsive craft.
          </p>
        </div>

        {/* Quick External Links */}
        <div className="flex items-center gap-6 text-zinc-400 font-medium text-xs">
          <a
            href="https://github.com/anujtiwari2403-alt"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anuj-tiwari-4905b6335/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:anujtiwari2403@gmail.com"
            onClick={() => sound.playClick()}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/5 transition-all text-xs font-medium"
        >
          <span>Back to top</span>
          <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
        </button>
      </div>
    </footer>
  );
};
