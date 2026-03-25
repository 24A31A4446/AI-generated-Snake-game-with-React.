import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Trophy, Music, Gamepad2, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-sans selection:bg-[#ff00ff] selection:text-white overflow-hidden relative">
      {/* Glitch Overlays */}
      <div className="static-overlay" />
      <div className="scanline" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b-4 border-[#ff00ff] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ff00ff] flex items-center justify-center crt-border">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <div className="flex flex-col">
              <h1 
                className="text-4xl font-pixel glitch-text leading-none tracking-tighter"
                data-text="SYSTEM_ERROR://SNAKE.EXE"
              >
                SYSTEM_ERROR://SNAKE.EXE
              </h1>
              <span className="text-xs font-mono text-[#ff00ff] mt-1 uppercase tracking-[0.3em]">
                Protocol: Retro-Futurist_V.04
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase tracking-widest text-[#ff00ff] font-bold mb-1">DATA_HARVESTED</span>
              <div className="flex items-center gap-3 bg-[#ff00ff]/10 px-4 py-2 crt-border">
                <Trophy className="w-5 h-5 text-[#ff00ff]" />
                <span className="text-3xl font-pixel text-white">
                  {score.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Sidebar - Terminal Info */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
            <div className="p-6 crt-border bg-black">
              <div className="flex items-center gap-2 mb-4 text-[#ff00ff]">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-pixel text-xs uppercase tracking-wider">LOG_FILE</h3>
              </div>
              <div className="font-mono text-xs space-y-2 text-[#00ffff]/70">
                <p>&gt; INITIALIZING_GRID...</p>
                <p>&gt; LOADING_SYNTH_CORE...</p>
                <p>&gt; USER_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                <p className="text-[#ff00ff] animate-pulse">&gt; STATUS: UNSTABLE</p>
              </div>
            </div>

            <div className="p-6 crt-border-cyan bg-black">
              <div className="flex items-center gap-2 mb-4 text-[#00ffff]">
                <Gamepad2 className="w-5 h-5" />
                <h3 className="font-pixel text-xs uppercase tracking-wider">INPUT_MAP</h3>
              </div>
              <ul className="space-y-3 text-sm font-mono text-[#00ffff]">
                <li className="flex justify-between border-b border-[#00ffff]/20 pb-1">
                  <span>VECTOR_X/Y</span>
                  <span className="text-[#ff00ff]">[ARROWS]</span>
                </li>
                <li className="flex justify-between border-b border-[#00ffff]/20 pb-1">
                  <span>HALT_PROCESS</span>
                  <span className="text-[#ff00ff]">[SPACE]</span>
                </li>
                <li className="flex justify-between border-b border-[#00ffff]/20 pb-1">
                  <span>REBOOT</span>
                  <span className="text-[#ff00ff]">[R]</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Center - The Void (Game) */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              animate={{ 
                x: [0, -2, 2, -1, 1, 0],
                y: [0, 1, -1, 2, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5,
                ease: "linear"
              }}
              className="p-2 bg-[#ff00ff] crt-border"
            >
              <SnakeGame onScoreChange={setScore} />
            </motion.div>
          </div>

          {/* Right Sidebar - Audio Transmission */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="p-2 bg-[#00ffff] crt-border-cyan">
              <MusicPlayer />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 border-t-4 border-[#00ffff] flex justify-between items-center font-mono text-xs tracking-[0.2em] text-[#ff00ff]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ff00ff] animate-ping" />
            <span>CONNECTION_ESTABLISHED: 2026.03.25</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:bg-[#ff00ff] hover:text-black px-2 cursor-crosshair transition-colors">ENCRYPTED_DATA</span>
            <span className="hover:bg-[#00ffff] hover:text-black px-2 cursor-crosshair transition-colors">TERMINATE_SESSION</span>
          </div>
        </footer>
      </main>

      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} 
      />
    </div>
  );
}

