import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, onNotify }) => {
  const [pdfAvailable, setPdfAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/Anuj_Tiwari_Resume.pdf', { method: 'HEAD' })
        .then((res) => {
          setPdfAvailable(res.ok);
        })
        .catch(() => {
          setPdfAvailable(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadSuccess = () => {
    sound.playSuccess();
    onNotify('Initiating download: Anuj_Tiwari_Resume.pdf');
  };

  const handleEmailRequest = () => {
    sound.playClick();
    window.location.href = 'mailto:anujtiwari2403@gmail.com?subject=Resume%20Request%20-%20Anuj%20Tiwari';
    onNotify('Opening mail client for direct resume transmission');
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#111116] border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#adc6ff]">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Anuj Tiwari — Curriculum Vitae</h3>
              <p className="text-xs text-[#adc6ff] font-medium">B.Tech CSE (AI &amp; ML) · Batch 2024–2028</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content Briefing */}
        <div className="space-y-4 text-sm text-zinc-300">
          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/10 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#ffb690] font-semibold block">
              Candidate overview
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              Undergraduate engineer at Technocrats Institute of Technology &amp; Science (RGPV), pursuing Bachelor of Technology in Computer Science &amp; Engineering (Artificial Intelligence &amp; Machine Learning). Actively developing in Java, OOP, Data Structures &amp; Algorithms, and practical web stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-[11px] text-zinc-500 font-medium block mb-1">Core competencies</span>
              <span className="text-white font-medium">Java 21, Python, C, C++, OOP, DSA</span>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-[11px] text-zinc-500 font-medium block mb-1">Project highlights</span>
              <span className="text-white font-medium">BankFlow, Smart Placement Tracker, EVM</span>
            </div>
          </div>

          {/* PDF Status / Placeholder Box */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1.5 text-zinc-400">
            <div className="flex items-center justify-between text-white font-medium">
              <span>PDF asset status:</span>
              <span className={pdfAvailable ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {pdfAvailable ? 'Ready for instant download' : 'External PDF placement placeholder'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-normal">
              {pdfAvailable
                ? 'A verified PDF containing academic details, coursework, projects, and certifications is ready in public assets.'
                : 'Place your real resume PDF at /public/Anuj_Tiwari_Resume.pdf to enable direct static downloading.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10 text-xs sm:text-sm font-medium">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
          >
            Close
          </button>

          {pdfAvailable ? (
            <a
              href="/Anuj_Tiwari_Resume.pdf"
              download="Anuj_Tiwari_Resume.pdf"
              onClick={handleDownloadSuccess}
              className="px-6 py-2.5 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download resume (PDF)</span>
            </a>
          ) : (
            <button
              onClick={handleEmailRequest}
              className="px-6 py-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold hover:bg-amber-500/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Request resume via email</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
