"use client";

import { useEffect, useState } from "react";
import { ArtistWithSongs, fetchArtists } from "@/lib/fetchArtists";
import ArtistRow from "./ArtistRow";

export default function ArtistSection() {
    const [artists, setArtists] = useState<ArtistWithSongs[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchArtists();
                setArtists(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="h-8 w-48 bg-white/5 rounded-lg" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="h-48 w-[160px] bg-white/5 rounded-xl" />
                            ))}
                        </div>
                    </div>
                ))}
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
