import { db } from "@/db/drizzle";
import { songs, artists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        if (isNaN(numericId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const [song] = await db
            .select()
            .from(songs)
            .where(eq(songs.id, numericId));

        if (!song) {
            return new NextResponse("Song not found", { status: 404 });
        }

        const [artist] = await db
            .select()
            .from(artists)
            .where(eq(artists.id, song.artistId));

        // Process cover URL
        // We expect the DB to possibly contain a full URL or a relative path or a MinIO key.
        // The logic below attempts to extract the key if it looks like a full URL.
        const cleanKey = song.coverUrl
            ?.replace(/^https?:\/\/[^/]+\/[^/]+\//, "") // remove protocol + host + bucket/
            .replace(/^\/+/, ""); // remove extra slashes

        const responseData = {
            id: song.id,
            title: song.title,
            artist: artist?.name || "Unknown Artist",
            cover: cleanKey ? `/api/covers/${encodeURIComponent(cleanKey)}` : null,
            coverUrl: cleanKey ? `/api/covers/${encodeURIComponent(cleanKey)}` : null,
            streamUrl: `/api/songs/${song.id}/stream`,
            durationSec: song.duration,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Error fetching song details:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
