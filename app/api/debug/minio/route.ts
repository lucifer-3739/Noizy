import { NextResponse } from "next/server";
import { minioClient } from "@/lib/minio";

export async function GET() {
  const files: string[] = [];

  const stream = minioClient.listObjects(process.env.MINIO_BUCKET!, "", true);

  return new Promise((resolve) => {
    stream.on("data", (obj) => {
      if (typeof obj.name === "string") {
        files.push(obj.name);
      }
    });
    stream.on("end", () => resolve(NextResponse.json({ files })));
    stream.on("error", (err) => resolve(NextResponse.json({ error: err })));
  });
}
