import React, { useState } from 'react';
import { TiltCard } from './TiltCard';
import { sound } from '../utils/sound';

export const About: React.FC = () => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ cmd: string; res: string; color?: string }>>([
    {
      cmd: 'whoami',
      res: 'Anuj Tiwari // B.Tech CSE (AI & ML) Student & Software Development Enthusiast',
    },
    {
      cmd: 'echo $CORE_STACK',
      res: '["Java 21", "OOP Architecture", "Data Structures", "Algorithms", "Python", "Web_Fundamentals"]',
      color: 'text-emerald-400 font-medium',
    },
    {
      cmd: 'git status',
      res: 'Branch: main • 100-Days-DSA: Streak Active • Projects: BankFlow, Smart-Placement-Tracker, EVM',
      color: 'text-[#adc6ff]',
    },
  ]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const query = terminalInput.trim().toLowerCase();
    if (!query) return;

    let response = '';
    let color = 'text-zinc-300';

    if (query === 'help') {
      response = 'Available commands: whoami, stack, education, projects, leetcode, contact, clear';
      color = 'text-[#ffb690]';
    } else if (query === 'whoami' || query === 'bio') {
      response = 'Anuj Tiwari: CSE (AI & ML) student focused on strengthening programming fundamentals and building practical software.';
    } else if (query === 'stack') {
      response = 'Primary: Java 21, OOP, DSA | Secondary: Python, C, C++, HTML5, CSS3, JavaScript | Tools: Git, GitHub, VS Code, IntelliJ';
      color = 'text-[#adc6ff]';
    } else if (query === 'education') {
      response = 'Technocrats Institute of Technology & Science, Bhopal (RGPV) • 2024–2028 • B.Tech CSE (AI & ML)';
    } else if (query === 'projects') {
      response = '1. BankFlow (Java OOP Banking System) 2. Smart Placement Tracker (Core Java + DSA) 3. EVM (Web Voting Machine)';
      color = 'text-emerald-400';
    } else if (query === 'leetcode') {
      response = '100 Days of LeetCode challenge active! Practicing Arrays, Strings, HashMaps, Two Pointers, Trees, and Recursion.';
    } else if (query === 'contact') {
      response = 'Email: anujtiwari2403@gmail.com | LinkedIn: linkedin.com/in/anuj-tiwari-4905b6335 | GitHub: github.com/anujtiwari2403-alt';
      color = 'text-emerald-400';
    } else if (query === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      response = `Command not recognized: "${query}". Type "help" for available commands.`;
      color = 'text-rose-400';
    }

    setTerminalLogs((prev) => [...prev, { cmd: query, res: response, color }]);
    setTerminalInput('');
  };

  return (
    <section id="about" className="py-24 md:py-36 border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Counter & Label in Sentence Case */}
        <div className="flex items-baseline justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-sans font-light text-2xl sm:text-4xl text-white/20 tracking-tight">
              01
            </span>
            <div>
              <span className="text-xs sm:text-[13px] text-[#adc6ff] font-sans font-medium tracking-normal block">
                01 · About &amp; philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mt-1 break-words">
                A little about me.
              </h2>
            </div>
          </div>
          <span className="text-xs sm:text-[13px] text-zinc-400 hidden sm:inline-block font-sans">
            Personal overview
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Editorial Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 min-w-0">
            <div className="space-y-5 sm:space-y-6 text-zinc-300 font-sans text-[15px] sm:text-[18px] leading-[1.75]">
              <p className="text-white font-medium text-base sm:text-[19px] leading-relaxed">
                I am a B.Tech CSE (AI &amp; ML) student with a strong interest in Software Development, Data Structures &amp; Algorithms, and Artificial Intelligence.
              </p>
              <p className="text-zinc-300">
                I am currently building my skills in Java, Object-Oriented Programming, Data Structures &amp; Algorithms, Python, and Web Development through hands-on learning and projects.
              </p>
              <p className="text-zinc-300">
                I have developed <span className="text-white font-semibold underline decoration-[#adc6ff] decoration-1 underline-offset-4">BankFlow</span>, a Banking Management System built using Java and OOP concepts, which helped me apply programming fundamentals to a practical software solution. I am also continuously improving my problem-solving skills through regular LeetCode practice.
              </p>
              <p className="text-zinc-300">
                I am exploring AI/ML and AI integration while strengthening my software development fundamentals.
              </p>
            </div>

            {/* Authentic Current Objective Callout Plaque */}
            <TiltCard className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[#111116] border border-[#ffb690]/30 relative overflow-hidden group shadow-xl">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#ffb690]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                <span className="material-symbols-outlined text-[#ffb690] text-xl sm:text-2xl shrink-0 mt-0.5">
                  verified
                </span>
                <div className="space-y-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-[#ffb690] font-semibold block">
                    Career objective
                  </span>
                  <p className="text-white font-sans text-sm sm:text-[17px] leading-relaxed font-normal">
                    "I am currently seeking internship opportunities where I can learn from experienced professionals, contribute to real-world projects, and grow as a software developer."
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Academic Matrix Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              <TiltCard className="p-4 sm:p-5 rounded-xl bg-[#15151c] border border-white/5 flex flex-col gap-1">
                <span className="text-[11px] sm:text-[12px] text-zinc-400 font-normal">
                  Degree path
                </span>
                <span className="font-semibold text-sm sm:text-[17px] text-white">4-Year B.Tech</span>
                <span className="text-xs text-[#adc6ff] font-medium">Sept 2024 – July 2028</span>
              </TiltCard>
              <TiltCard className="p-4 sm:p-5 rounded-xl bg-[#15151c] border border-white/5 flex flex-col gap-1">
                <span className="text-[11px] sm:text-[12px] text-zinc-400 font-normal">
                  Discipline
                </span>
                <span className="font-semibold text-sm sm:text-[17px] text-[#ffb690]">CSE (AI &amp; ML)</span>
                <span className="text-xs text-zinc-400">Java, DSA &amp; Python</span>
              </TiltCard>
              <TiltCard className="p-4 sm:p-5 rounded-xl bg-[#15151c] border border-white/5 flex flex-col gap-1">
                <span className="text-[11px] sm:text-[12px] text-zinc-400 font-normal">
                  Institution
                </span>
                <span className="font-semibold text-sm sm:text-[17px] text-white">RGPV</span>
                <span className="text-xs text-zinc-400">Technocrats Inst., Bhopal</span>
              </TiltCard>
            </div>
          </div>

          {/* Right Technical Shell / Philosophy Execution (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 min-w-0">
            {/* Editorial Philosophy Card */}
            <TiltCard className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[#111116] border border-white/10 flex flex-col gap-5 sm:gap-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                <span className="text-xs uppercase tracking-wider text-[#adc6ff] font-semibold">
                  Engineering mindset
                </span>
                <span className="font-mono text-xs text-zinc-400">at-system.dev</span>
              </div>
              <blockquote className="font-sans text-base sm:text-[19px] font-normal italic text-zinc-200 leading-relaxed">
                "Writing clean, modular Java object structures and turning algorithmic insights into dependable everyday applications."
              </blockquote>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center font-bold text-xs text-[#adc6ff] shrink-0">
                  AT
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-sm text-white truncate">Anuj Tiwari</span>
                  <span className="text-xs text-zinc-400 font-normal truncate block">Bhopal, Madhya Pradesh</span>
                </div>
              </div>
            </TiltCard>

            {/* Interactive Terminal-Styled Runtime Console Block */}
            <div className="rounded-2xl bg-[#070709] border border-white/10 p-4 sm:p-6 space-y-3 shadow-2xl overflow-hidden min-w-0">
              <div className="flex items-center justify-between text-zinc-500 pb-3 border-b border-white/5 font-mono text-xs">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-[11px] sm:text-xs tracking-normal text-zinc-400 font-sans truncate ml-2">
                  Interactive Terminal · anuj_dev
                </span>
              </div>

              {/* Logs in JetBrains Mono */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 font-mono text-xs">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-zinc-500 break-all">$ {log.cmd}</div>
                    <div className={`pl-3 border-l border-zinc-700 text-xs leading-relaxed break-words break-all ${log.color || 'text-zinc-200'}`}>
                      {log.res}
                    </div>
                  </div>
                ))}
              </div>

              {/* Command Input Form */}
              <form onSubmit={handleCommandSubmit} className="pt-2 flex items-center gap-2 border-t border-white/5 font-mono text-xs">
                <span className="text-[#3b82f6] font-bold">$</span>
                <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type 'help', 'stack', or 'projects'..."
                    className="w-full min-w-0 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-xs font-mono"
                  />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs transition-colors font-sans shrink-0"
                >
                  Run
                </button>
              </form>
            </div>

            {/* Verified Academic Coordinates Badge */}
            <TiltCard className="p-3.5 sm:p-4 rounded-xl bg-[#15151c] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
              <span className="text-zinc-400 font-normal shrink-0">Affiliated university:</span>
              <span className="text-white font-medium text-left sm:text-right break-words">Rajiv Gandhi Proudyogiki Vishwavidyalaya</span>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
