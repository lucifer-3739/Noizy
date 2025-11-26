"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";

const UploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist name is required"),
  audio: z.instanceof(File, { message: "Audio file is required" }),
  cover: z.instanceof(File, { message: "Cover image is required" }),
  duration: z.number().int().positive("Duration must be positive"),
  album: z.string().optional().nullable().default(null),
});

// Utility for duration
async function secondsFromFile(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(Math.floor(audio.duration));
    };
    audio.onerror = () => reject(new Error("Failed to read audio duration"));
  });
}

export default function UploadDialog({
  onUploaded,
}: {
  onUploaded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const audio = fd.get("audio") as File | null;
    const cover = fd.get("cover") as File | null;
    const title = String(fd.get("title"));
    const artist = String(fd.get("artist"));
    const album = fd.get("album") || null;

    if (!audio || !cover || !title || !artist) {
      toast.error("Please fill all fields and select both files.");
      return;
    }

    try {
      setBusy(true);
      // ⏱️ Calculate audio duration before upload
      const durationSec = await secondsFromFile(audio);
           // Validate with schema
      const validation = UploadSchema.safeParse({
        title,
        artist,
        audio,
        cover,
        duration: durationSec,
        album,
      });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

     fd.append("duration", durationSec.toString());

      // ✅ Upload to /api/upload (single request with files)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast.success("Song uploaded successfully!");
      setOpen(false);
      onUploaded?.();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload song.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full">
        <Upload className="mr-2" /> Upload
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
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
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  disabled={busy}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white disabled:opacity-50 hover:bg-emerald-600"
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
