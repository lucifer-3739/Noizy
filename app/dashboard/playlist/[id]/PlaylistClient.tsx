"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Playlist } from "@/types";

export default function PlaylistClient({ id }: { id: string }) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/playlists/${id}`);
     if (!res.ok) {
       if (!cancelled) {
        setPlaylist(null);
        setLoading(false);
      }
       return;
     }
      const data = await res.json();
      if (!cancelled) {
        setPlaylist(data);
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);
  
  if (loading) return <div>Loading...</div>;
  if (!playlist) return <div>Not found</div>;

  return (
    <div>
      <h1>{playlist.name}</h1>
    </div>
  );
}
