"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

export default function PlaylistClient({ id }: { id: string }) {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/playlists/${id}`);
      if (!res.ok) return notFound();

      const data = await res.json();
      setPlaylist(data);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!playlist) return <div>Not found</div>;

  return (
    <div>
      <h1>{playlist.name}</h1>
    </div>
  );
}
