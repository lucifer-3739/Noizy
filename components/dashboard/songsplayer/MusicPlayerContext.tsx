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
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  currentIndex: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;

  currentTime: number;
  duration: number;

  playSong: (song: Song, list?: Song[], startIndex?: number) => void;
  playAtIndex: (idx: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (v: number) => void;
  seekTo: (timeSec: number) => void;
  toggleShuffle: () => void;
  setRepeat: (r: RepeatMode) => void;

  ui: PlayerUI;
  openMiniPlayer: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  hidePlayer: () => void;

  overlay: OverlayUI;
  openUpload: () => void;
  closeUpload: () => void;

  analyser: AnalyserNode | null;

  refreshTrigger: number;
  triggerRefresh: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
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

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🔄 State ref for event listeners
  const stateRef = useRef({
    playlist,
    currentIndex,
    repeat,
  });

  useEffect(() => {
    stateRef.current = {
      playlist,
      currentIndex,
      repeat,
    };
  }, [playlist, currentIndex, repeat]);

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

    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration || 0);

    // ✅ FIXED: correct repeat logic
    audio.onended = () => {
      const state = stateRef.current;

      // 🔁 Repeat ONE
      if (state.repeat === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => { });
        return;
      }

      if (!state.playlist.length) return;

      const nextIndex = state.currentIndex + 1;

      // ⛔ End of playlist
      if (nextIndex >= state.playlist.length) {
        // 🔁 Repeat ALL
        if (state.repeat === "all") {
          const firstSong = state.playlist[0];
          setCurrentIndex(0);
          setCurrentSong(firstSong);

          audio.src = firstSong.streamUrl;
          audio.load();
          audio.play().catch(() => { });
        }
        // 🚫 Repeat NONE → stop
        return;
      }

      // ▶️ Normal next track
      const nextSong = state.playlist[nextIndex];
      setCurrentIndex(nextIndex);
      setCurrentSong(nextSong);

      audio.src = nextSong.streamUrl;
      audio.load();
      audio.play().catch(() => { });
    };

    audioRef.current = audio;
    analyserRef.current = analyser;
    document.body.appendChild(audio);

    return () => {
      audio.pause();
      ctx.close();
      audio.remove();
    };
  }, []);

  const loadAndPlay = async (song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = song.streamUrl;
    audio.load();
    try {
      await audio.play();
    } catch { }
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
    playAtIndex(currentIndex + 1);
  };

  const prevSong = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    playAtIndex(currentIndex - 1);
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
    hidePlayer: () => {
      setUI("hidden");
      audioRef.current?.pause();
    },

    overlay,
    openUpload: () => setOverlay("upload"),
    closeUpload: () => setOverlay("none"),

    analyser: analyserRef.current,

    refreshTrigger,
    triggerRefresh: () => setRefreshTrigger((p) => p + 1),
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
