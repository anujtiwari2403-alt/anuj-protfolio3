import React, { useState } from 'react';
import { TiltCard } from './TiltCard';
import { sound } from '../utils/sound';

interface ContactProps {
  onNotify: (msg: string) => void;
  onOpenResume: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onNotify, onOpenResume }) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const email = 'anujtiwari2403@gmail.com';

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      sound.playSuccess();
      onNotify('anujtiwari2403@gmail.com copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSendCustomMail = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject || 'Inquiry / Opportunity for Anuj Tiwari'
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
    onNotify('Opening your default email client...');
  };

  return (
    <section id="contact" className="py-24 md:py-36 relative">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="font-sans font-bold text-3xl md:text-5xl text-white/15 tracking-tight">
              07
            </span>
            <div>
              <span className="text-xs text-[#adc6ff] font-mono tracking-wider uppercase font-semibold block">
                07 · Direct channels
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
                Let's build something meaningful.
              </h2>
            </div>
          </div>
          <span className="text-xs text-zinc-500 hidden sm:inline-block font-sans">
            Inbox open for 2025
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Narrative & Resume Card (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <p className="font-sans text-lg sm:text-[19px] text-zinc-300 leading-relaxed font-normal">
              "Have an opportunity, a project idea, or a reason to connect? I'd love to hear from you."
            </p>

            {/* Quick Dispatch Composer */}
            <TiltCard className="p-8 rounded-2xl bg-[#111116] border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-base text-white">Send direct message</span>
                <span className="text-xs text-zinc-500 font-sans">Quick compose</span>
              </div>

              <form onSubmit={handleSendCustomMail} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="text-zinc-400 block mb-1.5 text-xs font-medium">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Internship opportunity / Project inquiry"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6] text-sm"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1.5 text-xs font-medium">Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello Anuj, we would like to connect regarding..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6] resize-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
                >
                  <span className="material-symbols-outlined text-[17px]">send</span>
                  <span>Prepare email draft</span>
                </button>
              </form>
            </TiltCard>

            {/* Resume Access Card */}
            <TiltCard className="p-8 rounded-2xl bg-[#111116] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-white">Curriculum Vitae / Resume</span>
                <span className="text-xs text-[#ffb690] font-semibold">PDF Format</span>
              </div>
              <p className="font-sans text-sm text-zinc-400 leading-relaxed font-normal">
                Directly review academic details, technical coursework, verified projects, and contact references.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="/Anuj_Tiwari_Resume.pdf"
                  download="Anuj_Tiwari_Resume.pdf"
                  onClick={() => {
                    sound.playSuccess();
                    onNotify('Downloading Anuj_Tiwari_Resume.pdf');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenResume();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 text-xs sm:text-sm font-medium transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>View details</span>
                </button>
              </div>
            </TiltCard>
          </div>

          {/* Functional Contact Action Matrix (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Email Primary Card */}
            <TiltCard className="p-8 rounded-2xl bg-[#111116] border border-white/15 space-y-6 shadow-xl">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="text-[#adc6ff] font-semibold">Primary email address</span>
                <span className="material-symbols-outlined text-[#3b82f6] text-xl">mail</span>
              </div>

              <div>
                <div className="text-lg sm:text-xl font-bold text-white select-all break-all tracking-tight font-sans">
                  {email}
                </div>
                <span className="text-xs text-zinc-500 mt-1 block font-normal">
                  Typically responds within 24 hours
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm font-sans font-medium">
                <a
                  href={`mailto:${email}`}
                  onClick={() => sound.playClick()}
                  className="px-6 py-2.5 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Email me</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className={`px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${
                    copied
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied to clipboard' : 'Copy email'}</span>
                </button>
              </div>
            </TiltCard>

            {/* Social Dual Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub Card */}
              <a
                href="https://github.com/anujtiwari2403-alt"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-6 rounded-2xl bg-[#111116] border border-white/10 hover:border-[#3b82f6]/50 transition-all flex flex-col justify-between group shadow-lg tilt-card"
              >
                <div className="flex items-center justify-between pb-4 text-xs text-zinc-500 font-medium">
                  <span>Code repositories</span>
                  <span className="material-symbols-outlined text-lg text-zinc-400 group-hover:text-[#adc6ff] transition-colors">
                    arrow_outward
                  </span>
                </div>
                <div>
                  <div className="font-bold text-base text-white">Explore GitHub</div>
                  <span className="text-xs text-[#adc6ff] font-medium font-mono">@anujtiwari2403-alt</span>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/anuj-tiwari-4905b6335/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-6 rounded-2xl bg-[#111116] border border-white/10 hover:border-[#ffb690]/50 transition-all flex flex-col justify-between group shadow-lg tilt-card"
              >
                <div className="flex items-center justify-between pb-4 text-xs text-zinc-500 font-medium">
                  <span>Professional network</span>
                  <span className="material-symbols-outlined text-lg text-zinc-400 group-hover:text-[#ffb690] transition-colors">
                    arrow_outward
                  </span>
                </div>
                <div>
                  <div className="font-bold text-base text-white">Connect on LinkedIn</div>
                  <span className="text-xs text-[#ffb690] font-medium font-sans">Anuj Tiwari</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
