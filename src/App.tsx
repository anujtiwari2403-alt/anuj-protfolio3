/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { LeetCodeTracker } from './components/LeetCodeTracker';
import { EducationCertifications } from './components/EducationCertifications';
import { InternshipCTA } from './components/InternshipCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ResumeModal } from './components/ResumeModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CyberRunnerGame } from './game/CyberRunnerGame';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [gameMode, setGameMode] = useState(false);

  // Activate scroll-triggered section reveals
  useScrollReveal();

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3400);
  };

  // When Game Mode is active, render full-viewport Game Shell without website navigation/footers
  if (gameMode) {
    return (
      <CyberRunnerGame
        onExitGame={() => {
          setGameMode(false);
          notify('Exited 3D Cyber Runner Game');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e5e1e4] relative selection:bg-[#3b82f6] selection:text-white overflow-x-hidden">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Dynamic Toast Feedback */}
      <Toast message={toastMessage} />

      {/* Ambient Grid Lines & Atmospheric Gradient Lights */}
      <div className="fixed inset-0 grid-lines pointer-events-none z-0 opacity-70" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-[#ffb690]/5 blur-[160px] rounded-full pointer-events-none z-0" />

      {/* Navigation */}
      <Navbar
        onOpenResume={() => setResumeModalOpen(true)}
        onOpenVoice={() => setVoiceModalOpen(true)}
        onOpenGame={() => setGameMode(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 w-full overflow-hidden">
        {/* Hero Section with Interactive 3D Scene & Authentic Photo */}
        <Hero
          onOpenResume={() => setResumeModalOpen(true)}
          onOpenVoice={() => setVoiceModalOpen(true)}
          onOpenGame={() => setGameMode(true)}
        />

        {/* 01 / About Me & Terminal */}
        <div className="reveal-on-scroll">
          <About />
        </div>

        {/* 02 / Selected Projects (BankFlow, Smart Placement Tracker, EVM) */}
        <div className="reveal-on-scroll">
          <Projects onNotify={notify} />
        </div>

        {/* 03 / Technical Skills Matrix */}
        <div className="reveal-on-scroll">
          <Skills />
        </div>

        {/* 04 / 100 Days of LeetCode Tracker */}
        <div className="reveal-on-scroll">
          <LeetCodeTracker />
        </div>

        {/* 05 / Education & 06 / Certifications */}
        <div className="reveal-on-scroll">
          <EducationCertifications onNotify={notify} />
        </div>

        {/* Internship Readiness CTA */}
        <div className="reveal-on-scroll">
          <InternshipCTA />
        </div>

        {/* 07 / Direct Channels & Contact */}
        <div className="reveal-on-scroll">
          <Contact onNotify={notify} onOpenResume={() => setResumeModalOpen(true)} />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Resume Overview & Download Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        onNotify={notify}
      />

      {/* Gemini 3.8 Live API Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onNotify={notify}
      />
    </div>
  );
}
