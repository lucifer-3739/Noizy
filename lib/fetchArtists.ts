import { Song } from "@/components/dashboard/songsplayer/MusicPlayerContext";

export interface ArtistWithSongs {
    id: number;
    name: string;
    bio: string | null;
    imageUrl: string | null;
    createdAt: string | null;
    songs: Song[];
}

export async function fetchArtists(): Promise<ArtistWithSongs[]> {
    try {
        const res = await fetch("/api/artists", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        return data.artists;
    } catch (error) {
        console.error("Error fetching artists:", error);
        return [];
    }
}
