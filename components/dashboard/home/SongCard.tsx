"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Plus, Check, Music2 } from "lucide-react";
import { Song, useMusicPlayer } from "@/components/dashboard/songsplayer/MusicPlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Playlist } from "@/types";

interface SongCardProps {
    song: Song;
    playlist?: Song[];
    userPlaylists?: Playlist[];
}

export default function SongCard({ song, playlist, userPlaylists = [] }: SongCardProps) {
    const { playSong, isPlaying, currentSong } = useMusicPlayer();
    const [showPlaylists, setShowPlaylists] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isCurrent = isPlaying && currentSong?.id === song.id;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowPlaylists(false);
            }
        };

        if (showPlaylists) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPlaylists]);

    const addToPlaylist = async (playlistId: number) => {
        try {
            const res = await fetch("/api/playlists/add-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playlistId, songId: song.id }),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Added to playlist");
                setShowPlaylists(false);
            } else {
                toast.error(data.error || "Failed to add song");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handlePlay = (e: React.MouseEvent) => {
        // Don't play if clicking the add button or menu
        if ((e.target as HTMLElement).closest(".playlist-menu-trigger")) return;
        playSong(song, playlist);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="relative group w-[220px] lg:w-[240px] aspect-square rounded-[24px] overflow-hidden bg-zinc-900 shadow-xl cursor-pointer"
            onClick={handlePlay}
        >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={song.coverUrl || "https://placehold.co/400x400"}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />

                {/* Dark Overlay Gradient - Stronger for readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            </div>

            {/* Play Overlay (Center) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play fill="white" className="ml-1 text-white" />
                </div>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-2 z-10">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-bold text-white leading-tight line-clamp-1 drop-shadow-md" title={song.title}>
                        {song.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                        <p className="text-[11px] font-medium text-white/80 line-clamp-1 drop-shadow-sm" title={song.artist}>
                            {song.artist || "Unknown Artist"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    {/* Duration / Stats */}
                    <div className="flex items-center gap-1 text-[10px] text-white/70 font-medium tracking-wide bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                        <Music2 size={10} />
                        <span>{song.durationSec ? `${Math.floor(song.durationSec / 60)}:${(song.durationSec % 60).toString().padStart(2, '0')}` : "Audio"}</span>
                    </div>

                    {/* Add Button */}
                    <div className="relative playlist-menu-trigger">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPlaylists(!showPlaylists);
                            }}
                            className="h-6 px-3 bg-white text-black text-[10px] font-bold rounded-full flex items-center gap-0.5 shadow-lg hover:bg-zinc-200 transition-colors"
                        >
                            Add <Plus size={12} strokeWidth={3} />
                        </motion.button>

                        {/* Custom Dropdown Menu */}
                        <AnimatePresence>
                            {showPlaylists && (
                                <motion.div
                                    ref={menuRef}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full right-0 mb-2 w-48 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1 z-500"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider border-b border-white/5 mb-1">
                                        Add to Playlist
                                    </div>

                                    <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                                        {userPlaylists.length > 0 ? (
                                            userPlaylists.map((pl) => (
                                                <button
                                                    key={pl.id}
                                                    onClick={() => addToPlaylist(pl.id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition"
                                                >
                                                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                                                        <Music2 size={12} className="text-white/50" />
                                                    </div>
                                                    <span className="truncate">{pl.name}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-3 py-4 text-center text-xs text-white/40">
                                                No playlists found.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}
