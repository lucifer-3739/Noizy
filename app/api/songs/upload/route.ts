import { NextResponse } from "next/server";
import { z } from "zod";
import { uploadToMinio } from "@/lib/minio";
import { randomUUID } from "crypto";
import { db } from "@/db/drizzle";
import { songs, artists } from "@/db/schema";
import { eq } from "drizzle-orm";

const UploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist name is required"),
  audio: z.instanceof(File, { message: "Audio file is required" }),
  cover: z.instanceof(File, { message: "Cover image is required" }),
  duration: z.number().int().positive("Duration must be positive"),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const audioFile = formData.get("audio") as File | null;
    const coverFile = formData.get("cover") as File | null;
    const duration = formData.get("duration")
      ? Number.parseInt(formData.get("duration") as string)
      : 0;

    // Validate all required fields
    if (!title || !artist || !audioFile || !coverFile || !duration) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, artist, audio, cover, and duration",
        },
        { status: 400 }
      );
    }

    // Parse and validate
    UploadSchema.parse({
      title,
      artist,
      audio: audioFile,
      cover: coverFile,
      duration,
    });

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());

    // Generate unique keys
    const audioExt = audioFile.name.split(".").pop() || "mp3";
    const coverExt = coverFile.name.split(".").pop() || "png";

    const audioKey = `audio/${randomUUID()}.${audioExt}`;
    const coverKey = `covers/${randomUUID()}.${coverExt}`;

    let audioUrl: string;
    let coverUrl: string;

    try {
      audioUrl = await uploadToMinio(
        process.env.MINIO_BUCKET!,
        audioKey,
        audioBuffer,
        audioFile.type
      );
    } catch (uploadError) {
      console.error("[v0] Audio upload to MinIO failed:", uploadError);
      throw new Error("Failed to upload audio file to storage");
    }

    try {
      coverUrl = await uploadToMinio(
        process.env.MINIO_BUCKET!,
        coverKey,
        coverBuffer,
        coverFile.type
      );
    } catch (uploadError) {
      console.error("[v0] Cover upload to MinIO failed:", uploadError);
      throw new Error("Failed to upload cover image to storage");
    }

    // Get or create artist
    let artistId: number;
    const existingArtist = await db
      .select()
      .from(artists)
      .where(eq(artists.name, artist))
      .limit(1);

    if (existingArtist.length > 0) {
      artistId = existingArtist[0].id;
    } else {
      const [newArtist] = await db
        .insert(artists)
        .values({ name: artist })
        .returning();

      if (!newArtist) {
        throw new Error("Failed to create artist record");
      }

      artistId = newArtist.id;
    }

    if (!artistId) {
      throw new Error("Failed to get artist ID");
    }

    // Insert song into database
    const [song] = await db
      .insert(songs)
      .values({
        title,
        artistId,
        fileUrl: audioUrl,
        coverUrl,
        duration,
        releaseDate: new Date(),
      })
      .returning();

    if (!song) {
      throw new Error("Failed to create song record");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Song uploaded successfully",
        song: {
          id: song.id,
          title: song.title,
          artistId: song.artistId,
          fileUrl: song.fileUrl,
          coverUrl: song.coverUrl,
          duration: song.duration,
          createdAt: song.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("[v0] Song upload error:", e);
    return NextResponse.json(
      {
        error: e.message || "Failed to upload song",
      },
      { status: 500 }
    );
  }
}
