"use client";

import { useEffect, useState } from "react";
import { fetchSongs } from "@/lib/fetchSongs";
import { fetchPlaylists } from "@/lib/fetchPlaylists";
import { useMusicPlayer } from "../songsplayer/MusicPlayerContext";
import ArtistSection from "./ArtistSection";
import SongCard from "./SongCard";

export default function HomePage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { refreshTrigger } = useMusicPlayer();

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          fetchSongs(),
          fetchPlaylists(),
        ]);

        if (!mounted) return;

        const [songsResult, playlistsResult] = results;

        if (songsResult.status === "fulfilled") {
          setSongs(songsResult.value);
        } else {
          console.error("Failed to fetch songs:", songsResult.reason);
          setSongs([]);
          setError("Some content failed to load.");
        }

        if (playlistsResult.status === "fulfilled") {
          setPlaylists(playlistsResult.value);
        } else {
          console.error("Failed to fetch playlists:", playlistsResult.reason);
          setPlaylists([]);
          setError("Some content failed to load.");
        }
      } catch (err) {
        // This should rarely happen, but keep it safe
        console.error("Unexpected error loading home data:", err);
        if (mounted) {
          setError("Failed to load content. Please refresh.");
          setSongs([]);
          setPlaylists([]);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [refreshTrigger]);

  return (
    <div className="px-10 text-white pt-10 space-y-16">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Songs Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Your Songs</h2>

        <div className="flex flex-wrap gap-6">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              playlist={songs}
              userPlaylists={playlists}
            />
          ))}

          {songs.length === 0 && !error && (
            <p className="text-white/50">No songs available.</p>
          )}
        </div>
      </section>

      {/* Artists Section */}
      <section>
        <ArtistSection />
      </section>
    </div>
  );
}
