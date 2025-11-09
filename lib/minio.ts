import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

// Ensure bucket exists
export async function ensureBucket(bucketName: string) {
  const exists = await minioClient.bucketExists(bucketName).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
    console.log(`✅ Created bucket: ${bucketName}`);
  }
}

export async function uploadToMinio(bucket: string, fileName: string, buffer: Buffer, mimeType: string) {
  await ensureBucket(bucket);

  await minioClient.putObject(bucket, fileName, buffer, buffer.length, {
    "Content-Type": mimeType,
  });

  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${fileName}`;
}
