"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { motion } from "framer-motion";

export default function GlassMusicPlayer({ song }: { song: any }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
  };

  const handleSeek = (e: any) => {
    if (!audioRef.current) return;
    const val = e.target.value;
    const total = audioRef.current.duration;
    audioRef.current.currentTime = (val / 100) * total;
    setProgress(val);
  };

  return (
    <div className="w-full flex justify-center items-center p-8">
      {/* Glass container */}
      <div
        className="
        w-full max-w-md p-6 rounded-3xl 
        bg-white/10 backdrop-blur-xl shadow-2xl 
        border border-white/20
        flex flex-col items-center gap-6
        text-white
      "
      >
        {/* Cover Art */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src={song?.cover || "https://placehold.co/400x400"}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Song Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-wide">
            {song?.title || "Unknown Song"}
          </h2>
          <p className="text-white/70">{song?.artist || "Unknown Artist"}</p>
        </div>

        {/* Seek Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full accent-white cursor-pointer"
        />

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 shadow-md"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>

          <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
            <SkipForward size={24} />
          </button>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={`/api/songs/${song.id}/stream`}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  );
}
