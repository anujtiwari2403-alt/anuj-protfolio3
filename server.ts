import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// REST Fallback endpoint for voice/chat questions
app.post('/api/voice-chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are Anuj Tiwari's AI Portfolio Voice Assistant and Technical Twin.
Anuj is a B.Tech Computer Science & Engineering (Artificial Intelligence & Machine Learning) student at Technocrats Institute of Technology & Science, Bhopal (RGPV), batch 2024–2028.
His core focus: Java 21, Object-Oriented Programming (OOP), Data Structures & Algorithms, and AI Integration.
Projects:
1. BankFlow: Java 21 OOP Banking Management System with ledger reconciliation, funds transfer, and balance checking.
2. Smart Placement Tracker: Core Java & Data Structures console project organizing student placement rounds and search.
3. EVM: Electronic Voting Machine web application with client-side state handling and single-vote enforcement.
4. 100 Days of LeetCode challenge active!
Certifications: Ramraj Technology Solutions (C/C++ & Competitive Programming) and NASSCOM (Prompt Engineering & ChatGPT).
Seeking: Software Development, Java Backend, and AI/ML internship opportunities (On-site in Bhopal, Remote, or Hybrid).
Keep your answers conversational, concise (2-3 sentences max for spoken audio playback), confident, and friendly.`,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Error in /api/voice-chat:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// WebSocket Server for Gemini Live API (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/api/live-ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    // If not our endpoint, let Vite handle its own WebSockets if any
    socket.destroy();
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live API WebSocket endpoint (/api/live-ws)');

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction: `You are Anuj Tiwari's AI Portfolio Voice Assistant and Technical Twin.
You speak in real-time audio with recruiters and visitors exploring Anuj's developer portfolio.
Key information about Anuj:
- B.Tech CSE (AI & ML) student at Technocrats Institute of Technology & Science, Bhopal (affiliated with RGPV), batch Sept 2024 – July 2028.
- Technical skills: Java 21, Python, C, C++, Data Structures & Algorithms, Object-Oriented Programming (OOP), HTML, CSS, JavaScript, Git, GitHub.
- Featured Projects:
  1. BankFlow (Java Banking Management System with OOP architecture, funds transfer, ledger reconciliation).
  2. Smart Placement Tracker (Core Java + Data Structures placement organizer).
  3. EVM (Electronic Voting Machine web application).
- 100 Days of LeetCode challenge active focusing on Arrays, Strings, HashMaps, Two Pointers, Trees, and Recursion.
- Certifications: Ramraj Technology Solutions (C/C++ & Competitive Programming) and NASSCOM (Prompt Engineering & ChatGPT).
- Seeking: Software Development, Java Developer, Backend Engineering, or AI/ML internships (On-site in Bhopal, Remote, or Hybrid).
Tone: Warm, highly articulate, polite, concise, and enthusiastic about software craftsmanship.`,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          // Send audio chunks to client
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio) {
            clientWs.send(JSON.stringify({ audio, text }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err.message || 'Live session error' }));
          }
        },
        onclose: () => {
          console.log('Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ closed: true }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ status: 'connected', message: 'Gemini 3.8 Live session ready' }));

    clientWs.on('message', (data: Buffer | string) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.audio && session) {
          session.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (payload.text && session) {
          session.sendRealtimeInput({
            text: payload.text,
          });
        }
      } catch (e) {
        console.error('Error handling message from client to Live session:', e);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close();
        } catch {
          // ignore
        }
      }
    });
  } catch (err: any) {
    console.error('Failed to connect to gemini-3.8-live:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          error:
            err.message ||
            'Gemini 3.8 Live API connection unavailable. You can use the Voice Assistant text/audio fallback.',
        })
      );
    }
  }
});

// Mount Vite or Serve Static Build
async function setupApp() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
});
