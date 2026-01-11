"use client";

import { useEffect, useState } from "react";
import { fetchSongs } from "@/lib/fetchSongs";
import { fetchPlaylists } from "@/lib/fetchPlaylists";
import { Play } from "lucide-react";
import { useMusicPlayer } from "../songsplayer/MusicPlayerContext";
import ArtistSection from "./ArtistSection";
import SongCard from "./SongCard";

export default function HomePage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { playSong, refreshTrigger } = useMusicPlayer();

  useEffect(() => {
    const loadData = async () => {
      const [songsData, playlistsData] = await Promise.all([
        fetchSongs(),
        fetchPlaylists()
      ]);
      setSongs(songsData);
      setPlaylists(playlistsData);
    };

    loadData();
  }, [refreshTrigger]);

  return (
    <div className="px-10 text-white pt-10">
      <h2 className="text-3xl font-bold mb-6">Your Songs</h2>

      <div className="flex flex-wrap gap-6">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} playlist={songs} userPlaylists={playlists} />
        ))}
      </div>
    </div>
  );
}
