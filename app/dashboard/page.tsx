"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Upload, Music4 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  const audio = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new Audio();
  }, []);

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => r.json())
      .then((d) => setSongs(d.songs || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!audio) return;
    if (current) {
      audio.src = current.streamUrl; // signed
      audio.onended = () => setPlaying(false);
      if (playing) audio.play();
    } else {
      audio.pause();
    }
  }, [current, playing, audio]);

  const togglePlay = (song?: Song) => {
    if (!audio) return;
    if (song && (!current || current.id !== song.id)) {
      setCurrent(song);
      setPlaying(true);
      return;
    }
    if (!current) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Music4 /> Your Dashboard
          </h1>
          <UploadDialog
            onUploaded={() => {
              setLoading(true);
              fetch("/api/songs")
                .then((r) => r.json())
                .then((d) => setSongs(d.songs || []))
                .finally(() => setLoading(false));
            }}
          />
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading songs…</p>
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
                            <Pause className="mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2" />
                            Play
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

        {/* Mini player */}
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
                    <Pause className="mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2" />
                    Play
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

function UploadDialog({ onUploaded }: { onUploaded: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title"));
    const artist = String(fd.get("artist"));
    const audio = fd.get("audio") as File | null;
    const cover = fd.get("cover") as File | null;
    if (!audio || !cover) return alert("Pick audio and cover");

    setBusy(true);
    try {
      const initRes = await fetch("/api/upload/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioExt: extOf(audio.name),
          coverExt: extOf(cover.name),
        }),
      }).then((r) => r.json());

      if (!initRes.audioUrl || !initRes.coverUrl)
        throw new Error("Failed to init upload");

      // PUT directly to MinIO
      await Promise.all([
        fetch(initRes.audioUrl, { method: "PUT", body: audio }),
        fetch(initRes.coverUrl, { method: "PUT", body: cover }),
      ]);

      const durationSec = await secondsFromFile(audio);

      const commit = await fetch("/api/upload/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          durationSec,
          audioKey: initRes.audioKey,
          coverKey: initRes.coverKey,
        }),
      }).then((r) => r.json());

      if (!commit.song) throw new Error("Commit failed");
      setOpen(false);
      onUploaded();
    } catch (e: any) {
      alert(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full">
        <Upload className="mr-2" />
        Upload
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Upload a new song</h2>
            <form onSubmit={handle} className="space-y-4">
              <div>
                <label className="text-sm">Title</label>
                <input
                  name="title"
                  required
                  className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="text-sm">Artist</label>
                <input
                  name="artist"
                  required
                  className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="text-sm">Audio file</label>
                <input
                  name="audio"
                  type="file"
                  accept="audio/*"
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="text-sm">Cover image</label>
                <input
                  name="cover"
                  type="file"
                  accept="image/*"
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  disabled={busy}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white disabled:opacity-50"
                >
                  {busy ? "Uploading…" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
