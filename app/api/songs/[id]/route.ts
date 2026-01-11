import { db } from "@/db/drizzle";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = Number(id);

        if (Number.isNaN(numericId)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // ✅ Single query with relation
        const song = await db.query.songs.findFirst({
            where: eq(songs.id, numericId),
            with: {
                artist: true,
            },
        });

        if (!song) {
            return new NextResponse("Song not found", { status: 404 });
        }

        // ✅ Safe coverUrl handling
        const rawCoverUrl = song.coverUrl ?? "";
        const cleanKey = rawCoverUrl
            .replace(/^https?:\/\/[^/]+\/[^/]+\//, "")
            .replace(/^\/+/, "");

        if (!song.artist) {
            console.error(`Data integrity error: Song ${numericId} references non-existent artist ${song.artistId}`);
            return new NextResponse("Internal Server Error: Invalid artist reference", { status: 500 });
        }

        const responseData = {
            id: song.id,
            title: song.title,
            artist: song.artist.name,
            cover: cleanKey
                ? `/api/covers/${encodeURIComponent(cleanKey)}`
                : null,
            coverUrl: cleanKey
                ? `/api/covers/${encodeURIComponent(cleanKey)}`
                : null,
            streamUrl: `/api/songs/${song.id}/stream`,
            durationSec: song.duration,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Error fetching song details:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
