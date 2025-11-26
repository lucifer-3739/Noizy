import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { songs, artists, playlists } from "@/db/schema";
import { ilike } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length === 0) {
      return NextResponse.json({ songs: [], artists: [], playlists: [] });
    }

    const query = `%${q}%`;

    const [songResults, artistResults, playlistResults] = await Promise.all([
      db.select().from(songs).where(ilike(songs.title, query)).limit(10),
      db.select().from(artists).where(ilike(artists.name, query)).limit(10),
      db.select().from(playlists).where(ilike(playlists.name, query)).limit(10),
    ]);

    return NextResponse.json({
      songs: songResults,
      artists: artistResults,
      playlists: playlistResults,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
