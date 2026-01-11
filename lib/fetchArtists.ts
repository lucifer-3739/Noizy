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
    const res = await fetch("/api/artists", { cache: "no-store" });

    if (!res.ok) {
        const message = `Failed to fetch artists (status ${res.status})`;
        throw new Error(message);
    }

    const data = await res.json();

    if (!data?.artists || !Array.isArray(data.artists)) {
        throw new Error("Invalid artists response shape");
    }

    return data.artists;
}
