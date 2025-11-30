import { db } from "@/db/drizzle";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { minioClient } from "@/lib/minio";
import type { Readable } from "node:stream";

function nodeStreamToWebStream(readable: Readable) {
  return new ReadableStream({
    start(controller) {
      readable.on("data", (chunk) => controller.enqueue(chunk));
      readable.on("end", () => controller.close());
      readable.on("error", (err) => controller.error(err));
    },
    cancel() {
      readable.destroy();
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) return new Response("Invalid ID", { status: 400 });

    const [song] = await db.select().from(songs).where(eq(songs.id, numericId));
    if (!song) return new Response("Song not found", { status: 404 });

    console.log("STREAM FILE KEY:", song.storageKey);

    // Get MinIO file metadata
    const stat = await minioClient.statObject(
      process.env.MINIO_BUCKET!,
      song.storageKey
    );

    const mimeType = stat.metaData["content-type"] || "audio/mpeg"; // FIXED
    const fileSize = stat.size;

    const range = req.headers.get("range");

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = Number(startStr);
      const end = endStr ? Number(endStr) : fileSize - 1;

      const chunkSize = end - start + 1;

      const nodeStream = await minioClient.getPartialObject(
        process.env.MINIO_BUCKET!,
        song.storageKey,
        start,
        chunkSize
      );

      return new Response(nodeStreamToWebStream(nodeStream), {
        status: 206,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    // FULL STREAM
    const nodeStream = await minioClient.getObject(
      process.env.MINIO_BUCKET!,
      song.storageKey
    );

    return new Response(nodeStreamToWebStream(nodeStream), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err: any) {
    console.error("STREAM ERROR:", err);
    return new Response("Streaming failed", { status: 500 });
  }
}
