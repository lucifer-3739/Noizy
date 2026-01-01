"use client";

import { motion } from "framer-motion";
import { useMusicPlayer } from "./MusicPlayerContext";
import Waveform from "./Waveform";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume,
} from "lucide-react";

export default function FullPlayer() {
  const {
    ui,
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    playlist,
    currentIndex,
    setVolume,
    volume,
    shuffle,
    toggleShuffle,
    repeat,
    setRepeat,
    closeFullPlayer,
    playAtIndex,
    currentTime,
    duration,
    seekTo,
  } = useMusicPlayer();

  if (ui !== "full" || !currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  return (
    <motion.div
      layoutId="player-container"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeFullPlayer}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-4xl bg-white/6 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeFullPlayer}
          className="absolute right-4 top-4 p-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/8">
            {currentSong.coverUrl ? (
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                🎵
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{currentSong.title}</h2>
            <p className="text-white/70">{currentSong.artist}</p>
          </div>
        </div>

        {/* Waveform */}
        <div className="mt-6">
          <Waveform height={120} />
        </div>

        {/* 🔥 TIMELINE */}
        <div
          className="mt-3 h-1 w-full bg-white/15 rounded-full cursor-pointer relative"
          onClick={handleSeek}
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={toggleShuffle}
            className={shuffle ? "text-blue-400" : "text-white/70"}
          >
            <Shuffle />
          </button>

          <button onClick={prevSong}>
            <SkipBack />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button onClick={nextSong}>
            <SkipForward />
          </button>

          <button
            onClick={() =>
              setRepeat(
                repeat === "none" ? "all" : repeat === "all" ? "one" : "none"
              )
            }
            className={repeat !== "none" ? "text-blue-400" : "text-white/70"}
          >
            <Repeat />
          </button>
        </div>

        {/* Queue + Volume */}
        <div className="mt-6 flex items-start gap-6">
          {/* Queue */}
          <div className="flex-1">
            <h3 className="text-sm text-white/70 mb-2">Queue</h3>
            <div className="max-h-48 overflow-auto space-y-2 pr-2">
              {playlist.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    i === currentIndex ? "bg-white/10" : "bg-white/4"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-white/6">
                      {s.coverUrl ? (
                        <img
                          src={s.coverUrl}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          🎵
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {s.title}
                      </div>
                      <div className="truncate text-xs text-white/60">
                        {s.artist}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => playAtIndex(i)}
                    className="p-2 rounded-md bg-white/6 hover:bg-white/10"
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div className="w-44">
            <h4 className="text-sm text-white/70 mb-2">Volume</h4>
            <div className="flex items-center gap-2">
              <Volume size={18} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    rgba(96,165,250,1) 0%,
                    rgba(96,165,250,1) ${volume * 100}%,
                    rgba(255,255,255,0.2) ${volume * 100}%,
                    rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
