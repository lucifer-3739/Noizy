import { db } from "@/db/drizzle";
import { songs, artists } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allSongs = await db.select().from(songs);
  const artistList = await db.select().from(artists);

  const songsWithArtist = allSongs.map((s) => {
    const artist = artistList.find((a) => a.id === s.artistId);

    // Extract object key: "covers/xyz.jpg"
    const cleanKey = s.coverUrl
      ?.replace(/^https?:\/\/[^/]+\/[^/]+\//, "") // remove protocol + host + bucket/
      .replace(/^\/+/, ""); // remove extra slashes

    return {
      id: s.id,
      title: s.title,
      artist: artist?.name,
      coverUrl: cleanKey ? `/api/covers/${encodeURIComponent(cleanKey)}` : null,
      streamUrl: `/api/songs/${s.id}/stream`,
      durationSec: s.duration,
    };
  });

  return NextResponse.json({ songs: songsWithArtist });
}
