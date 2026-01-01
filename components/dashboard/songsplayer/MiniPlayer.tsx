"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X } from "lucide-react";
import { useMusicPlayer } from "./MusicPlayerContext";

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    ui,
    openFullPlayer,
    hidePlayer,
    currentTime,
    duration,
  } = useMusicPlayer();

  if (ui !== "mini" || !currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      layoutId="player-container"
      onClick={openFullPlayer}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md h-16 rounded-2xl cursor-pointer overflow-hidden z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10" />

      <div className="relative h-full flex items-center px-3 gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
          {currentSong.coverUrl ? (
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-400 to-blue-600 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{currentSong.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong.artist || "Unknown Artist"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div key="pause">
                  <Pause className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="play">
                  <Play className="w-5 h-5 ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              hidePlayer();
            }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* REAL PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-blue-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
