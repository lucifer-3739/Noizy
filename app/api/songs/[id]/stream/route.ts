import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { minioClient } from "@/lib/minio";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 mark it as a Promise
) {
  try {
    const { id } = await context.params; // 👈 await it here
    const songId = parseInt(id);

    if (isNaN(songId)) {
      return NextResponse.json({ error: "Invalid song ID" }, { status: 400 });
    }

    const [song] = await db.select().from(songs).where(eq(songs.id, songId));
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const bucket = process.env.MINIO_BUCKET!;
    const url = new URL(song.fileUrl);
    const objectKey = url.pathname.split("/").slice(2).join("/");

    console.log("🎵 Streaming object:", bucket, objectKey);

    const fileStream = await minioClient.getObject(bucket, objectKey);
    if (!fileStream) {
      return NextResponse.json(
        { error: "File not found in MinIO" },
        { status: 404 }
      );
    }

    const headers = new Headers({
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return new NextResponse(fileStream as any, { headers });
  } catch (err: any) {
    console.error("❌ Stream error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to stream audio" },
      { status: 500 }
    );
  }
}
