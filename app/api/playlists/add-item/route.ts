import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { playlistItems, playlists, songs } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

const AddItemSchema = z.object({
  playlistId: z.number().positive(),
  songId: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { playlistId, songId } = AddItemSchema.parse(body);

    // Check playlist exists
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1);

    if (existingPlaylist.length === 0) {
      return NextResponse.json(
        { error: "Playlist not found." },
        { status: 404 }
      );
    }

    // Check song exists
    const existingSong = await db
      .select()
      .from(songs)
      .where(eq(songs.id, songId))
      .limit(1);

    if (existingSong.length === 0) {
      return NextResponse.json({ error: "Song not found." }, { status: 404 });
    }

    // Get next position
    const allItems = await db
      .select()
      .from(playlistItems)
      .where(eq(playlistItems.playlistId, playlistId));

    const nextPosition = allItems.length + 1;

    // Insert playlist item
    const [item] = await db
      .insert(playlistItems)
      .values({
        playlistId,
        songId,
        position: sql`(
+          SELECT COALESCE(MAX(position), 0) + 1
+          FROM ${playlistItems}
+          WHERE ${playlistItems.playlistId} = ${playlistId}
+        )`,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Song added to playlist",
        item,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Playlist item add error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
