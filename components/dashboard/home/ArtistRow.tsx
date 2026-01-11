"use client";

import { ArtistWithSongs } from "@/lib/fetchArtists";
import SongCard from "./SongCard";

interface ArtistRowProps {
    artist: ArtistWithSongs;
    onSeeAll?: () => void;
}

export default function ArtistRow({ artist, onSeeAll }: ArtistRowProps) {
    if (!artist.songs || artist.songs.length === 0) return null;

    const isDisabled = !onSeeAll;

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                    {artist.name}
                </h3>

                <button
                    onClick={onSeeAll}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    className={`text-xs font-medium uppercase tracking-wider transition
            ${isDisabled
                            ? "text-white/30 cursor-not-allowed"
                            : "text-white/50 hover:text-white"
                        }
          `}
                >
                    See All
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {artist.songs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        playlist={artist.songs}
                    />
                ))}
            </div>
        </div>
    );
}
