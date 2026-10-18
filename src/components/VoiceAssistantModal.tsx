import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'listening' | 'speaking' | 'error'
  >('idle');
  const [isMicActive, setIsMicActive] = useState(false);
  const [transcripts, setTranscripts] = useState<
    Array<{ sender: 'user' | 'model'; text: string }>
  >([
    {
      sender: 'model',
      text: "Hello! I am Anuj Tiwari's AI Twin powered by Gemini 3.8 Live. Ask me anything about my software projects, Java skills, DSA practice, or internship availability!",
    },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState('');

  // Audio Contexts
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef<boolean>(false);

  // Suggested Prompts
  const suggestions = [
    'Tell me about your BankFlow project.',
    'What is your DSA & LeetCode routine?',
    'What internship roles are you seeking?',
    'Why did you choose Java and OOP?',
  ];

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen]);

  const pcmToBase64 = (float32Array: Float32Array): string => {
    const l = float32Array.length;
    const int16Array = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0 || !outputAudioCtxRef.current) {
      isPlayingRef.current = false;
      setStatus('listening');
      return;
    }

    isPlayingRef.current = true;
    setStatus('speaking');
    const chunk = audioQueueRef.current.shift()!;
    const ctx = outputAudioCtxRef.current;

    const buffer = ctx.createBuffer(1, chunk.length, 24000); // Live API returns 24kHz
    buffer.getChannelData(0).set(chunk);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => {
      playNextInQueue();
    };
    source.start();
  };

  const queuePcmAudio = (base64Audio: string) => {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }
      audioQueueRef.current.push(float32);

      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (e) {
      console.error('Error decoding PCM chunk:', e);
    }
  };

  const startLiveSession = async () => {
    sound.playClick();
    setStatus('connecting');
    setErrorMessage(null);

    try {
      // 1. Setup Output Audio Context at 24kHz
      if (!outputAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      }
      if (outputAudioCtxRef.current.state === 'suspended') {
        await outputAudioCtxRef.current.resume();
      }

      // 2. Setup WebSocket connection to server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus('listening');
        setIsMicActive(true);
        onNotify('Connected to Gemini 3.8 Live API');

        // 3. Request user microphone
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              sampleRate: 16000,
            },
          });
          streamRef.current = stream;

          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const inputCtx = new AudioCtx({ sampleRate: 16000 });
          inputAudioCtxRef.current = inputCtx;

          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64 = pcmToBase64(inputData);
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
        } catch (micErr: any) {
          console.warn('Microphone permission not granted, using text input mode:', micErr);
          onNotify('Microphone not detected; you can type questions directly!');
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio) {
            queuePcmAudio(data.audio);
          }
          if (data.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'model') {
                return [...prev.slice(0, -1), { sender: 'model', text: last.text + ' ' + data.text }];
              }
              return [...prev, { sender: 'model', text: data.text }];
            });
          }
          if (data.interrupted) {
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            setStatus('listening');
          }
          if (data.error) {
            setErrorMessage(data.error);
            setStatus('error');
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket connection error:', e);
        setErrorMessage('Could not establish real-time WebSocket connection to Live API.');
        setStatus('error');
      };

      ws.onclose = () => {
        cleanup();
        setStatus('idle');
      };
    } catch (err: any) {
      console.error('Failed to start Live session:', err);
      setErrorMessage(err.message || 'Live session initialization failed');
      setStatus('error');
    }
  };

  const handleSendTextPrompt = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    sound.playClick();

    setTranscripts((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInputQuery('');

    // If live WebSocket is active, send text over Live API
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: textToSend }));
      setStatus('speaking');
      return;
    }

    // Otherwise use fast REST endpoint
    setStatus('speaking');
    try {
      const res = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();
      if (data.text) {
        setTranscripts((prev) => [...prev, { sender: 'model', text: data.text }]);
        // Synthesize spoken audio with speech synthesis or procedural chime
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.text);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
      setStatus('idle');
    } catch (err: any) {
      setErrorMessage(err.message || 'Request failed');
      setStatus('error');
    }
  };

  const cleanup = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsMicActive(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111116] border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] flex flex-col font-mono text-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#3b82f6] animate-pulse" />
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Anuj's AI Voice Assistant
              </h3>
              <p className="text-[11px] text-[#adc6ff]">
                Powered by Gemini 3.8 Live API (<code className="text-[#38bdf8]">gemini-3.8-live</code>)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              cleanup();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Dynamic Soundwave Orb Centerpiece */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Rings */}
            <div
              className={`absolute w-28 h-28 rounded-full border transition-all duration-500 ${
                status === 'speaking'
                  ? 'border-[#38bdf8] scale-125 opacity-70 animate-ping'
                  : status === 'listening'
                  ? 'border-[#ffb690] scale-110 opacity-50'
                  : 'border-white/10 scale-100 opacity-20'
              }`}
            />
            {/* Center Core Button */}
            <button
              onClick={isMicActive ? cleanup : startLiveSession}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-2xl active:scale-95 ${
                status === 'speaking'
                  ? 'bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white shadow-[0_0_35px_rgba(56,189,248,0.5)]'
                  : isMicActive
                  ? 'bg-gradient-to-tr from-amber-600 to-[#ffb690] text-white shadow-[0_0_30px_rgba(255,182,144,0.4)]'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-200'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {status === 'speaking' ? 'graphic_eq' : isMicActive ? 'mic' : 'mic_none'}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold">
                {status === 'speaking'
                  ? 'Speaking'
                  : isMicActive
                  ? 'Listening'
                  : 'Start Live'}
              </span>
            </button>
          </div>

          <div className="text-center space-y-0.5">
            <span className="text-zinc-400 text-[11px]">
              {status === 'connecting'
                ? 'Connecting to Gemini 3.8 Live WebSocket...'
                : status === 'speaking'
                ? 'Gemini Live is speaking via real-time 24kHz audio'
                : status === 'listening'
                ? 'Microphone streaming active — speak now'
                : 'Click orb to start real-time voice conversation'}
            </span>
          </div>
        </div>

        {/* Subtitle / Transcript History Area */}
        <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto space-y-3 p-4 rounded-2xl bg-[#0a0a0c] border border-white/10 text-xs">
          {transcripts.map((t, idx) => (
            <div
              key={idx}
              className={`flex flex-col space-y-1 ${
                t.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                {t.sender === 'user' ? 'You' : 'Gemini 3.8 Live'}
              </span>
              <div
                className={`p-3 rounded-xl max-w-[85%] font-sans text-xs leading-relaxed ${
                  t.sender === 'user'
                    ? 'bg-[#3b82f6] text-white rounded-tr-none'
                    : 'bg-white/[0.04] text-zinc-200 border border-white/5 rounded-tl-none'
                }`}
              >
                {t.text}
              </div>
            </div>
          ))}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendTextPrompt(q)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 text-[10px] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input / Control Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendTextPrompt(inputQuery);
          }}
          className="flex items-center gap-2 pt-2 border-t border-white/10"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type a question or speak using the mic orb..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6] text-xs font-sans"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white font-bold transition-all flex items-center gap-1.5"
          >
            <span>Ask</span>
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  );
};
