import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { playlists } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const playlistId = Number(id);

        if (Number.isNaN(playlistId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const playlist = await db.query.playlists.findFirst({
            where: eq(playlists.id, playlistId),
            with: {
                items: {
                    with: {
                        song: {
                            with: {
                                artist: true,
                            },
                        },
                    },
                    orderBy: (items, { asc }) => [asc(items.position)],
                },
            },
        });

        if (!playlist) {
            return NextResponse.json(
                { error: "Playlist not found" },
                { status: 404 }
            );
        }

        const formatted = {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            coverUrl: playlist.coverUrl,
            songs: playlist.items.map((item) => {
                const s = item.song;

                // ✅ FIX: guard coverUrl safely
                const rawCoverUrl = s.coverUrl ?? "";
                const cleanKey = rawCoverUrl
                    .replace(/^https?:\/\/[^/]+\/[^/]+\//, "")
                    .replace(/^\/+/, "");

                return {
                    id: s.id,
                    title: s.title,
                    artist: s.artist.name,
                    coverUrl: cleanKey
                        ? `/api/covers/${encodeURIComponent(cleanKey)}`
                        : null,
                    streamUrl: `/api/songs/${s.id}/stream`,
                    durationSec: s.duration,
                };
            }),
        };

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
