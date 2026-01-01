import { Song } from "@/types";

export async function fetchSongs(): Promise<Song[]> {
  try {
    const res = await fetch("/api/song", { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch songs: ${res.status}`);
    }

    const data = await res.json();

    return Array.isArray(data.songs) ? data.songs : [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}
