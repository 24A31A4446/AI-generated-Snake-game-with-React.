import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "NEON_DREAMS.MP3",
    artist: "SYNTH_CORE_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff"
  },
  {
    id: 2,
    title: "CYBER_PULSE.WAV",
    artist: "GLITCH_UNIT_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "MIDNIGHT_DRIVE.FLAC",
    artist: "RETRO_PROCESSOR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffffff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md p-6 bg-black border-4 border-[#00ffff] shadow-[0_0_20px_#00ffff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          animate={isPlaying ? { 
            rotate: 360,
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ 
            rotate: { repeat: Infinity, duration: 5, ease: "linear" },
            scale: { repeat: Infinity, duration: 0.5 }
          }}
          className="w-16 h-16 bg-[#ff00ff] flex items-center justify-center crt-border"
        >
          <Music2 className="text-black w-8 h-8" />
        </motion.div>
        
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <h3 className="text-[#00ffff] font-pixel text-[10px] truncate uppercase mb-1">
                {currentTrack.title}
              </h3>
              <p className="text-[#ff00ff] font-mono text-xs truncate uppercase tracking-widest">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-4 w-full bg-black border-2 border-[#ff00ff] p-0.5 overflow-hidden mb-2">
          <motion.div 
            className="h-full bg-[#ff00ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#00ffff] font-mono uppercase">
          <span>00:00</span>
          <span>03:45</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={skipBackward}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 bg-[#00ffff] flex items-center justify-center hover:bg-[#ff00ff] transition-all crt-border-cyan"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-black fill-black" />
          ) : (
            <Play className="w-8 h-8 text-black fill-black ml-1" />
          )}
        </button>
        
        <button 
          onClick={skipForward}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>

      <div className="mt-6 pt-6 border-t-2 border-[#00ffff]/20 flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-[#ff00ff]" />
        <div className="h-2 flex-1 bg-black border border-[#ff00ff]">
          <div className="h-full w-2/3 bg-[#ff00ff]" />
        </div>
      </div>
    </div>
  );
}
