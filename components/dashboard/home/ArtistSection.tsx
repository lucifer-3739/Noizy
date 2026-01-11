"use client";

import { useEffect, useState } from "react";
import { ArtistWithSongs, fetchArtists } from "@/lib/fetchArtists";
import ArtistRow from "./ArtistRow";

export default function ArtistSection() {
    const [artists, setArtists] = useState<ArtistWithSongs[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await fetchArtists();
                if (mounted) {
                    setArtists(data);
                }
            } catch (err) {
                console.error("Artist fetch failed:", err);
                if (mounted) {
                    setError("Failed to load artists. Please try again.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="h-8 w-48 bg-white/5 rounded-lg" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((j) => (
                                <div
                                    key={j}
                                    className="h-48 w-[160px] bg-white/5 rounded-xl"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-12 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
            </div>
        );
    }

    if (artists.length === 0) {
        return (
            <div className="mt-12 text-center text-white/50">
                No artists found.
            </div>
        );
    }

    return (
        <div className="space-y-8 mt-12 mb-20">
            {artists.map((artist) => (
                <ArtistRow key={artist.id} artist={artist} />
            ))}
        </div>
    );
}
