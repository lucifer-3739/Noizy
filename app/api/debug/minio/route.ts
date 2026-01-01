import { NextResponse } from "next/server";
import { minioClient } from "@/lib/minio";

export async function GET() {
  const bucket = process.env.MINIO_BUCKET;
  if (!bucket || bucket.trim() === "") {
    console.error("MINIO_BUCKET environment variable is missing or empty.");
    return NextResponse.json(
      { error: "MINIO_BUCKET environment variable is missing or empty." },
      { status: 500 }
    );
  }

  const files: string[] = [];
  const stream = minioClient.listObjects(bucket, "", true);

  return new Promise((resolve) => {
    stream.on("data", (obj) => {
      if (typeof obj.name === "string") {
        files.push(obj.name);
      }
    });
    stream.on("end", () => resolve(NextResponse.json({ files })));
    stream.on("error", (err) => {
      console.error("MinIO listObjects error:", err);
      let errorObj;
      if (err && typeof err === "object") {
        errorObj = {
          message: err.message || String(err),
          name: err.name || "Error",
          stack: err.stack || undefined,
        };
      } else {
        errorObj = { message: String(err) };
      }
      resolve(NextResponse.json({ error: errorObj }, { status: 500 }));
    });
  });
}
