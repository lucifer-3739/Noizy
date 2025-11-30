"use client";

import { createContext, useContext, useRef, useState } from "react";

type Song = {
  id: number;
  title: string;
  artist: string;
  streamUrl: string;
  coverUrl?: string;
};

interface MusicPlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null);

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop current playing audio
    audio.pause();

    // Set state
    setCurrentSong(song);
    setIsPlaying(false);

    // Remove old event listeners
    audio.oncanplay = null;
    audio.onloadedmetadata = null;
    audio.onerror = null;

    // Set new stream URL
    audio.src = song.streamUrl;

    // Load it
    audio.load();

    // Wait for audio to be ready to start
    audio.oncanplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Playback interrupted:", err);
      }
    };
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)!;
