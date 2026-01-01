"use client";

import { motion } from "framer-motion";
import {
  Upload,
  Music,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useMusicPlayer } from "./MusicPlayerContext";

export default function UploadSongPlayer() {
  const { overlay, closeUpload } = useMusicPlayer();

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = Boolean(audio && cover && title && artist);

  if (overlay !== "upload") return null;

  /* --------------------------------------------------
     🔥 GET AUDIO DURATION (required by your API)
  -------------------------------------------------- */
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audioEl = document.createElement("audio");
      audioEl.src = URL.createObjectURL(file);
      audioEl.preload = "metadata";

      audioEl.onloadedmetadata = () => {
        resolve(Math.floor(audioEl.duration));
        URL.revokeObjectURL(audioEl.src);
      };

      audioEl.onerror = () => reject(new Error("Failed to load audio"));
    });
  };

  /* --------------------------------------------------
     🚀 UPLOAD HANDLER
  -------------------------------------------------- */
  const handleUpload = async () => {
    if (!ready || !audio || !cover) return;

    setLoading(true);
    setError(null);

    try {
      const duration = await getAudioDuration(audio);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("audio", audio);
      formData.append("cover", cover);
      formData.append("duration", String(duration));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // ✅ success
      closeUpload();

      // (optional later)
      // addSongToPlaylist(data.song)
      // playSong(data.song)
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-999 flex items-end md:items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={closeUpload}
      />

      {/* Card */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-white"
      >
        {/* Close */}
        <button
          onClick={closeUpload}
          className="absolute right-4 top-4 p-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            {cover ? (
              <img
                src={URL.createObjectURL(cover)}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="opacity-50" size={32} />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold">Upload New Track</h2>
            <p className="text-white/60 text-sm">
              Share your sound with the world
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Song title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 px-4 rounded-xl bg-white/10 border border-white/10 outline-none"
          />
          <input
            placeholder="Artist name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="h-12 px-4 rounded-xl bg-white/10 border border-white/10 outline-none"
          />
        </div>

        {/* Upload zones */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => audioInputRef.current?.click()}
            className="h-28 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-2"
          >
            <Music />
            <span className="text-sm truncate px-2">
              {audio ? audio.name : "Upload audio file"}
            </span>
          </button>

          <button
            onClick={() => coverInputRef.current?.click()}
            className="h-28 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-2"
          >
            <ImageIcon />
            <span className="text-sm truncate px-2">
              {cover ? cover.name : "Upload cover image"}
            </span>
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setCover(e.target.files?.[0] || null)}
        />

        {/* Error */}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {/* Action */}
        <div className="mt-8 flex justify-end">
          <motion.button
            onClick={handleUpload}
            disabled={!ready || loading}
            whileHover={ready && !loading ? { scale: 1.05 } : {}}
            whileTap={ready && !loading ? { scale: 0.95 } : {}}
            className={`
              px-6 h-12 rounded-full flex items-center gap-2 font-semibold
              ${
                ready && !loading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-white/10 cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading…
              </>
            ) : ready ? (
              <>
                <Upload size={18} />
                Upload Song
              </>
            ) : (
              <>
                <Check size={18} />
                Fill all details
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
