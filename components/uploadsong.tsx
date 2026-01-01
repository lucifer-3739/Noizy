"use client";

import * as React from "react";
import { Upload, X, Music, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

type Props = {
  action: (fd: FormData) => void;
};

export default function AudioUploadForm({ action }: Props) {
  const [audio, setAudio] = React.useState<File | null>(null);
  const [cover, setCover] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [artist, setArtist] = React.useState("");

  const audioRef = React.useRef<HTMLInputElement>(null);
  const coverRef = React.useRef<HTMLInputElement>(null);

  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!audio || !title || !artist) return;

    const fd = new FormData();
    fd.append("title", title);
    fd.append("artist", artist);
    fd.append("audioFile", audio);
    if (cover) fd.append("coverFile", cover);

    startTransition(() => {
      action(fd);
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-4xl border border-border p-6 space-y-6">
      {/* Text Inputs */}
      <div className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title"
          className="w-full h-12 px-4 rounded-xl bg-muted outline-none"
        />
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist name"
          className="w-full h-12 px-4 rounded-xl bg-muted outline-none"
        />
      </div>

      {/* Audio Upload */}
      <div
        onClick={() => audioRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition",
          audio ? "border-green-400" : "border-border hover:bg-muted/40"
        )}
      >
        <input
          ref={audioRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
        />

        <Music className="mx-auto mb-2 text-blue-500" />
        <p className="text-sm">
          {audio ? audio.name : "Click to upload audio file"}
        </p>
      </div>

      {/* Cover Upload */}
      <div
        onClick={() => coverRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition",
          cover ? "border-purple-400" : "border-border hover:bg-muted/40"
        )}
      >
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setCover(e.target.files?.[0] ?? null)}
        />

        <ImageIcon className="mx-auto mb-2 text-purple-500" />
        <p className="text-sm">
          {cover ? cover.name : "Upload cover image (optional)"}
        </p>
      </div>

      {/* Action */}
      <Button
        className="w-full h-14 rounded-full text-lg bg-blue-600 hover:bg-blue-700"
        disabled={pending || !audio || !title || !artist}
        onClick={submit}
      >
        {pending ? "Uploading..." : "Upload Song"}
      </Button>
    </div>
  );
}
