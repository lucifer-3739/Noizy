"use client";

import { useEffect, useState } from "react";
import { Playlist } from "@/types";
import { Song, useMusicPlayer } from "@/components/dashboard/songsplayer/MusicPlayerContext";
import { Play, Share2, Clock, Music } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PlaylistWithSongs extends Playlist {
  songs: Song[];
}

export default function PlaylistClient({ id }: { id: string }) {
  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null);
  const [loading, setLoading] = useState(true);

  const { playSong } = useMusicPlayer();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/playlists/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();

        if (mounted) {
          setPlaylist(data);
        }
      } catch (err) {
        if (mounted) setPlaylist(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handlePlayAll = () => {
    if (playlist?.songs.length) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="p-10 text-white flex flex-col gap-8 animate-pulse">
        <div className="flex gap-6 items-end">
          <div className="w-52 h-52 bg-white/10 rounded-xl shadow-2xl" />
          <div className="flex flex-col gap-4 w-full">
            <div className="w-32 h-4 bg-white/10 rounded" />
            <div className="w-96 h-12 bg-white/10 rounded" />
            <div className="w-64 h-6 bg-white/10 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-16 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/50">
        <Music size={64} className="mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-white">Playlist Not Found</h2>
        <p>This playlist might be private or deleted.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-linear-to-b from-purple-900/20 to-black p-8 text-white pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-end mb-8">
        {/* Cover */}
        <div className="w-52 h-52 shrink-0 shadow-2xl rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center">
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} className="w-full h-full object-cover" />
          ) : (
            <Music size={64} className="text-white/20" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 w-full">
          <span className="uppercase text-xs font-bold tracking-wider">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-bold font-aerosoldis tracking-wide">
            {playlist.name}
          </h1>
          <p className="text-white/60 text-sm max-w-2xl">
            {playlist.description || "No description"}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Button
              onClick={handlePlayAll}
              className="rounded-full h-12 px-8 bg-green-500 hover:bg-green-400 text-black font-bold text-lg"
            >
              <Play fill="black" className="mr-2" /> Play
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="rounded-full h-12 w-12 p-0 border-white/20 hover:bg-white/10 text-white"
            >
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="flex flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-white/50 text-sm uppercase tracking-wider mb-2">
          <span className="w-8 text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Artist</span>
          <span className="flex justify-end"><Clock size={16} /></span>
        </div>

        {/* Songs */}
        <div className="flex flex-col gap-1">
          {playlist.songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => playSong(song, playlist.songs)}
              className="group grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer items-center"
            >
              <span className="w-8 text-center text-white/50 group-hover:text-white">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play size={14} className="hidden group-hover:inline-block fill-white" />
              </span>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white/10 overflow-hidden shrink-0">
                  {song.coverUrl && <img src={song.coverUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white truncate max-w-[200px] md:max-w-md">{song.title}</span>
                  <span className="md:hidden text-xs text-white/50">{song.artist}</span>
                </div>
              </div>

              <span className="hidden md:block text-white/50 group-hover:text-white transition">
                {song.artist}
              </span>

              <span className="text-white/50 text-sm tabular-nums flex justify-end">
                {formatDuration(song.durationSec)}
              </span>
            </div>
          ))}

          {playlist.songs.length === 0 && (
            <div className="py-10 text-center text-white/50">
              No songs in this playlist yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
