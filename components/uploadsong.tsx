"use client";
import { useState, FormEvent } from "react";
import { useTransition } from "react"; // useTransition for pending state

export default function UploadSongForm({
  action,
}: {
  action: (fd: FormData) => void;
}) {
  const [audio, setAudio] = useState<File | null>(null);
  const [art, setArt] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState<number>(1);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("artistId", String(artistId));
    if (audio) fd.append("audioFile", audio);
    if (art) fd.append("artworkFile", art);
    startTransition(() => {
      action(fd);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Song title"
      />
      <input
        type="number"
        value={artistId}
        onChange={(e) => setArtistId(Number(e.target.value))}
        placeholder="Artist ID"
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setArt(e.target.files?.[0] ?? null)}
      />
      <button type="submit" disabled={pending}>
        {pending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
