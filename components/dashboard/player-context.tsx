"use client";

import { Song } from "@/types";
import type React from "react";
import { createContext, useContext, useState, useRef, useEffect } from "react";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  playlist: Song[];
  addToQueue: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Song[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => playNext(); // Auto play next

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);

    // Add to playlist if not present (simple queue logic)
    if (!playlist.find((s) => s.id === song.id)) {
      setPlaylist((prev) => [...prev, song]);
    }

    if (audioRef.current) {
      audioRef.current.src = `/api/songs/${song.id}/stream`;
      audioRef.current.play().catch((e) => console.error("Play error:", e));
    }
  };

  const togglePlay = () => {
    if (!currentSong || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const nextSong = playlist[(currentIndex + 1) % playlist.length];
    if (nextSong) playSong(nextSong);
  };

  const playPrevious = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIndex =
      currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    if (prevSong) playSong(prevSong);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, vol));
      setVolumeState(vol);
    }
  };

  const addToQueue = (song: Song) => {
    setPlaylist((prev) => [...prev, song]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        progress,
        duration,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        playlist,
        addToQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};
