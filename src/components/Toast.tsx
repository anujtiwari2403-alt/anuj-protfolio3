import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl bg-[#111116]/95 border border-[#3b82f6]/50 text-white font-mono text-xs shadow-2xl backdrop-blur-xl animate-fade-in">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
      <span>{message}</span>
    </div>
  );
};
