import { minioClient } from "@/lib/minio";
import { NextResponse } from "next/server";
import type { Readable } from "node:stream";

// Convert Node stream → Web stream
function nodeToWeb(readable: Readable) {
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
  { params }: { params: Promise<{ key: string }> }
) {
  const { key: rawKey } = await params;
  const key = decodeURIComponent(rawKey).replace(/^\/+/, "");

  console.log("FETCHING:", key);

  try {
    const stat = await minioClient.statObject(process.env.MINIO_BUCKET!, key);

    const nodeStream = await minioClient.getObject(
      process.env.MINIO_BUCKET!,
      key
    );

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": stat.metaData?.["content-type"] || "image/jpeg",
      },
    });
  } catch (err) {
    console.error("COVER ERROR:", err);
    return new Response("Not found", { status: 404 });
  }
}
