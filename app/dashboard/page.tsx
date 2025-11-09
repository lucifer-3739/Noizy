"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UploadDialog from "@/components/dashboard/UploadDialog"; // adjust path if needed
import { toast } from "sonner";

type Song = {
  id: number;
  title: string;
  artist: string;
  durationSec: number;
  coverUrl: string;
  streamUrl: string;
};

export default function DashboardPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Song | null>(null);
  const [playing, setPlaying] = useState(false);

  // 🎧 Create a single audio instance
  const audio = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new Audio();
  }, []);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [audio]);

  // 🔄 Fetch all songs
  async function fetchSongs() {
    try {
      const res = await fetch("/api/songs");
      if (!res.ok) throw new Error("Failed to fetch songs");
      const data = await res.json();
      setSongs(data.songs || []);
    } catch (err: any) {
      console.error("Fetch songs error:", err);
      toast.error(err.message || "Error loading songs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  // 🔊 Handle audio playback
  useEffect(() => {
    if (!audio) return;
    if (current) {
      audio.src = current.streamUrl; // use stream endpoint
      audio.onended = () => setPlaying(false);
      if (playing) {
        audio
          .play()
          .then(() => console.log(`Playing: ${current.title}`))
          .catch((err) => {
            console.error("Playback error:", err);
            toast.error("Could not play audio");
            setPlaying(false);
          });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [current, playing, audio]);

  const togglePlay = (song?: Song) => {
    if (!audio) return;
    // if selecting a new song
    if (song && (!current || current.id !== song.id)) {
      setCurrent(song);
      setPlaying(true);
      return;
    }
    // if toggling current song
    if (!current) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch((err) => {
        console.error("Playback error:", err);
        toast.error("Could not play audio");
      });
      setPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Music4 /> Your Dashboard
          </h1>

          {/* ✅ Refreshes song list on upload */}
          <UploadDialog
            onUploaded={() => {
              setLoading(true);
              fetchSongs();
            }}
          />
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading songs…</p>
        ) : songs.length === 0 ? (
          <p className="text-zinc-500">No songs uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 hover:border-emerald-500 transition-all">
                  <CardContent className="p-4">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.coverUrl}
                        alt={s.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="text-sm text-zinc-400">{s.artist}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {Math.floor(s.durationSec / 60)}:
                        {String(s.durationSec % 60).padStart(2, "0")}
                      </span>
                      <Button
                        className="rounded-full"
                        onClick={() => togglePlay(s)}
                      >
                        {current?.id === s.id && playing ? (
                          <>
                            <Pause className="mr-2" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2" /> Play
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* 🎧 Mini player */}
        {current && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded-2xl px-6 py-4 shadow-2xl">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.coverUrl}
                alt={current.title}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">{current.title}</div>
                <div className="text-xs text-zinc-400">{current.artist}</div>
              </div>
              <Button className="rounded-full" onClick={() => togglePlay()}>
                {playing ? (
                  <>
                    <Pause className="mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2" /> Play
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function extOf(filename: string) {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot);
}

function secondsFromFile(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      resolve(Math.max(1, Math.floor(audio.duration || 1)));
      URL.revokeObjectURL(audio.src);
    };
    audio.src = URL.createObjectURL(file);
  });
}

<UploadDialog
  onUploaded={function (): void {
    throw new Error("Function not implemented.");
  }}
/>;
