import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const artistsWithSongs = await db.query.artists.findMany({
            with: {
                songs: {
                    limit: 10,
                    orderBy: (songs: any, { desc }: any) => [desc(songs.createdAt)],
                },
            },
            limit: 20,
        });

        // Transform data to ensure URLs are correct
        const formattedData = artistsWithSongs.map((artist: any) => ({
            ...artist,
            songs: artist.songs.map((song: any) => {
                // Handle cover URL same as song route
                const cleanKey = song.coverUrl
                    ?.replace(/^https?:\/\/[^/]+\/[^/]+\//, "")
                    .replace(/^\/+/, "");

                return {
                    id: song.id,
                    title: song.title,
                    artist: artist.name, // Use artist name from parent
                    coverUrl: cleanKey ? `/api/covers/${encodeURIComponent(cleanKey)}` : null,
                    streamUrl: `/api/songs/${song.id}/stream`,
                    durationSec: song.duration,
                };
            }),
        }));

        return NextResponse.json({ artists: formattedData });
    } catch (error) {
        console.error("Error fetching artists:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
