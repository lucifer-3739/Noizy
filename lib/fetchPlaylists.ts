import { Playlist } from "@/types";

export async function fetchPlaylists(): Promise<Playlist[]> {
    try {
        const res = await fetch("/api/playlists", { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`Failed to fetch playlists: ${res.status}`);
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return [];
    }
}
