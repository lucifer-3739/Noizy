"use client";

import { useEffect, useState } from "react";
import { fetchSongs } from "@/lib/fetchSongs";
import { Play } from "lucide-react";
import { useMusicPlayer } from "../songsplayer/MusicPlayerContext";

export default function HomePage() {
  const [songs, setSongs] = useState<any[]>([]);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    const loadSongs = async () => {
      const result = await fetchSongs();
      setSongs(result);
    };

    loadSongs();
  }, []);

  return (
    <div className="px-10 text-white pt-10">
      <h2 className="text-3xl font-bold mb-6">Your Songs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition cursor-pointer"
            onClick={() => playSong(song, songs)}
          >
            <div>
              <h3 className="text-xl font-semibold">{song.title}</h3>
              <p className="text-white/50 text-sm">{song.artist}</p>
            </div>

            <Play className="text-white" />
          </div>
        ))}
      </div>
    </div>
  );
}
