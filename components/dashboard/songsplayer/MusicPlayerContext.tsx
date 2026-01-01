"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Song = {
  id: number;
  title: string;
  artist?: string;
  streamUrl: string;
  coverUrl?: string;
  durationSec?: number;
};

type PlayerUI = "hidden" | "mini" | "full";
type RepeatMode = "none" | "one" | "all";
type OverlayUI = "none" | "upload";

interface MusicPlayerState {
  // 🎵 Player
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  currentIndex: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;

  // ⏱ Timeline
  currentTime: number;
  duration: number;

  // 🎮 Controls
  playSong: (song: Song, list?: Song[], startIndex?: number) => void;
  playAtIndex: (idx: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (v: number) => void;
  seekTo: (timeSec: number) => void;
  toggleShuffle: () => void;
  setRepeat: (r: RepeatMode) => void;

  // 🧠 UI state
  ui: PlayerUI;
  openMiniPlayer: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  hidePlayer: () => void;

  // 📤 Upload overlay
  overlay: OverlayUI;
  openUpload: () => void;
  closeUpload: () => void;

  // 📊 Audio analysis
  analyser: AnalyserNode | null;
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null);

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [overlay, setOverlay] = useState<OverlayUI>("none");
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.9);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeatState] = useState<RepeatMode>("none");
  const [ui, setUI] = useState<PlayerUI>("hidden");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 📤 Upload controls
  const openUpload = () => setOverlay("upload");
  const closeUpload = () => setOverlay("none");

  useEffect(() => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.volume = volume;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.onended = () => {
      if (repeat === "one") {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      nextSong();
    };

    audioRef.current = audio;
    analyserRef.current = analyser;
    document.body.appendChild(audio);

    return () => {
      audio.pause();
      ctx.close();
      audio.remove();
    };
  }, [repeat]);

  const loadAndPlay = async (song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = song.streamUrl;
    audio.load();
    try {
      await audio.play();
    } catch {}
  };

  const playSong = (song: Song, list?: Song[], startIndex?: number) => {
    const active = list ?? playlist;
    if (list) setPlaylist(list);

    const idx = startIndex ?? active.findIndex((s) => s.id === song.id);
    if (idx < 0) return;

    setCurrentIndex(idx);
    setCurrentSong(active[idx]);
    loadAndPlay(active[idx]);
    setUI("mini");
  };

  const playAtIndex = (idx: number) => {
    if (!playlist.length) return;
    const safe = Math.max(0, Math.min(idx, playlist.length - 1));
    setCurrentIndex(safe);
    setCurrentSong(playlist[safe]);
    loadAndPlay(playlist[safe]);
  };

  const nextSong = () => {
    if (!playlist.length) return;
    playAtIndex((currentIndex + 1) % playlist.length);
  };

  const prevSong = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    playAtIndex((currentIndex - 1 + playlist.length) % playlist.length);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
  };

  const setVolume = (v: number) => {
    const safe = Math.max(0, Math.min(1, v));
    setVolumeState(safe);
    if (audioRef.current) audioRef.current.volume = safe;
  };

  const seekTo = (sec: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Math.min(audio.duration, Math.max(0, sec));
  };

  const value: MusicPlayerState = {
    currentSong,
    isPlaying,
    playlist,
    currentIndex,
    volume,
    shuffle,
    repeat,
    currentTime,
    duration,

    playSong,
    playAtIndex,
    togglePlay,
    nextSong,
    prevSong,
    setVolume,
    seekTo,
    toggleShuffle: () => setShuffle((s) => !s),
    setRepeat: setRepeatState,

    ui,
    openMiniPlayer: () => setUI("mini"),
    openFullPlayer: () => setUI("full"),
    closeFullPlayer: () => setUI("mini"),
    hidePlayer: () => setUI("hidden"),

    overlay,
    openUpload,
    closeUpload,

    analyser: analyserRef.current,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used inside MusicPlayerProvider");
  }
  return ctx;
};
