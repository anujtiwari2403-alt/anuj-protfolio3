import React, { useState } from 'react';
import { TiltCard } from './TiltCard';
import { sound } from '../utils/sound';

interface ProjectsProps {
  onNotify: (msg: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onNotify }) => {
  // BankFlow Interactive State
  const [bankBalance, setBankBalance] = useState(42850);
  const [activeBankTab, setActiveBankTab] = useState<'overview' | 'transfer' | 'ledger'>('overview');
  const [transferRecipient, setTransferRecipient] = useState('Tech Systems Ltd');
  const [transferAmount, setTransferAmount] = useState(1500);
  const [recentTransfers, setRecentTransfers] = useState([
    { id: 'TXN-9021', title: 'Stipend Disbursed (NEFT)', amt: '+ ₹ 5,000.00', type: 'credit', time: 'Today, 10:42 AM' },
    { id: 'TXN-8842', title: 'Cloud Infrastructure Subscription', amt: '- ₹ 850.00', type: 'debit', time: 'Yesterday' },
    { id: 'TXN-7619', title: 'Online Developer Tooling Suite', amt: '- ₹ 1,200.00', type: 'debit', time: '3 days ago' },
  ]);

  // Smart Placement Tracker State
  const [candidateFilter, setCandidateFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const candidates = [
    { name: 'Aditya S.', role: 'SDE Intern', round: 'Technical', cgpa: '8.9', status: 'Offer Received' },
    { name: 'Priya M.', role: 'Java Backend', round: 'HR Final', cgpa: '9.2', status: 'Interview Scheduled' },
    { name: 'Rohan K.', role: 'AI/ML Intern', round: 'Technical', cgpa: '8.7', status: 'Shortlisted' },
    { name: 'Sneha P.', role: 'Web Developer', round: 'Aptitude', cgpa: '8.4', status: 'In Review' },
    { name: 'Vikas N.', role: 'Java Developer', round: 'Technical', cgpa: '9.0', status: 'Shortlisted' },
  ];

  // EVM Interactive State
  const [votes, setVotes] = useState<Record<string, number>>({
    'Alpha (Clean Tech)': 142,
    'Beta (Decentralized Open Source)': 188,
    'Gamma (AI Systems)': 215,
  });
  const [votedCandidate, setVotedCandidate] = useState<string | null>(null);

  const handleSimulateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (bankBalance < transferAmount) {
      onNotify('BankFlow Exception: Insufficient balance');
      return;
    }
    setBankBalance((prev) => prev - transferAmount);
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Transfer to ${transferRecipient || 'Beneficiary'}`,
      amt: `- ₹ ${transferAmount.toLocaleString('en-IN')}.00`,
      type: 'debit',
      time: 'Just now',
    };
    setRecentTransfers((prev) => [newTxn, ...prev.slice(0, 4)]);
    sound.playSuccess();
    onNotify(`BankFlow: Transferred ₹${transferAmount.toLocaleString('en-IN')} successfully`);
  };

  const handleCastVote = (candidate: string) => {
    sound.playClick();
    if (votedCandidate) {
      onNotify(`One-Voter Rule: Vote already recorded for "${votedCandidate}"`);
      return;
    }
    setVotes((prev) => ({
      ...prev,
      [candidate]: (prev[candidate] || 0) + 1,
    }));
    setVotedCandidate(candidate);
    sound.playSuccess();
    onNotify(`EVM: Ballot recorded securely for ${candidate}`);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesRound = candidateFilter === 'All' || c.round === candidateFilter;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRound && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 md:py-36 border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="font-sans font-light text-3xl md:text-4xl text-white/20 tracking-tight">
              02
            </span>
            <div>
              <span className="text-[13px] text-[#adc6ff] font-medium tracking-normal block">
                02 · Selected projects
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mt-1">
                Things I've built.
              </h2>
            </div>
          </div>
          <a
            href="https://github.com/anujtiwari2403-alt"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <span>All repositories on GitHub</span>
            <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
          </a>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {/* ==================== PROJECT 01: BANKFLOW ==================== */}
          <TiltCard className="rounded-3xl bg-[#111116] border border-white/15 overflow-hidden shadow-2xl relative">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#3b82f6]/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              {/* Information (6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="px-3 py-1 rounded-full bg-[#ffb690]/10 border border-[#ffb690]/25 text-[#ffb690] font-medium">
                    Featured case study
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300 font-medium">Core Java Architecture</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-[38px] font-semibold text-white tracking-[-0.02em] leading-tight">
                  BankFlow — Banking Management System
                </h3>

                <p className="font-sans text-[16px] sm:text-[17px] text-zinc-300 leading-[1.75] font-normal">
                  "A Java-based Banking Management System developed using Object-Oriented Programming principles. The project demonstrates practical application of programming fundamentals and banking-related operations."
                </p>

                {/* Technology Labels */}
                <div className="flex flex-wrap gap-2 pt-1 font-sans text-[13px]">
                  <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[#adc6ff] font-medium">
                    Java 21
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[#ffb690] font-medium">
                    OOP
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 font-medium">
                    JavaScript (ES6)
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 font-medium">
                    HTML5
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 font-medium">
                    Tailwind CSS
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3 font-sans text-sm font-medium">
                  <a
                    href="https://bankflow-system.surge.sh"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="px-6 py-3 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
                    <span>Live Demo</span>
                  </a>

                  <a
                    href="https://github.com/anujtiwari2403-alt/BankFlow"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-all duration-300 flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[17px]">code</span>
                    <span>View Source Code</span>
                  </a>
                </div>
              </div>

              {/* Large Banking Dashboard Preview (6 cols) */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-[#0a0a0c] border border-white/15 p-6 shadow-2xl space-y-4 font-sans">
                  {/* Browser Chrome Top */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-zinc-300 flex items-center gap-1.5 font-medium text-[13px]">
                      <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
                      bankflow-system.surge.sh
                    </span>
                    <span className="text-emerald-400 font-medium text-xs">Secure SSL</span>
                  </div>

                  {/* Dashboard Preview Navigation Tabs */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/5 text-xs sm:text-[13px] font-medium">
                    {(['overview', 'transfer', 'ledger'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          sound.playClick();
                          setActiveBankTab(tab);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                          activeBankTab === tab
                            ? 'bg-[#3b82f6] text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab === 'overview'
                          ? 'Account Summary'
                          : tab === 'transfer'
                          ? 'Fund Transfer'
                          : 'Recent Ledger'}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Account Overview */}
                  {activeBankTab === 'overview' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-1">
                          <span className="text-[12px] text-zinc-400 block font-normal">
                            Account balance
                          </span>
                          <div className="font-semibold text-2xl text-white tabular-nums tracking-tight">
                            ₹ {bankBalance.toLocaleString('en-IN')}.00
                          </div>
                          <span className="text-xs text-[#adc6ff] flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]" />
                            Savings · Active
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-1">
                          <span className="text-[12px] text-zinc-400 block font-normal">
                            Account holder
                          </span>
                          <div className="font-semibold text-base sm:text-lg text-white">
                            Anuj Tiwari
                          </div>
                          <span className="font-mono text-xs text-zinc-400">
                            A/C: •••• 9842
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#15151c] border border-white/5 text-[13px] flex items-center justify-between">
                        <span className="text-zinc-300 font-normal">Monthly credits:</span>
                        <span className="text-emerald-400 font-semibold tabular-nums">+ ₹ 15,000.00</span>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Fund Transfer Simulation Form */}
                  {activeBankTab === 'transfer' && (
                    <form onSubmit={handleSimulateTransfer} className="p-4 rounded-xl bg-[#15151c] border border-white/5 space-y-3 text-xs sm:text-[13px]">
                      <div>
                        <label className="text-zinc-300 block mb-1 text-[12px]">Beneficiary name</label>
                        <input
                          type="text"
                          value={transferRecipient}
                          onChange={(e) => setTransferRecipient(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0c] border border-white/10 text-white focus:outline-none focus:border-[#3b82f6] text-xs sm:text-[13px]"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-300 block mb-1 text-[12px]">Transfer amount (INR)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[500, 1500, 5000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setTransferAmount(amt);
                              }}
                              className={`py-1.5 rounded-lg border text-xs sm:text-[13px] transition-colors font-medium tabular-nums ${
                                transferAmount === amt
                                  ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                                  : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.06]'
                              }`}
                            >
                              ₹ {amt.toLocaleString('en-IN')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white font-medium transition-all shadow-sm"
                      >
                        Execute Transfer (Account.java)
                      </button>
                    </form>
                  )}

                  {/* Tab 3: Recent Ledger */}
                  {activeBankTab === 'ledger' && (
                    <div className="space-y-2 p-2 rounded-xl bg-[#15151c] border border-white/5 max-h-48 overflow-y-auto text-xs sm:text-[13px]">
                      {recentTransfers.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#111116] border border-white/5"
                        >
                          <div>
                            <span className="text-white block font-medium">{t.title}</span>
                            <span className="text-xs text-zinc-400 font-mono">{t.id} · {t.time}</span>
                          </div>
                          <span
                            className={`font-semibold tabular-nums text-xs sm:text-[13px] ${
                              t.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {t.amt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Engine Telemetry Bar */}
                  <div className="p-3 rounded-lg bg-[#111116] border border-white/5 flex items-center justify-between text-xs sm:text-[13px] font-sans">
                    <span className="flex items-center gap-2 text-zinc-300">
                      <span className="material-symbols-outlined text-[16px] text-[#adc6ff] animate-spin">
                        sync
                      </span>
                      <span>OOP Ledger Reconciliation Active</span>
                    </span>
                    <span className="text-[#adc6ff] font-medium font-mono text-xs">Java 21 Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* ==================== PROJECT 02 & 03: SEPARATE SHOWCASES ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* PROJECT 02: SMART PLACEMENT TRACKER (7 cols) */}
            <TiltCard className="lg:col-span-7 rounded-3xl bg-[#111116] border border-white/10 p-8 sm:p-10 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-[13px] border-b border-white/5 pb-4">
                  <span className="text-[#ffb690] font-medium">
                    Project 02 · Console application
                  </span>
                  <span className="text-zinc-400 font-mono text-xs">Core Java</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-[28px] font-semibold text-white tracking-[-0.02em]">
                    Smart Placement Tracker
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#adc6ff] font-medium mt-1">
                    Java, Data Structures, Algorithms, OOP
                  </p>
                </div>

                <p className="font-sans text-[15px] sm:text-[16px] text-zinc-300 leading-[1.7] font-normal">
                  "A console-based placement and internship application tracking project built using Core Java and Data Structures concepts. Designed to organize placement-related information and demonstrate practical Java programming."
                </p>

                <div className="flex flex-wrap gap-2 text-xs sm:text-[13px]">
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[#adc6ff] font-medium">
                    Java
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 font-medium">
                    Data Structures
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 font-medium">
                    Algorithms
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[#ffb690] font-medium">
                    OOP
                  </span>
                </div>

                {/* Console Output Simulation */}
                <div className="rounded-xl bg-[#070709] border border-white/10 p-5 font-mono text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-400 pb-2 border-b border-white/5">
                    <span>// Candidates Registry</span>
                    <div className="flex items-center gap-1 font-sans">
                      {['All', 'Technical', 'HR Final'].map((round) => (
                        <button
                          key={round}
                          onClick={() => {
                            sound.playClick();
                            setCandidateFilter(round);
                          }}
                          className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                            candidateFilter === round
                              ? 'bg-[#3b82f6] text-white'
                              : 'bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {round}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate or role..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111116] border border-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6] text-xs font-sans"
                  />

                  <div className="space-y-1.5 text-zinc-300 font-sans">
                    {filteredCandidates.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5 text-xs"
                      >
                        <span className="text-white font-medium">{c.name}</span>
                        <span className="text-zinc-400">{c.role}</span>
                        <span className="text-[#adc6ff] font-mono">CGPA: {c.cgpa}</span>
                        <span className="text-emerald-400 font-medium">{c.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-emerald-400 text-xs pt-1 flex items-center justify-between font-sans">
                    <span>Search filter executed in 0.12ms</span>
                    <span className="text-zinc-500 text-xs font-mono">Console mode</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://github.com/anujtiwari2403-alt/smart-placement-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 font-sans text-xs sm:text-sm font-medium transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  <span>View repository on GitHub</span>
                </a>
              </div>
            </TiltCard>

            {/* PROJECT 03: EVM VOTING MACHINE (5 cols) */}
            <TiltCard className="lg:col-span-5 rounded-3xl bg-[#111116] border border-white/10 p-8 sm:p-10 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-[13px] border-b border-white/5 pb-4">
                  <span className="text-[#ffb690] font-medium">
                    Project 03 · Web interface
                  </span>
                  <span className="text-zinc-400 font-mono text-xs">JavaScript</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-[28px] font-semibold text-white tracking-[-0.02em]">
                    EVM — Electronic Voting Machine
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#adc6ff] font-medium mt-1">
                    Web Application · State Logic &amp; Verification
                  </p>
                </div>

                <p className="font-sans text-[15px] sm:text-[16px] text-zinc-300 leading-[1.7] font-normal">
                  "A web development project demonstrating a digital voting interface and basic voting interactions."
                </p>

                <div className="flex flex-wrap gap-2 text-xs sm:text-[13px]">
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[#adc6ff] font-medium">
                    HTML
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 font-medium">
                    CSS
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[#ffb690] font-medium">
                    JavaScript
                  </span>
                </div>

                {/* Digital Ballot Unit Simulation */}
                <div className="rounded-xl bg-[#070709] border border-white/10 p-5 space-y-3 text-xs sm:text-[13px] font-sans">
                  <div className="flex items-center justify-between text-zinc-400 pb-1 text-xs">
                    <span>Digital ballot unit</span>
                    <span
                      className={`font-semibold ${
                        votedCandidate ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {votedCandidate ? 'Ballot locked' : 'Ready to vote'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(votes).map(([cand, count]) => (
                      <div
                        key={cand}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#111116] border border-white/5"
                      >
                        <div>
                          <div className="text-white font-medium">{cand}</div>
                          <span className="text-xs text-zinc-400 font-mono">Tally: {count} votes</span>
                        </div>
                        <button
                          onClick={() => handleCastVote(cand)}
                          disabled={Boolean(votedCandidate)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                            votedCandidate === cand
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : votedCandidate
                              ? 'bg-white/5 text-zinc-600 cursor-not-allowed'
                              : 'bg-[#3b82f6] hover:bg-blue-600 text-white shadow-sm'
                          }`}
                        >
                          {votedCandidate === cand ? 'Recorded' : 'Vote'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {votedCandidate && (
                    <div className="text-right">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setVotedCandidate(null);
                        }}
                        className="text-xs text-[#adc6ff] hover:underline"
                      >
                        Reset ballot demo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://github.com/anujtiwari2403-alt"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 font-sans text-xs sm:text-sm font-medium transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  <span>Project repository</span>
                </a>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
