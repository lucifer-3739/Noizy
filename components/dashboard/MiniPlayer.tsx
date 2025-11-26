"use client";

import { usePlayer } from "./player-context";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { formatTime } from "@/lib/utils";

export function Player() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    duration,
    seek,
    volume,
    setVolume,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-full md:w-1/3">
          <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-md overflow-hidden shrink-0">
            {currentSong.coverUrl ? (
              <img
                src={currentSong.coverUrl || "/placeholder.svg"}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                No Cover
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
              {currentSong.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
              {currentSong.artist?.name || "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
          <div className="flex items-center gap-6">
            <button
              onClick={playPrevious}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              aria-label="Previous"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </button>
            <button
              onClick={playNext}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              aria-label="Next"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="w-full flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span>{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 w-1/3 justify-end">
          <Volume2 size={18} className="text-zinc-400" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
