import React, { useState } from 'react';
import { TiltCard } from './TiltCard';
import { sound } from '../utils/sound';

export const LeetCodeTracker: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [hoveredDay, setHoveredDay] = useState<{ day: number; title: string; topic: string } | null>(null);
  const [completedDays, setCompletedDays] = useState<number>(35);
  const [showProgressEditor, setShowProgressEditor] = useState<boolean>(false);

  const topics = [
    { name: 'All', count: '100 Days Target' },
    { name: 'Arrays', count: 'Prefix & Sliding Window' },
    { name: 'Strings', count: 'Parsing & Anagrams' },
    { name: 'HashMaps', count: 'O(1) Lookups' },
    { name: 'Two Pointers', count: 'Opposite & Fast/Slow' },
    { name: 'Linked Lists', count: 'Pointers & Cycles' },
    { name: 'Trees', count: 'DFS & BFS Traversal' },
    { name: 'Recursion', count: 'Backtracking Basics' },
  ];

  // Configurable representation of the 100-day journey
  const sampleProblems: Record<number, { title: string; topic: string }> = {
    1: { title: 'Two Sum', topic: 'HashMaps' },
    2: { title: 'Best Time to Buy & Sell Stock', topic: 'Arrays' },
    3: { title: 'Contains Duplicate', topic: 'HashMaps' },
    4: { title: 'Product of Array Except Self', topic: 'Arrays' },
    5: { title: 'Valid Palindrome', topic: 'Two Pointers' },
    6: { title: '3Sum', topic: 'Two Pointers' },
    7: { title: 'Container With Most Water', topic: 'Two Pointers' },
    8: { title: 'Longest Substring Without Repeating Characters', topic: 'Strings' },
    9: { title: 'Minimum Window Substring', topic: 'Strings' },
    10: { title: 'Valid Parentheses', topic: 'Strings' },
    11: { title: 'Min Stack', topic: 'Arrays' },
    12: { title: 'Binary Search', topic: 'Arrays' },
    13: { title: 'Search in Rotated Sorted Array', topic: 'Arrays' },
    14: { title: 'Reverse Linked List', topic: 'Linked Lists' },
    15: { title: 'Merge Two Sorted Lists', topic: 'Linked Lists' },
    16: { title: 'Linked List Cycle', topic: 'Linked Lists' },
    17: { title: 'Maximum Depth of Binary Tree', topic: 'Trees' },
    18: { title: 'Invert Binary Tree', topic: 'Trees' },
    19: { title: 'Same Tree', topic: 'Trees' },
    20: { title: 'Subtree of Another Tree', topic: 'Trees' },
    21: { title: 'Lowest Common Ancestor of a BST', topic: 'Trees' },
    22: { title: 'Combination Sum', topic: 'Recursion' },
    23: { title: 'Word Search', topic: 'Recursion' },
    24: { title: 'Climbing Stairs', topic: 'Recursion' },
    25: { title: 'Coin Change', topic: 'Recursion' },
    26: { title: 'Group Anagrams', topic: 'Strings' },
    27: { title: 'Top K Frequent Elements', topic: 'HashMaps' },
    28: { title: 'Merge Intervals', topic: 'Arrays' },
    29: { title: 'Insert Interval', topic: 'Arrays' },
    30: { title: 'Set Matrix Zeroes', topic: 'Arrays' },
    31: { title: 'Longest Palindromic Substring', topic: 'Strings' },
    32: { title: 'Binary Tree Level Order Traversal', topic: 'Trees' },
    33: { title: 'Validate Binary Search Tree', topic: 'Trees' },
    34: { title: 'Number of Islands', topic: 'Recursion' },
    35: { title: 'Rotting Oranges (BFS)', topic: 'Trees' },
  };

  const totalTargetDays = 100;

  const handleDayClick = (dayNum: number) => {
    sound.playClick();
    if (dayNum <= completedDays) {
      const prob = sampleProblems[dayNum] || { title: `Practice Session Day ${dayNum}`, topic: 'General DSA' };
      setHoveredDay({ day: dayNum, ...prob });
    } else {
      setCompletedDays(dayNum);
    }
  };

  return (
    <section id="dsa" className="py-24 md:py-36 border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto px-6 md:px-12">
        {/* Large Technical Section Header */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="font-sans font-light text-3xl md:text-4xl text-white/20 tracking-tight">
              04
            </span>
            <div>
              <span className="text-[13px] text-[#adc6ff] font-medium tracking-normal block">
                04 · Discipline &amp; problem solving
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mt-1">
                100 Days of LeetCode.
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
            <span>DSA solutions repository</span>
            <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
          </a>
        </div>

        <p className="font-sans text-[16px] sm:text-[18px] text-zinc-300 max-w-2xl leading-[1.75] font-normal mb-12">
          "Consistently practicing Data Structures and Algorithms to improve problem-solving ability, strengthen coding fundamentals, and prepare for technical interviews."
        </p>

        {/* Algorithmic Telemetry Canvas */}
        <TiltCard className="p-8 sm:p-12 rounded-3xl bg-[#111116] border border-white/15 space-y-10 shadow-2xl font-sans">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-1">
              <span className="text-[13px] text-zinc-400 font-normal block">
                Target horizon
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-[#adc6ff] tracking-tight">
                {totalTargetDays}
              </div>
              <span className="text-xs text-zinc-400">Target days challenge</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-1">
              <span className="text-[13px] text-zinc-400 font-normal block">
                Days completed
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-white tabular-nums tracking-tight">
                {completedDays}
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                {Math.round((completedDays / totalTargetDays) * 100)}% Milestone reached
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-1">
              <span className="text-[13px] text-zinc-400 font-normal block">
                Primary language
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Java</div>
              <span className="text-xs text-zinc-400">Collections &amp; OOP</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-1">
              <span className="text-[13px] text-zinc-400 font-normal block">
                Algorithm patterns
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-[#ffb690] tracking-tight">7+</div>
              <span className="text-xs text-zinc-400">Core problem types</span>
            </div>
          </div>

          {/* Topic Labels Filter */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-medium text-white block">
                Algorithm topic areas
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowProgressEditor(!showProgressEditor);
                }}
                className="text-xs sm:text-[13px] text-[#adc6ff] hover:underline flex items-center gap-1.5 font-medium"
              >
                <span className="material-symbols-outlined text-[15px]">tune</span>
                <span>{showProgressEditor ? 'Hide progress control' : 'Adjust progress data'}</span>
              </button>
            </div>

            {/* Editable Progress Control Box */}
            {showProgressEditor && (
              <div className="p-4 rounded-xl bg-[#0a0a0c] border border-[#3b82f6]/40 space-y-3 text-xs sm:text-[13px]">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Configure Current Progress:</span>
                  <span className="text-[#3b82f6] font-semibold">
                    {completedDays} of {totalTargetDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={completedDays}
                  onChange={(e) => setCompletedDays(Number(e.target.value))}
                  className="w-full accent-[#3b82f6] cursor-pointer"
                />
                <p className="text-xs text-zinc-400 font-normal">
                  Slide or click any day in the grid to update the active progress state dynamically.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {topics.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTopic(t.name);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTopic === t.name
                      ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white shadow-sm'
                      : 'bg-[#0a0a0c] border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="block text-xs sm:text-[13px] font-medium">{t.name}</span>
                  <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contribution-Style 100-Block Calendar */}
          <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-[13px] text-zinc-400">
              <span className="text-zinc-200 font-medium">100-day problem solving progression</span>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-white/5" />
                  <span>Horizon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#ffb690] animate-pulse" />
                  <span>Current active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#3b82f6]" />
                  <span>Completed</span>
                </div>
              </div>
            </div>

            {/* 100-Day Grid */}
            <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-25 gap-2 py-3">
              {Array.from({ length: totalTargetDays }).map((_, i) => {
                const dayNum = i + 1;
                const problem = sampleProblems[dayNum];
                const isLogged = dayNum <= completedDays;
                const isCurrent = dayNum === completedDays + 1;

                const matchesFilter =
                  selectedTopic === 'All' || (problem && problem.topic === selectedTopic);

                return (
                  <div
                    key={dayNum}
                    onClick={() => handleDayClick(dayNum)}
                    onMouseEnter={() => {
                      if (problem) {
                        setHoveredDay({ day: dayNum, ...problem });
                      } else {
                        setHoveredDay({
                          day: dayNum,
                          title: `Target Challenge Day ${dayNum}`,
                          topic: 'Roadmap Target',
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-4 rounded-sm transition-all duration-200 cursor-pointer ${
                      isLogged
                        ? matchesFilter
                          ? 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.3)] hover:scale-125'
                          : 'bg-[#3b82f6]/30'
                        : isCurrent
                        ? 'bg-[#ffb690] animate-pulse hover:scale-125'
                        : 'bg-white/[0.05] hover:bg-white/15'
                    }`}
                    title={
                      problem
                        ? `Day ${dayNum}: ${problem.title} (${problem.topic})`
                        : `Day ${dayNum}: Horizon Target`
                    }
                  />
                );
              })}
            </div>

            {/* Tooltip & Solution Sync Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[13px] text-zinc-400 pt-2 border-t border-white/5">
              <span>
                {hoveredDay ? (
                  <span className="text-zinc-200">
                    Day {hoveredDay.day}: <strong className="text-[#adc6ff] font-medium">{hoveredDay.title}</strong>{' '}
                    <span className="text-zinc-400">({hoveredDay.topic})</span>
                  </span>
                ) : (
                  <span>Hover or click any day block to inspect / update</span>
                )}
              </span>
              <a
                href="https://github.com/anujtiwari2403-alt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#adc6ff] font-medium hover:underline flex items-center gap-1"
              >
                <span>Synced to GitHub solutions</span>
                <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </a>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};
