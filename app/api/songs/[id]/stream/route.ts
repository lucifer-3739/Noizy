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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const [song] = await db
      .select()
      .from(songs)
      .where(eq(songs.id, Number(id)));

    if (!song) {
      return new Response("Song not found", { status: 404 });
    }

    // Check for Range header (user scrubbing)
    const range = req.headers.get("range");

    // Get file info from MinIO
    const stat = await minioClient.statObject(
      process.env.MINIO_BUCKET!,
      song.storageKey
    );

    const fileSize = stat.size;

    // --- RANGE REQUEST HANDLING ---
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

      const webStream = nodeStreamToWebStream(nodeStream);

      return new Response(webStream, {
        status: 206,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    // --- NORMAL STREAM ---
    const nodeStream = await minioClient.getObject(
      process.env.MINIO_BUCKET!,
      song.storageKey
    );

    const webStream = nodeStreamToWebStream(nodeStream);

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("STREAM ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
