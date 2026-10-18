import React, { useEffect, useRef, useState } from 'react';
import { GameEngine, GameStats } from './GameEngine';
import { gameAudio } from './gameAudio';

interface CyberRunnerGameProps {
  onExitGame: () => void;
}

export const CyberRunnerGame: React.FC<CyberRunnerGameProps> = ({ onExitGame }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameStats['state']>('title');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    shield: 100,
    crystals: 0,
    speed: 38,
    combo: 1,
    distance: 0,
    state: 'title',
  });
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new GameEngine(mountRef.current, {
      onStatsUpdate: (newStats) => {
        setStats({ ...newStats });
      },
      onStateChange: (state) => {
        setGameState(state);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  const handleStart = () => {
    engineRef.current?.startGame();
  };

  const handleResume = () => {
    engineRef.current?.resumeGame();
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    gameAudio.setMuted(next);
  };

  return (
    <div className="fixed inset-0 z-[200] w-screen h-screen bg-[#0a0a0c] text-white select-none overflow-hidden font-mono">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ==================== TITLE SCREEN ==================== */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 sm:p-14 bg-gradient-to-t from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-300">
                CYBER RUNNER // 3D DSA ODYSSEY
              </span>
            </div>
            <button
              onClick={onExitGame}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              <span>EXIT TO PORTFOLIO</span>
            </button>
          </div>

          {/* Center Title Lockup over 30-40% Negative Space */}
          <div className="max-w-2xl space-y-6 my-auto">
            {/* Bespoke Inline SVG Title Lockup */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#adc6ff] text-[11px] font-semibold tracking-wider">
                <span>ANUJ TIWARI PRESENTS</span>
                <span className="text-zinc-600">•</span>
                <span>THREE.JS ARCHITECTURE</span>
              </div>
              <h1 className="font-display font-black text-5xl sm:text-7xl xl:text-8xl tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-[#adc6ff] to-[#38bdf8]">
                CYBER RUNNER
              </h1>
              <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
                Pilot the algorithm vessel through the infinite data highway. Harvest DSA crystals, avoid bug collisions, and activate your pulse shield.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleStart}
                className="px-8 py-4 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center gap-3 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>START SIMULATION [SPACE / ENTER]</span>
              </button>
              <button
                onClick={handleToggleMute}
                className="px-5 py-4 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
                <span>{isMuted ? 'AUDIO MUTED' : 'SYNTH AUDIO ON'}</span>
              </button>
            </div>

            {/* Flat Single Control-Hint Line */}
            <div className="pt-2 text-xs text-zinc-500">
              <span className="text-zinc-400 font-semibold">WASD / Arrow Keys</span> Move ·{' '}
              <span className="text-zinc-400 font-semibold">Space</span> Pulse Shield ·{' '}
              <span className="text-zinc-400 font-semibold">Esc</span> Pause
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-white/5 pt-4">
            <span>ENGINE: THREE.JS PBR SHADERS • 60 FPS CLAMPED</span>
            <span>DATA ROAD: INFINITE CHUNKING</span>
          </div>
        </div>
      )}

      {/* ==================== PLAYING HUD (LOW OCCLUSION <15%) ==================== */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 z-10 pointer-events-none p-6 md:p-8 flex flex-col justify-between">
          {/* Top Perimeter Status Cluster */}
          <div className="flex items-start justify-between">
            {/* Health / Shield Gauge */}
            <div className="p-3.5 rounded-xl bg-[#0a0a0c]/80 border border-white/10 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between gap-6 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>VESSEL INTEGRITY</span>
                </span>
                <span className="tabular-nums font-bold text-white">{stats.shield}%</span>
              </div>
              <div className="w-44 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    stats.shield > 50
                      ? 'bg-[#38bdf8]'
                      : stats.shield > 25
                      ? 'bg-amber-400'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${stats.shield}%` }}
                />
              </div>
            </div>

            {/* Score & Multiplier */}
            <div className="p-3.5 rounded-xl bg-[#0a0a0c]/80 border border-white/10 text-right space-y-0.5 shadow-lg">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                ALGORITHM SCORE
              </span>
              <div className="font-display font-black text-2xl text-white tabular-nums">
                {stats.score.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#ffb690] font-bold tabular-nums">
                {stats.combo > 1 ? `${stats.combo}X COMBO ACTIVE` : 'BASE SPEED'}
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Cluster */}
          <div className="flex items-end justify-between">
            {/* Crystals Harvested */}
            <div className="p-3.5 rounded-xl bg-[#0a0a0c]/80 border border-white/10 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8]">
                <span className="material-symbols-outlined text-lg">diamond</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  DSA CRYSTALS
                </span>
                <span className="font-display font-bold text-lg text-white tabular-nums">
                  {stats.crystals} / 50
                </span>
              </div>
            </div>

            {/* Speed & Controls Reminder */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block p-3 rounded-xl bg-[#0a0a0c]/80 border border-white/10 text-right text-xs">
                <span className="text-[10px] text-zinc-500 block uppercase">VELOCITY</span>
                <span className="font-bold text-[#38bdf8] tabular-nums">
                  {Math.round(stats.speed)} MB/s
                </span>
              </div>

              <button
                onClick={() => engineRef.current?.pauseGame()}
                className="pointer-events-auto p-3 rounded-xl bg-[#0a0a0c]/80 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
                title="Pause Game [Esc]"
              >
                <span className="material-symbols-outlined text-xl">pause</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PAUSE MODAL ==================== */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#111116] border border-white/20 p-8 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center mx-auto text-[#adc6ff]">
              <span className="material-symbols-outlined text-2xl">pause</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white">SIMULATION PAUSED</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Score: <strong className="text-white">{stats.score}</strong> · Crystals:{' '}
                <strong className="text-[#38bdf8]">{stats.crystals}</strong>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleResume}
                className="w-full py-3.5 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-xs tracking-wider transition-all"
              >
                RESUME RUN [ESC]
              </button>
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
              >
                RESTART SIMULATION
              </button>
              <button
                onClick={onExitGame}
                className="w-full py-2.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                Exit to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME OVER MODAL ==================== */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#111116] border border-rose-500/40 p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl text-white">SYSTEM CRITICAL</h2>
              <p className="text-xs text-rose-400/90 font-mono mt-1">
                Vessel collided with too many memory leak bugs!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0a0a0c] border border-white/5 text-left text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">FINAL SCORE</span>
                <span className="font-display font-black text-xl text-white tabular-nums">
                  {stats.score.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">CRYSTALS HARVESTED</span>
                <span className="font-display font-black text-xl text-[#38bdf8] tabular-nums">
                  {stats.crystals}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleStart}
                className="w-full py-3.5 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                TRY AGAIN [SPACE / ENTER]
              </button>
              <button
                onClick={onExitGame}
                className="w-full py-2.5 text-zinc-400 hover:text-white text-xs transition-colors"
              >
                Return to Anuj's Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VICTORY MODAL ==================== */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#111116] border border-emerald-500/40 p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <span className="material-symbols-outlined text-3xl">emoji_events</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl text-white">ALGORITHM MASTER</h2>
              <p className="text-xs text-emerald-400/90 font-mono mt-1">
                You harvested 50 DSA crystals and conquered the highway!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0a0a0c] border border-white/5 text-left text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">HIGH SCORE</span>
                <span className="font-display font-black text-xl text-white tabular-nums">
                  {stats.score.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">DISTANCE RUN</span>
                <span className="font-display font-black text-xl text-[#ffb690] tabular-nums">
                  {Math.round(stats.distance)}m
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleStart}
                className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={onExitGame}
                className="w-full py-2.5 text-zinc-400 hover:text-white text-xs transition-colors"
              >
                Return to Anuj's Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
