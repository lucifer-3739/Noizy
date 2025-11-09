import { NextResponse } from "next/server";
import { z } from "zod";
import { uploadToMinio } from "@/lib/minio"; // your file with minioClient + uploadToMinio
import { randomUUID } from "crypto";

const FormSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  audio: z.any(),
  cover: z.any(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Validate input
    const title = formData.get("title");
    const artist = formData.get("artist");
    const audioFile = formData.get("audio") as File | null;
    const coverFile = formData.get("cover") as File | null;

    if (!title || !artist || !audioFile || !coverFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsed = FormSchema.parse({
      title,
      artist,
      audio: audioFile,
      cover: coverFile,
    });

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());

    const audioExt = audioFile.name.split(".").pop();
    const coverExt = coverFile.name.split(".").pop();

    const audioKey = `audio/${randomUUID()}.${audioExt}`;
    const coverKey = `covers/${randomUUID()}.${coverExt}`;

    const audioUrl = await uploadToMinio(
      process.env.MINIO_BUCKET!,
      audioKey,
      audioBuffer,
      audioFile.type
    );

    const coverUrl = await uploadToMinio(
      process.env.MINIO_BUCKET!,
      coverKey,
      coverBuffer,
      coverFile.type
    );

    // Return URLs and keys for DB insertion
    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      audioKey,
      coverKey,
      audioUrl,
      coverUrl,
      meta: {
        title,
        artist,
      },
    });
  } catch (e: any) {
    console.error("❌ Upload error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
