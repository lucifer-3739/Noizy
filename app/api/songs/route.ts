import { db } from "@/db/drizzle";
import { songs, artists } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const allSongs = await db.select().from(songs);
  const artistList = await db.select().from(artists);

  const songsWithArtist = allSongs.map((s) => {
    const artist = artistList.find((a) => a.id === s.artistId);
    return {
      id: s.id,
      title: s.title,
      artist: artist?.name || "Unknown",
      durationSec: s.duration ?? 0,
      coverUrl: s.coverUrl ?? "",
      streamUrl: `/api/songs/${s.id}/stream`, // ✅ used by Dashboard
    };
  });

  return NextResponse.json({ songs: songsWithArtist });
}
